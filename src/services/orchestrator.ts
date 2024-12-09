import { Octokit } from "@octokit/rest";
import { OpenAIService } from "./openai.js";
import { submitMessage } from "./submitMessage.js";

export class OrchestratorService {
  private octokit: Octokit;
  private openAIService: OpenAIService;
  private owner: string;
  private repo: string;

  constructor(
    githubToken: string,
    openAIKey: string,
    owner: string,
    repo: string
  ) {
    this.octokit = new Octokit({ auth: githubToken });
    this.openAIService = new OpenAIService(openAIKey);
    this.owner = owner;
    this.repo = repo;
  }

  async processNewPRs(): Promise<void> {
    try {
      console.log("Starting PR processing");
      const mergedPRs = await this.getMergedPRs();
      console.log(`Found ${mergedPRs.length} merged PRs`);

      for (const pr of mergedPRs) {
        try {
          const summary = await this.openAIService.generatePRSummary(
            pr.body || "",
            pr.title
          );
          const tweet = await this.openAIService.generateTweetText(summary);
          await submitMessage(tweet);
          console.log(`Successfully processed PR #${pr.number}`);
        } catch (error) {
          console.error(`Error processing PR #${pr.number}:`, error);
          continue;
        }
      }
    } catch (error) {
      console.error("Error in processNewPRs:", error);
      throw error;
    }
  }

  private async getMergedPRs() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: pulls } = await this.octokit.pulls.list({
      owner: this.owner,
      repo: this.repo,
      state: "closed",
      sort: "updated",
      direction: "desc",
      per_page: 100,
    });

    return pulls.filter(
      (pr) =>
        pr.merged_at &&
        new Date(pr.merged_at) > yesterday &&
        new Date(pr.merged_at) <= new Date()
    );
  }
}
