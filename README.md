# Chrome Extension Performance Testing

A Next.js application for testing and comparing Chrome extension performance using dual browser automation, powered by Kernel, Magnitude, and Vercel.

## Overview

This application demonstrates how to:

- Select and load Chrome extensions from your Kernel account
- Create dual cloud browsers (one with extension, one without) with live views
- Run AI-powered automation tasks using Magnitude and Claude
- Analyze the impact of Chrome extensions on browsing and automation tasks

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Browser Infrastructure**: Kernel SDK
- **AI Automation**: Magnitude + Claude Sonnet/Haiku 4.5
- **Package Manager**: Bun
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- [Bun](https://bun.sh) (package manager)
- A Kernel account and API key ([Get one here](https://dashboard.onkernel.com))
- An Anthropic API key ([Get one here](https://console.anthropic.com))
- Chrome extensions uploaded to your Kernel account
- Vercel account (optional, for deployment)

### Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd nextjs-kernel-template
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Set up API keys**:

   - **Kernel API key**: Get from [Kernel Dashboard](https://dashboard.onkernel.com) or install the [Kernel integration](https://vercel.com/integrations/kernel) from Vercel Marketplace
   - **Anthropic API key**: Get from [Anthropic Console](https://console.anthropic.com)

4. **Upload Chrome extensions**:

   Upload your Chrome extension to Kernel following the [extension documentation](https://www.onkernel.com/docs/browsers/extensions)

5. **Configure environment variables**:

   Create a `.env` file:

   ```bash
   touch .env
   ```

   Add your API keys:

   ```
   KERNEL_API_KEY=your_kernel_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

6. **Run the development server**:

   ```bash
   bun dev
   ```

7. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Example Chrome Extensions

This repository includes two sample Chrome extensions in the [`/extension-examples`](extension-examples/) directory that you can use to test the demo:

### 1. Kernel Mode
**Location**: [`/extension-examples/kernel-mode`](extension-examples/kernel-mode/)

Replaces all images and videos on web pages with Kernel logos. Great for testing visual content modification and DOM manipulation performance.

### 2. Remove Webpage Media
**Location**: [`/extension-examples/remove-webpage-media`](extension-examples/remove-webpage-media/)

Blocks and removes all images and videos from loaded web pages. Useful for testing page load performance.

### How to Use These Extensions

1. **Login to Kernel CLI**:
   ```bash
   kernel login
   ```

2. **Upload to Kernel via CLI**:
   ```bash
   kernel extensions upload ./extension-examples/kernel-mode --name kernel-mode
   ```

3. **Test in the demo**:
   - Start the development server
   - Select your uploaded extension from the dropdown
   - Create dual browsers and run automation tasks to see the extension's impact

## How It Works

1. **Select Extension**: Choose a Chrome extension from your Kernel account via the dropdown
2. **Create Dual Browsers**: Click "Create Browsers" to provision two identical Kernel browsers in parallel:
   - **Standard Browser**: Baseline browser (stealth mode enabled)
   - **Extended Browser**: Same configuration + your selected Chrome extension
3. **Live Views**: Watch both browsers side-by-side in real-time through embedded iframes
4. **Configure Automation Task**: Enter automation details using three substeps:
   - **1. Target Website**: The URL where the automation should start
   - **2. Task Action**: What you want the AI agent to do (e.g., "Navigate to the careers page and find job listings")
   - **3. Task Extraction**: What data to extract after completing the action (e.g., "Extract the job title and location for Customer Engineer positions")
5. **Parallel Execution**: Magnitude agents run the same task on both browsers simultaneously using Claude Sonnet/Haiku 4.5
   - The **Task Action** is passed to `agent.act()` to execute the browsing task
   - The **Task Extraction** is passed to `agent.extract()` to extract structured data
6. **Compare Results**: View execution times and extracted results side-by-side to see the extension's impact

## Code Structure

```
app/
├── api/
│   ├── create-browser/
│   │   └── route.ts          # Creates dual Kernel browsers (with/without extension)
│   ├── list-extensions/
│   │   └── route.ts          # Fetches user's Chrome extensions from Kernel
│   └── run-automation/
│       └── route.ts          # Runs Magnitude AI agents on both browsers
├── page.tsx                  # Main UI with dual live views and controls
├── layout.tsx                # Root layout
└── globals.css               # Global styles

components/
└── ui/                       # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    └── input.tsx

lib/
└── utils.ts                  # Utility functions
```

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fonkernel%2Fkernel-nextjs-extensions-demo&env=ANTHROPIC_API_KEY&project-name=kernel-nextjs-extensions-demo&repository-name=kernel-nextjs-extensions-demo&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22kernel%22%2C%22productSlug%22%3A%22kernel%22%2C%22protocol%22%3A%22other%22%7D%5D)

### Environment Variables

- `KERNEL_API_KEY` - Your Kernel API key (automatically added via Kernel integration)
- `ANTHROPIC_API_KEY` - Your Anthropic API key for Magnitude/Claude

### Troubleshooting

- **Using the Deploy button**: The Deploy button utilizes the official Kernel Integration on the Vercel Marketplace, which creates a new Vercel-managed Kernel Organization for you. You will need to add your Chrome extensions to this newly created organization. You can use `kernel login --force` to reauthenticate with the correct organization.

- **Using your existing Kernel organization**: If you want to use your existing Kernel organization (for example, if you're already on a paid tier required to use Chrome Extensions), you should deploy separately (on Vercel or your preferred method) and manually set the `ANTHROPIC_API_KEY` and `KERNEL_API_KEY` environment variables for the deployment.

- **Running locally**: Alternatively, you can run the app locally instead of deploying by following the [Getting Started](#getting-started) instructions above.

## Learn More

- [Kernel Documentation](https://docs.onkernel.com)
- [Kernel Extensions API](https://www.onkernel.com/docs/browsers/extensions)
- [Magnitude Documentation](https://docs.magnitude.run)
- [Magnitude + Kernel Integration](https://docs.magnitude.run/integrations/kernel)
- [Next.js Documentation](https://nextjs.org/docs)

---

Built with [Kernel](https://dashboard.onkernel.com), [Magnitude](https://docs.magnitude.run), and [Vercel](https://vercel.com)
