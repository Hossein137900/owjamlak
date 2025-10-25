import { Socket } from "socket.io-client";

export interface Message {
  name: string;
  text: string;
  time: string;
  room?: string; // چون تو چندتا ایونت room می‌فرستی
  createdAt?:Date;
}

export interface User {
  name: string;
  id?: string;
}

export interface RoomData {
  room: string;
  guestName?: string;
  userToken?: string;
}

export interface JWTPayload {
  userId?: string;
  id?: string;
  name?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export interface AdminRoomData {
  name: string;
  messages: Message[];
  userCount: number;
  inputValue: string;
  hasNewMessage: boolean;
  userName: string;
  isOnline: boolean;
}

export interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  message: (data: Message) => void;
  activity: (name: string) => void;
  userList: (data: { users: User[]; room?: string }) => void;
  roomList: (data: { rooms: string[] }) => void;
  newUserMessage: (data: { room: string; userName?: string }) => void;
  adminMessageUpdate: (data: Message) => void;
  removeGuestRoom: (data: { room: string }) => void;
}

export interface ClientToServerEvents {
  enterRoom: (data: RoomData) => void;
  message: (data: { text: string; userName?: string }) => void;
  activity: () => void;
  stopActivity: () => void;
  adminJoinRoom: (data: { room: string }) => void;
  adminMessage: (data: { room: string; text: string; userName?: string }) => void;
}

export type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
export type AdminSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
