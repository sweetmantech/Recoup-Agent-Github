import { GithubService } from "./services/github.js";
import { OpenAIService } from "./services/openai.js";
import { FarcasterService } from "./services/farcaster.js";

async function testIntegration() {
  try {
    const githubService = new GithubService();
    const openaiService = new OpenAIService();
    const farcasterService = new FarcasterService();

    // Verify Farcaster connection
    console.log("Verifying Farcaster connection...");
    const isConnected = await farcasterService.verifyConnection();
    if (!isConnected) {
      throw new Error("Failed to connect to Farcaster");
    }
    console.log("✅ Farcaster connection verified");

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
      console.log("\nGenerating social post...");
      const tweet = await openaiService.generateTweetText(summary);
      console.log("Post content:", tweet);

      // Post to Farcaster
      console.log("\nPosting to Farcaster...");
      const postHash = await farcasterService.createPost(tweet, {
        channelId: "recoupable", // Optional: specify a channel
      });
      console.log(`✅ Posted to Farcaster with hash: ${postHash}`);

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
