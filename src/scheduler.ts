import cron from "node-cron";
import { OrchestratorService } from "./services/orchestrator";
import { logger } from "./utils/logger";

// Validate required environment variables
const requiredEnvVars = [
  "GITHUB_TOKEN",
  "OPENAI_API_KEY",
  "GITHUB_OWNER",
  "GITHUB_REPO",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize orchestrator
const orchestrator = new OrchestratorService(
  process.env.GITHUB_TOKEN!,
  process.env.OPENAI_API_KEY!,
  process.env.GITHUB_OWNER!,
  process.env.GITHUB_REPO!
);

// Schedule PR processing every hour
cron.schedule("0 * * * *", async () => {
  logger.info("Starting scheduled PR processing");
  try {
    await orchestrator.processNewPRs();
    logger.info("Completed scheduled PR processing");
  } catch (error) {
    logger.error("Failed to process PRs:", error);
  }
});

// Initial run on startup
logger.info("Starting initial PR processing");
orchestrator
  .processNewPRs()
  .then(() => logger.info("Completed initial PR processing"))
  .catch((error) => logger.error("Failed initial PR processing:", error));
