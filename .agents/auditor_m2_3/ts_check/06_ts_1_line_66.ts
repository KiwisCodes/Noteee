export interface RPCMessage<T = unknown> {
  id: string; // UUID v4 for request/response tracking
  type: 'REQUEST' | 'RESPONSE' | 'EVENT';
  method: string; // RPC method name (e.g., 'editor:loadDocument', 'editor:onTransaction')
  payload: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number; // UTC Epoch Unix MS
}
