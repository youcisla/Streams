# ⚡ QUICK START GUIDE

## 🎯 Deploy in 5 Minutes

This guide gets your n8n workflow running **TODAY** with zero external dependencies.

---

## ✅ PREREQUISITES

- ✅ n8n running (Docker or self-hosted)
- ✅ Access to n8n web interface
- ❌ No database required (for testing)
- ❌ No API keys required (for testing)
- ❌ No OAuth setup required (for testing)

---

## 🚀 STEP 1: IMPORT WORKFLOW (1 minute)

### Option A: Via n8n UI

```bash
1. Open n8n: http://localhost:5678
2. Click "Workflows" (left sidebar)
3. Click "+ Add Workflow" (top right)
4. Click "Import from File"
5. Select: project/n8n.json
6. Click "Import"
```

### Option B: Via Docker Volume

```bash
# Copy workflow to n8n data directory
docker cp project/n8n.json n8n-container:/home/node/.n8n/workflows/

# Restart n8n to load new workflow
docker restart n8n-container
```

---

## 🧪 STEP 2: TEST WORKFLOW (2 minutes)

### Execute Manually

```bash
1. In n8n editor, open the imported workflow
2. Click "Execute Workflow" button (top right)
3. Watch nodes light up green as they execute
4. Check execution time (should be < 1 second)
```

### Verify Results

Click on each node to see output:

1. **📊 Get Active Streamers**: Should show 3 mock streamers
2. **📡 Platform API nodes**: Should show random live/offline status
3. **💾 Store Stream Data**: Check browser console (F12) for logs
4. **📲 Send Notifications**: Check console for notification logs

### Expected Console Output

```
=== STREAM PROCESSING SUMMARY ===
Total streams processed: 3
Live streams found: 1

🔴 LIVE: test_streamer_1 on TWITCH
   Title: test_streamer_1's Epic Gaming Stream
   Viewers: 2347
   URL: https://twitch.com/test_streamer_1

=================================

=== NOTIFICATION DELIVERY ===

📧 Sending to: user1@example.com
   Push: 🔴 test_streamer_1 is now live!
   Email: test_streamer_1 is streaming now!

📧 Sending to: user2@example.com
   Push: 🔴 test_streamer_1 is now live!
   Email: test_streamer_1 is streaming now!

Total notifications sent: 2
=============================

╔════════════════════════════════════════╗
║   PIPELINE EXECUTION SUMMARY          ║
╠════════════════════════════════════════╣
║ Streamers Checked: 3                  ║
║ Live Streams: 1                       ║
║ Notifications: 2                      ║
║ Execution Time: 87ms                  ║
║ Status: SUCCESS                       ║
╚════════════════════════════════════════╝
```

---

## 🎨 STEP 3: VISUALIZE FLOW (1 minute)

### Canvas Layout

The workflow should look like this:

```
[🎯] → [📊] → [🔧] → [🔑]
                      ↓  ↓
                    [🔄] [skip]
                      ↓  ↓
                      [🔗]
                       ↓
                      [🔀]
                    ↓  ↓  ↓
                [📡][📡][📡]
                    ↓  ↓  ↓
                      [🔗]
                       ↓
                      [🔄]
                       ↓
                      [💾]
                       ↓
                      [📢]
                      ↓  ↓
                    [👥] [skip]
                     ↓    ↓
                    [📦]  ↓
                     ↓    ↓
                    [📲]  ↓
                     ↓    ↓
                      [🔗]
                       ↓
                      [✅]
```

### Verify Connections

- ✅ All nodes have arrows connecting them
- ✅ No isolated nodes
- ✅ Two split points (IF nodes)
- ✅ Three merge points (Merge nodes)

---

## 📊 STEP 4: CHECK EXECUTION HISTORY (1 minute)

```bash
1. Click "Executions" in left sidebar
2. See your test execution listed
3. Click on it to view details
4. Verify:
   - Status: Success
   - Duration: < 1 second
   - Nodes executed: 20
```

---

## ✅ YOU'RE DONE!

Your n8n workflow is now **live and testable** without any external dependencies.

---

## 🔄 OPTIONAL: ENABLE SCHEDULE TRIGGER

### Make it Run Automatically

```bash
1. Open workflow in editor
2. Click on "🎯 Master Orchestrator" node
3. Verify interval: Every 10 minutes
4. Click "Activate" toggle (top right of editor)
5. Workflow will now run every 10 minutes automatically
```

### Monitor Automatic Executions

```bash
# Check execution history
Executions → Filter by "Automated"

# Expected behavior:
- New execution every 10 minutes
- Random live stream results (30% Twitch, 20% YouTube, 25% Kick)
- Console logs on each execution
```

---

## 🎯 WHAT'S NEXT?

### Phase 1: Production Database (Week 1)

Replace mock data with real database:

```bash
1. Set up PostgreSQL credentials in n8n
2. Replace "📊 Get Active Streamers (Mock)" node
3. Change type from "Code" to "PostgreSQL"
4. Use query from node comments
5. Test with real streamer data
```

**File**: `N8N_TESTING_GUIDE.md` → Section "Switching to Production"

### Phase 2: Platform APIs (Week 2)

Enable real API calls:

```bash
1. Set up Twitch OAuth app
2. Set up YouTube OAuth app
3. Configure Kick API access
4. Replace mock API nodes with HTTP Request nodes
5. Test with real platform data
```

**File**: `N8N_TESTING_GUIDE.md` → Section "Enable Real APIs"

### Phase 3: Notifications (Week 2-3)

Enable push + email delivery:

```bash
1. Set up Postmark account
2. Configure Expo push service
3. Replace mock notification nodes with HTTP Request nodes
4. Test with real users
```

**File**: `N8N_TESTING_GUIDE.md` → Section "Enable Notifications"

### Phase 4: AI Integration (Month 2+)

Add AI features when ready:

```bash
1. Set up OpenAI account
2. Add content analysis node
3. Add embedding generation
4. Add engagement prediction
5. Personalize notifications with GPT-4
```

**File**: `AI_INTEGRATION_GUIDE.md` (from previous version)

---

## 🐛 TROUBLESHOOTING

### Problem: Workflow doesn't import

**Solution**: 
```bash
# Check JSON syntax
cat project/n8n.json | python -m json.tool

# If invalid, re-download from repository
```

### Problem: Nodes don't execute

**Solution**:
```bash
# Verify n8n version
docker exec n8n-container n8n --version

# Should be v1.0.0 or higher
# Update if needed: docker pull n8nio/n8n:latest
```

### Problem: No console output

**Solution**:
```bash
# Open browser console (F12)
# Navigate to "Console" tab
# Execute workflow again
# Console.log statements will appear here
```

### Problem: "Module not found" error

**Solution**:
```bash
# All nodes use built-in n8n types
# No custom modules needed
# If error persists, restart n8n:
docker restart n8n-container
```

---

## 📚 DOCUMENTATION INDEX

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `N8N_TESTING_GUIDE.md` | Comprehensive testing & production migration | After import, before deployment |
| `NODE_CONNECTION_MAP.md` | Visual flow diagram & connection details | When understanding flow structure |
| `BEFORE_AFTER_ANALYSIS.md` | Comparison with AI version | When deciding on features |
| `QUICK_START_GUIDE.md` | This file - 5-minute setup | **START HERE** |

---

## 🎉 SUCCESS METRICS

After following this guide, you should have:

- ✅ Workflow imported to n8n
- ✅ Manual execution successful
- ✅ All 20 nodes executed
- ✅ Console logs visible
- ✅ Execution time < 1 second
- ✅ No errors in execution history
- ✅ Understanding of flow structure

---

## 💡 PRO TIPS

### Tip 1: Use Manual Trigger for Testing

```bash
# Instead of waiting 10 minutes, manually trigger:
1. Keep workflow inactive (toggle OFF)
2. Use "Execute Workflow" button for testing
3. Activate (toggle ON) only when ready for production
```

### Tip 2: Monitor Execution Logs

```bash
# n8n stores execution data
# View history: Executions → Click any execution
# See node outputs, execution time, errors
```

### Tip 3: Duplicate Workflow for Testing

```bash
# Create a test version:
1. Open workflow
2. Click "..." menu (top right)
3. Select "Duplicate"
4. Rename: "StreamLink (Test)"
5. Experiment without affecting production
```

### Tip 4: Use Pinned Data for Debugging

```bash
# Pin data to specific nodes:
1. Execute workflow once
2. Click node with good output
3. Click "Pin data" icon
4. Node will use pinned data on next execution
5. Useful for testing downstream nodes
```

---

## 🔗 USEFUL COMMANDS

### Check n8n Status

```bash
docker ps | grep n8n
docker logs n8n-container --tail 50
```

### Restart n8n

```bash
docker restart n8n-container
```

### Access n8n Shell

```bash
docker exec -it n8n-container /bin/sh
```

### Export Workflow

```bash
# From n8n UI:
Workflow → ... menu → "Export" → "Download"

# Or via CLI:
docker exec n8n-container n8n export:workflow --id=<workflow-id>
```

---

## 🆘 SUPPORT RESOURCES

### n8n Documentation
- Workflow basics: https://docs.n8n.io/workflows/
- Node reference: https://docs.n8n.io/integrations/

### Community
- n8n forum: https://community.n8n.io/
- Discord: https://discord.gg/n8n

### This Project
- Testing guide: `N8N_TESTING_GUIDE.md`
- Connection map: `NODE_CONNECTION_MAP.md`
- Comparison: `BEFORE_AFTER_ANALYSIS.md`

---

**Version**: 3.0.0  
**Last Updated**: 2025-10-02  
**Status**: ✅ Production-Ready (Mock Mode)  
**Time to Deploy**: 5 minutes  
**External Dependencies**: None (for testing)
