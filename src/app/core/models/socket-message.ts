export interface SocketMessageResponse {
  MessageType: SocketMessageType;
  TimeStamp: Date;
}

export interface SocketMessageRequest {
  messageType: SocketMessageType | number;
}

export enum SocketMessageType {
  Ping = 0,
  LogOff = 1
}
