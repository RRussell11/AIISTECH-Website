module.exports = {
  apps: [
    {
      name:         'multiplic-app',
      script:       'server/app.js',
      cwd:          '/var/www/multiplic',
      instances:    'max',
      exec_mode:    'cluster',
      env: {
        NODE_ENV:              'production',
        PORT:                  3000,
        MULTIPLIC_REPO_PATH:   '/var/www/multiplic'
      }
    },
    {
      name:         'multiplic-sync',
      script:       'server/sync.js',
      cwd:          '/var/www/multiplic',
      instances:    1,
      env: {
        NODE_ENV:              'production',
        SYNC_PORT:             9001,
        SYNC_SECRET:           'SET_IN_PM2_ENV',
        MULTIPLIC_REPO_PATH:   '/var/www/multiplic'
      }
    }
  ]
};
