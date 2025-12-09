# Deployment Guide

This guide covers how pob.dev is deployed and how to set up your own deployment.

## Deployment Overview

pob.dev is deployed to **Cloudflare Workers** with automatic deployments triggered by:

1. **Pushes to `main` branch** - Production deployments
2. **Hourly cron schedule** - Refreshes external RSS feeds
3. **Manual workflow dispatch** - On-demand deployments

## Platform: Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com/) is a serverless edge computing platform that:

- Deploys to Cloudflare's global network
- Serves static assets with minimal latency
- Provides automatic SSL/TLS
- Scales automatically with traffic
- Offers generous free tier

**Project Name:** `pob-dev-site`

**Configuration:** [wrangler.jsonc](../wrangler.jsonc)

```jsonc
{
  "name": "pob-dev-site",
  "assets": {
    "directory": "public"
  },
  "compatibility_date": "2025-08-12"
}
```

## CI/CD Pipeline

### GitHub Actions Workflow

**File:** [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

**Triggers:**

```yaml
on:
  push:
    branches:
      - main
  schedule:
    - cron: '0 * * * *'  # Every hour at :00
  workflow_dispatch:     # Manual trigger
```

**Workflow Steps:**

1. **Checkout repository** - Clones the repo
2. **Setup Node.js** - Installs Node.js 24
3. **Install dependencies** - Runs `npm ci`
4. **Build site** - Runs `npm run build`
5. **Publish to Cloudflare** - Deploys via Wrangler

**Duration:** Typically 2-3 minutes

### Why Hourly Builds?

The hourly cron schedule refreshes the "Reading" page with the latest items from external RSS feeds. This keeps aggregated content current without requiring manual rebuilds.

## Prerequisites for Deployment

### 1. Cloudflare Account

Sign up at [cloudflare.com](https://dash.cloudflare.com/sign-up)

### 2. Cloudflare API Token

Create an API token with Workers permissions:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use the **Edit Cloudflare Workers** template
5. Configure:
   - **Permissions:** Account → Cloudflare Workers → Edit
   - **Account Resources:** Include your account
6. Copy the generated token

### 3. Cloudflare Account ID

Find your account ID:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select **Workers & Pages**
3. Copy your **Account ID** from the right sidebar

### 4. GitHub Secrets

Add secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add two secrets:
   - `CLOUDFLARE_API_TOKEN` - Your API token from step 2
   - `CLOUDFLARE_ACCOUNT_ID` - Your account ID from step 3

## Deployment Methods

### 1. Automatic Deployment (Recommended)

**Push to main branch:**

```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

GitHub Actions automatically:
- Builds the site
- Deploys to Cloudflare Workers
- Makes it live at your domain

**Monitor deployment:**

1. Go to **Actions** tab in GitHub
2. View the running workflow
3. Check logs for any errors

### 2. Manual Deployment via GitHub

Trigger a deployment without pushing:

1. Go to **Actions** tab
2. Select **Deploy to Cloudflare Workers**
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

### 3. Local Deployment

Deploy from your local machine:

```bash
# Build the site
npm run build

# Deploy to Cloudflare
npm run deploy
```

**Requirements:**
- Wrangler CLI installed (via `npm ci`)
- Cloudflare credentials configured locally

**Configure local credentials:**

```bash
npx wrangler login
```

This opens a browser to authenticate with Cloudflare.

**Verify deployment:**

```bash
npx wrangler whoami
```

## Testing Deployment Locally

Before deploying to production, test locally:

### 1. Build the site

```bash
npm run build
```

### 2. Run local Workers environment

```bash
npm run dev
```

This starts a local Cloudflare Workers environment that simulates production.

### 3. Access locally

Open [http://localhost:8787](http://localhost:8787) in your browser.

### 4. Test functionality

- Navigation works
- Search functionality
- RSS feeds load
- Dark mode toggles
- Responsive design

## Custom Domain Setup

To use a custom domain with Cloudflare Workers:

### 1. Add domain to Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Add a site**
3. Enter your domain (e.g., `pob.dev`)
4. Follow the nameserver setup instructions

### 2. Configure Workers route

1. Go to **Workers & Pages**
2. Select your Workers project (`pob-dev-site`)
3. Go to **Settings** → **Domains & Routes**
4. Click **Add Custom Domain**
5. Enter your domain (e.g., `pob.dev`)
6. Click **Add domain**

Cloudflare automatically:
- Provisions SSL certificate
- Routes traffic to your Worker
- Enables HTTPS

### 3. Update site metadata

Update [src/_data/metadata.js](../src/_data/metadata.js) with your domain:

```javascript
export default {
  // ...
  host: "https://yourdomain.com",
  // ...
};
```

## Monitoring Deployments

### GitHub Actions

**View deployment status:**

1. Go to **Actions** tab
2. See recent workflow runs
3. Click a run for detailed logs

**Badge in README:**

Add a status badge to show build status:

```markdown
![Deploy Status](https://github.com/p-ob/pob.dev/actions/workflows/deploy.yml/badge.svg)
```

### Cloudflare Dashboard

**View deployed site:**

1. Go to **Workers & Pages**
2. Select `pob-dev-site`
3. View deployment history
4. Check analytics and metrics

**Key metrics:**
- Requests per day
- Data transfer
- Errors
- Latency

## Rollback Strategy

If a deployment introduces issues:

### Option 1: Revert the commit

```bash
git revert HEAD
git push origin main
```

This creates a new commit that undoes the changes and triggers a new deployment.

### Option 2: Roll back to previous deployment

In Cloudflare Dashboard:

1. Go to **Workers & Pages**
2. Select `pob-dev-site`
3. Go to **Deployments**
4. Find a previous working deployment
5. Click **Roll back to this deployment**

### Option 3: Deploy from a specific commit

```bash
git checkout <commit-hash>
npm run build
npm run deploy
git checkout main
```

## Troubleshooting

### Deployment Fails

**Check GitHub Actions logs:**

1. Go to **Actions** tab
2. Click the failed workflow
3. Review error messages

**Common issues:**

- **Build errors** - Fix syntax errors, missing dependencies
- **Missing secrets** - Verify `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
- **Node version mismatch** - Ensure Node 24+ in workflow

**Fix and retry:**

```bash
git commit --amend
git push --force origin main
```

### Site Not Updating

**Cloudflare cache:**

1. Go to **Caching** → **Configuration**
2. Click **Purge Everything**
3. Wait 30 seconds and refresh

**Browser cache:**

- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Clear browser cache
- Try incognito/private mode

### Wrangler CLI Issues

**Update Wrangler:**

```bash
npm install wrangler@latest
```

**Re-authenticate:**

```bash
npx wrangler logout
npx wrangler login
```

**Verify configuration:**

```bash
npx wrangler deploy --dry-run
```

### Search Not Working After Deploy

**Ensure search index was built:**

```bash
npm run build:index
```

**Verify PageFind output:**

```bash
ls public/pagefind/
```

Should contain:
- `pagefind.js`
- `pagefind-ui.js`
- `pagefind.css`
- `index/` directory

### Performance Issues

**Check Cloudflare Analytics:**

1. Go to **Workers & Pages** → `pob-dev-site`
2. View **Metrics** tab
3. Check CPU time, errors, latency

**Optimize if needed:**

- Reduce image sizes
- Minify CSS/JS further
- Enable compression
- Review third-party resources

## Deployment Checklist

Before deploying major changes:

- [ ] Test locally with `npm start`
- [ ] Run production build: `npm run build`
- [ ] Test production build locally: `npm run dev`
- [ ] Lint code: `npm run lint`
- [ ] Format code: `npm run format`
- [ ] Test on multiple browsers
- [ ] Test responsive design
- [ ] Verify search works
- [ ] Check external links
- [ ] Review console for errors
- [ ] Commit with clear message
- [ ] Push to `main` branch
- [ ] Monitor GitHub Actions
- [ ] Verify deployment on live site
- [ ] Test live site functionality

## Security Considerations

### API Token Security

- **Never commit** API tokens to the repository
- Use GitHub Secrets for CI/CD
- Rotate tokens periodically
- Use minimum required permissions

### Content Security

- Review external RSS feeds regularly
- Sanitize user-generated content
- Keep dependencies updated
- Monitor for vulnerabilities

### HTTPS

- Cloudflare provides automatic HTTPS
- Always redirect HTTP to HTTPS
- Use secure headers

## Cost Considerations

Cloudflare Workers offers a generous free tier:

- **100,000 requests/day**
- **Workers CPU time limits**

For a personal blog with moderate traffic, the free tier should be sufficient.

**Monitor usage:**

1. Go to **Workers & Pages**
2. Check **Metrics** tab
3. Review request counts

**If you exceed limits:**

- Upgrade to paid plan ($5/month for 10M requests)
- Optimize build frequency
- Consider reducing hourly cron to less frequent

## Alternative Deployment Options

While Cloudflare Workers is recommended, the site can be deployed anywhere that serves static files:

### Cloudflare Pages

Similar to Workers but designed specifically for static sites:

```bash
npx wrangler pages deploy public
```

### Netlify

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `public`

### Vercel

1. Connect GitHub repository
2. Vercel auto-detects Eleventy
3. Deploys automatically

### GitHub Pages

Add to [package.json](../package.json):

```json
{
  "scripts": {
    "deploy:gh-pages": "gh-pages -d public"
  }
}
```

### Self-Hosted

Serve the `public/` directory with any web server:

- **Nginx**
- **Apache**
- **Caddy**
- Any static file server

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)

## Getting Help

- Review GitHub Actions logs for deployment errors
- Check Cloudflare dashboard for runtime errors
- Open an issue on GitHub
- Consult [development guide](development.md) for local testing
