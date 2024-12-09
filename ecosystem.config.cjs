module.exports = {
  apps: [
    {
      name: "recoup-github-agent",
      script: "npm",
      args: "start",
      cron_restart: "0 */12 * * *",
      watch: false,
      autorestart: true,
    },
  ],
};
