module.exports = {
  apps: [
    {
      name: "recoup-github-agent",
      script: "npm",
      args: "test",
      cron_restart: "0 */12 * * *",
      watch: false,
      autorestart: true,
    },
  ],
};
