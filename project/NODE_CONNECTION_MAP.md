# 🔗 NODE CONNECTION REFERENCE

## COMPLETE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STREAMLINK CORE AUTOMATION FLOW                      │
│                         (All Nodes Properly Connected)                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: INITIALIZATION & DATA FETCHING                                      │
└──────────────────────────────────────────────────────────────────────────────┘

   [🎯 Master Orchestrator]
   │ Type: scheduleTrigger
   │ Interval: Every 10 minutes
   └──→ Triggers entire pipeline
         │
         ↓
   [📊 Get Active Streamers (Mock)]
   │ Type: Code
   │ Returns: 3 mock streamers (Twitch, YouTube, Kick)
   │ Production: Replace with PostgreSQL query
   └──→ Mock data for independent testing
         │
         ↓
   [🔧 Enrich with Metadata]
   │ Type: Code
   │ Adds: fetch_timestamp, needs_refresh, hours_until_expiry
   └──→ Calculates token expiry status
         │
         ↓

┌──────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: TOKEN REFRESH LOGIC (SPLIT & MERGE)                                 │
└──────────────────────────────────────────────────────────────────────────────┘

   [🔑 Token Refresh Needed?]
   │ Type: IF
   │ Condition: needs_refresh === true
   └──→ Splits flow into 2 branches
         │
         ├─── TRUE (token expiring) ───┐
         │                             ↓
         │                  [🔄 Refresh Tokens (Mock)]
         │                  │ Type: Code
         │                  │ Returns: New token + 30-day expiry
         │                  │ Production: OAuth2 token refresh APIs
         │                  └──→ Simulates successful refresh
         │                         │
         └─── FALSE (token valid) ─┤
                                   ↓
                         [🔗 Merge Token Paths]
                         │ Type: Merge
                         │ Mode: mergeByPosition
                         └──→ Combines both branches
                               │
                               ↓

┌──────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: PLATFORM ROUTING & API CALLS (SPLIT & MERGE)                        │
└──────────────────────────────────────────────────────────────────────────────┘

   [🔀 Route by Platform]
   │ Type: Switch
   │ Routes: TWITCH / YOUTUBE / KICK
   └──→ Splits by platform type
         │
         ├────── TWITCH ──────┐
         │                    ↓
         │         [📡 Fetch Twitch Data (Mock)]
         │         │ Type: Code
         │         │ Returns: is_live, viewer_count, title, etc.
         │         │ Production: HTTP → api.twitch.tv/helix/streams
         │         └──→ Mock: 30% chance live
         │                    │
         ├────── YOUTUBE ─────┤
         │                    ↓
         │         [📡 Fetch YouTube Data (Mock)]
         │         │ Type: Code
         │         │ Returns: is_live, video_id, viewer_count, etc.
         │         │ Production: HTTP → googleapis.com/youtube/v3/search
         │         └──→ Mock: 20% chance live
         │                    │
         └────── KICK ────────┤
                              ↓
                   [📡 Fetch Kick Data (Mock)]
                   │ Type: Code
                   │ Returns: is_live, category, viewer_count, etc.
                   │ Production: HTTP → kick.com/api/v2/channels
                   └──→ Mock: 25% chance live
                              │
                              ↓
                   [🔗 Merge All Platform Data]
                   │ Type: Merge
                   │ Mode: mergeByPosition
                   └──→ Combines all 3 platforms
                         │
                         ↓

┌──────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: DATA NORMALIZATION & STORAGE                                        │
└──────────────────────────────────────────────────────────────────────────────┘

   [🔄 Normalize Platform Data]
   │ Type: Code
   │ Creates: Unified schema for all platforms
   │ Fields: streamer_id, is_live, stream_url, should_notify, etc.
   └──→ Transforms to consistent format
         │
         ↓
   [💾 Store Stream Data (Mock)]
   │ Type: Code
   │ Action: console.log() with summary
   │ Production: PostgreSQL INSERT/UPDATE query
   └──→ Logs live streams to console
         │
         ↓

┌──────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: NOTIFICATION ROUTING (SPLIT & MERGE)                                │
└──────────────────────────────────────────────────────────────────────────────┘

   [📢 Should Notify?]
   │ Type: IF
   │ Condition: should_notify === true (stream is live)
   └──→ Splits: notify vs skip
         │
         ├─── TRUE (stream live) ──────┐
         │                             ↓
         │                  [👥 Get Followers (Mock)]
         │                  │ Type: Code
         │                  │ Returns: 2-5 mock followers per stream
         │                  │ Production: PostgreSQL JOIN query
         │                  └──→ Mock users with email + push tokens
         │                         │
         │                         ↓
         │                  [📦 Build Notifications]
         │                  │ Type: Code
         │                  │ Creates: Push + Email payloads
         │                  └──→ Formats notification messages
         │                         │
         │                         ↓
         │                  [📲 Send Notifications (Mock)]
         │                  │ Type: Code
         │                  │ Action: console.log() delivery
         │                  │ Production: HTTP → Expo Push + Postmark
         │                  └──→ Logs sent notifications
         │                         │
         └─── FALSE (offline) ─────┤
                                   ↓
                         [🔗 Merge Final Results]
                         │ Type: Merge
                         │ Mode: mergeByPosition
                         └──→ Combines notified + non-notified
                               │
                               ↓

┌──────────────────────────────────────────────────────────────────────────────┐
│ PHASE 6: EXECUTION SUMMARY                                                    │
└──────────────────────────────────────────────────────────────────────────────┘

   [✅ Log Execution Summary]
   │ Type: Code
   │ Logs: Total checked, live found, notifications sent, execution time
   │ Production: PostgreSQL INSERT into execution_logs table
   └──→ Final summary with formatted console output
         │
         ↓
      [END]

┌──────────────────────────────────────────────────────────────────────────────┐
│ KEY METRICS                                                                   │
└──────────────────────────────────────────────────────────────────────────────┘

Total Nodes: 20
Connections: 19 (all nodes connected)
Split Points: 2 (token refresh, notifications)
Merge Points: 3 (tokens, platforms, results)
Mock Nodes: 6 (database, APIs, notifications)
Production-Ready Nodes: 14

┌──────────────────────────────────────────────────────────────────────────────┐
│ CONNECTION TYPES                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

→  Sequential (14 connections)
├→ Branch/Split (2 IF nodes + 1 Switch = 6 outputs)
└→ Merge/Join (3 merge nodes = 6 inputs)

Total Input/Output Connections: 26

┌──────────────────────────────────────────────────────────────────────────────┐
│ DATA FLOW SUMMARY                                                             │
└──────────────────────────────────────────────────────────────────────────────┘

INPUT:  1 trigger (schedule)
        ↓
FETCH:  3 streamers (mock)
        ↓
ENRICH: Add metadata (timestamps, expiry)
        ↓
SPLIT:  Refresh tokens if needed
        ↓
MERGE:  Combine refreshed + valid tokens
        ↓
SPLIT:  Route by platform (3 branches)
        ↓
API:    Fetch stream status (3 mock APIs)
        ↓
MERGE:  Combine all platforms
        ↓
NORMALIZE: Unified schema
        ↓
STORE:  Log to console (mock database)
        ↓
SPLIT:  Notify if live
        ↓
FOLLOWERS: Get notification targets (mock)
        ↓
BUILD:  Create push + email payloads
        ↓
SEND:   Log notifications (mock)
        ↓
MERGE:  Final results
        ↓
OUTPUT: Execution summary

┌──────────────────────────────────────────────────────────────────────────────┐
│ TESTING CHECKLIST                                                             │
└──────────────────────────────────────────────────────────────────────────────┘

□ All 20 nodes visible in editor
□ No isolated nodes (all have arrows)
□ Manual execution completes successfully
□ Console shows stream processing summary
□ Console shows notification delivery logs
□ Console shows execution summary
□ Execution time < 1 second (mock mode)
□ All nodes show green checkmarks after execution

┌──────────────────────────────────────────────────────────────────────────────┐
│ PRODUCTION MIGRATION PATH                                                     │
└──────────────────────────────────────────────────────────────────────────────┘

STEP 1: Replace mock streamers with PostgreSQL query
STEP 2: Replace mock platform APIs with HTTP Request nodes
STEP 3: Replace mock storage with PostgreSQL INSERT
STEP 4: Replace mock followers with PostgreSQL JOIN
STEP 5: Replace mock notifications with Expo + Postmark HTTP
STEP 6: Add error handling nodes
STEP 7: Add retry logic for failed API calls
STEP 8: Enable schedule trigger (10-minute interval)
STEP 9: Set up monitoring and alerts
STEP 10: Test with real data in staging environment
```

---

## 🔗 NODE IDs & CONNECTIONS MAP

### **Trigger**
- `master-orchestrator` → `fetch-active-streamers`

### **Data Fetching**
- `fetch-active-streamers` → `enrich-metadata`
- `enrich-metadata` → `check-token-refresh`

### **Token Refresh Branch**
- `check-token-refresh` (TRUE) → `refresh-tokens-mock`
- `check-token-refresh` (FALSE) → `merge-after-refresh` (input 1)
- `refresh-tokens-mock` → `merge-after-refresh` (input 0)

### **Platform Routing**
- `merge-after-refresh` → `route-by-platform`
- `route-by-platform` (output 0) → `fetch-twitch-data`
- `route-by-platform` (output 1) → `fetch-youtube-data`
- `route-by-platform` (output 2) → `fetch-kick-data`

### **Platform Merge**
- `fetch-twitch-data` → `merge-platform-data` (input 0)
- `fetch-youtube-data` → `merge-platform-data` (input 0)
- `fetch-kick-data` → `merge-platform-data` (input 0)

### **Processing**
- `merge-platform-data` → `normalize-data`
- `normalize-data` → `store-stream-data`
- `store-stream-data` → `check-should-notify`

### **Notification Branch**
- `check-should-notify` (TRUE) → `get-followers`
- `check-should-notify` (FALSE) → `merge-final-results` (input 1)
- `get-followers` → `build-notifications`
- `build-notifications` → `send-notifications`
- `send-notifications` → `merge-final-results` (input 0)

### **Final**
- `merge-final-results` → `log-execution-summary`

---

**Total Connections**: 19  
**Total Nodes**: 20  
**Status**: ✅ All nodes connected, no orphans
