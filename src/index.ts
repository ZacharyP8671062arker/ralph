import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

/**
 * Ralph - An AI assistant powered by Claude
 * Main entry point for the CLI application
 */

const client = new Anthropic();

interface Message {
  role: "user" | "assistant";
  content: string;
}

const conversationHistory: Message[] = [];

/**
 * Send a message to Claude and get a response
 */
async function chat(userMessage: string): Promise<string> {
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 8096,
    system:
      "You are Ralph, a helpful and knowledgeable AI assistant. You are direct, honest, and conversational. You help users with a wide range of tasks including coding, writing, analysis, and general questions. Keep responses concise unless the user asks for detail.",
    messages: conversationHistory,
  });

  const assistantMessage =
    response.content[0].type === "text" ? response.content[0].text : "";

  conversationHistory.push({
    role: "assistant",
    content: assistantMessage,
  });

  return assistantMessage;
}

/**
 * Main CLI loop
 */
async function main(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Ralph - AI Assistant (powered by Claude)");
  console.log('Type your message and press Enter. Type "exit" to quit.\n');

  const askQuestion = (): void => {
    rl.question("You: ", async (input: string) => {
      const userInput = input.trim();

      if (!userInput) {
        askQuestion();
        return;
      }

      if (userInput.toLowerCase() === "exit" || userInput.toLowerCase() === "quit") {
        console.log("Goodbye!");
        rl.close();
        return;
      }

      try {
        process.stdout.write("Ralph: ");
        const response = await chat(userInput);
        console.log(response);
        console.log();
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
        } else {
          console.error("An unexpected error occurred");
        }
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
