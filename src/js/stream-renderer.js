// StreamRenderer class for real-time text display
class StreamRenderer {
    constructor(outputElement, characterCountElement) {
        this.outputElement = outputElement;
        this.characterCountElement = characterCountElement;
        this.content = '';
        this.isStreaming = false;
        this.previewUpdateTimeout = null;
    }

    startStream() {
        this.isStreaming = true;
        this.content = '';
        this.outputElement.textContent = '';
        this.updateCharacterCount();
        document.getElementById('loadingIndicator').classList.remove('hidden');
        document.getElementById('stopGeneration').classList.remove('hidden');
        
        // Disable fullscreen button during streaming
        document.getElementById('fullscreenPreview').disabled = true;
    }

    addChunk(chunk) {
        if (!this.isStreaming) return;
        
        this.content += chunk;
        this.outputElement.textContent = this.content;
        this.updateCharacterCount();
        
        // Auto-scroll to bottom
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
        
        // Update preview less frequently to avoid CPU spikes
        if (!this.previewUpdateTimeout && (this.content.includes('<html') || this.content.includes('<!DOCTYPE'))) {
            this.previewUpdateTimeout = setTimeout(() => {
                this.updatePreview();
                this.previewUpdateTimeout = null;
            }, 500); // Only update every 500ms during streaming
        }
    }

    endStream() {
        this.isStreaming = false;
        document.getElementById('loadingIndicator').classList.add('hidden');
        document.getElementById('stopGeneration').classList.add('hidden');
        
        // Clear any pending preview updates
        if (this.previewUpdateTimeout) {
            clearTimeout(this.previewUpdateTimeout);
            this.previewUpdateTimeout = null;
        }
        
        // Extract HTML and update global variable
        const extractedHtml = this.extractHtmlFromContent(this.content);
        currentHtml = extractedHtml || this.content;
        
        // Debug log
        console.log('HTML extraction result:', {
            originalLength: this.content.length,
            extractedLength: extractedHtml.length,
            hasHtml: !!extractedHtml,
            currentHtmlLength: currentHtml ? currentHtml.length : 0
        });
        
        // Enable fullscreen and modify buttons if we have HTML content
        const fullscreenButton = document.getElementById('fullscreenPreview');
        const modifyButton = document.getElementById('modifyThis');
        if (currentHtml && currentHtml.trim()) {
            fullscreenButton.disabled = false;
            modifyButton.disabled = false;
        } else {
            fullscreenButton.disabled = true;
            modifyButton.disabled = true;
        }
        
        // Final preview update
        this.updatePreview();
    }

    updateCharacterCount() {
        this.characterCountElement.textContent = `${this.content.length} characters`;
    }

    updatePreview() {
        const previewFrame = document.getElementById('previewFrame');
        const rawHtmlView = document.getElementById('rawHtmlView');
        
        // Extract HTML from the content
        const extractedHtml = this.extractHtmlFromContent(this.content);
        
        // Update raw HTML view with extracted HTML
        rawHtmlView.value = extractedHtml;
        
        // Update iframe preview only if we have valid HTML
        if (extractedHtml.trim()) {
            try {
                // Wait for iframe to be ready
                if (previewFrame.contentDocument || previewFrame.contentWindow) {
                    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
                    doc.open();
                    doc.write(extractedHtml);
                    doc.close();
                } else {
                    // Fallback: use srcdoc attribute
                    previewFrame.srcdoc = extractedHtml;
                }
            } catch (error) {
                console.error('Preview update failed:', error);
                // Fallback: use srcdoc attribute
                previewFrame.srcdoc = extractedHtml;
            }
        }
    }

    extractHtmlFromContent(content) {
        if (!content || typeof content !== 'string') return '';
        
        // Strategy 1: Find complete HTML documents (most reliable)
        const completeHtmlPattern = /<!DOCTYPE\s+html[\s\S]*?<\/html\s*>/gi;
        const completeMatches = content.match(completeHtmlPattern);
        if (completeMatches && completeMatches.length > 0) {
            console.log('Found complete HTML document(s):', completeMatches.length);
            // Return the FIRST complete HTML document (before explanations)
            return completeMatches[0];
        }
        
        // Strategy 2: Find HTML tag blocks
        const htmlTagPattern = /<html[\s\S]*?<\/html\s*>/gi;
        const htmlMatches = content.match(htmlTagPattern);
        if (htmlMatches && htmlMatches.length > 0) {
            console.log('Found HTML tag block(s):', htmlMatches.length);
            // Return the FIRST complete HTML block
            return htmlMatches[0];
        }
        
        // Strategy 3: Extract from DOCTYPE to end of HTML (handle incomplete streams)
        let startIndex = content.search(/<!DOCTYPE\s+html/i);
        if (startIndex !== -1) {
            let htmlContent = content.substring(startIndex);
            
            // Try to find the end of the HTML document
            const htmlEndIndex = htmlContent.search(/<\/html\s*>/i);
            if (htmlEndIndex !== -1) {
                // Include the closing tag
                htmlContent = htmlContent.substring(0, htmlEndIndex + htmlContent.match(/<\/html\s*>/i)[0].length);
                console.log('Found complete HTML from DOCTYPE to </html>');
                return htmlContent;
            } else {
                console.log('Found incomplete HTML starting with DOCTYPE');
                return htmlContent;
            }
        }
        
        // Strategy 4: Extract from <html> tag
        startIndex = content.search(/<html[\s\S]/i);
        if (startIndex !== -1) {
            let htmlContent = content.substring(startIndex);
            
            // Try to find the end of the HTML document
            const htmlEndIndex = htmlContent.search(/<\/html\s*>/i);
            if (htmlEndIndex !== -1) {
                htmlContent = htmlContent.substring(0, htmlEndIndex + htmlContent.match(/<\/html\s*>/i)[0].length);
                console.log('Found complete HTML from <html> to </html>');
                return htmlContent;
            } else {
                console.log('Found incomplete HTML starting with <html>');
                return htmlContent;
            }
        }
        
        // Strategy 5: Last resort - return content if it looks like HTML
        if (content.includes('<') && content.includes('>') && content.length > 100) {
            console.log('Found HTML-like content, returning as-is');
            return content;
        }
        
        console.log('No HTML content found');
        return '';
    }

    clear() {
        this.content = '';
        this.outputElement.textContent = '';
        this.updateCharacterCount();
        document.getElementById('rawHtmlView').value = '';
        
        // Disable fullscreen and modify buttons when cleared
        document.getElementById('fullscreenPreview').disabled = true;
        document.getElementById('modifyThis').disabled = true;
        
        // Clear preview
        const previewFrame = document.getElementById('previewFrame');
        try {
            if (previewFrame.contentDocument || previewFrame.contentWindow) {
                const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
                doc.open();
                doc.write('');
                doc.close();
            } else {
                previewFrame.srcdoc = '';
            }
        } catch (error) {
            console.error('Preview clear failed:', error);
            previewFrame.srcdoc = '';
        }
    }
}