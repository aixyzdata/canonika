#!/bin/bash

# =============================================================================
# CANONIKA DESIGN SYSTEM - SCSS BUILD SCRIPT
# =============================================================================

set -e

echo "🎨 Building Canonika Design System..."

# Check if sass is installed
if ! command -v sass &> /dev/null; then
    echo "❌ Sass is not installed. Installing..."
    npm install -g sass
fi

# Create output directory
mkdir -p shared/styles/dist

# Build main CSS file
echo "📦 Compiling main.scss..."
sass shared/styles/build.scss:shared/styles/dist/canonika-design-system.css --style=compressed

# Build development version
echo "🔧 Compiling development version..."
sass shared/styles/build.scss:shared/styles/dist/canonika-design-system.dev.css --style=expanded

# Build individual component files
echo "🧩 Compiling component files..."

# Header
sass shared/styles/scss/layout/_header.scss:shared/styles/dist/header.css --style=compressed

# Create a minified version of existing files
echo "📝 Creating minified versions of existing files..."

# Copy and minify existing CSS files
cp shared/styles/header.css shared/styles/dist/header.legacy.css
cp shared/styles/sidebar.css shared/styles/dist/sidebar.legacy.css
cp shared/styles/masterpage.css shared/styles/dist/masterpage.legacy.css
cp shared/styles/view-content.css shared/styles/dist/view-content.legacy.css

echo "✅ Build completed successfully!"
echo "📁 Output files:"
echo "   - shared/styles/dist/canonika-design-system.css (production)"
echo "   - shared/styles/dist/canonika-design-system.dev.css (development)"
echo "   - shared/styles/dist/header.css (new SCSS version)"
echo "   - shared/styles/dist/*.legacy.css (existing files)"

echo ""
echo "🚀 To use the new design system, include:"
echo "   <link rel=\"stylesheet\" href=\"shared/styles/dist/canonika-design-system.css\">" 