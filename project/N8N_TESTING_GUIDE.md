# 🧪 N8N FLOW TESTING GUIDE

## ✅ REBUILT FLOW OVERVIEW

The n8n.json file has been completely rebuilt with:
- ✅ **All nodes properly connected** (no isolated nodes)
- ✅ **NO AI integrations** (all commented out in code)
- ✅ **Independent testing** (mock data, no database required)
- ✅ **Production-ready** (easy to switch from mock to real APIs)

---

## 📊 FLOW ARCHITECTURE (20 Nodes)

### **LINEAR PIPELINE - FULLY CONNECTED**

```
🎯 Master Orchestrator (Schedule Trigger)
    ↓
📊 Get Active Streamers (Mock Data)
    ↓
🔧 Enrich with Metadata (Add timestamps)
    ↓
🔑 Token Refresh Needed? (IF condition)
    ↓↓
    ├─YES→ 🔄 Refresh Tokens (Mock) ─┐
    └─NO─────────────────────────────┤
                                      ↓
                      🔗 Merge Token Paths
                                      ↓
                      🔀 Route by Platform (Switch)
                            ↓↓↓
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
    📡 Fetch Twitch  📡 Fetch YouTube  📡 Fetch Kick
            ↓              ↓              ↓
            └──────────────┼──────────────┘
                           ↓
            🔗 Merge All Platform Data
                           ↓
            🔄 Normalize Platform Data
                           ↓
            💾 Store Stream Data (Mock - Console Log)
                           ↓
            📢 Should Notify? (IF condition)
                ↓↓
                ├─YES→ 👥 Get Followers (Mock)
                │           ↓
                │      📦 Build Notifications
                │           ↓
                │      📲 Send Notifications (Mock)
                │           ↓
                └─NO──────┐ │
                          ↓ ↓
              🔗 Merge Final Results
                          ↓
              ✅ Log Execution Summary
```

---

## 🚀 HOW TO TEST (STEP-BY-STEP)

### **1. IMPORT WORKFLOW**

```bash
# Navigate to n8n dashboard
http://localhost:5678

# Import workflow:
1. Click "Workflows" → "Add Workflow" → "Import from File"
2. Select: project/n8n.json
3. Click "Import"
```

### **2. MANUAL EXECUTION (TEST WITHOUT WAITING)**

```bash
# In n8n editor:
1. Click "Execute Workflow" button (top right)
2. Watch nodes light up as they execute
3. Check console logs in each node
```

### **3. CHECK EXECUTION LOGS**

Click on each node to see output:

- **📊 Get Active Streamers**: 3 mock streamers (Twitch, YouTube, Kick)
- **🔧 Enrich Metadata**: Token expiry calculations
- **🔑 Token Refresh**: Identifies expiring tokens
- **📡 Platform APIs**: Mock stream status (random live/offline)
- **💾 Store Data**: Console logs showing which streams are live
- **📲 Notifications**: Mock notification delivery logs

### **4. VERIFY CONNECTION FLOW**

All nodes should execute in sequence. No "orphaned" nodes.

Expected execution count: **20 nodes** (all connected)

---

## 📝 MOCK DATA DETAILS

### **Mock Streamers (3)**
```javascript
Streamer 1: Twitch  (token expires in 7 days)
Streamer 2: YouTube (token expires in 2 days)
Streamer 3: Kick    (token expired 1 day ago - triggers refresh)
```

### **Random Live Status**
- Twitch: 30% chance live
- YouTube: 20% chance live
- Kick: 25% chance live

### **Mock Followers (per live stream)**
- 2-5 mock users with email addresses
- Push tokens generated
- Email + Push notification payloads created

---

## 🔄 SWITCHING TO PRODUCTION

### **Phase 1: Connect Database**

**Node: `📊 Get Active Streamers`**

Replace the `jsCode` parameter with:

```json
{
  "parameters": {
    "operation": "executeQuery",
    "query": "SELECT sp.id as streamer_id, sp.user_id, lpa.platform, lpa.platform_user_id, lpa.access_token, lpa.handle, lpa.token_expires_at FROM streamer_profiles sp JOIN linked_platform_accounts lpa ON lpa.user_id = sp.user_id WHERE sp.active = true ORDER BY sp.id",
    "options": {}
  },
  "type": "n8n-nodes-base.postgres",
  "credentials": {"postgres": {"id": "streamlink-db", "name": "StreamLink PostgreSQL"}}
}
```

**Node: `💾 Store Stream Data`**

Replace mock console.log with INSERT query (see comments in node).

**Node: `👥 Get Followers`**

Replace mock followers with PostgreSQL JOIN query (see comments).

### **Phase 2: Enable Real APIs**

**Twitch Node:**
```json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://api.twitch.tv/helix/streams",
    "method": "GET",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "twitchOAuth2Api",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [{"name": "user_id", "value": "={{ $json.platform_user_id }}"}]
    }
  }
}
```

**YouTube Node:**
```json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://www.googleapis.com/youtube/v3/search",
    "method": "GET",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "youtubeOAuth2Api",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        {"name": "part", "value": "snippet"},
        {"name": "channelId", "value": "={{ $json.platform_user_id }}"},
        {"name": "eventType", "value": "live"},
        {"name": "type", "value": "video"}
      ]
    }
  }
}
```

**Kick Node:**
```json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "=https://kick.com/api/v2/channels/{{ $json.handle }}",
    "method": "GET",
    "options": {"timeout": 15000}
  }
}
```

### **Phase 3: Enable Notifications**

**Push Notifications (Expo):**
```json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://exp.host/--/api/v2/push/send",
    "method": "POST",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {"name": "to", "value": "={{ $json.notification_payload.to }}"},
        {"name": "title", "value": "={{ $json.notification_payload.title }}"},
        {"name": "body", "value": "={{ $json.notification_payload.body }}"},
        {"name": "data", "value": "={{ $json.notification_payload.data }}"}
      ]
    }
  }
}
```

**Email (Postmark):**
```json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://api.postmarkapp.com/email",
    "method": "POST",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {"name": "X-Postmark-Server-Token", "value": "={{ $env.POSTMARK_API_KEY }}"},
        {"name": "Content-Type", "value": "application/json"}
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {"name": "From", "value": "notifications@streamlink.app"},
        {"name": "To", "value": "={{ $json.email_payload.to }}"},
        {"name": "Subject", "value": "={{ $json.email_payload.subject }}"},
        {"name": "HtmlBody", "value": "={{ $json.email_payload.html }}"}
      ]
    }
  }
}
```

---

## 🐛 TROUBLESHOOTING

### **Issue: "Workflow did not return data"**
- Check if nodes are executing (green checkmarks)
- Verify mock data in first node returns items
- Ensure connections are correct

### **Issue: "Node not found"**
- Re-import workflow
- Check node IDs match in connections section

### **Issue: "Merge node has no input"**
- Verify both IF branches connect to merge node
- Check switch node outputs all connect properly

### **Issue: "Execution timed out"**
- Mock data executes instantly
- If using real APIs, increase timeout in Settings

---

## ⚙️ PRODUCTION CONFIGURATION

### **Environment Variables (Add to n8n)**

```bash
# n8n Settings → Variables
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
POSTMARK_API_KEY=your_postmark_key
EXPO_ACCESS_TOKEN=your_expo_token
```

### **Database Credentials**

```bash
# n8n Settings → Credentials → PostgreSQL
Name: streamlink-db
Host: localhost
Port: 5432
Database: streamlink
User: postgres
Password: your_db_password
```

---

## 📊 MONITORING

### **Check Execution History**

```bash
# n8n dashboard
Executions → View all executions
- Filter by: Success/Error
- Check execution time
- View node outputs
```

### **Expected Performance**

- **Mock Mode**: < 100ms execution time
- **Production Mode**: 2-5 seconds (depends on API responses)
- **With Database**: Add 50-200ms per query

---

## 🎯 NEXT STEPS

### **Phase 1: Test Current Flow (TODAY)**
1. ✅ Import n8n.json
2. ✅ Execute manually
3. ✅ Verify all 20 nodes run
4. ✅ Check console logs

### **Phase 2: Connect Database (WHEN READY)**
1. Replace mock streamer node
2. Add PostgreSQL credentials
3. Test database queries
4. Store real stream data

### **Phase 3: Enable Platform APIs (WHEN OAUTH READY)**
1. Set up Twitch OAuth app
2. Set up YouTube OAuth app
3. Configure Kick API access
4. Replace mock API nodes

### **Phase 4: Enable Notifications (WHEN SERVICES READY)**
1. Set up Postmark account
2. Configure Expo push service
3. Replace mock notification nodes
4. Test with real users

---

## 📌 KEY DIFFERENCES FROM AI VERSION

| Feature | AI Version | Current Version |
|---------|-----------|-----------------|
| **Nodes** | 48 nodes | 20 nodes |
| **AI Features** | 6 AI nodes | 0 (all removed) |
| **Dependencies** | OpenAI API required | None (all mocked) |
| **Testing** | Requires API keys | Works immediately |
| **Database** | Required | Optional (mocked) |
| **Complexity** | High | Low |
| **Deployment** | Complex | Simple |

---

## ✅ CHECKLIST FOR DEPLOYMENT

- [ ] Import workflow to n8n
- [ ] Test manual execution
- [ ] Verify all 20 nodes execute
- [ ] Check console logs
- [ ] Set up PostgreSQL credentials (when ready)
- [ ] Configure platform OAuth (when ready)
- [ ] Set up notification services (when ready)
- [ ] Enable schedule trigger (10-minute interval)
- [ ] Monitor execution history
- [ ] Add error handling workflow (optional)

---

## 🆘 SUPPORT

If you encounter issues:

1. **Check n8n logs**: `docker logs n8n-container`
2. **Verify node connections**: All arrows should be solid
3. **Test individual nodes**: Right-click → "Execute Node"
4. **Check execution data**: Click node → "Output" tab

---

**Last Updated**: 2025-10-02  
**Version**: 3.0.0 (Production-Ready, No AI)  
**Status**: ✅ READY TO TEST
