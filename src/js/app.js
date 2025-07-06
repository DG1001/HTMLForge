// Initialize Lucide icons
lucide.createIcons();

// Global variables
let currentHtml = '';
let currentUploadedHtml = '';
let usingGeneratedHtml = false; // Track if we're modifying generated HTML
let apiClient = null;
let streamRenderer = null;
let htmlProcessor = null;
let uiManager = null;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    apiClient = new APIClient();
    streamRenderer = new StreamRenderer(
        document.getElementById('streamOutput'),
        document.getElementById('characterCount')
    );
    htmlProcessor = new HTMLProcessor();
    uiManager = new UIManager();
    
    console.log('HTMLForge initialized - Ready to forge amazing HTML applications!');
});