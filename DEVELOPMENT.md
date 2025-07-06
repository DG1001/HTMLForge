# HTMLForge Development Guide

This document explains the modular architecture and development workflow for HTMLForge.

## 📁 Project Structure

```
NewSiteGen/
├── src/                      # Development source files
│   ├── css/
│   │   └── styles.css        # Custom CSS styles
│   ├── html/
│   │   ├── head.html         # HTML head template
│   │   └── body.html         # HTML body structure
│   ├── js/                   # Modular JavaScript
│   │   ├── app.js            # Global variables & initialization
│   │   ├── api-client.js     # DeepSeek API communication
│   │   ├── stream-renderer.js # Real-time text display
│   │   ├── html-processor.js  # SEARCH/REPLACE functionality
│   │   └── ui-manager.js      # UI interactions & event handling
│   └── index-dev.html        # Development HTML (uses modules)
├── dist/                     # Built distribution
│   ├── index.html            # Single-file production build
│   └── prompts/              # Copied prompt files
├── prompts/                  # AI prompt templates
│   ├── creation-prompt.txt
│   └── modify-prompt.txt
├── build.sh                  # Build script (dev → dist)
└── index.html                # Original monolithic file (legacy)
```

## 🛠️ Development Workflow

### Development Mode
For active development, use the modular structure:

```bash
cd src
python3 -m http.server 8000
# Open http://localhost:8000/index-dev.html
```

**Benefits:**
- Individual file editing
- Faster iteration
- Clear separation of concerns
- Easier debugging

### Production Build
To create the single-file distribution:

```bash
./build.sh
```

This creates `dist/index.html` - a self-contained file suitable for distribution.

## 🏗️ Architecture Overview

### JavaScript Classes

#### 1. **APIClient** (`api-client.js`)
- **Responsibility**: DeepSeek API communication
- **Key Methods**:
  - `setApiKey(key)` - Store API key
  - `testConnection()` - Verify API connectivity
  - `streamRequest(messages, callbacks)` - Stream chat completions
  - `isIncompleteOutput(content)` - Auto-continue detection

#### 2. **StreamRenderer** (`stream-renderer.js`)
- **Responsibility**: Real-time text display and HTML preview
- **Key Methods**:
  - `startStream()` - Initialize streaming UI
  - `addChunk(chunk)` - Append text incrementally
  - `endStream()` - Finalize and extract HTML
  - `extractHtmlFromContent(content)` - Smart HTML extraction

#### 3. **HTMLProcessor** (`html-processor.js`)
- **Responsibility**: SEARCH/REPLACE block parsing and application
- **Key Methods**:
  - `parseSearchReplaceBlocks(content)` - Extract modification blocks
  - `applyChanges(html, blocks)` - Apply modifications to HTML
  - `displaySearchReplaceBlocks(blocks)` - Visualize changes

#### 4. **UIManager** (`ui-manager.js`)
- **Responsibility**: User interface interactions
- **Key Features**:
  - Tab switching (Create/Modify)
  - Dark mode toggle
  - File upload handling
  - Preview mode management
  - Action button orchestration

### Build System

The build script (`build.sh`) performs:

1. **Template Processing**: Injects CSS and JavaScript into HTML templates
2. **Module Concatenation**: Combines all JS files with proper indentation
3. **Asset Copying**: Copies prompts and other required files
4. **Size Reporting**: Shows final file size

## 🔧 Adding New Features

### Adding a New JavaScript Module

1. Create `src/js/new-module.js`
2. Add to `build.sh` in the JavaScript section:
   ```bash
   echo "      // NewModule class" >> dist/index.html
   cat src/js/new-module.js | sed 's/^/        /' >> dist/index.html
   ```
3. Include in development HTML: `<script src="js/new-module.js"></script>`

### Modifying Styles

Edit `src/css/styles.css` - changes apply to both dev and production builds.

### Updating HTML Structure

- **Head section**: Edit `src/html/head.html`
- **Body structure**: Edit `src/html/body.html`
- **Development**: Update `src/index-dev.html` manually

## 🧪 Testing

### Development Testing
```bash
cd src
python3 -m http.server 8000
# Test at http://localhost:8000/index-dev.html
```

### Production Testing
```bash
./build.sh
cd dist
python3 -m http.server 8000
# Test at http://localhost:8000
```

### Cross-Testing
Always test both development and production builds to ensure consistency.

## 📝 Code Style Guidelines

### JavaScript
- Use ES6+ class syntax
- Clear method names describing actions
- Comprehensive error handling
- Console logging for debugging

### CSS
- Follow BEM-like naming where applicable
- Use Tailwind utility classes primarily
- Custom CSS only for animations and complex layouts

### HTML
- Semantic HTML5 elements
- Proper ARIA labels for accessibility
- Consistent Tailwind class patterns

## 🚀 Deployment

### Single-File Distribution
The built `dist/index.html` is completely self-contained:
- No external dependencies (except CDNs)
- Includes all CSS and JavaScript
- Works offline after initial load
- Can be hosted anywhere

### Development Sharing
Share the entire `src/` folder for collaborative development.

## 🔄 Maintenance

### Updating Dependencies
- **TailwindCSS**: Update CDN link in `head.html`
- **Lucide Icons**: Update CDN link in `head.html`
- **AI Prompts**: Edit files in `prompts/` directory

### Performance Optimization
- Monitor build size (currently ~55KB)
- Use tree-shaking if adding large libraries
- Optimize CSS with PurgeCSS if needed

### Debugging
- Use development mode for detailed debugging
- Each class is isolated for easier testing
- Console logs available throughout codebase

---

**Happy Coding! 🔨**