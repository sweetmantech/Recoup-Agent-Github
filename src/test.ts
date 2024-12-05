import { GithubService } from "./services/github.js";

async function testGithubService() {
  try {
    const githubService = new GithubService();

    // Test with a popular repository that's likely to have recent PRs
    const owner = "vercel";
    const repo = "next.js";

    console.log(
      `Fetching merged PRs from last 24 hours for ${owner}/${repo}...`
    );

    const mergedPRs = await githubService.getMergedPullRequests(owner, repo);

    console.log(`Found ${mergedPRs.length} merged PRs in the last 24 hours:`);
    mergedPRs.forEach((pr) => {
      console.log(`- #${pr.number}: ${pr.title}`);
      console.log(`  Merged at: ${pr.merged_at}`);
      console.log(`  URL: ${pr.html_url}\n`);
    });
  } catch (error) {
    console.error("Error testing Github service:", error);
  }
}

testGithubService();
