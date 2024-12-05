import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

type PullRequest = {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  number: number;
  state: string;
  title: string;
  body: string | null;
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  draft: boolean;
};

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
  ): Promise<PullRequest[]> {
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
      (pr): pr is PullRequest =>
        pr.merged_at !== null && new Date(pr.merged_at) > yesterday
    );
  }
}
