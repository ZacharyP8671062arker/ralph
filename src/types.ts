/**
 * Core type definitions for Ralph
 * Defines the interfaces and types used throughout the application
 */

/** Supported AI model providers */
export type Provider = 'openai' | 'anthropic' | 'google' | 'mistral' | 'ollama';

/** Role of a message in a conversation */
export type MessageRole = 'user' | 'assistant' | 'system';

/** A single message in a conversation */
export interface Message {
  role: MessageRole;
  content: string;
  timestamp?: Date;
}

/** Configuration for a specific AI model */
export interface ModelConfig {
  provider: Provider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  maxTokens?: number;
  temperature?: number;
}

/** Agent persona configuration */
export interface AgentPersona {
  name: string;
  description: string;
  systemPrompt: string;
  model: ModelConfig;
}

/** Options for running a conversation turn */
export interface RunOptions {
  stream?: boolean;
  maxRetries?: number;
  timeout?: number;
}

/** Result of a single conversation turn */
export interface TurnResult {
  message: Message;
  usage?: TokenUsage;
  model: string;
  provider: Provider;
  durationMs: number;
}

/** Token usage statistics */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/** Conversation state */
export interface Conversation {
  id: string;
  persona: AgentPersona;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

/** Plugin manifest structure */
export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  tools?: ToolDefinition[];
}

/** Tool definition for function calling */
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

/** Error types specific to Ralph */
export class RalphError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly provider?: Provider
  ) {
    super(message);
    this.name = 'RalphError';
  }
}

export class AuthenticationError extends RalphError {
  constructor(provider: Provider) {
    super(`Authentication failed for provider: ${provider}`, 'AUTH_ERROR', provider);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends RalphError {
  constructor(provider: Provider, public readonly retryAfterMs?: number) {
    super(`Rate limit exceeded for provider: ${provider}`, 'RATE_LIMIT', provider);
    this.name = 'RateLimitError';
  }
}
