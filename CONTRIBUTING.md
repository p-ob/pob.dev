# Contributing to pob.dev

Thank you for your interest in contributing to pob.dev! This document provides guidelines and information for contributors.

## Code of Conduct

This project follows a simple principle: be respectful and professional in all interactions.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check [existing issues](https://github.com/p-ob/pob.dev/issues) to avoid duplicates
2. Open a new issue with a clear title and description
3. Include steps to reproduce (for bugs)
4. Include expected vs actual behavior
5. Add relevant labels (bug, enhancement, documentation, etc.)

**Good issue example:**

```
Title: Search results don't update after clearing query

Description:
When using the search feature, clearing the search query doesn't
reset the results to show all posts.

Steps to reproduce:
1. Go to /search/
2. Enter a search query (e.g., "web components")
3. Clear the search query
4. Observe that results don't update

Expected: Results should reset to show all posts
Actual: Previous search results remain visible

Browser: Chrome 120 on macOS
```

### Suggesting Features

For feature requests:

1. Check if the feature already exists or is planned
2. Open an issue with the "enhancement" label
3. Describe the feature and its benefits
4. Explain use cases
5. Consider implementation complexity

### Pull Requests

#### Before Starting

1. Check existing issues and PRs to avoid duplicates
2. For major changes, open an issue first to discuss
3. Fork the repository
4. Create a feature branch from `main`

#### Development Workflow

1. **Clone your fork**

```bash
git clone https://github.com/YOUR_USERNAME/pob.dev.git
cd pob.dev
```

2. **Create a branch**

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `style/` - Code style changes
- `test/` - Test additions/fixes

3. **Install dependencies**

```bash
npm ci
```

4. **Make your changes**

See [Development Guide](docs/development.md) for detailed development instructions.

5. **Test your changes**

```bash
# Start development server
npm start

# Build production version
npm run build

# Test production build locally
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

6. **Commit your changes**

Follow the commit message format:

```
type: short description

Longer description if needed.

Fixes #123
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or fixing tests
- `chore:` - Maintenance tasks

**Examples:**

```bash
git commit -m "feat: add social media sharing buttons"
git commit -m "fix: correct dark mode color contrast"
git commit -m "docs: update development guide with new scripts"
```

7. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

8. **Open a pull request**

- Go to the original repository
- Click "New pull request"
- Select your branch
- Fill in the PR template (if available)
- Describe your changes clearly
- Link related issues

**Good PR description example:**

```
## Summary
Adds social media sharing buttons to blog posts

## Changes
- Added share buttons component
- Integrated with Twitter, LinkedIn, and Mastodon
- Styled buttons to match site design
- Added hover effects

## Testing
- Tested on Chrome, Firefox, Safari
- Verified buttons work on mobile
- Checked dark mode compatibility

## Screenshots
[Include screenshots if UI changes]

Closes #42
```

## Development Guidelines

### Code Style

**Follow existing code style:**

- Indentation: Tabs (size 2)
- Line width: 120 characters (200 for Markdown)
- Use template literals for strings
- Use modern JavaScript (ES modules, async/await, arrow functions)

**Formatting:**

```bash
# Check formatting
npm run lint

# Auto-format
npm run format
```

All code must pass `npm run lint` before merging.

### File Organization

**Follow the project structure:**

```
src/
├── _data/              # Global data files
├── _includes/          # Layouts and components
├── assets/
│   ├── css/            # Stylesheets
│   └── js/components/  # Web components
└── blog/               # Blog posts (YYYY/MM/post.md)
```

**Naming conventions:**

- Files: `kebab-case.js`
- Components: `PascalCase` classes, `kebab-case` custom elements
- CSS classes: `kebab-case`, BEM for components
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### CSS Guidelines

**Use CSS layers:**

```css
@layer reset, config, base, utility, layout;
```

**Component styles:**

```css
/* Good */
.my-component {
	/* styles */
}

.my-component__element {
	/* styles */
}

.my-component--modifier {
	/* styles */
}

/* Avoid */
.myComponent {
	/* styles */
}
```

**Use CSS custom properties for theme values:**

```css
/* Good */
.component {
	color: var(--color-text);
	background: var(--color-background);
}

/* Avoid */
.component {
	color: #333;
	background: #fff;
}
```

### JavaScript Guidelines

**Use modern JavaScript:**

```javascript
// Good
const items = posts.map(post => ({
	title: post.data.title,
	url: post.url
}));

// Avoid
var items = posts.map(function(post) {
	return {
		title: post.data.title,
		url: post.url
	};
});
```

**Prefer async/await over callbacks:**

```javascript
// Good
async function fetchFeed(url) {
	try {
		const response = await fetch(url);
		return await response.json();
	} catch (error) {
		console.error('Failed to fetch feed:', error);
	}
}

// Avoid
function fetchFeed(url, callback) {
	fetch(url)
		.then(response => response.json())
		.then(data => callback(null, data))
		.catch(error => callback(error));
}
```

### Markdown Guidelines

**Blog posts:**

- Use YAML frontmatter
- Required fields: `title`, `description`, `date`
- Optional fields: `tags`, `draft`
- Use semantic headings (`##`, `###`, not `#`)
- One blank line between sections
- Use code blocks with language identifiers

**Example:**

```markdown
---
title: How to Contribute
description: A guide for contributors
date: 2024-11-30
tags:
  - guide
  - contributing
---

## Introduction

This guide explains...

## Getting Started

First, clone the repository:

\`\`\`bash
git clone https://github.com/p-ob/pob.dev.git
\`\`\`

## Next Steps

Continue with...
```

### Testing Requirements

**Before submitting a PR:**

1. Test locally with `npm start`
2. Build production version: `npm run build`
3. Test production build: `npm run dev`
4. Test in multiple browsers (Chrome, Firefox, Safari)
5. Test responsive design (mobile, tablet, desktop)
6. Test dark mode
7. Verify search works (if applicable)
8. Check browser console for errors

**For UI changes:**

- Include screenshots in PR
- Test accessibility (keyboard navigation, screen readers)
- Verify color contrast meets WCAG standards
- Test with JavaScript disabled (progressive enhancement)

## Documentation

### When to Update Docs

Update documentation when:

- Adding new features
- Changing workflows
- Updating dependencies
- Modifying deployment process
- Adding new scripts

### Documentation Files

- [README.md](README.md) - Project overview and quick start
- [docs/architecture.md](docs/architecture.md) - Technical architecture
- [docs/development.md](docs/development.md) - Development guide
- [docs/deployment.md](docs/deployment.md) - Deployment guide
- [docs/maintenance.md](docs/maintenance.md) - Maintenance guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - This file

### Documentation Style

- Use clear, concise language
- Include code examples
- Add links to related documentation
- Use headings for organization
- Include a table of contents for long docs

## Review Process

### What to Expect

1. **Initial review** - Within a few days
2. **Feedback** - Suggestions for changes if needed
3. **Iteration** - Make requested changes
4. **Approval** - Maintainer approves PR
5. **Merge** - PR merged to `main`
6. **Deploy** - Automatically deployed via GitHub Actions

### Review Criteria

PRs are reviewed for:

- Code quality and style
- Adherence to project conventions
- Test coverage (manual testing)
- Documentation updates
- Performance impact
- Breaking changes
- Security considerations

### Responding to Feedback

- Address all comments
- Ask questions if unclear
- Push changes to the same branch
- Mark conversations as resolved
- Be open to suggestions

## What We're Looking For

Contributions that:

- Follow project conventions
- Include clear documentation
- Are well-tested
- Solve real problems
- Improve code quality
- Enhance user experience
- Fix bugs
- Add valuable features

## What to Avoid

- Breaking changes without discussion
- Large refactors without prior agreement
- Unrelated changes in a single PR
- Lack of testing
- Poor code quality
- Missing documentation
- Ignoring review feedback

## Getting Help

Need help contributing?

- Review [Development Guide](docs/development.md)
- Check existing issues and PRs
- Open a discussion on GitHub
- Ask questions in your PR

## Recognition

Contributors are recognized in:

- Git commit history
- GitHub contributors list
- Acknowledgment in release notes (for significant contributions)

## Questions?

If you have questions about contributing:

1. Check this guide
2. Review [documentation](docs/)
3. Search [existing issues](https://github.com/p-ob/pob.dev/issues)
4. Open a new issue with the "question" label

Thank you for contributing to pob.dev!
