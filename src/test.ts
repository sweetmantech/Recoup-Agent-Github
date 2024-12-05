import { GithubService } from "./services/github.js";
import { OpenAIService } from "./services/openai.js";
import { FarcasterService } from "./services/farcaster.js";

async function testIntegration() {
  try {
    // Initialize services
    console.log("Initializing services...");
    const githubService = new GithubService();
    const openaiService = new OpenAIService();
    const farcasterService = new FarcasterService();

    // Test Farcaster connection
    console.log("\nTesting Farcaster connection...");
    const isConnected = await farcasterService.verifyConnection();
    if (!isConnected) {
      throw new Error("Failed to connect to Farcaster");
    }
    console.log("✅ Farcaster connection verified");

    // Test GitHub and OpenAI
    const owner = "recoupable";
    const repo = "Recoup-Chat";

    console.log(
      `\nFetching merged PRs from last 24 hours for ${owner}/${repo}...`
    );

    const mergedPRs = await githubService.getMergedPullRequests(owner, repo);
    console.log(`Found ${mergedPRs.length} merged PRs in the last 24 hours:`);

    for (const pr of mergedPRs) {
      console.log(`\nAnalyzing PR #${pr.number}: ${pr.title}`);

      // Get detailed PR information
      const prDetails = await githubService.getPRDetails(
        owner,
        repo,
        pr.number
      );

      // Generate summary using OpenAI
      console.log("Generating PR summary...");
      const summary = await openaiService.generatePRSummary(
        prDetails.title,
        prDetails.description,
        prDetails.changes
      );
      console.log("\nSummary:", summary);

      // Generate tweet
      console.log("\nGenerating tweet...");
      const tweet = await openaiService.generateTweetText(summary);
      console.log("Tweet:", tweet);

      console.log("\n----------------------------------------");
    }
  } catch (error) {
    console.error("Error during testing:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    process.exit(1);
  }
}

testIntegration();
