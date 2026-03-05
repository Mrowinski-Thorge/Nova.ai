# Supabase Setup Guide for Nova AI

This guide will help you set up Supabase authentication for Nova AI.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- Nova AI project cloned locally

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Project name: `nova-ai` (or any name you prefer)
   - Database password: (create a secure password)
   - Region: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the "Settings" icon (gear icon)
2. Click on "API" in the sidebar
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Configure Environment Variables

1. In your Nova AI project root directory, create or update the `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_public_key
```

Replace the values with your actual Supabase project URL and anon key from Step 2.

## Step 4: Enable Email Authentication

1. In your Supabase project dashboard, go to "Authentication" > "Providers"
2. Ensure "Email" is enabled (it should be enabled by default)
3. Configure email templates (optional):
   - Go to "Authentication" > "Email Templates"
   - Customize the confirmation and password reset emails if desired

## Step 5: Set Up User Deletion Logic (Optional)

To implement the 7-day deletion grace period mentioned in the requirements, you'll need to set up a database function and cron job:

### 5.1 Create a Database Function

Go to the SQL Editor in Supabase and run:

```sql
-- Create a function to delete users marked for deletion after 7 days
CREATE OR REPLACE FUNCTION delete_expired_users()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users
  WHERE (raw_user_meta_data->>'deletion_scheduled')::boolean = true
    AND (raw_user_meta_data->>'deletion_requested_at')::timestamp
      < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5.2 Schedule the Cron Job

Supabase doesn't have built-in cron jobs in the free tier, so you have a few options:

**Option A: Use a third-party service**
- Use services like GitHub Actions, Vercel Cron, or EasyCron to call an API endpoint daily

**Option B: Manual implementation**
- Create an API route in your Next.js app that calls this function
- Protect it with an API key
- Call it from an external cron service

Example API route (`/app/api/cron/cleanup/route.ts`):

```typescript
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc('delete_expired_users');

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
```

## Step 6: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000

3. Click "Sign In" in the header

4. Test sign up:
   - Enter an email and password
   - Check your email for the confirmation link (if email confirmation is enabled)
   - Confirm your account

5. Test sign in:
   - Use your credentials to log in
   - Verify you're redirected to the account page

6. Test sign out:
   - Click on your account icon in the header
   - Click "Sign Out"

## Step 7: Configure Email Settings (Production)

For production, you should configure custom SMTP settings:

1. Go to "Project Settings" > "Auth" in Supabase
2. Scroll down to "SMTP Settings"
3. Enable "Use custom SMTP server"
4. Enter your SMTP provider details (e.g., SendGrid, AWS SES, Mailgun)

## Troubleshooting

### Authentication not working
- Check that your environment variables are correctly set
- Verify your Supabase project is active
- Check the browser console for errors

### Email not being received
- Check your spam folder
- Verify email provider settings in Supabase
- In development, check the Supabase dashboard > Authentication > Logs

### User deletion not working
- Ensure the database function was created successfully
- Verify the cron job is running
- Check Supabase logs for errors

## Features Implemented

- ✅ Sign up with email and password
- ✅ Sign in with email and password
- ✅ Sign out functionality
- ✅ Account page showing user info
- ✅ Account settings page
- ✅ Account deletion with 7-day grace period
- ✅ Cancel deletion within 7 days by logging in
- ✅ User menu in header showing account status
- ✅ Protected routes (redirecting to auth if not logged in)

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use Row Level Security (RLS)** - If you add custom tables, always enable RLS
3. **Validate on server side** - Always validate user input on the server
4. **Use HTTPS in production** - Ensure your deployed app uses HTTPS
5. **Rotate keys regularly** - Change your API keys periodically
6. **Monitor authentication logs** - Check for suspicious activity in Supabase dashboard

## Next Steps

- Add password reset functionality
- Implement social auth providers (Google, GitHub, etc.)
- Add profile customization features
- Sync chat history to Supabase database
- Implement user preferences storage

## Support

For more information, visit:
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Nova AI GitHub Repository: https://github.com/Mrowinski-Thorge/Nova.ai
