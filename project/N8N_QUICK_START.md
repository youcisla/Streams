# StreamLink n8n Quick Start (5 Minutes)

Get your automation up and running in 5 minutes with this quick start guide.

## 🚀 Step 1: Start n8n (1 minute)

### Using Docker Compose (Recommended)

Add to your existing `docker-compose.yml`:

```yaml
services:
  # ... your existing services ...
  
  n8n:
    image: n8nio/n8n:latest
    container_name: streamlink-n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=streamlink123
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=America/New_York
      # Environment variables for workflows
      - POSTMARK_API_KEY=${POSTMARK_API_KEY}
      - TWITCH_CLIENT_ID=${TWITCH_CLIENT_ID}
      - TWITCH_CLIENT_SECRET=${TWITCH_CLIENT_SECRET}
      - YOUTUBE_CLIENT_ID=${YOUTUBE_CLIENT_ID}
      - YOUTUBE_CLIENT_SECRET=${YOUTUBE_CLIENT_SECRET}
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - streamlink-network
    depends_on:
      - postgres

volumes:
  n8n_data:

networks:
  streamlink-network:
    driver: bridge
```

**Start it:**
```bash
docker-compose up -d n8n
```

### Or standalone Docker:
```bash
docker run -d --name streamlink-n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=streamlink123 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

**Access n8n**: Open http://localhost:5678
- Username: `admin`
- Password: `streamlink123`

## 📥 Step 2: Import Workflow (2 minutes)

1. Click **Workflows** in the left sidebar
2. Click **Import from File** button
3. Select the `n8n.json` file from your project root
4. Click **Import**

## 🔑 Step 3: Configure Credentials (1 minute)

### PostgreSQL Connection

1. Click **Credentials** in the left sidebar
2. Click **Add Credential** button
3. Search for "Postgres"
4. Fill in:
   ```
   Name: StreamLink PostgreSQL
   Host: postgres (or localhost if not using Docker)
   Database: streamlink
   User: streamlink
   Password: password
   Port: 5432
   ```
5. Click **Create**

### Optional: Configure Email (if using Postmark)

1. Add credential → Search "HTTP Header Auth"
2. Name: `Postmark Auth`
3. Header: `X-Postmark-Server-Token`
4. Value: Your Postmark API key

## ✅ Step 4: Test a Simple Workflow (30 seconds)

1. Open the imported workflow
2. Click on "Check Live Status (Every 10min)" node
3. Click **Execute Node** button
4. Check the output panel for results

## 🎯 Step 5: Activate Workflows (30 seconds)

1. Toggle **Active** switch in the top right
2. All scheduled jobs will now run automatically!

## 🎉 You're Done!

Your automation is now running. Here's what's happening:

- ✅ Live status checks every 10 minutes
- ✅ Content sync every hour
- ✅ Daily stats snapshots at midnight
- ✅ Webhook endpoints ready
- ✅ Email notifications configured

## 📊 Monitoring

### View Recent Executions
1. Click **Executions** tab
2. See all workflow runs with timestamps
3. Click any execution to see detailed logs

### Check for Errors
Look for red ❌ indicators in the executions list

## 🔧 Common Adjustments

### Change Schedule Times

1. Click the Schedule Trigger node (e.g., "Check Live Status")
2. Click the node to open settings
3. Adjust "Rule" → "Interval"
4. Save and re-activate

### Update API URL

If your API isn't at `localhost:3001`:

1. Click Edit → Find
2. Search for: `http://localhost:3001`
3. Replace with your URL: `https://api.yourdomain.com`
4. Click "Replace All"

### Update Email "From" Address

1. Find any email node
2. Click to open settings
3. Change "From" parameter
4. Save

## 🚨 Troubleshooting

### Can't connect to PostgreSQL?

**From Docker container:**
```yaml
# In docker-compose.yml, make sure n8n is on same network
networks:
  - streamlink-network
```

Host should be: `postgres` (service name), not `localhost`

### Workflows not executing?

1. Check the workflow is **Active** (toggle in top right)
2. Check **Executions** tab for errors
3. Verify credentials are configured

### Webhooks not receiving data?

1. Get webhook URL from the Webhook node
2. Copy the "Test URL" or "Production URL"
3. Configure it in the platform (Twitch, Stripe, etc.)

## 📚 Next Steps

1. **Read the full guide**: [N8N_INTEGRATION_GUIDE.md](./N8N_INTEGRATION_GUIDE.md)
2. **Compare approaches**: [ARCHITECTURE_COMPARISON.md](./ARCHITECTURE_COMPARISON.md)
3. **Customize workflows**: Add your own nodes and logic
4. **Monitor performance**: Check execution times and optimize

## 💡 Pro Tips

### Start Small
Activate just 2-3 workflows initially:
1. Live status checks
2. Platform webhooks
3. Email notifications

### Test Before Production
Use the "Execute Workflow" button to test manually before activating

### Use Webhook Queue Mode
For high-volume webhooks, enable queue mode:
```bash
docker run -d --name streamlink-n8n \
  -p 5678:5678 \
  -e EXECUTIONS_MODE=queue \
  n8nio/n8n
```

### Backup Your Workflows
```bash
# Export workflow
docker exec streamlink-n8n n8n export:workflow --all --output=/data/backup.json

# Copy from container
docker cp streamlink-n8n:/data/backup.json ./n8n-backup.json
```

## 🎊 Success!

You now have a powerful automation system running with:
- **Zero custom code** for background jobs
- **Visual workflows** easy to understand and modify
- **Instant updates** without redeployment
- **Built-in monitoring** and error handling

Enjoy your 80-90% faster development! 🚀

---

**Need help?** Check the [n8n community forum](https://community.n8n.io/) or the full [integration guide](./N8N_INTEGRATION_GUIDE.md).
