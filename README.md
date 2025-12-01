# pob.dev

This is the source code for my personal website, [pob.dev](https://pob.dev).

A modern, performant personal website and blog built with static site generation and web components.

> [!NOTE]
> This project uses AI assistance (e.g. Claude Code) for development tasks such as code generation, refactoring, and documentation.
>
> Content on this site is authored solely by Patrick O'Brien.

## Quick Start

```bash
# Install dependencies
npm ci

# Start development server
npm start

# Build for production
npm run build
```

Visit [http://localhost:8080](http://localhost:8080) after starting the development server.

## Tech Stack

- **[Eleventy](https://www.11ty.dev/)** - Static site generator
- **[Lit](https://lit.dev/)** - Web components with SSR
- **[PageFind](https://pagefind.app/)** - Static search
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Hosting platform

## Features

- Static site generation for performance
- Server-side rendered web components
- Full-text search with PageFind
- RSS/Atom/JSON feeds
- External feed aggregation
- Automatic dark mode
- Responsive design
- Hourly automated builds

## Documentation

Comprehensive documentation is available in the [`/docs/`](docs/) directory:

- **[Architecture](docs/architecture.md)** - Technical architecture and design decisions
- **[Development Guide](docs/development.md)** - Local setup, workflow, and best practices
- **[Deployment Guide](docs/deployment.md)** - CI/CD pipeline and hosting setup
- **[Maintenance Guide](docs/maintenance.md)** - Routine maintenance and troubleshooting

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details
