"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Head from "next/head";
import {
  Message,
  User,
  RoomData,
  JWTPayload,
  ChatSocket,
} from "../../types/chat";

export default function Chat() {
  const [socket, setSocket] = useState<ChatSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activity, setActivity] = useState<string>("");
  const [currentRoom, setCurrentRoom] = useState<string>("");

  console.log(isConnected)

  // Form states
  const [name, setName] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Get JWT token from localStorage
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setIsConnected(true);
        console.log("Connected to server");
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Disconnected from server");
      });

      socket.on("message", (data: Message) => {
        setActivity("");
        setMessages((prev) => [...prev, data]);
      });

      socket.on("activity", (name: string) => {
        setActivity(`${name} is typing...`);
        setTimeout(() => setActivity(""), 3000);
      });

      socket.on("userList", ({ users }: { users: User[] }) => {
        setUsers(users);
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("message");
        socket.off("activity");
        socket.off("userList");
      };
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectSocket = (): void => {
    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500",
      {
        auth: {
          token: token || null,
        },
      }
    ) as ChatSocket;
    setSocket(newSocket);
  };

  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!socket) {
      connectSocket();
    }

    let finalRoom = room;
    let roomDisplay = room;

    if (token) {
      try {
        const payload: JWTPayload = JSON.parse(atob(token.split(".")[1]));
        finalRoom = `user_${payload.userId || payload.id}`;
        roomDisplay = "Personal Chat";
      } catch {
        alert("Invalid token format");
        return;
      }
    } else {
      if (!name || !room) {
        alert("Please enter your name and room name");
        return;
      }
    }

    const roomData: RoomData = { room: finalRoom };
    if (!token && name) {
      roomData.guestName = name;
    }
    if (token) {
      roomData.userToken = token;
    }

    socket?.emit("enterRoom", roomData);
    setShowChat(true);
    setCurrentRoom(roomDisplay);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit("message", { text: message.trim() });
      setMessage("");
    }
  };

  const handleTyping = (): void => {
    socket?.emit("activity");
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }
    typingTimer.current = setTimeout(() => {
      socket?.emit("stopActivity");
    }, 1000);
  };

  const getCurrentUserName = (): string => {
    if (token) {
      try {
        const payload: JWTPayload = JSON.parse(atob(token.split(".")[1]));
        return payload.name || "User";
      } catch {
        return "User";
      }
    }
    return name || "Guest";
  };

  const getMessageClass = (msgName: string): string => {
    const currentUser = getCurrentUserName();
    if (msgName === currentUser) return "flex justify-end mb-4";
    if (msgName === "Admin") return "flex justify-center mb-4";
    if (msgName === "WhatsApp") return "flex justify-center mb-4";
    return "flex justify-start mb-4";
  };

  const getMessageBubbleClass = (msgName: string): string => {
    const currentUser = getCurrentUserName();
    if (msgName === currentUser)
      return "bg-gradient-to-r from-blue-500 to-purple-600 text-white";
    if (msgName === "Admin")
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
    if (msgName === "WhatsApp")
      return "bg-gradient-to-r from-orange-500 to-red-600 text-white";
    return "bg-white/20 text-slate-100";
  };

  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Chat Icon Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-16 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <svg
          className="w-8 h-8 group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {messages.length > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {messages.length > 9 ? "9+" : messages.length}
          </div>
        )}
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md h-[600px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {!showChat ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Join Chat
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 p-6 flex items-center justify-center">
                  <form onSubmit={handleJoinRoom} className="w-full space-y-4">
                    {!token && (
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setName(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                        required={!token}
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Enter your token (optional)"
                      value={token}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setToken(e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                    />
                    {!token && (
                      <input
                        type="text"
                        placeholder="Room name"
                        value={room}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setRoom(e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                        required={!token}
                      />
                    )}
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-lg"
                    >
                      Join Chat
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {currentRoom}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {users.length > 0
                        ? `${users.length} participant${
                            users.length > 1 ? "s" : ""
                          }`
                        : "No participants"}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
                  {messages.map((msg, index) => (
                    <div key={index} className={getMessageClass(msg.name)}>
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl backdrop-blur-sm border border-white/10 shadow-lg ${getMessageBubbleClass(
                          msg.name
                        )}`}
                      >
                        {msg.name !== "WhatsApp" ? (
                          <>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-sm opacity-90">
                                {msg.name}
                              </span>
                              <span className="text-xs opacity-70">
                                {msg.time}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {msg.text}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-center">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                  {activity && (
                    <div className="text-center text-sm text-slate-400 italic animate-pulse">
                      {activity}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setMessage(e.target.value)
                      }
                      onInput={handleTyping}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-lg"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
