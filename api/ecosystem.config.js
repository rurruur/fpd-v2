module.exports = {
  apps: [
    {
      name: 'fpd-api',
      script: 'dist/index.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      cwd: '/home/bitnami/fpd/api',
      excec_mode: 'cluster',
      instances: 1,
      node_args: '-r dotenv/config',
    },
  ],
};
