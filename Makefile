.PHONY: help install build serve dev clean

# Default target
help:
	@echo "Available targets:"
	@echo "  make install  - Install Ruby and npm dependencies"
	@echo "  make build    - Build the site (Jekyll + JS minification)"
	@echo "  make serve    - Serve the site locally at http://localhost:4000"
	@echo "  make dev      - Run in development mode (with watch)"
	@echo "  make clean    - Clean build artifacts and caches"

# Install dependencies
install:
	@echo "Installing Ruby dependencies..."
	bundle install
	@echo "Installing npm dependencies..."
	npm install

# Build the site
build: build-js
	@echo "Building Jekyll site..."
	bundle exec jekyll build

# Check if npm dependencies are installed
node_modules/.bin/uglifyjs:
	@echo "npm dependencies not found, installing..."
	npm install

# Build JavaScript assets
build-js: node_modules/.bin/uglifyjs
	@echo "Building JavaScript assets..."
	npm run build:js

# Serve the site locally
serve: build-js
	@echo "Starting Jekyll server at http://localhost:4000..."
	bundle exec jekyll serve --config _config.yml,_config.dev.yml

# Development mode with watch
dev: build-js
	@echo "Starting Jekyll in development mode with watch..."
	bundle exec jekyll serve --config _config.yml,_config.dev.yml --watch --livereload

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf _site
	rm -rf .sass-cache
	rm -rf .jekyll-cache
	rm -rf .jekyll-assets-cache
	rm -rf .asset-cache
	@echo "Clean complete!"
