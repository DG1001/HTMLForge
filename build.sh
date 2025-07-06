#!/bin/bash

# HTMLForge Build Script
# Combines modular source files into a single HTML file for distribution

echo "🔨 Building HTMLForge..."

# Create dist directory
mkdir -p dist

# Start with the head template
echo "📄 Adding HTML head section..."
cp src/html/head.html dist/index.html

# Replace CSS placeholder with actual CSS content
echo "🎨 Injecting CSS styles..."
sed -i 's|{{CSS_CONTENT}}|'"$(sed 's/$/\\n/' src/css/styles.css | tr -d '\n')"'|g' dist/index.html

# Add the body HTML (without the JavaScript placeholder)
echo "🏗️ Adding HTML body structure..."
sed '1,/<body/d; /{{JAVASCRIPT_CONTENT}}/,$d' src/html/body.html >> dist/index.html

# Add JavaScript content
echo "⚡ Adding JavaScript modules..."
echo "" >> dist/index.html
echo "    <script>" >> dist/index.html

# Add each JavaScript module
echo "      // Global variables and initialization" >> dist/index.html
cat src/js/app.js | sed 's/^/        /' >> dist/index.html
echo "" >> dist/index.html

echo "      // APIClient class" >> dist/index.html
cat src/js/api-client.js | sed 's/^/        /' >> dist/index.html
echo "" >> dist/index.html

echo "      // StreamRenderer class" >> dist/index.html
cat src/js/stream-renderer.js | sed 's/^/        /' >> dist/index.html
echo "" >> dist/index.html

echo "      // HTMLProcessor class" >> dist/index.html
cat src/js/html-processor.js | sed 's/^/        /' >> dist/index.html
echo "" >> dist/index.html

echo "      // UIManager class" >> dist/index.html
cat src/js/ui-manager.js | sed 's/^/        /' >> dist/index.html

# Close the script tag and HTML
echo "    </script>" >> dist/index.html
echo "</body>" >> dist/index.html
echo "</html>" >> dist/index.html

# Copy prompts directory
echo "📝 Copying prompts..."
cp -r prompts dist/

# Get file size
FILE_SIZE=$(wc -c < dist/index.html)
FILE_SIZE_KB=$((FILE_SIZE / 1024))

echo ""
echo "✅ Build completed successfully!"
echo "📊 Distribution file: dist/index.html (${FILE_SIZE_KB}KB)"
echo "📁 Prompts copied to: dist/prompts/"
echo ""
echo "🚀 To test the built version:"
echo "   cd dist && python3 -m http.server 8000"
echo "   then open http://localhost:8000"