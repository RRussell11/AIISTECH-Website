#!/bin/bash
set -e
apt-get update && apt-get upgrade -y
apt-get install -y git nginx certbot python3-certbot-nginx

# Node 20 via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
nvm install 20 && nvm use 20 && nvm alias default 20

# pm2 globally
npm install -g pm2

# Clone repo (built branch — no build tools needed on server)
git clone --branch built https://github.com/MultiplicityFoundation/multiplic /var/www/multiplic
cd /var/www/multiplic

# Install server deps only
cd server && npm ci --production && cd ..

# Copy Nginx config
cp infra/nginx/multiplic.conf /etc/nginx/sites-available/multiplic
ln -sf /etc/nginx/sites-available/multiplic /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Start processes
pm2 start infra/pm2/ecosystem.config.js
pm2 save && pm2 startup
