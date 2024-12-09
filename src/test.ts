import botCast from "./farcaster/botCast.js";
import { GithubService } from "./services/github.js";
import { OpenAIService } from "./services/openai.js";

async function testIntegration() {
  try {
    console.log("Initializing services...");
    const githubService = new GithubService();
    const openaiService = new OpenAIService();

    const owner = "recoupable";
    const repo = "Recoup-Chat";

    console.log(
      `\nFetching merged PRs from last 24 hours for ${owner}/${repo}...`
    );

    const mergedPRs = await githubService.getMergedPullRequests(owner, repo);
    console.log(`Found ${mergedPRs.length} merged PRs in the last 24 hours:`);

    for (const pr of mergedPRs) {
      console.log(`\nAnalyzing PR #${pr.number}: ${pr.title}`);

      const prDetails = await githubService.getPRDetails(
        owner,
        repo,
        pr.number
      );

      console.log("Generating PR summary...");
      const summary = await openaiService.generatePRSummary(
        prDetails.title,
        prDetails.description,
        prDetails.changes
      );
      console.log("\nSummary:", summary);

      console.log("\nGenerating tweet...");
      const tweet = await openaiService.generateTweetText(summary);
      console.log("Tweet:", tweet);

      console.log("\nPosting to Farcaster...");
      const postHash = await botCast(tweet);
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
