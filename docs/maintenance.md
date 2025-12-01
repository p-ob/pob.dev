# Maintenance Guide

This guide covers routine maintenance tasks, dependency updates, and troubleshooting for pob.dev.

## Regular Maintenance Tasks

### Weekly Tasks

#### Check Dependency Updates

```bash
npm outdated
```

Review outdated packages and plan updates.

#### Review Automated Builds

1. Go to **GitHub Actions**
2. Check hourly cron builds are succeeding
3. Review any errors in recent workflows

#### Monitor Site Performance

1. Visit [pob.dev](https://pob.dev)
2. Test key functionality:
   - Homepage loads
   - Blog posts display correctly
   - Search works
   - RSS feeds are accessible
   - Dark mode toggles properly
3. Check browser console for errors

### Monthly Tasks

#### Update Dependencies

```bash
# Update all dependencies to latest versions
npm update

# Or update specific packages
npm update eleventy lit pagefind

# Test after updating
npm run build
npm start
```

**After updating:**
- Test locally thoroughly
- Run `npm run lint`
- Commit changes with clear message
- Monitor first deployment closely

#### Review Cloudflare Analytics

1. Go to **Cloudflare Dashboard** → **Workers & Pages**
2. Select `pob-dev-site`
3. Review **Metrics**:
   - Request volume
   - Error rates
   - Latency
   - Data transfer

#### Check External RSS Feeds

Review [feeds.json](../feeds.json):
- Are feeds still active?
- Any new feeds to add?
- Remove broken feeds

Test feeds manually:

```bash
npm run build
# Check reading page in browser
```

### Quarterly Tasks

#### Major Dependency Updates

Check for major version updates:

```bash
npm outdated
```

**For major updates:**

1. Read release notes and changelogs
2. Review breaking changes
3. Test in local environment
4. Update code if needed
5. Deploy to production

**Key dependencies to watch:**

- **Eleventy** - Static site generator (currently 3.1.2)
- **Lit** - Web components library (currently 3.3.1)
- **PageFind** - Search functionality (currently 1.3.0)
- **Wrangler** - Cloudflare deployment (currently 4.29.0)

#### Security Audit

```bash
npm audit
```

**Fix vulnerabilities:**

```bash
npm audit fix
```

**For critical vulnerabilities:**

```bash
npm audit fix --force
```

⚠️ **Caution:** `--force` may install breaking changes. Test thoroughly.

#### Node.js Version

Check if Node.js has new LTS versions:

```bash
node --version
```

Current requirement: **Node.js 22+**

**Update if needed:**

1. Update [package.json](../package.json) engines field
2. Update [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) node-version
3. Test locally with new version
4. Deploy and monitor

### Annual Tasks

#### Review and Update Documentation

- Update [README.md](../README.md)
- Review [docs/](../docs/) for accuracy
- Update screenshots if design changed
- Review [CONTRIBUTING.md](../CONTRIBUTING.md)

#### License Review

Ensure [LICENSE](../LICENSE) is up-to-date and dependencies are compatible.

#### Accessibility Audit

Test with accessibility tools:
- Browser DevTools accessibility checker
- Screen reader testing
- Keyboard navigation
- Color contrast validation

## Dependency Management

### Viewing Dependencies

**List all dependencies:**

```bash
npm list
```

**Check for outdated packages:**

```bash
npm outdated
```

**Check for security vulnerabilities:**

```bash
npm audit
```

### Updating Dependencies

**Update all within semver range:**

```bash
npm update
```

**Update specific package:**

```bash
npm update package-name
```

**Update to latest (potentially breaking):**

```bash
npm install package-name@latest
```

**Update all to latest:**

```bash
npx npm-check-updates -u
npm install
```

### Dependency Update Strategy

**Semantic Versioning (semver):**

- `^3.1.2` - Allow minor and patch updates (3.x.x)
- `~3.1.2` - Allow patch updates only (3.1.x)
- `3.1.2` - Exact version only

**Current strategy:** Use `^` for flexibility while avoiding breaking changes.

**Before updating:**

1. Read release notes
2. Check for breaking changes
3. Review migration guides
4. Test locally

**After updating:**

1. Run `npm run build`
2. Test all features
3. Check for console errors
4. Deploy to production
5. Monitor for issues

### Lock File Management

**package-lock.json** ensures consistent installs:

```bash
# Install exact versions from lock file
npm ci

# Update lock file after changes
npm install
```

**Commit `package-lock.json`** to ensure reproducible builds.

## Troubleshooting Common Issues

### Build Failures

#### Eleventy Build Errors

**Symptom:** Build fails with template errors

**Solution:**

1. Check error message for file and line number
2. Review template syntax
3. Ensure all data files are valid JSON
4. Check frontmatter formatting

```bash
# Clean and rebuild
npm run clean
npm run build
```

#### Out of Memory Errors

**Symptom:** Node runs out of memory during build

**Solution:**

Increase Node memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### CSS Minification Errors

**Symptom:** clean-css fails during build

**Solution:**

1. Check CSS syntax
2. Validate CSS with linter
3. Review recent CSS changes

### Search Not Working

**Symptom:** Search page shows no results

**Solution:**

1. Rebuild search index:

```bash
npm run build:index
```

2. Verify `public/pagefind/` exists:

```bash
ls public/pagefind/
```

3. Check browser console for JavaScript errors
4. Clear browser cache

### RSS Feed Issues

**Symptom:** Feeds return 404 or show errors

**Solution:**

1. Verify feed files exist:

```bash
ls public/feed.*
```

Should show:
- `feed.rss`
- `feed.atom`
- `feed.json`

2. Check [11ty/feeds.js](../11ty/feeds.js) configuration
3. Rebuild site:

```bash
npm run build
```

### External Feed Aggregation Fails

**Symptom:** "Reading" page is empty or shows errors

**Solution:**

1. Check [feeds.json](../feeds.json) URLs are valid
2. Test feed URLs manually in browser
3. Review build logs for fetch errors
4. Consider feed might be temporarily down
5. Add error handling in [11ty/feed-aggregator.js](../11ty/feed-aggregator.js)

### Deployment Failures

**Symptom:** GitHub Actions workflow fails

**Solution:**

1. Check workflow logs in **Actions** tab
2. Common causes:
   - Missing secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)
   - Build errors
   - Wrangler configuration issues
   - Network issues

3. Fix and re-run:

```bash
# Fix issue
git commit -m "fix: resolve deployment issue"
git push origin main
```

### Dark Mode Not Working

**Symptom:** Dark mode doesn't activate

**Solution:**

1. Check browser supports `prefers-color-scheme`
2. Verify system dark mode is enabled
3. Check CSS custom properties in [src/assets/css/partials/config.css](../src/assets/css/partials/config.css)
4. Inspect with browser DevTools
5. Clear browser cache

### Slow Build Times

**Symptom:** Builds take too long

**Solution:**

1. Use incremental builds in development:

```bash
npm start  # Uses --incremental flag
```

2. Clean build artifacts:

```bash
npm run clean
npm run build
```

3. Review large image files for optimization
4. Consider limiting PageFind index scope

## Performance Optimization

### Monitoring Performance

**Web Vitals:**
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

**Tools:**
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

### Optimization Strategies

**Images:**

1. Use appropriate image formats (WebP, AVIF)
2. Optimize image sizes
3. Use responsive images
4. Lazy load below-the-fold images

**CSS:**

1. Remove unused CSS
2. Minimize CSS files (automatic via clean-css)
3. Use CSS containment
4. Limit expensive properties (shadows, gradients)

**JavaScript:**

1. Keep JavaScript minimal
2. Defer non-critical scripts
3. Use native web platform features
4. Avoid large libraries

**Fonts:**

1. Use system fonts where possible
2. Preload critical fonts
3. Use `font-display: swap`
4. Subset fonts to required characters

**Caching:**

Cloudflare automatically caches static assets. Configure cache headers if needed.

## Backup and Recovery

### Content Backup

**Git repository** serves as primary backup:

- All content is version-controlled
- Hosted on GitHub
- Clone repository to recover

**Create local backup:**

```bash
git clone https://github.com/p-ob/pob.dev.git backup-$(date +%Y%m%d)
```

### Configuration Backup

**Critical files to backup:**

- `eleventy.config.js`
- `wrangler.jsonc`
- `feeds.json`
- `package.json`
- `.github/workflows/deploy.yml`
- All files in `src/_data/`

**These are backed up in Git** - no additional action needed.

### Secrets Backup

**GitHub Secrets** are not backed up in repository:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

**Store securely:**
- Use password manager
- Document in secure location
- Keep separate from repository

### Recovery Procedure

**If site goes down:**

1. **Check Cloudflare status:**
   - Go to Cloudflare Dashboard
   - Check Workers & Pages status

2. **Check recent deployments:**
   - GitHub Actions → Recent workflows
   - Review logs for errors

3. **Roll back if needed:**
   - See [Deployment Guide - Rollback Strategy](deployment.md#rollback-strategy)

4. **Restore from Git:**

```bash
# Clone repository
git clone https://github.com/p-ob/pob.dev.git

# Install dependencies
npm ci

# Build
npm run build

# Deploy
npm run deploy
```

## Monitoring and Alerts

### GitHub Actions Notifications

**Enable email notifications:**

1. Go to GitHub **Settings** → **Notifications**
2. Enable **Actions** notifications
3. Get alerted on workflow failures

### Cloudflare Notifications

**Configure alerts:**

1. Go to **Cloudflare Dashboard** → **Notifications**
2. Set up alerts for:
   - Workers errors
   - High traffic
   - Security events

### Uptime Monitoring

**Recommended tools:**

- [UptimeRobot](https://uptimerobot.com/) - Free tier available
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

**Configure:**
- Monitor main URL (pob.dev)
- Check interval: 5-15 minutes
- Alert via email/SMS on downtime

## Clean-Up Tasks

### Remove Unused Assets

**Find unused files:**

```bash
# Search for files not referenced in templates
git ls-files src/ | grep -v ".md$"
```

Review and remove unused:
- Images
- CSS files
- JavaScript files
- Fonts

### Clean Build Artifacts

```bash
# Remove build output
npm run clean

# Or manually
rm -rf public/
```

### Prune Dependencies

**Find unused dependencies:**

```bash
npx depcheck
```

**Remove if truly unused:**

```bash
npm uninstall package-name
```

### Clean Git History

**Large files accidentally committed:**

```bash
# Remove from history (use carefully!)
git filter-branch --tree-filter 'rm -f path/to/large/file' HEAD
```

⚠️ **Caution:** This rewrites history. Only use if necessary.

## Upgrading Node.js

**When to upgrade:**
- New LTS version released
- Security patches
- Required by dependencies

**How to upgrade:**

1. **Update local Node.js**

```bash
# Using nvm (recommended)
nvm install 22
nvm use 22

# Verify
node --version
```

2. **Update package.json**

```json
{
  "engines": {
    "node": ">=22"
  }
}
```

3. **Update GitHub Actions**

Edit [.github/workflows/deploy.yml](../.github/workflows/deploy.yml):

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22'
```

4. **Test thoroughly**

```bash
npm ci
npm run build
npm start
```

5. **Deploy and monitor**

```bash
git commit -m "chore: upgrade to Node.js 22"
git push origin main
```

## Documentation Maintenance

### Keeping Docs Updated

**When to update docs:**
- After major code changes
- New features added
- Dependencies updated
- Deployment process changes

**Documents to review:**

- [README.md](../README.md)
- [docs/architecture.md](architecture.md)
- [docs/development.md](development.md)
- [docs/deployment.md](deployment.md)
- [docs/maintenance.md](maintenance.md) (this file)
- [CONTRIBUTING.md](../CONTRIBUTING.md)

**Process:**

1. Review document
2. Update outdated information
3. Add new sections if needed
4. Test any commands/code examples
5. Commit changes

## Getting Help

If you encounter issues not covered here:

1. Check [development guide](development.md)
2. Check [deployment guide](deployment.md)
3. Review GitHub Issues for similar problems
4. Open a new issue with:
   - Description of problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node version, OS, etc.)

## Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
