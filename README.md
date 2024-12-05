# Recoup Agent Github

A tool that monitors Github repositories for merged PRs, generates music industry-focused summaries using OpenAI, and creates social media content.

## Features

- 🔍 Monitor repositories for merged PRs in the last 24 hours
- 🎵 Generate music industry-focused PR summaries using OpenAI
- 📱 Create engaging social media content for the music community
- 🤖 Automated testing with GitHub Actions
- 🎸 Specialized for music tech and rights management context

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/sweetmantech/Recoup-Agent-Github.git
   cd Recoup-Agent-Github
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```env
   GITHUB_TOKEN=your_github_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Required API Keys:
   - GitHub Token: Create at https://github.com/settings/tokens
     - Required scopes: `repo`
   - OpenAI API Key: Get from https://platform.openai.com/api-keys

## GitHub Actions Setup

The project uses GitHub Actions to run tests automatically on pull requests. To set this up:

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `GITHUB_TOKEN`: Your GitHub personal access token with repo access
   - `OPENAI_API_KEY`: Your OpenAI API key

## Development

Run tests locally:

```bash
npm test
```

The test suite will:

- Fetch recent merged PRs
- Generate music industry-focused summaries
- Create engaging social media content

## API Usage

### GitHub Service

```typescript
const github = new GithubService();
const prs = await github.getMergedPullRequests("owner", "repo");
```

### OpenAI Service

```typescript
const openai = new OpenAIService();
const summary = await openai.generatePRSummary(title, description, changes);
const tweet = await openai.generateTweetText(summary);
```
