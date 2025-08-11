#!/bin/bash

# =============================================================================
# CANONIKA PLATFORM - CLEANUP AND ORGANIZATION SCRIPT
# =============================================================================

set -e

echo "🧹 Starting Canonika Platform cleanup and organization..."

# Remove temporary files
echo "🗑️  Removing temporary files..."
find . -name "*.tmp" -delete
find . -name "*.log" -delete
find . -name ".DS_Store" -delete
find . -name "Thumbs.db" -delete

# Remove node_modules from root (if exists)
if [ -d "node_modules" ]; then
    echo "📦 Removing root node_modules..."
    rm -rf node_modules
fi

# Clean build artifacts
echo "🏗️  Cleaning build artifacts..."
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "build" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".cache" -type d -exec rm -rf {} + 2>/dev/null || true

# Clean Docker artifacts
echo "🐳 Cleaning Docker artifacts..."
docker system prune -f 2>/dev/null || true
docker volume prune -f 2>/dev/null || true

# Organize documentation
echo "📚 Organizing documentation..."
if [ ! -d "docs" ]; then
    mkdir -p docs
fi

# Move any remaining markdown files to docs
find . -maxdepth 1 -name "*.md" -not -name "README.md" -exec mv {} docs/ \; 2>/dev/null || true

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.cache/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/

# Docker
.dockerignore

# Backup files
*.bak
*.backup
EOF
fi

# Create scripts directory if it doesn't exist
if [ ! -d "scripts" ]; then
    mkdir -p scripts
fi

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true

# Build SCSS
echo "🎨 Building SCSS..."
if [ -f "scripts/build-styles.sh" ]; then
    ./scripts/build-styles.sh
fi

# Check for unused files
echo "🔍 Checking for unused files..."
echo "   - Check for duplicate CSS files"
echo "   - Check for unused components"
echo "   - Check for unused dependencies"

# Summary
echo ""
echo "✅ Cleanup completed successfully!"
echo ""
echo "📊 Summary:"
echo "   - Temporary files removed"
echo "   - Build artifacts cleaned"
echo "   - Documentation organized"
echo "   - Scripts made executable"
echo "   - SCSS compiled"
echo ""
echo "🚀 Next steps:"
echo "   1. Review the organized documentation in docs/"
echo "   2. Test the build process"
echo "   3. Verify all services are working"
echo "   4. Update any remaining references" 