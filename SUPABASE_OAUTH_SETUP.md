# Supabase OAuth Setup Instructions

## Google OAuth Configuration

To fix the Google OAuth error, you need to configure the OAuth settings in your Supabase dashboard:

### 1. Go to Supabase Dashboard

- Visit [https://app.supabase.com](https://app.supabase.com)
- Select your project: `fzvjtycrhwnmunawvpzp`

### 2. Configure Authentication Settings

- Navigate to **Authentication** → **Providers**
- Find **Google** in the list and click to configure

### 3. Enable Google Provider

- Toggle **Enable sign in with Google** to ON
- You'll need to set up a Google OAuth application first

### 4. Create Google OAuth Application

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable the Google+ API
- Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
- Set **Application type** to "Web application"
- Add **Authorized redirect URIs**:

  ```
  https://fzvjtycrhwnmunawvpzp.supabase.co/auth/v1/callback
  http://localhost:5173/auth/callback
  http://localhost:5174/auth/callback
  http://localhost:5175/auth/callback
  ```

### 5. Configure Supabase with Google Credentials

- Copy the **Client ID** and **Client Secret** from Google Console
- Paste them into Supabase Google provider settings:
  - **Client ID**: Your Google OAuth Client ID
  - **Client Secret**: Your Google OAuth Client Secret

### 6. Update Site URL

In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:5173` (for development)
- **Redirect URLs**: Add these URLs:

  ```
  http://localhost:5173
  http://localhost:5174
  http://localhost:5175
  https://your-production-domain.com
  ```

### 7. Test the Configuration

- Restart your development server
- Try signing up with Google
- The OAuth flow should now work correctly

## Alternative: Disable Google OAuth Temporarily

If you want to test other features without Google OAuth:

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Turn OFF **Enable sign in with Google**
3. Users can still sign up/sign in with email and password

## Common Issues and Solutions

### Error: "Invalid redirect URI"

- Make sure the redirect URI in Google Console exactly matches:
  `https://fzvjtycrhwnmunawvpzp.supabase.co/auth/v1/callback`

### Error: "Client ID not found"

- Double-check that the Client ID is correctly copied from Google Console
- Ensure the Google project has the Google+ API enabled

### Error: "Unauthorized redirect URI"

- Add all your development ports (5173, 5174, 5175) to Google Console
- Make sure the Site URL in Supabase matches your current development URL

## Production Deployment

When deploying to production:

1. Update Google Console with your production domain
2. Update Supabase Site URL to your production domain
3. Update redirect URLs in both Google Console and Supabase

Example production URLs:

```
https://your-domain.com
https://your-domain.com/auth/callback
```
