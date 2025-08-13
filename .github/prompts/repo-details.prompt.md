---
mode: agent
---

This is an 11ty website, using lit-html and lit-ssr and hosted in Cloudflare Workers.

## Code style
- Use ES Module syntax for imports/exports
- Use camelCase for variable and function names
- Use modern CSS practices, like CSS nesting, custom properties, etc.

## MUSTs and MUST NOTs
- You MUST NOT pull in additional dependencies.
- You MUST adhere to prettier style guide
	- `npm run lint` may help
- You MUST NOT modify any files ignored via `.gitignore`
- You MUST NOT use inline styles on HTML elements. Always use classes.
