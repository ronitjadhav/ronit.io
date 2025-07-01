# GitHub Workflows

This directory contains GitHub Actions workflows for the ronit.io project.

## Workflows

### 1. `ci.yml` - Continuous Integration

**Triggers:** Push to main/develop branches, Pull requests to main/develop

**Purpose:** Ensures code quality and build integrity before merging

**Steps:**

- 🔍 **ESLint**: Checks for code style and potential errors
- 🏗️ **TypeScript**: Validates type safety with `tsc --noEmit`
- 💄 **Prettier**: Ensures consistent code formatting
- 🔨 **Build**: Verifies the application builds successfully
- 🔒 **Security Audit**: Scans dependencies for vulnerabilities
- 📦 **Caching**: Improves workflow performance

### 2. `nextjs.yml` - Deployment to GitHub Pages

**Triggers:** Push to main branch, Manual dispatch

**Purpose:** Builds and deploys the Next.js application to GitHub Pages

**Steps:**

- 🔧 **Build**: Creates optimized production build
- 🚀 **Deploy**: Publishes to GitHub Pages

## Environment Variables

The workflows use the following secrets/environment variables:

### Required for deployment (`nextjs.yml`):

- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- `NEXT_PUBLIC_MAPBOX_LIGHT_STYLE_URL`
- `NEXT_PUBLIC_MAPBOX_DARK_STYLE_URL`
- `NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY`
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

### For CI builds (`ci.yml`):

The CI workflow uses dummy values when secrets aren't available, allowing it to verify the build process without requiring actual API keys.

## Status Checks

The CI workflow is designed to be used as a required status check for pull requests. This ensures that:

1. ✅ Code passes ESLint rules
2. ✅ TypeScript compilation succeeds
3. ✅ Code is properly formatted
4. ✅ Application builds without errors
5. ⚠️ Dependencies are audited for security issues

## Adding New Checks

To add new quality checks:

1. Add a new step to the `quality-checks` job in `ci.yml`
2. Ensure it fails fast with `continue-on-error: false`
3. Update this README with the new check

## Branch Protection

Consider setting up branch protection rules to require:

- CI workflow to pass
- At least one review
- Up-to-date branches before merging
