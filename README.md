# Recoup Agent Github

A tool that monitors Github repositories for merged PRs, generates summaries using OpenAI, and creates social media content.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`

## GitHub Actions Setup

The project uses GitHub Actions to run tests automatically on every commit. To set this up:

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `GITHUB_TOKEN`: Your GitHub personal access token with repo access
   - `OPENAI_API_KEY`: Your OpenAI API key

## Development

To run tests locally:

```bash
npm test
```

## Features

- Fetch merged PRs from the last 24 hours
- Generate PR summaries using OpenAI
- Create engaging tweet content
- Automated testing with GitHub Actions
