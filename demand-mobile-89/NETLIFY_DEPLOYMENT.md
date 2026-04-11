# Netlify Deployment Guide for GoHandyMate

This guide explains how to deploy the GoHandyMate application to Netlify using the pre-configured settings.

## 📋 Prerequisites

- A GitHub, GitLab, or Bitbucket repository containing the project code.
- A [Netlify account](https://app.netlify.com/signup).

## 🛠️ Configuration Overview

I have already added the necessary configuration files to your project:

1. **`netlify.toml`**: Located in the root directory. It tells Netlify:
    - **Build Command**: `npm run build`
    - **Publish Directory**: `dist`
    - **Redirects**: Automatically handles client-side routing.
2. **`public/_redirects`**: A fallback configuration to ensure Single Page Application (SPA) routing works correctly across all browsers.

## 🚀 Deployment Steps

### Option 1: Continuous Deployment (Recommended)

1. **Push your code**: Ensure all changes (including `netlify.toml` and `_redirects`) are pushed to your remote repository.
2. **Login to Netlify**: Go to [app.netlify.com](https://app.netlify.com).
3. **New Site**: Click **"Add new site"** > **"Import an existing project"**.
4. **Connect Provider**: Select your Git provider (e.g., GitHub) and authorize Netlify.
5. **Select Repository**: Choose the `demand-mobile-89` repository.
6. **Site Settings**: Netlify should automatically detect the settings from `netlify.toml`:
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
7. **Deploy**: Click **"Deploy site"**.

### Option 2: Manual Drag & Drop

1. **Build Locally**: Run `npm run build` in your terminal.
2. **Locate 'dist'**: Find the `dist` folder created in your project root.
3. **Upload**: Drag and drop the `dist` folder into the [Netlify "Sites" page](https://app.netlify.com/teams/your-team-name/sites).

## 🌍 Environment Variables

Since the application currently uses a **mocked Supabase client**, you **do not** need to set any environment variables (like `VITE_SUPABASE_URL`) for the site to function as a demo/MVP.

If you decide to reconnect to a real Supabase instance later, you can add those variables in **Site settings > Environment variables** on Netlify.

## 🔍 Troubleshooting

- **Page Not Found (404) on Refresh**: This happens if the `_redirects` file or `netlify.toml` redirect rules are missing. I have already included these, so you should be covered.
- **Build Errors**: Ensure your `node_modules` are up to date and that the local `npm run build` command works before pushing.
