import { NextResponse } from "next/server";
import { startBrowserAgent } from "magnitude-core";
import { z } from "zod";

function normalizeUrl(url: string): string {
  if (!url) return "";

  const trimmed = url.trim();

  // Return empty string if URL is blank after trimming
  if (!trimmed) return "";

  // Check if URL already has a protocol
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Prepend https:// if no protocol is present
  return `https://${trimmed}`;
}

export async function POST(request: Request) {
  try {
    const { cdpWsUrl, url, taskAction, taskExtraction, model } = await request.json();

    if (!cdpWsUrl) {
      return NextResponse.json(
        { error: "CDP WebSocket URL is required" },
        { status: 400 }
      );
    }

    // Normalize URL to ensure it has a protocol (or empty string if blank)
    const normalizedUrl = normalizeUrl(url);

    if (!taskAction) {
      return NextResponse.json(
        { error: "taskAction is required" },
        { status: 400 }
      );
    }

    if (!taskExtraction) {
      return NextResponse.json(
        { error: "taskExtraction is required" },
        { status: 400 }
      );
    }

    // Set model with fallback to Sonnet 4.5
    const selectedModel = model || "claude-sonnet-4-5-20250929";

    // Validate model is one of the allowed values
    const allowedModels = ["claude-sonnet-4-5-20250929", "claude-haiku-4-5-20251001"];
    if (!allowedModels.includes(selectedModel)) {
      return NextResponse.json(
        { error: `Invalid model. Must be one of: ${allowedModels.join(", ")}` },
        { status: 400 }
      );
    }

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY environment variable is not set" },
        { status: 500 }
      );
    }

    // Run automation on single browser
    console.log("Starting Magnitude agent...");

    const result = await runMagnitudeAutomation(cdpWsUrl, normalizedUrl, taskAction, taskExtraction, anthropicApiKey, selectedModel);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error running automation:", error);
    return NextResponse.json(
      {
        error: "Failed to run automation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

async function runMagnitudeAutomation(
  cdpWsUrl: string,
  startingUrl: string,
  taskAction: string,
  taskExtraction: string,
  anthropicApiKey: string,
  model: string
) {
  const startTime = Date.now();
  let agent;

  try {
    console.log(`Starting agent for URL: ${startingUrl}, Task Action: ${taskAction}, Task Extraction: ${taskExtraction}`);

    // Initialize Magnitude agent
    agent = await startBrowserAgent({
      browser: {
        cdp: cdpWsUrl,
      },
      llm: {
        provider: "anthropic",
        options: {
          model: model,
          apiKey: anthropicApiKey,
        },
      },
    });

    // Execute the user's natural language task
    let result = "";
    try {
      // Only navigate if a starting URL is provided
      if (startingUrl) {
        await agent.nav(startingUrl);
      }
      await agent.act([taskAction]);

      // Extract structured output with result
      const extractedData = await agent.extract(
        taskExtraction,
        z.object({
          result: z.string().describe("The direct answer or result of the task requested (raw data, values, or factual information)")
        })
      );

      result = extractedData.result;
    } catch (actError) {
      // If act fails, try to extract what was attempted
      try {
        const attemptData = await agent.extract(
          "Describe what you attempted",
          z.object({
            result: z.string().describe("What you were trying to accomplish (raw data, values, or factual information)")
          })
        );
        result = attemptData.result;
      } catch {
        // If extraction also fails, use empty string
        result = "";
      }

      // Re-throw with context
      const errorMessage = actError instanceof Error ? actError.message : String(actError);
      throw new Error(`Task could not be completed: ${errorMessage}`);
    }

    const executionTime = Date.now() - startTime;

    console.log(`Agent completed successfully. Result: ${result}`);

    return {
      success: true,
      executionTime,
      result,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error("Agent error:", error);

    return {
      success: false,
      executionTime,
      result: "",
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    if (agent) {
      try {
        await agent.stop();
        console.log("Agent cleaned up successfully");
      } catch (cleanupError) {
        console.error("Error cleaning up agent:", cleanupError);
      }
    }
  }
}

