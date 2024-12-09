import cron from "node-cron";
import { OrchestratorService } from "./services/orchestrator.js";

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

const orchestrator = new OrchestratorService(
  process.env.GITHUB_TOKEN!,
  process.env.OPENAI_API_KEY!,
  process.env.GITHUB_OWNER!,
  process.env.GITHUB_REPO!
);

cron.schedule("0 21 * * 1-5", async () => {
  console.log("Starting scheduled PR processing");
  try {
    await orchestrator.processNewPRs();
    console.log("Completed scheduled PR processing");
  } catch (error) {
    console.error("Failed to process PRs:", error);
  }
});

console.log("Starting initial PR processing");
orchestrator
  .processNewPRs()
  .then(() => console.log("Completed initial PR processing"))
  .catch((error) => console.error("Failed initial PR processing:", error));
