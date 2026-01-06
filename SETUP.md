# Sweepr Setup Guide

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Name it "sweepr", set a strong database password
4. Select Sydney (ap-southeast-2) region for Australia
5. Wait for project to provision (~2 minutes)

### Create Database Tables

Go to **SQL Editor** in Supabase and run this SQL:

```sql
-- Create sweepstakes table
CREATE TABLE sweepstakes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  countries TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sweepstakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access for active items
CREATE POLICY "Public can view active sweepstakes"
  ON sweepstakes FOR SELECT
  USING (active = true);

CREATE POLICY "Public can view active testimonials"
  ON testimonials FOR SELECT
  USING (active = true);

-- Authenticated users have full access
CREATE POLICY "Authenticated users can manage sweepstakes"
  ON sweepstakes FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL
  USING (auth.role() = 'authenticated');
```

### Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click "New bucket"
3. Name: `images`
4. Make it **Public**
5. Click "Create bucket"

Add storage policies (go to Policies tab for the bucket):

```sql
-- Allow public read access
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images' AND auth.role() = 'authenticated');
```

### Create Admin User

1. Go to **Authentication** > **Users**
2. Click "Add user"
3. Enter email and password for your admin account
4. Click "Create user"

### Get API Keys

1. Go to **Settings** > **API**
2. Copy "Project URL" and "anon public" key

---

## 2. Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase credentials to `.env.local`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Visit http://localhost:3000/admin to access the admin panel

---

## 3. Deploy to Vercel

### Push to GitHub

```bash
git add .
git commit -m "Add admin panel with Supabase"
git remote add origin https://github.com/YOUR_USERNAME/sweepr.git
git push -u origin main
```

### Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and login
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### Custom Domain

1. In Vercel dashboard, go to your project
2. Click **Settings** > **Domains**
3. Add your domain (e.g., `sweepr.com.au`)
4. Add DNS records at your domain registrar:
   - **CNAME**: Point to `cname.vercel-dns.com`
   - Or **A record**: Point to Vercel's IP (shown in dashboard)
5. Wait for DNS propagation (5-30 minutes)
6. SSL certificate is auto-provisioned

### Update Supabase Settings

After your domain is live:

1. Go to Supabase Dashboard > **Authentication** > **URL Configuration**
2. Set **Site URL** to `https://yourdomain.com`
3. Add `https://yourdomain.com/api/auth/callback` to **Redirect URLs**

---

## Admin Panel Features

- **Dashboard**: Overview of sweepstakes and testimonials count
- **Sweepstakes**: Add, edit, delete, reorder, toggle active status
- **Testimonials**: Add, edit, delete, reorder, star ratings
- **Image Upload**: Drag & drop to Supabase Storage
- **Authentication**: Email/password login

Access admin at: `https://yourdomain.com/admin`
