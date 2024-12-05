import { GithubService } from "./services/github.js";
import { OpenAIService } from "./services/openai.js";

async function testGithubAndOpenAI() {
  try {
    const githubService = new GithubService();
    const openaiService = new OpenAIService();

    const owner = "recoupable";
    const repo = "Recoup-Chat";

    console.log(
      `Fetching merged PRs from last 24 hours for ${owner}/${repo}...`
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
  }
}

testGithubAndOpenAI();
