# Quinn CRM Documentation

This directory contains the complete documentation for Quinn CRM, built with [Mintlify](https://mintlify.com).

## 📚 Documentation Structure

```
docs/
├── mint.json                 # Mintlify configuration
├── openapi.json             # Auto-generated API spec (432 endpoints)
├── introduction.mdx         # Homepage
├── quickstart.mdx           # Getting started guide
├── authentication.mdx       # Auth documentation
├── core-concepts.mdx        # Fundamental concepts
├── features/                # Feature guides
│   └── crm-overview.mdx    # CRM features with interactive demos
├── api-reference/           # API endpoint documentation
│   ├── introduction.mdx
│   └── auth/
│       └── login.mdx
├── integrations/            # Integration guides
├── guides/                  # How-to guides
└── snippets/                # Custom MDX components
    ├── EquipmentCatalog.jsx
    ├── PipelineVisualizer.jsx
    ├── AICapabilitiesDemo.jsx
    └── IntegrationStatus.jsx
```

## 🚀 Quick Start

### Local Development

```bash
# Install Mintlify CLI globally
npm install -g mintlify

# Start local dev server
cd docs
mintlify dev
```

Visit `http://localhost:3000` to preview docs.

### Generate OpenAPI Spec

The OpenAPI spec is auto-generated from `server/routes.ts`:

```bash
# Generate/regenerate OpenAPI spec
tsx scripts/generate-openapi.ts

# Or use the sync script (generates + previews)
bash scripts/sync-docs.sh
```

This creates `docs/openapi.json` with all 432 API endpoints.

## 🔄 Automation

### Auto-Sync on Deploy

The documentation automatically stays up-to-date using these mechanisms:

#### GitHub Actions (Recommended)

A workflow at `.github/workflows/docs-sync.yml` automatically:
1. Runs when `server/routes.ts` or `shared/schema.ts` changes
2. Regenerates OpenAPI spec
3. Commits changes if spec updated
4. Triggers Mintlify deployment

**Setup:**
1. GitHub Actions is already configured
2. Push changes to `main` branch
3. Docs auto-update within 2-3 minutes

#### Manual Sync

```bash
# Full documentation sync
bash scripts/sync-docs.sh

# Just regenerate OpenAPI
tsx scripts/generate-openapi.ts
```

### Adding to Deployment Pipeline

Add this to your deployment script (Render, Vercel, etc.):

```bash
# In your build command
npm run build && tsx scripts/generate-openapi.ts
```

Or in `package.json` (ask admin to add):

```json
{
  "scripts": {
    "docs:generate": "tsx scripts/generate-openapi.ts",
    "docs:sync": "bash scripts/sync-docs.sh",
    "docs:dev": "cd docs && mintlify dev"
  }
}
```

## 📝 Editing Documentation

### Adding Pages

1. Create MDX file in appropriate directory:
   ```bash
   touch docs/guides/my-new-guide.mdx
   ```

2. Add frontmatter:
   ```mdx
   ---
   title: 'My New Guide'
   description: 'Brief description'
   ---
   
   Content here...
   ```

3. Register in `mint.json` navigation:
   ```json
   {
     "group": "Guides",
     "pages": [
       "guides/my-new-guide"
     ]
   }
   ```

### Using Custom Components

Import custom components from `snippets/`:

```mdx
---
title: 'My Page'
---

## Interactive Demo

<EquipmentCatalog />

<PipelineVisualizer />

<AICapabilitiesDemo />

<IntegrationStatus />
```

### Creating New Components

Add `.jsx` files to `snippets/`:

```jsx
// docs/snippets/MyComponent.jsx
'use client';
import { useState } from 'react';

export default function MyComponent() {
  return <div>My interactive component</div>;
}
```

Use in any MDX file:
```mdx
<MyComponent />
```

## 🎨 Customization

### Branding

Edit `mint.json`:

```json
{
  "name": "Quinn CRM",
  "logo": {
    "light": "/logo/light.svg",
    "dark": "/logo/dark.svg"
  },
  "colors": {
    "primary": "#3B82F6",
    "light": "#60A5FA",
    "dark": "#1E40AF"
  }
}
```

### Navigation

Update navigation structure in `mint.json`:

```json
{
  "navigation": [
    {
      "group": "Getting Started",
      "pages": ["introduction", "quickstart"]
    }
  ]
}
```

## 🔌 Interactive API Playground

The OpenAPI spec enables interactive API testing:

1. Navigate to any API endpoint page
2. Click "Try It" button
3. Enter parameters
4. Click "Send Request"
5. View real response

**Authentication:**
- Login via `/api/auth/login` first
- Session cookie automatically included in requests

## 🤖 AI Features

### AI Chat (Mintlify Pro)

Enable AI chat for 24/7 user support:

```json
// mint.json
{
  "ai": {
    "enabled": true,
    "prompt": "You are a helpful assistant for Quinn CRM. Answer questions about features, API usage, and integrations."
  }
}
```

### /llms.txt Generation

Mintlify auto-generates `/llms.txt` and `/llms-full.txt` for AI ingestion.

Access at:
- `https://docs.quinn.app/llms.txt`
- `https://docs.quinn.app/llms-full.txt`

## 📊 Analytics

Track documentation usage:

```json
// mint.json
{
  "analytics": {
    "mixpanel": {
      "projectToken": "YOUR_MIXPANEL_TOKEN"
    },
    "ga4": {
      "measurementId": "G-XXXXXXXXXX"
    }
  }
}
```

Metrics tracked:
- Page views
- Search queries
- API playground usage
- Link clicks

## 🌐 Custom Domain

1. Configure custom domain in Mintlify dashboard
2. Add CNAME record: `docs.quinn.app` → `mintlify-docs.com`
3. Wait for DNS propagation (5-30 minutes)
4. Enable HTTPS (automatic)

## 📦 Deployment

### Mintlify Hosting (Recommended)

1. Connect GitHub repo to Mintlify
2. Configure branch: `main`
3. Mintlify auto-deploys on push
4. Docs available at `yourproject.mintlify.app`

### Self-Hosted

```bash
# Build static site
npx mintlify build

# Deploy output to any static host
# (Vercel, Netlify, S3, etc.)
```

## 🐛 Troubleshooting

### OpenAPI Generation Fails

```bash
# Check TypeScript errors first
npm run check

# Run with verbose output
tsx scripts/generate-openapi.ts --verbose
```

### Mintlify Dev Won't Start

```bash
# Reinstall Mintlify CLI
npm uninstall -g mintlify
npm install -g mintlify

# Clear cache
rm -rf node_modules/.cache
```

### Custom Components Not Rendering

1. Check 'use client' directive at top of file
2. Verify component is in `snippets/` directory
3. Ensure React hooks used correctly
4. Check browser console for errors

### Docs Out of Sync

```bash
# Force regenerate everything
tsx scripts/generate-openapi.ts
bash scripts/sync-docs.sh

# Commit and push
git add docs/
git commit -m "docs: regenerate OpenAPI spec"
git push
```

## 📚 Resources

- **Mintlify Docs**: https://mintlify.com/docs
- **OpenAPI Spec**: https://swagger.io/specification/
- **MDX Guide**: https://mdxjs.com/
- **React Components**: https://react.dev/

## 🤝 Contributing

To contribute to documentation:

1. Fork the repository
2. Create feature branch: `git checkout -b docs/my-improvement`
3. Make changes to MDX files
4. Test locally: `cd docs && mintlify dev`
5. Commit: `git commit -m "docs: improve XYZ guide"`
6. Push and create pull request

## 📄 License

Documentation is part of Quinn CRM and follows the same license as the main repository.

---

## Quick Commands Reference

```bash
# Generate OpenAPI spec
tsx scripts/generate-openapi.ts

# Full docs sync
bash scripts/sync-docs.sh

# Local preview
cd docs && mintlify dev

# Build for production
cd docs && mintlify build
```

**Questions?** Open an issue or contact support@quinn.app
