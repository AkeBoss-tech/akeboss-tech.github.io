.PHONY: help install dev lint test check audit validate build resume

help:
	@echo "Available targets:"
	@echo "  make install   - Install the pinned root dependencies with Bun"
	@echo "  make dev       - Start the Next.js development server"
	@echo "  make lint      - Run ESLint"
	@echo "  make test      - Run Bun website tests"
	@echo "  make check     - Run lint, wiki validation, and tests in parallel"
	@echo "  make audit     - Check dependencies for high-severity advisories"
	@echo "  make validate  - Validate wiki content and links"
	@echo "  make build     - Build the GitHub Pages static export"
	@echo "  make resume    - Build the resume PDF with Tectonic"

install:
	bun ci

dev:
	bun run dev

lint:
	bun run lint

test:
	bun run test

check:
	bun run check

audit:
	bun run audit

validate:
	bun run wiki:validate

build:
	GITHUB_PAGES=true bun run build
	bun run redirects:build

resume:
	tectonic files/resume.tex -o files/
