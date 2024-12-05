# Instructions - Github Agent

## Overview

The Github Agent is a tool that allows you to interact with Github repositories. It is designed to be used in a Digital Ocean Droplet

## Implementation Steps

1. Basic Setup and Github Integration

   - ✅ Initialize Node.js/TypeScript project
   - ✅ Setup Github API client (Octokit)
   - ✅ Implement function to fetch merged PRs from last 24 hours

2. OpenAI Integration

   - Install OpenAI SDK
   - Create service for OpenAI interactions
   - Implement PR summary generation function
   - Implement tweet text generation function
   - create a github action to run the test file on commit.

3. Farcaster Integration

   - Install Farcaster SDK/gRPC dependencies
   - Setup Farcaster authentication
   - Create service for Farcaster interactions
   - Implement post creation function

4. WOW Protocol Integration

   - Install Base/Stack SDK
   - Setup WOW protocol contract interactions
   - Implement token creation function
   - Add token sale configuration

5. Automation & Scheduling

   - Create main orchestration service
   - Implement scheduling logic for PR checking
   - Add error handling and retries
   - Setup logging and monitoring

6. Deployment

   - Create Dockerfile
   - Setup Github Actions workflow
   - Configure Digital Ocean deployment
   - Add environment variable management

7. Documentation
   - Create comprehensive README
   - Add setup instructions
   - Document environment variables
   - Add usage examples

## Features

- Function to post on farcaster
- Function to get all successfully merged pull requests in the past 24 hours for a given repository
- Function to summarize changes in a pull request using open AI API
- Function to generate a tweet text string using open AI API
- Function to create a new token for sale on wow
- Github action deployment pipeline for Digital Ocean Droplet deployment
- README with getting started instructions and key features

## Tech Stack

- hosting: Digital Ocean Droplet
- backend: Node.js / typescript
- database: Stack SDK (L3 on Base)
- openAI API
- farcaster API using gRPC calls
- wow protocol contracts on base
