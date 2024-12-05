import { Octokit } from "@octokit/rest";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import * as dotenv from "dotenv";

dotenv.config();

type PullRequestResponse =
  RestEndpointMethodTypes["pulls"]["list"]["response"]["data"][0];

export class GithubService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
  }

  async getMergedPullRequests(
    owner: string,
    repo: string
  ): Promise<PullRequestResponse[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data } = await this.octokit.pulls.list({
      owner,
      repo,
      state: "closed",
      sort: "updated",
      direction: "desc",
    });

    return data.filter(
      (pr) => pr.merged_at !== null && new Date(pr.merged_at) > yesterday
    );
  }
}
