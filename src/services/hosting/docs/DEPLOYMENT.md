# Deployment

See the step-by-step deployment instructions in the README.md.

## Summary

1. Provision Ubuntu 22.04 VPS
2. Run `bash infra/setup/server-init.sh`
3. Set GitHub secrets: `SYNC_SECRET`, `SERVER_SYNC_URL`
4. Push to `main` — CI handles the rest

## Environment Variables

| Variable              | Where         | Description                        |
|-----------------------|---------------|------------------------------------|
| `PORT`                | server/app.js | HTTP port for the main server      |
| `SYNC_PORT`           | server/sync.js| Internal HTTP port for the sync listener (default: 9001). Nginx listens on 9000 and proxies to this port. |
| `SYNC_SECRET`         | pm2 env       | HMAC secret for webhook validation |
| `MULTIPLIC_REPO_PATH` | pm2 env       | Path to the multiplic repo on disk |
| `SERVER_SYNC_URL`     | GitHub secret | Full URL to the sync endpoint      |
