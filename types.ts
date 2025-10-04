
export interface Server {
  id: string;
  name: string;
  flag: string;
  ping: number;
}

export enum Status {
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
}

export type ConnectionStatus = Status.DISCONNECTED | Status.CONNECTING | Status.CONNECTED;

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
}
