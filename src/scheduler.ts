import cron from "node-cron";
import { OrchestratorService } from "./services/orchestrator";

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
  console.log("Starting scheduled PR processing");
  try {
    await orchestrator.processNewPRs();
    console.log("Completed scheduled PR processing");
  } catch (error) {
    console.error("Failed to process PRs:", error);
  }
});

// Initial run on startup
console.log("Starting initial PR processing");
orchestrator
  .processNewPRs()
  .then(() => console.log("Completed initial PR processing"))
  .catch((error) => console.error("Failed initial PR processing:", error));
