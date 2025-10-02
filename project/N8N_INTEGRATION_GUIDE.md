# n8n Integration Guide for StreamLink

## 🚀 Why n8n for StreamLink?

n8n is a powerful workflow automation tool that can **dramatically reduce development time** and **boost your app's capabilities** by handling complex automation without writing code. Here's how it supercharges StreamLink:

### Benefits

1. **Replace Worker Service** - n8n can handle all scheduled jobs, reducing maintenance
2. **Visual Workflows** - Easy to debug and modify without code changes
3. **Built-in Integrations** - Pre-built nodes for Stripe, email, databases, APIs
4. **Webhook Management** - Handle all platform webhooks in one place
5. **No Deployment Needed** - Workflows update instantly without redeployment
6. **Error Handling** - Built-in retry logic and error notifications
7. **Scalability** - Can handle thousands of concurrent workflows
8. **Cost Reduction** - Reduce server costs by offloading background jobs

## 📋 What This Workflow Does

### 🔄 Automated Workflows (51 Nodes Total)

#### 1. **Live Status Monitoring** (Every 10 minutes)
- Fetches all active streamers from database
- Checks live status across Twitch, YouTube, Kick
- Sends push notifications to followers when streamers go live
- Updates database with current live status

#### 2. **Content Synchronization** (Hourly)
- Syncs latest videos, clips, and posts from all platforms
- Updates view counts, likes, comments
- Stores content in database for trending algorithms

#### 3. **Daily Analytics** (Midnight)
- Creates daily stats snapshots for all streamers
- Aggregates followers, views, likes across platforms
- Prepares data for dashboard analytics

#### 4. **Platform Webhooks**
- **Twitch**: Handles stream.online, stream.offline, follow events
- **YouTube**: PubSubHubbub for new uploads and live streams
- **Stripe**: Payment success, refunds, disputes

#### 5. **Token Refresh** (Every 6 hours)
- Automatically refreshes expiring OAuth tokens
- Prevents API access interruptions
- Updates tokens in database

#### 6. **Poll Management** (Every 5 minutes)
- Auto-closes expired polls
- Maintains data integrity

#### 7. **Weekly Reports** (Monday 6am)
- Generates weekly analytics for all streamers
- Sends beautiful email reports with stats
- Includes followers, views, likes growth

#### 8. **User Onboarding**
- Sends welcome emails on signup
- Logs events for audit trail
- Triggers onboarding sequence

#### 9. **Reward Redemptions**
- Notifies viewers via email when rewards are redeemed
- Alerts streamers of pending redemptions
- Tracks fulfillment status

#### 10. **Database Cleanup** (Every 2 hours)
- Removes old audit logs (>90 days)
- Cleans old stats snapshots (>1 year)
- Runs VACUUM ANALYZE for performance

## 🛠️ Setup Instructions

### 1. Install n8n

**Option A: Docker (Recommended)**
```bash
docker run -d --restart unless-stopped \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your-secure-password \
  -e POSTGRES_DATABASE=streamlink \
  -e POSTGRES_HOST=localhost \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_USER=streamlink \
  -e POSTGRES_PASSWORD=password \
  -v n8n_data:/home/node/.n8n \
  --network streamlink-network \
  n8nio/n8n
```

**Option B: npm**
```bash
npm install -g n8n
n8n start
```

### 2. Configure PostgreSQL Connection

1. Open n8n at `http://localhost:5678`
2. Go to **Credentials** → **Add Credential**
3. Select **Postgres**
4. Name: `StreamLink PostgreSQL`
5. Configure:
   ```
   Host: localhost
   Database: streamlink
   User: streamlink
   Password: password
   Port: 5432
   ```

### 3. Import Workflow

1. Copy the entire `n8n.json` file
2. In n8n, click **Workflows** → **Import from File**
3. Paste the JSON or upload the file
4. Click **Import**

### 4. Configure Environment Variables

Add these to your n8n environment:

```bash
# Postmark Email
POSTMARK_API_KEY=your-postmark-api-key

# Platform APIs
TWITCH_CLIENT_ID=your-twitch-client-id
TWITCH_CLIENT_SECRET=your-twitch-client-secret
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret
KICK_API_KEY=your-kick-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-key
```

### 5. Update Webhook URLs

Replace `http://localhost:3001` with your actual API URL in:
- All HTTP Request nodes
- Webhook trigger URLs

### 6. Activate Workflows

1. Open the imported workflow
2. Click **Activate** toggle in the top right
3. All scheduled triggers will start automatically

## 🔗 Integration with Your App

### Replace Worker Service

You can now **remove or simplify** the worker service since n8n handles:
- ✅ Scheduled jobs (cron)
- ✅ Platform API calls
- ✅ Webhook processing
- ✅ Email notifications
- ✅ Token refresh

**Keep in worker service** (optional):
- Complex business logic
- Real-time processing
- Heavy computations

### Trigger Workflows from API

Add webhook triggers to your NestJS API:

```typescript
// services/api/src/modules/webhooks/webhooks.service.ts
import axios from 'axios';

async triggerN8nWorkflow(workflow: string, data: any) {
  const n8nWebhookUrl = `http://localhost:5678/webhook/${workflow}`;
  
  try {
    await axios.post(n8nWebhookUrl, data);
  } catch (error) {
    console.error('Failed to trigger n8n workflow:', error);
  }
}

// Example: Trigger on user signup
async onUserSignup(user: User) {
  await this.triggerN8nWorkflow('webhook-user-signup', {
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role
  });
}
```

## 📊 Monitoring & Debugging

### View Execution History
1. Go to **Executions** tab
2. See all workflow runs with timestamps
3. Click any execution to see detailed logs

### Error Notifications
Add error handling to critical workflows:
1. Add **Error Trigger** node
2. Connect to email/Slack notification
3. Get alerted when workflows fail

### Performance Monitoring
- Check execution times in the Executions view
- Optimize slow workflows by splitting them
- Use webhook queues for high-volume events

## 🎯 Advanced Features

### 1. A/B Testing Email Templates
Create multiple versions of email workflows and split traffic to test performance.

### 2. Smart Notification Timing
Add logic to send notifications based on user timezone and activity patterns.

### 3. Platform Rate Limiting
Add delay nodes between API calls to respect platform rate limits.

### 4. Content Moderation
Integrate AI services (OpenAI) to auto-moderate user-generated content.

### 5. Fraud Detection
Build workflows to detect suspicious activity patterns and alert admins.

### 6. Customer Support Automation
Auto-respond to common support queries via email or chat.

## 🔧 Customization Tips

### Add More Platforms
1. Duplicate an existing platform check node
2. Update API endpoint and authentication
3. Add to the Switch node routing

### Modify Email Templates
1. Find the email node
2. Update HtmlBody parameter
3. Use n8n's expression syntax for dynamic content

### Add Custom Analytics
1. Create new scheduled trigger
2. Query database for insights
3. Store results or send reports

### Integrate with Other Services
n8n has 350+ integrations:
- Slack notifications
- Discord webhooks
- Google Sheets logging
- Airtable databases
- Zapier alternatives

## 💰 Cost Savings

### Development Time
- **Before**: 2-3 weeks to build worker service
- **After**: 1 day to configure n8n workflows
- **Savings**: 80-90% development time

### Maintenance
- **Before**: Update code, test, deploy for every change
- **After**: Update workflow visually, activate immediately
- **Savings**: Hours to minutes per change

### Infrastructure
- **Before**: Separate worker service + Redis
- **After**: Single n8n container
- **Savings**: ~$20-50/month in server costs

## 🚨 Production Considerations

### High Availability
- Run n8n in cluster mode with Redis
- Use queue mode for webhook processing
- Set up health checks and auto-restart

### Security
- Enable authentication (Basic Auth or OAuth)
- Use HTTPS for webhooks
- Encrypt sensitive credentials
- Limit network access

### Scaling
- Use separate n8n instances for different workflow types
- Queue heavy workflows
- Cache frequently accessed data
- Use webhook queues for burst traffic

### Backup
```bash
# Backup n8n data
docker exec n8n n8n export:workflow --all --output=/backup/workflows.json
docker exec n8n n8n export:credentials --all --output=/backup/credentials.json
```

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community](https://community.n8n.io/)
- [Workflow Templates](https://n8n.io/workflows)
- [API Documentation](https://docs.n8n.io/api/)

## 🎉 Next Steps

1. ✅ Import the workflow
2. ✅ Configure database credentials
3. ✅ Set environment variables
4. ✅ Test individual nodes
5. ✅ Activate workflows
6. ✅ Monitor executions
7. 🚀 Enjoy automated workflows!

---

**Pro Tip**: Start with just a few workflows (live status + webhooks), test thoroughly, then gradually activate the rest. This ensures stability and gives you time to learn n8n's capabilities.
