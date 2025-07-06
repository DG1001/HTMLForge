// UIManager class for tab switching and form handling
class UIManager {
    constructor() {
        this.currentTab = 'create';
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.previewMode = 'live'; // 'live' or 'raw'
        this.initializeDarkMode();
        this.bindEvents();
    }

    initializeDarkMode() {
        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
            document.getElementById('darkModeToggle').innerHTML = '<i data-lucide="sun" class="w-5 h-5"></i>';
        } else {
            document.documentElement.classList.remove('dark');
            document.getElementById('darkModeToggle').innerHTML = '<i data-lucide="moon" class="w-5 h-5"></i>';
        }
        lucide.createIcons();
    }

    bindEvents() {
        // Tab switching
        document.getElementById('createTab').addEventListener('click', () => this.switchTab('create'));
        document.getElementById('modifyTab').addEventListener('click', () => this.switchTab('modify'));

        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleDarkMode());

        // API key toggle
        document.getElementById('toggleApiKey').addEventListener('click', () => this.toggleApiKeyVisibility());

        // Preview mode toggle
        document.getElementById('rawHtmlToggle').addEventListener('click', () => this.setPreviewMode('raw'));
        document.getElementById('livePreviewToggle').addEventListener('click', () => this.setPreviewMode('live'));

        // Fullscreen preview
        document.getElementById('fullscreenPreview').addEventListener('click', () => this.openFullscreenPreview());
        document.getElementById('closeFullscreen').addEventListener('click', () => this.closeFullscreenPreview());

        // File upload
        document.getElementById('htmlFile').addEventListener('change', (e) => this.handleFileUpload(e));

        // Action buttons
        document.getElementById('testConnection').addEventListener('click', () => this.testConnection());
        document.getElementById('generateHTML').addEventListener('click', () => this.generateHTML());
        document.getElementById('applyChanges').addEventListener('click', () => this.applyChanges());
        document.getElementById('modifyThis').addEventListener('click', () => this.modifyCurrentHtml());
        document.getElementById('clearCurrentHtml').addEventListener('click', () => this.clearCurrentHtmlMode());
        document.getElementById('stopGeneration').addEventListener('click', () => this.stopGeneration());
        document.getElementById('downloadHtml').addEventListener('click', () => this.downloadHTML());
        document.getElementById('copyToClipboard').addEventListener('click', () => this.copyToClipboard());
        document.getElementById('clearOutput').addEventListener('click', () => this.clearOutput());

        // Load saved API key
        const savedApiKey = localStorage.getItem('deepseek_api_key');
        if (savedApiKey) {
            document.getElementById('apiKey').value = savedApiKey;
            apiClient.setApiKey(savedApiKey);
        }
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600', 'dark:text-blue-400');
            btn.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-300');
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        if (tab === 'create') {
            document.getElementById('createTab').classList.add('border-blue-500', 'text-blue-600', 'dark:text-blue-400');
            document.getElementById('createTab').classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-300');
            document.getElementById('createContent').classList.add('active');
        } else {
            document.getElementById('modifyTab').classList.add('border-blue-500', 'text-blue-600', 'dark:text-blue-400');
            document.getElementById('modifyTab').classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-300');
            document.getElementById('modifyContent').classList.add('active');
        }
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.initializeDarkMode();
    }

    toggleApiKeyVisibility() {
        const apiKeyInput = document.getElementById('apiKey');
        const toggleButton = document.getElementById('toggleApiKey');
        
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            toggleButton.innerHTML = '<i data-lucide="eye-off" class="w-4 h-4"></i>';
        } else {
            apiKeyInput.type = 'password';
            toggleButton.innerHTML = '<i data-lucide="eye" class="w-4 h-4"></i>';
        }
        lucide.createIcons();
    }

    setPreviewMode(mode) {
        this.previewMode = mode;
        const previewFrame = document.getElementById('previewFrame');
        const rawHtmlView = document.getElementById('rawHtmlView');
        const liveToggle = document.getElementById('livePreviewToggle');
        const rawToggle = document.getElementById('rawHtmlToggle');

        if (mode === 'raw') {
            previewFrame.classList.add('hidden');
            rawHtmlView.classList.remove('hidden');
            rawToggle.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
            rawToggle.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            liveToggle.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
            liveToggle.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        } else {
            previewFrame.classList.remove('hidden');
            rawHtmlView.classList.add('hidden');
            liveToggle.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
            liveToggle.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            rawToggle.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
            rawToggle.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        }
    }

    openFullscreenPreview() {
        console.log('Fullscreen requested. currentHtml:', currentHtml ? currentHtml.length + ' chars' : 'null/empty');
        
        if (!currentHtml || !currentHtml.trim()) {
            console.log('No HTML available for fullscreen');
            alert('No HTML content to preview. Please generate HTML first.');
            return;
        }

        // Always use modal fullscreen for better compatibility
        this.openModalFullscreen();
    }

    enterBrowserFullscreen() {
        // Create a dedicated fullscreen container
        const fullscreenContainer = document.createElement('div');
        fullscreenContainer.id = 'trueFullscreenContainer';
        fullscreenContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: white;
            z-index: 9999;
            display: flex;
            flex-direction: column;
        `;

        // Create header with close button
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background: #f3f4f6;
            border-bottom: 1px solid #e5e7eb;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Full Screen Preview';
        title.style.cssText = 'margin: 0; font-size: 16px; font-weight: 600; color: #374151;';

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #6b7280;
            padding: 5px 10px;
            border-radius: 4px;
        `;
        closeButton.addEventListener('click', () => this.exitFullscreen());

        header.appendChild(title);
        header.appendChild(closeButton);

        // Create iframe container
        const iframeContainer = document.createElement('div');
        iframeContainer.style.cssText = 'flex: 1; overflow: hidden;';

        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
        iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups';

        iframeContainer.appendChild(iframe);
        fullscreenContainer.appendChild(header);
        fullscreenContainer.appendChild(iframeContainer);
        document.body.appendChild(fullscreenContainer);

        // Load content into iframe
        try {
            if (iframe.contentDocument || iframe.contentWindow) {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                doc.open();
                doc.write(currentHtml);
                doc.close();
            } else {
                iframe.srcdoc = currentHtml;
            }
        } catch (error) {
            console.error('Fullscreen preview failed:', error);
            iframe.srcdoc = currentHtml;
        }

        // Enter browser fullscreen
        const requestFullscreen = fullscreenContainer.requestFullscreen || 
                                fullscreenContainer.webkitRequestFullscreen || 
                                fullscreenContainer.mozRequestFullScreen || 
                                fullscreenContainer.msRequestFullscreen;

        if (requestFullscreen) {
            requestFullscreen.call(fullscreenContainer);
        }

        // Handle fullscreen exit
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && 
                !document.mozFullScreenElement && !document.msFullscreenElement) {
                this.exitFullscreen();
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        // Store cleanup function
        this.fullscreenCleanup = () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };

        // Add ESC key handler
        this.escKeyHandler = (e) => {
            if (e.key === 'Escape') {
                this.exitFullscreen();
            }
        };
        document.addEventListener('keydown', this.escKeyHandler);
    }

    exitFullscreen() {
        // Exit browser fullscreen
        const exitFullscreen = document.exitFullscreen || 
                             document.webkitExitFullscreen || 
                             document.mozCancelFullScreen || 
                             document.msExitFullscreen;

        if (exitFullscreen) {
            exitFullscreen.call(document);
        }

        // Remove fullscreen container
        const container = document.getElementById('trueFullscreenContainer');
        if (container) {
            container.remove();
        }

        // Cleanup event listeners
        if (this.fullscreenCleanup) {
            this.fullscreenCleanup();
            this.fullscreenCleanup = null;
        }

        if (this.escKeyHandler) {
            document.removeEventListener('keydown', this.escKeyHandler);
            this.escKeyHandler = null;
        }
    }

    openModalFullscreen() {
        const modal = document.getElementById('fullscreenModal');
        const fullscreenFrame = document.getElementById('fullscreenFrame');
        
        if (currentHtml && currentHtml.trim()) {
            try {
                // Always use srcdoc for better compatibility
                fullscreenFrame.srcdoc = currentHtml;
            } catch (error) {
                console.error('Fullscreen preview failed:', error);
                alert('Failed to load fullscreen preview');
                return;
            }
        }
        
        modal.classList.remove('hidden');
        
        // Focus on close button for keyboard navigation
        setTimeout(() => {
            document.getElementById('closeFullscreen').focus();
        }, 100);
    }

    closeFullscreenPreview() {
        document.getElementById('fullscreenModal').classList.add('hidden');
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/html') {
            // Clear current HTML mode when uploading file
            this.clearCurrentHtmlMode();
            
            const reader = new FileReader();
            reader.onload = (e) => {
                currentUploadedHtml = e.target.result;
                document.getElementById('uploadedFile').classList.remove('hidden');
                document.getElementById('fileName').textContent = file.name;
            };
            reader.readAsText(file);
        }
    }

    modifyCurrentHtml() {
        if (!currentHtml || !currentHtml.trim()) {
            alert('No generated HTML to modify');
            return;
        }

        // Set up modify mode with current HTML
        usingGeneratedHtml = true;
        currentUploadedHtml = currentHtml;
        
        // Switch to modify tab
        this.switchTab('modify');
        
        // Show current HTML status
        document.getElementById('currentHtmlStatus').classList.remove('hidden');
        document.getElementById('uploadSection').style.display = 'none';
        
        // Clear uploaded file display
        document.getElementById('uploadedFile').classList.add('hidden');
        document.getElementById('htmlFile').value = '';
        
        // Focus on modification instructions
        document.getElementById('modifyInstructions').focus();
        
        // Re-initialize lucide icons
        lucide.createIcons();
    }

    clearCurrentHtmlMode() {
        usingGeneratedHtml = false;
        currentUploadedHtml = '';
        
        // Hide current HTML status
        document.getElementById('currentHtmlStatus').classList.add('hidden');
        document.getElementById('uploadSection').style.display = 'block';
        
        // Clear modification instructions
        document.getElementById('modifyInstructions').value = '';
        
        // Re-initialize lucide icons
        lucide.createIcons();
    }

    stopGeneration() {
        if (apiClient) {
            apiClient.stopStream();
            console.log('Generation stopped by user');
        }
        
        // End the stream and re-enable buttons
        if (streamRenderer) {
            streamRenderer.endStream();
        }
        
        // Re-enable generate/apply buttons
        document.getElementById('generateHTML').disabled = false;
        document.getElementById('applyChanges').disabled = false;
    }

    updateConnectionStatus(isConnected) {
        const statusElement = document.getElementById('connectionStatus');
        if (isConnected) {
            statusElement.innerHTML = `
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-500 dark:text-gray-400">Connected</span>
            `;
        } else {
            statusElement.innerHTML = `
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <span class="text-sm text-gray-500 dark:text-gray-400">Disconnected</span>
            `;
        }
    }

    async testConnection() {
        const apiKey = document.getElementById('apiKey').value.trim();
        if (!apiKey) {
            alert('Please enter your DeepSeek API key');
            return;
        }

        apiClient.setApiKey(apiKey);
        const isConnected = await apiClient.testConnection();
        this.updateConnectionStatus(isConnected);
        
        if (isConnected) {
            alert('Connection successful!');
        } else {
            alert('Connection failed. Please check your API key.');
        }
    }

    async generateHTML() {
        const requirements = document.getElementById('createRequirements').value.trim();
        const apiKey = document.getElementById('apiKey').value.trim();

        if (!apiKey) {
            alert('Please enter your DeepSeek API key');
            return;
        }

        if (!requirements) {
            alert('Please describe the HTML application you want to create');
            return;
        }

        apiClient.setApiKey(apiKey);

        try {
            const creationPrompt = await fetch('./prompts/creation-prompt.txt').then(r => r.text());
            const messages = [
                { role: 'system', content: creationPrompt },
                { role: 'user', content: requirements }
            ];

            streamRenderer.startStream();
            document.getElementById('generateHTML').disabled = true;

            await apiClient.streamRequest(
                messages,
                (chunk) => streamRenderer.addChunk(chunk),
                () => {
                    streamRenderer.endStream();
                    document.getElementById('generateHTML').disabled = false;
                },
                (error) => {
                    console.error('Generation failed:', error);
                    alert('Failed to generate HTML. Please check your connection and try again.');
                    streamRenderer.endStream();
                    document.getElementById('generateHTML').disabled = false;
                }
            );
        } catch (error) {
            console.error('Generation failed:', error);
            alert('Failed to generate HTML. Please check your connection and try again.');
            document.getElementById('generateHTML').disabled = false;
        }
    }

    async applyChanges() {
        const instructions = document.getElementById('modifyInstructions').value.trim();
        const apiKey = document.getElementById('apiKey').value.trim();

        if (!apiKey) {
            alert('Please enter your DeepSeek API key');
            return;
        }

        if (!currentUploadedHtml) {
            alert('Please upload an HTML file first');
            return;
        }

        if (!instructions) {
            alert('Please provide modification instructions');
            return;
        }

        apiClient.setApiKey(apiKey);

        try {
            const modificationPrompt = await fetch('./prompts/modify-prompt.txt').then(r => r.text());
            const messages = [
                { role: 'system', content: modificationPrompt },
                { role: 'user', content: `HTML file to modify:\n\n${currentUploadedHtml}\n\nModification instructions:\n${instructions}` }
            ];

            streamRenderer.startStream();
            document.getElementById('applyChanges').disabled = true;

            let modificationResponse = '';
            await apiClient.streamRequest(
                messages,
                (chunk) => {
                    modificationResponse += chunk;
                    streamRenderer.addChunk(chunk);
                },
                () => {
                    // Parse search/replace blocks and apply changes
                    const blocks = htmlProcessor.parseSearchReplaceBlocks(modificationResponse);
                    if (blocks.length > 0) {
                        const result = htmlProcessor.applyChanges(currentUploadedHtml, blocks);
                        currentHtml = result.html;
                        
                        // Display the changes
                        htmlProcessor.displaySearchReplaceBlocks(blocks);
                        
                        // Update preview with modified HTML
                        streamRenderer.content = currentHtml;
                        streamRenderer.updatePreview();
                        
                        alert(`Applied ${result.appliedChanges} out of ${result.totalBlocks} changes`);
                    } else {
                        alert('No search/replace blocks found in the response');
                    }
                    
                    streamRenderer.endStream();
                    document.getElementById('applyChanges').disabled = false;
                },
                (error) => {
                    console.error('Modification failed:', error);
                    alert('Failed to apply changes. Please check your connection and try again.');
                    streamRenderer.endStream();
                    document.getElementById('applyChanges').disabled = false;
                }
            );
        } catch (error) {
            console.error('Modification failed:', error);
            alert('Failed to apply changes. Please check your connection and try again.');
            document.getElementById('applyChanges').disabled = false;
        }
    }

    downloadHTML() {
        if (!currentHtml || !currentHtml.trim()) {
            alert('No HTML to download. Please generate HTML first.');
            return;
        }

        // Generate intelligent filename based on HTML content
        const filename = this.generateIntelligentFilename(currentHtml);

        const blob = new Blob([currentHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateIntelligentFilename(html) {
        // Extract title from HTML
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        let appName = '';
        
        if (titleMatch && titleMatch[1]) {
            appName = titleMatch[1]
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single
                .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
        }

        // If no title or title is generic, try to extract from h1
        if (!appName || appName === 'document' || appName === 'untitled') {
            const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
            if (h1Match && h1Match[1]) {
                appName = h1Match[1]
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
            }
        }

        // Generate timestamp
        const timestamp = new Date().toISOString().replace(/[:]/g, '-').split('.')[0];

        // Create filename
        if (appName && appName.length > 0) {
            return `${appName}-${timestamp}.html`;
        } else {
            return `htmlforge-app-${timestamp}.html`;
        }
    }

    async copyToClipboard() {
        if (!currentHtml || !currentHtml.trim()) {
            alert('No HTML to copy. Please generate HTML first.');
            return;
        }

        try {
            await navigator.clipboard.writeText(currentHtml);
            alert('HTML copied to clipboard');
        } catch (error) {
            console.error('Copy failed:', error);
            alert('Failed to copy to clipboard');
        }
    }

    clearOutput() {
        currentHtml = '';
        streamRenderer.clear();
        // Clear modify mode if using generated HTML
        if (usingGeneratedHtml) {
            this.clearCurrentHtmlMode();
        }
        // Button will be disabled by streamRenderer.clear()
    }
}