# Environment Variables Setup

## Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual values:
   ```
   VITE_WEBSOCKET_URL=wss://your-websocket-server-url
   ```

## Vercel Deployment

### Setting Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Name**: `VITE_WEBSOCKET_URL`
   - **Value**: `wss://wizzyworks-server.redbush-85e59e10.swedencentral.azurecontainerapps.io`
   - **Environment**: Select all environments (Production, Preview, Development)

### Alternative: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Set environment variable
vercel env add VITE_WEBSOCKET_URL
# When prompted, enter: wss://wizzyworks-server.redbush-85e59e10.swedencentral.azurecontainerapps.io
# Select all environments when asked
```

## Important Notes

- Environment variables in Vite must be prefixed with `VITE_` to be accessible in the browser
- The `.env` file is ignored by git for security reasons
- Always use the `.env.example` file to document required environment variables
- After adding/updating environment variables in Vercel, you may need to redeploy your application

## Accessing Environment Variables in Code

```javascript
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
```