import { Octokit } from "@octokit/rest";
import { OpenAIService } from "./openai";
import { submitMessage } from "./submitMessage";
import { logger } from "../utils/logger";

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
      logger.info("Starting PR processing");

      // Get merged PRs from last 24 hours
      const mergedPRs = await this.getMergedPRs();
      logger.info(`Found ${mergedPRs.length} merged PRs`);

      for (const pr of mergedPRs) {
        try {
          // Generate summary
          const summary = await this.openAIService.generatePRSummary(
            pr.body || "",
            pr.title
          );

          // Generate tweet text
          const tweet = await this.openAIService.generateTweetText(summary);

          // Post to Farcaster
          await submitMessage(tweet);

          logger.info(`Successfully processed PR #${pr.number}`);
        } catch (error) {
          logger.error(`Error processing PR #${pr.number}:`, error);
          // Continue with next PR even if one fails
          continue;
        }
      }
    } catch (error) {
      logger.error("Error in processNewPRs:", error);
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
