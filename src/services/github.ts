import { Octokit } from "@octokit/rest";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import * as dotenv from "dotenv";

dotenv.config();

type PullRequest =
  RestEndpointMethodTypes["pulls"]["list"]["response"]["data"][0];

export class GithubService {
  private octokit: Octokit;

  constructor() {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN is required");
    }
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  async getMergedPullRequests(
    owner: string,
    repo: string
  ): Promise<PullRequest[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data } = await this.octokit.pulls.list({
      owner,
      repo,
      state: "closed",
      sort: "updated",
      direction: "desc",
      per_page: 100,
    });

    return data.filter(
      (pr: PullRequest) =>
        pr.merged_at !== null && new Date(pr.merged_at) > yesterday
    );
  }

  async getPRDetails(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<{
    title: string;
    description: string;
    changes: string;
  }> {
    const { data: pr } = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    const { data: diff } = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
      mediaType: {
        format: "diff",
      },
    });

    return {
      title: pr.title,
      description: pr.body || "",
      changes: typeof diff === "string" ? diff : JSON.stringify(diff),
    };
  }
}
