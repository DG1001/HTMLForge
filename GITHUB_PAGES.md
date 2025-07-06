# GitHub Pages Deployment Guide

This guide explains how to deploy HTMLForge to GitHub Pages with automatic builds.

## 🚀 Quick Setup

### 1. Repository Settings
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy on push to `main`/`master`

### 2. Automatic Deployment
The workflow (`.github/workflows/deploy.yml`) will:
- ✅ Trigger on every push to main/master branch
- ✅ Run the build script (`./build.sh`)
- ✅ Deploy the `dist/` folder to GitHub Pages
- ✅ Make your app available at `https://username.github.io/repository-name`

## 📝 Workflow Details

### What Happens When You Push:
1. **Build Step**: Runs `./build.sh` to create `dist/index.html`
2. **Deploy Step**: Uploads the `dist/` folder to GitHub Pages
3. **Live Site**: Your app becomes available at the Pages URL

### Branch Strategy:
- **`main`/`master`**: Automatically deploys to production
- **Other branches**: Build-only (no deployment)
- **Pull Requests**: Build verification only

## 🔧 Configuration

### Workflow File: `.github/workflows/deploy.yml`
```yaml
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]  # Deploy these branches
  pull_request:
    branches: [ main, master ]  # Test these PRs
  workflow_dispatch:            # Manual trigger

# ... (rest of workflow)
```

### Custom Domain (Optional)
To use a custom domain:
1. Add a `CNAME` file to your repository root:
   ```
   echo "yourdomain.com" > CNAME
   ```
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repository settings

## 📁 File Structure for Deployment

```
Your Repo/
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── src/                          # Development files (not deployed)
├── dist/                         # Built files (deployed to Pages)
├── prompts/                      # Deployed with the app
├── build.sh                      # Build script
└── README.md                     # Repository documentation
```

## 🛠️ Local Development vs. Production

### Development
```bash
cd src
python3 -m http.server 8000
# Open http://localhost:8000/index-dev.html
```

### Test Production Build Locally
```bash
./build.sh
cd dist
python3 -m http.server 8000
# Open http://localhost:8000
```

### Live Production
- Automatically available at your GitHub Pages URL after push
- Usually updates within 1-2 minutes

## 🚦 Deployment Status

### Check Deployment Status:
1. Go to **Actions** tab in your repository
2. See the latest workflow runs
3. Green ✅ = successful deployment
4. Red ❌ = build failed (check logs)

### Troubleshooting:
- **Build fails**: Check that `build.sh` runs locally
- **Deploy fails**: Ensure Pages is enabled in repository settings
- **Site not updating**: Wait 1-2 minutes, check Actions tab

## 🔒 Security Notes

### API Keys:
- **Never commit API keys** to the repository
- Users enter their own DeepSeek API keys in the app
- The app stores keys locally in browser storage only

### GitHub Actions Permissions:
The workflow needs these permissions (already configured):
- `contents: read` - Read repository files
- `pages: write` - Deploy to GitHub Pages
- `id-token: write` - Authentication

## 📊 Monitoring

### Workflow Notifications:
- GitHub will email you about failed deployments
- Watch the **Actions** tab for real-time status
- Check the **Pages** settings for the live URL

### Usage Analytics:
Consider adding Google Analytics or similar to track usage of your deployed app.

## 🎯 Benefits of This Setup

✅ **Automatic Deployment**: Push to deploy
✅ **Build Verification**: PRs are tested before merge  
✅ **Single Source of Truth**: Source code in `src/`, built output in `dist/`
✅ **Zero Maintenance**: No manual deployment steps
✅ **Fast Updates**: Changes go live in minutes
✅ **Free Hosting**: GitHub Pages is free for public repos

---

**Your HTMLForge app will be live at: `https://[username].github.io/[repository-name]`**