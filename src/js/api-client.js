// APIClient class for DeepSeek API communication
class APIClient {
    constructor() {
        this.apiKey = '';
        this.baseUrl = 'https://api.deepseek.com/v1/chat/completions';
        this.isConnected = false;
        this.currentAbortController = null;
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('deepseek_api_key', key);
    }

    async testConnection() {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: 'test' }],
                    max_tokens: 1,
                    stream: false
                })
            });

            this.isConnected = response.ok;
            return this.isConnected;
        } catch (error) {
            console.error('Connection test failed:', error);
            this.isConnected = false;
            return false;
        }
    }

    stopStream() {
        if (this.currentAbortController) {
            this.currentAbortController.abort();
            this.currentAbortController = null;
        }
    }

    async streamRequest(messages, onChunk, onComplete, onError) {
        let fullContent = '';
        let conversationMessages = [...messages];
        let continuationCount = 0;
        const maxContinuations = 3; // Prevent infinite loops
        
        const makeRequest = async (isRetry = false) => {
            try {
                // Create new abort controller for this request
                this.currentAbortController = new AbortController();
                
                const response = await fetch(this.baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: conversationMessages,
                        max_tokens: 8192,
                        stream: true,
                        temperature: 0.7
                    }),
                    signal: this.currentAbortController.signal
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let currentChunk = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // Keep the last incomplete line

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                // Check if output seems incomplete and we haven't exceeded max continuations
                                if (this.isIncompleteOutput(fullContent) && continuationCount < maxContinuations) {
                                    // Add assistant message and continue
                                    conversationMessages.push({ role: 'assistant', content: fullContent });
                                    conversationMessages.push({ role: 'user', content: 'continue' });
                                    
                                    continuationCount++;
                                    
                                    // Show continuation indicator
                                    onChunk(`\n\n[Auto-continuing generation... (${continuationCount}/${maxContinuations})]\n\n`);
                                    
                                    // Continue after a brief delay
                                    setTimeout(() => makeRequest(true), 1000);
                                    return;
                                }
                                
                                onComplete();
                                return;
                            }
                            try {
                                const json = JSON.parse(data);
                                if (json.choices[0].delta.content) {
                                    currentChunk = json.choices[0].delta.content;
                                    fullContent += currentChunk;
                                    onChunk(currentChunk);
                                }
                            } catch (e) {
                                // Skip invalid JSON
                            }
                        }
                    }
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Stream request was cancelled');
                    onComplete(); // Treat cancellation as completion
                } else {
                    onError(error);
                }
            }
        };

        await makeRequest();
    }

    isIncompleteOutput(content) {
        if (!content || content.trim().length < 100) {
            return true;
        }

        const trimmedContent = content.trim();
        
        // Check for explicit continuation markers
        const continuationMarkers = [
            /\.{3}$/,
            /\[continued\]/i,
            /\[continue\]/i,
            /\(continued\)/i,
            /…$/
        ];

        for (const marker of continuationMarkers) {
            if (marker.test(trimmedContent)) {
                return true;
            }
        }

        // Check if content ends abruptly (incomplete sentence or tag)
        const lastChar = trimmedContent.charAt(trimmedContent.length - 1);
        if (lastChar === '<' || lastChar === '&') {
            return true;
        }

        // Check for incomplete tags at the end
        const incompleteTagPattern = /<[^>]*$/;
        if (incompleteTagPattern.test(trimmedContent)) {
            return true;
        }

        // For HTML generation mode, be more selective
        if (trimmedContent.includes('<!DOCTYPE') || trimmedContent.includes('<html')) {
            // If we have a complete HTML document, don't continue even if there are explanations
            const completeHtmlPattern = /<!DOCTYPE\s+html[\s\S]*?<\/html\s*>/gi;
            const htmlMatches = trimmedContent.match(completeHtmlPattern);
            if (htmlMatches && htmlMatches.length > 0) {
                console.log('Found complete HTML document, not continuing');
                return false; // Don't continue if we have complete HTML
            }

            // Only continue if HTML is structurally incomplete
            const hasHtmlOpen = /<html[^>]*>/i.test(trimmedContent);
            const hasHtmlClose = /<\/html\s*>/i.test(trimmedContent);
            const hasHeadOpen = /<head[^>]*>/i.test(trimmedContent);
            const hasHeadClose = /<\/head\s*>/i.test(trimmedContent);
            const hasBodyOpen = /<body[^>]*>/i.test(trimmedContent);
            const hasBodyClose = /<\/body\s*>/i.test(trimmedContent);

            // Only continue if major structures are incomplete
            if (hasHtmlOpen && !hasHtmlClose) {
                return true;
            }
            if (hasHeadOpen && !hasHeadClose) {
                return true;
            }
            if (hasBodyOpen && !hasBodyClose) {
                return true;
            }

            // Check for unclosed script or style tags
            const scriptMatches = (trimmedContent.match(/<script[^>]*>/gi) || []).length;
            const scriptCloseMatches = (trimmedContent.match(/<\/script\s*>/gi) || []).length;
            if (scriptMatches > scriptCloseMatches) {
                return true;
            }

            const styleMatches = (trimmedContent.match(/<style[^>]*>/gi) || []).length;
            const styleCloseMatches = (trimmedContent.match(/<\/style\s*>/gi) || []).length;
            if (styleMatches > styleCloseMatches) {
                return true;
            }
        }

        // For SEARCH/REPLACE blocks, check if they're complete
        if (trimmedContent.includes('<<<<<<< SEARCH') || trimmedContent.includes('>>>>>>> REPLACE')) {
            // Check for incomplete SEARCH/REPLACE blocks
            const searchBlocks = (trimmedContent.match(/<<<<<<< SEARCH/g) || []).length;
            const replaceBlocks = (trimmedContent.match(/>>>>>>> REPLACE/g) || []).length;
            
            if (searchBlocks > replaceBlocks) {
                console.log('Found incomplete SEARCH/REPLACE block');
                return true;
            }
            
            // If we have complete SEARCH/REPLACE blocks, don't continue for explanations
            if (searchBlocks > 0 && searchBlocks === replaceBlocks) {
                console.log('Found complete SEARCH/REPLACE blocks, not continuing');
                return false;
            }
        }

        return false;
    }
}