# HTMLForge 🔨

**Forge HTML applications with AI assistance**

HTMLForge is a powerful web-based tool that uses DeepSeek AI to generate and modify single-page HTML applications. Create complete, production-ready web applications from simple descriptions, then iteratively refine them with intelligent modifications.

## ✨ Features

### 🎨 **AI-Powered HTML Generation**
- Generate complete single-page applications from natural language descriptions
- Uses specialized prompts optimized for web development
- Supports TailwindCSS, vanilla JavaScript, and modern HTML5
- Real-time streaming with live preview

### 🔄 **Intelligent Modification System**
- Modify existing HTML using natural language instructions
- SEARCH/REPLACE block system for precise code changes
- Seamless workflow: generate → modify → iterate
- "Modify This" button for instant iteration on generated content

### 🖥️ **Optimized User Experience**
- **Responsive Layout**: Optimized for large monitors with 3-column design
- **Live Preview**: Real-time HTML rendering with iframe sandbox
- **Full-Screen Preview**: Dedicated full-screen mode for testing
- **Smart Controls**: Stop/Continue buttons for generation control
- **Dark Mode**: Built-in dark/light theme support

### 🛠️ **Advanced Streaming Features**
- **Auto-Continue Detection**: Smart detection of incomplete generations
- **Manual Continue**: User-controlled continuation instead of automatic
- **HTML Extraction**: Intelligent extraction of code from AI explanations
- **Cancel Streaming**: Stop generation at any time
- **Progress Indicators**: Visual feedback during generation

### 💾 **File Management**
- **Upload HTML Files**: Modify existing HTML files
- **Download Results**: Save generated applications
- **Copy to Clipboard**: Quick sharing and backup
- **Browser Storage**: Save applications locally

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- DeepSeek API key ([Get one here](https://platform.deepseek.com/))

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Enter your DeepSeek API key
4. Start creating!

**No build process, no dependencies, no server required!**

## 📖 Usage Guide

### Creating New Applications

1. **Enter API Key**: Input your DeepSeek API key in the header
2. **Test Connection**: Verify your API key works
3. **Describe Your App**: Write a detailed description in the "Create New" tab
   ```
   Example: "Create a todo app with dark mode, drag-and-drop sorting, 
   categories, and local storage persistence"
   ```
4. **Generate**: Click "Generate HTML" and watch the magic happen
5. **Preview**: See live preview as the code streams in
6. **Download or Modify**: Save your app or make changes

### Modifying Applications

#### Option 1: Modify Generated Content
1. Generate an HTML application
2. Click **"Modify This"** button (appears when generation completes)
3. Automatically switches to modify mode
4. Enter your modification instructions
5. Click "Apply Changes"

#### Option 2: Upload Existing HTML
1. Switch to **"Modify Existing"** tab
2. Upload an HTML file or drag & drop
3. Enter modification instructions
4. Click "Apply Changes"

### Example Modification Instructions
```
"Add a dark mode toggle button in the header"
"Change the color scheme to use blue instead of green"
"Add form validation with error messages"
"Make the layout responsive for mobile devices"
"Add a confirmation dialog before deleting items"
```

## 🎛️ Interface Guide

### Left Panel
- **Input Forms**: Create new or modify existing HTML
- **Live Stream**: Real-time generation output with scroll
- **Controls**: Stop, Continue, and generation buttons

### Right Panel
- **Live Preview**: Real-time HTML rendering
- **Preview Controls**: Raw HTML view, Live Preview toggle, Full-screen
- **Action Buttons**: Modify This, Download, Copy, Save, Clear

### Header
- **API Key Input**: Secure API key management with visibility toggle
- **Connection Status**: Visual indicator of API connection
- **Dark Mode Toggle**: Switch between light and dark themes

## 🛡️ Security Features

- **Iframe Sandboxing**: Generated content runs in secure sandboxed iframes
- **API Key Storage**: Secure local storage of API credentials
- **Content Security**: Proper handling of user-generated content
- **No Server Dependencies**: Everything runs client-side

## 🔧 Technical Details

### Architecture
- **Single HTML File**: Complete application in one file
- **Vanilla JavaScript**: No framework dependencies
- **TailwindCSS**: Utility-first CSS framework via CDN
- **Lucide Icons**: Beautiful icon set via CDN

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### API Integration
- **DeepSeek Chat API**: Streaming completion endpoint
- **AbortController**: Proper request cancellation
- **Error Handling**: Graceful failure recovery
- **Rate Limiting**: Respectful API usage

## 📝 Prompt Engineering

HTMLForge uses specialized prompts optimized for web development:

### Creation Prompt
- Emphasizes single-file output with embedded CSS/JS
- Requires semantic HTML5 and accessibility features
- Promotes modern, responsive design patterns
- Includes realistic placeholder content

### Modification Prompt
- Uses SEARCH/REPLACE block format for precise changes
- Maintains existing code style and conventions
- Ensures structural integrity of HTML
- Provides clear change documentation

## 🤝 Contributing

HTMLForge is designed to be easily customizable:

1. **Modify Prompts**: Edit files in `prompts/` directory
2. **Adjust Styling**: Update TailwindCSS classes
3. **Add Features**: Extend JavaScript classes
4. **Improve UX**: Enhance responsive design

## 📄 License

This project is open source. Feel free to use, modify, and distribute according to your needs.

## 🆘 Troubleshooting

### Common Issues

**"No HTML content to preview"**
- Ensure DeepSeek API key is valid
- Check browser console for error messages
- Try regenerating with simpler description

**Preview not updating**
- Refresh the page
- Check if content contains valid HTML
- Try switching between Raw HTML and Live Preview

**Generation stops unexpectedly**
- Use the "Continue" button if content seems incomplete
- Check API quota and rate limits
- Verify stable internet connection

**API Connection Failed**
- Verify API key is correct
- Check DeepSeek service status
- Ensure no network restrictions

### Browser Developer Tools
Enable developer tools (F12) to see detailed logs and debug information.

## 🎯 Tips for Best Results

### Writing Effective Descriptions
- Be specific about functionality and features
- Mention desired styling approach (modern, minimal, colorful, etc.)
- Include interaction requirements (forms, buttons, animations)
- Specify responsive behavior if needed

### Modification Instructions
- Use clear, actionable language
- Reference specific elements when possible
- Describe the desired outcome, not just the change
- Test modifications incrementally

### Performance Optimization
- Use the "Stop" button for long generations you don't need
- Clear output regularly to free browser memory
- Download important work to avoid loss

---

**Built with ❤️ using DeepSeek AI**

*HTMLForge - Where ideas become HTML applications*