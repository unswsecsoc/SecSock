export type WebhookRequest = {
  ip: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  timestamp: number;
  query_params?: Record<string, string>;
};
