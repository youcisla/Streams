# 🚀 n8n + Supabase Setup Guide

## **Quick Setup: Connect n8n to Your Supabase Database**

This guide shows you how to configure n8n to work independently with your Supabase PostgreSQL database.

---

## 📋 **Prerequisites**

- n8n installed (Docker or self-hosted)
- Supabase account with PostgreSQL database
- Database password for your Supabase instance

---

## 🔐 **Your Supabase Connection Details**

```bash
Host: db.ssbybrjhptiindmwsclv.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [Your Supabase Password]
SSL: Required (true)
```

**Connection String:**
```
psql -h db.ssbybrjhptiindmwsclv.supabase.co -p 5432 -d postgres -U postgres
```

---

## 🛠️ **Step 1: Configure Supabase Credentials in n8n**

### **Option A: Via n8n UI (Recommended)**

1. **Open n8n Dashboard**
   ```
   http://localhost:5678
   ```

2. **Go to Credentials**
   - Click your profile icon (top-right)
   - Select "Credentials"

3. **Create New PostgreSQL Credential**
   - Click "Add Credential"
   - Search for "Postgres"
   - Select "Postgres"

4. **Fill in Connection Details**
   ```
   Name: StreamLink Supabase DB
   Host: db.ssbybrjhptiindmwsclv.supabase.co
   Port: 5432
   Database: postgres
   User: postgres
   Password: [Your Supabase Password]
   SSL: true
   ```

5. **Test Connection**
   - Click "Test" button
   - Should show "Connection successful!"

6. **Save**
   - Click "Save" button
   - Note the credential ID (shown in URL or settings)

### **Option B: Via Environment Variables**

Add to your `.env` file:

```bash
# Supabase PostgreSQL (Production)
POSTGRES_HOST="db.ssbybrjhptiindmwsclv.supabase.co"
POSTGRES_PORT="5432"
POSTGRES_DB="postgres"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="your-actual-supabase-password-here"
POSTGRES_SSL="true"
```

---

## 📦 **Step 2: Import n8n Workflow**

1. **Download Workflow**
   - File: `n8n.json` (in project root)

2. **Import into n8n**
   - Open n8n: `http://localhost:5678`
   - Click "+" → "Import from File"
   - Select `n8n.json`
   - Click "Import"

3. **Link Credentials**
   - The workflow will automatically look for credential: "StreamLink Supabase DB"
   - If not found, manually link in each PostgreSQL node:
     - Click on any PostgreSQL node
     - Click "Credentials" dropdown
     - Select "StreamLink Supabase DB"

---

## ✅ **Step 3: Test Database Connection**

### **Test Query Node**

1. **Open Workflow in n8n**
2. **Find "📊 Fetch All Active Streamers" node**
3. **Click "Execute Node"**
4. **Expected Results:**
   - If tables exist: Returns streamer data
   - If tables don't exist: Shows error (normal, see Step 4)

### **Quick Test via PostgreSQL Node**

Add a test node to your workflow:

```sql
-- Test connection
SELECT version();

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## 🗄️ **Step 4: Create Database Schema**

If your Supabase database doesn't have the required tables, run these migrations:

### **Connect to Supabase via psql**

```bash
psql -h db.ssbybrjhptiindmwsclv.supabase.co -p 5432 -d postgres -U postgres
# Enter your password when prompted
```

### **Create Required Tables**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'VIEWER',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Streamer profiles
CREATE TABLE IF NOT EXISTS streamer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    social_links JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Linked platform accounts
CREATE TABLE IF NOT EXISTS linked_platform_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    platform_user_id VARCHAR(255) NOT NULL,
    handle VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(platform, platform_user_id)
);

-- Content items
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    streamer_id UUID NOT NULL REFERENCES streamer_profiles(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    type VARCHAR(50),
    platform_id VARCHAR(255),
    title TEXT,
    thumbnail_url TEXT,
    url TEXT,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    is_live BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(platform, platform_id)
);

-- Follows
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    streamer_id UUID NOT NULL REFERENCES streamer_profiles(id) ON DELETE CASCADE,
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(viewer_id, streamer_id)
);

-- Notification subscriptions
CREATE TABLE IF NOT EXISTS notification_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50),
    token TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_streamers_active ON streamer_profiles(active);
CREATE INDEX IF NOT EXISTS idx_content_live ON content_items(is_live);
CREATE INDEX IF NOT EXISTS idx_content_platform ON content_items(platform);
CREATE INDEX IF NOT EXISTS idx_follows_viewer ON follows(viewer_id);
CREATE INDEX IF NOT EXISTS idx_follows_streamer ON follows(streamer_id);

-- Verify tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

---

## 🧪 **Step 5: Add Test Data**

To test the workflow without the main app, insert sample data:

```sql
-- Insert test user
INSERT INTO users (id, email, display_name, role) 
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'test@example.com', 'Test User', 'VIEWER'),
    ('22222222-2222-2222-2222-222222222222', 'streamer@example.com', 'Test Streamer', 'STREAMER');

-- Insert test streamer profile
INSERT INTO streamer_profiles (id, user_id, bio, active) 
VALUES 
    ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Test streamer bio', true);

-- Insert test platform account
INSERT INTO linked_platform_accounts (user_id, platform, platform_user_id, handle, access_token)
VALUES 
    ('22222222-2222-2222-2222-222222222222', 'TWITCH', '123456', 'test_streamer', 'fake_token_for_testing');

-- Insert test follow
INSERT INTO follows (viewer_id, streamer_id, notifications_enabled)
VALUES 
    ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', true);

-- Verify test data
SELECT * FROM users;
SELECT * FROM streamer_profiles;
SELECT * FROM linked_platform_accounts;
SELECT * FROM follows;
```

---

## 🎯 **Step 6: Test the Workflow**

### **Manual Execution (Recommended for Testing)**

1. **Open Workflow in n8n**
2. **Click "Execute Workflow" button** (top-right)
3. **Check Execution Log**
   - Green = Success
   - Red = Error
4. **Review Each Node**
   - Click on nodes to see output
   - Verify data flows correctly

### **Scheduled Execution**

Once tested manually:

1. **Activate Workflow**
   - Toggle "Active" switch (top-right)
2. **Monitor Executions**
   - Go to "Executions" tab
   - Check logs every 5 minutes
3. **View Database Changes**
   ```sql
   -- Check if content was fetched
   SELECT * FROM content_items ORDER BY created_at DESC LIMIT 10;
   ```

---

## 🔍 **Troubleshooting**

### **Issue: "Connection refused" or "Could not connect"**

**Solution:**
- Verify your Supabase password is correct
- Check if your IP is allowed in Supabase settings
- Ensure SSL is enabled in credential settings

### **Issue: "Table does not exist"**

**Solution:**
- Run the schema creation SQL from Step 4
- Verify tables exist:
  ```sql
  \dt
  ```

### **Issue: "Token expired" for platform APIs**

**Solution:**
- This is expected if using fake tokens
- The workflow will try to refresh tokens
- For real testing, connect actual platform OAuth

### **Issue: "No data returned"**

**Solution:**
- Insert test data from Step 5
- Or connect real platform accounts
- Check if `active = true` in streamer_profiles

---

## 📊 **Monitoring Queries**

Use these queries to monitor your workflow:

```sql
-- Check active streamers
SELECT sp.id, u.display_name, lpa.platform, lpa.handle
FROM streamer_profiles sp
JOIN users u ON u.id = sp.user_id
JOIN linked_platform_accounts lpa ON lpa.user_id = sp.user_id
WHERE sp.active = true;

-- Check recent content items
SELECT ci.title, ci.platform, ci.is_live, ci.view_count, ci.created_at
FROM content_items ci
ORDER BY ci.created_at DESC
LIMIT 20;

-- Check follows
SELECT 
    u1.display_name as viewer,
    u2.display_name as streamer,
    f.notifications_enabled
FROM follows f
JOIN users u1 ON u1.id = f.viewer_id
JOIN streamer_profiles sp ON sp.id = f.streamer_id
JOIN users u2 ON u2.id = sp.user_id;
```

---

## 🎨 **Visual Connection Flow**

```
┌─────────────────────────────────────────────────────────┐
│                    n8n Workflow                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🎯 Master Orchestrator (Every 5 min)                  │
│          ↓                                              │
│  📊 Fetch Active Streamers ──► Supabase DB             │
│          ↓                                              │
│  🔧 Enrich with Metadata                               │
│          ↓                                              │
│  🔑 Check Token Refresh                                │
│          ↓                                              │
│  🔀 Route by Platform                                  │
│     ├─► 📡 Twitch API                                  │
│     ├─► 📡 YouTube API                                 │
│     └─► 📡 Kick API                                    │
│          ↓                                              │
│  🔗 Merge Platform Data                                │
│          ↓                                              │
│  🔄 Normalize Data                                     │
│          ↓                                              │
│  💾 Store to Supabase DB                               │
│          ↓                                              │
│  🔴 Check If Live                                      │
│          ↓                                              │
│  👥 Get Followers ──► Supabase DB                      │
│          ↓                                              │
│  📦 Build Notifications                                │
│          ↓                                              │
│  📲 Send Push / 📧 Send Email                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
         │
         └──► All data flows through Supabase PostgreSQL
```

---

## 🚀 **Production Deployment**

### **Supabase Settings**

1. **Enable Connection Pooling**
   - Supabase Dashboard → Database → Connection Pooling
   - Use pooler connection string for better performance

2. **Configure IP Allowlist**
   - Add your n8n server IP
   - Or use 0.0.0.0/0 for development (not recommended for production)

3. **Set Up Database Backups**
   - Supabase automatically backs up
   - Configure point-in-time recovery if needed

### **n8n Settings**

1. **Use Environment Variables**
   - Don't hardcode credentials in workflow
   - Use `$env.POSTGRES_PASSWORD`

2. **Enable Error Workflow**
   - Create separate workflow for error handling
   - Link in main workflow settings

3. **Set Up Monitoring**
   - Use n8n's built-in execution tracking
   - Set up alerts for failed executions

---

## ✅ **Verification Checklist**

Before going live:

- [ ] Supabase connection successful in n8n
- [ ] All required tables created
- [ ] Test data inserted and queryable
- [ ] Manual workflow execution successful
- [ ] Each PostgreSQL node returns data
- [ ] No credential errors in execution log
- [ ] Scheduled trigger working (wait 5 min)
- [ ] Data being written to database
- [ ] Can query new data in Supabase

---

## 📞 **Quick Commands Reference**

```bash
# Connect to Supabase
psql -h db.ssbybrjhptiindmwsclv.supabase.co -p 5432 -d postgres -U postgres

# List all tables
\dt

# Describe a table
\d users

# Count records
SELECT COUNT(*) FROM users;

# Check recent activity
SELECT * FROM content_items WHERE created_at > NOW() - INTERVAL '1 hour';

# Exit psql
\q
```

---

## 🎯 **Next Steps**

1. ✅ **Connect n8n to Supabase** (this guide)
2. 🔲 **Test with sample data**
3. 🔲 **Connect real platform OAuth**
4. 🔲 **Enable scheduled execution**
5. 🔲 **Monitor for 24 hours**
6. 🔲 **Deploy to production**

---

**Your n8n workflow is now configured to work independently with Supabase! 🚀**

**Connection String for Reference:**
```
postgresql://postgres:[password]@db.ssbybrjhptiindmwsclv.supabase.co:5432/postgres?sslmode=require
```
