import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Head from "next/head";
import { useAdminAuth } from "../../../../contexts/AdminAuthContext";
import {
  AdminSocket,
  AdminRoomData,
  Message,
 } from "../../../../types/chat";

interface ChatSession {
  sessionId: string;
  userName: string;
  userId: string;
  lastActivity: string;
  status: string;
  hasUnreadMessages: boolean;
}

export default function ChatAdminList() {
  const { hasAccess } = useAdminAuth();
  const [socket, setSocket] = useState<AdminSocket | null>(null);
  const [activeRooms, setActiveRooms] = useState<Map<string, AdminRoomData>>(
    new Map()
  );
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);

  useEffect(() => {
    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500",
      { auth: { token: null } }
    ) as AdminSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Admin connected, loading recent chats");
      loadRecentChats();
    });

    newSocket.on("newUserMessage" as any, (data: any) => {
      console.log("New user message notification:", data);
      if (!activeRooms.has(data.room)) {
        // Create room for new message (even if older than 24h)
        createRoomCard(data.room, data.userName || "Unknown User", true);
        // Also reload room history to get full conversation
        setTimeout(() => loadRoomHistory(data.room), 100);
      } else {
        // Mark room as having new messages
        setActiveRooms((prev) => {
          const newRooms = new Map(prev);
          if (newRooms.has(data.room)) {
            const roomData = newRooms.get(data.room)!;
            newRooms.set(data.room, { ...roomData, hasNewMessage: true });
          }
          return newRooms;
        });
      }
    });

    newSocket.on("roomList", ({ rooms }: { rooms: string[] }) => {
      setOnlineUsers(new Set(rooms));
      rooms.forEach((room: string) => {
        setActiveRooms((prev) => {
          const newRooms = new Map(prev);
          if (newRooms.has(room)) {
            const roomData = newRooms.get(room)!;
            newRooms.set(room, { ...roomData, isOnline: true });
          }
          return newRooms;
        });
      });
    });

    newSocket.on("message", (data: Message & { room?: string }) => {
      if (data.room) {
        setActiveRooms((prev) => {
          const newRooms = new Map(prev);
          if (newRooms.has(data.room!)) {
            const roomData = newRooms.get(data.room!)!;
            // Check if message already exists to prevent duplicates
            const messageExists = roomData.messages.some(
              (msg) =>
                msg.text === data.text &&
                msg.time === data.time &&
                msg.name === data.name
            );
            if (!messageExists) {
              newRooms.set(data.room!, {
                ...roomData,
                messages: [...roomData.messages, data],
                hasNewMessage: data.name !== "Admin",
              });
            }
          }
          return newRooms;
        });
      }
    });

    newSocket.on(
      "adminMessageUpdate" as any,
      (data: Message & { room?: string }) => {
        if (data.room) {
          setActiveRooms((prev) => {
            const newRooms = new Map(prev);
            if (newRooms.has(data.room!)) {
              const roomData = newRooms.get(data.room!)!;
              // Check if message already exists to prevent duplicates
              const messageExists = roomData.messages.some(
                (msg) =>
                  msg.text === data.text &&
                  msg.time === data.time &&
                  msg.name === data.name
              );
              if (!messageExists) {
                newRooms.set(data.room!, {
                  ...roomData,
                  messages: [...roomData.messages, data],
                  hasNewMessage: data.name !== "Admin",
                });
              }
            } else if (data.name === "Guest") {
              // Create room for guest if it doesn't exist
              createRoomCard(data.room!, "Guest", true);
            }
            return newRooms;
          });
        }
      }
    );

    newSocket.on("removeGuestRoom" as any, (data: { room: string }) => {
      setActiveRooms((prev) => {
        const newRooms = new Map(prev);
        newRooms.delete(data.room);
        return newRooms;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const loadRecentChats = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500"
        }/api/chat-sessions/recent?limit=5`
      );
      const sessions: ChatSession[] = await response.json();
      sessions.forEach((session) => {
        createRoomCard(
          session.sessionId,
          session.userName,
          session.hasUnreadMessages
        );
      });
    } catch (error) {
      console.error("Error loading recent chats:", error);
    }
  };

  const loadMoreHistory = async (): Promise<void> => {
    setLoadingMore(true);
    try {
      const skip = activeRooms.size;
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500"
        }/api/chat-sessions/history?skip=${skip}&limit=5`
      );
      const sessions: ChatSession[] = await response.json();

      if (sessions.length === 0) {
        setHasMoreHistory(false);
      } else {
        sessions.forEach((session) => {
          createRoomCard(session.sessionId, session.userName, false);
        });
      }
    } catch (error) {
      console.error("Error loading more history:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const createRoomCard = (
    sessionId: string,
    userName: string,
    hasUnread: boolean = false
  ): void => {
    setActiveRooms((prev) => {
      const newRooms = new Map(prev);
      if (!newRooms.has(sessionId)) {
        newRooms.set(sessionId, {
          name: sessionId,
          messages: [],
          userCount: 0,
          inputValue: "",
          hasNewMessage: hasUnread,
          userName: userName,
          isOnline: onlineUsers.has(sessionId),
        });
        socket?.emit("adminJoinRoom", { room: sessionId });
        loadRoomHistory(sessionId);
      }
      return newRooms;
    });
  };

  const loadRoomHistory = async (roomName: string): Promise<void> => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500"
        }/api/messages/${roomName}`
      );
      const messages: Message[] = await response.json();
      setActiveRooms((prev) => {
        const newRooms = new Map(prev);
        if (newRooms.has(roomName)) {
          const roomData = newRooms.get(roomName)!;
          newRooms.set(roomName, { ...roomData, messages });
        }
        return newRooms;
      });
    } catch (error) {
      console.error("Error loading room history:", error);
    }
  };

  const openChat = (roomName: string) => {
    setSelectedRoom(roomName);
    // Clear new message indicator
    setActiveRooms((prev) => {
      const newRooms = new Map(prev);
      if (newRooms.has(roomName)) {
        const roomData = newRooms.get(roomName)!;
        newRooms.set(roomName, { ...roomData, hasNewMessage: false });
      }
      return newRooms;
    });
  };

  const sendAdminMessage = (roomName: string): void => {
    const roomData = activeRooms.get(roomName);
    if (roomData && roomData.inputValue.trim()) {
      const messageText = roomData.inputValue.trim();

      // Add message immediately to UI
      const adminMessage = {
        name: "Admin",
        text: messageText,
        time: new Intl.DateTimeFormat("default", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }).format(new Date()),
      };

      setActiveRooms((prev) => {
        const newRooms = new Map(prev);
        const updatedRoom = newRooms.get(roomName)!;
        newRooms.set(roomName, {
          ...updatedRoom,
          inputValue: "",
          messages: [...updatedRoom.messages, adminMessage],
        });
        return newRooms;
      });

      socket?.emit("adminMessage", {
        room: roomName,
        text: messageText,
      });
    }
  };

  const updateInputValue = (roomName: string, value: string): void => {
    setActiveRooms((prev) => {
      const newRooms = new Map(prev);
      const roomData = newRooms.get(roomName)!;
      newRooms.set(roomName, { ...roomData, inputValue: value });
      return newRooms;
    });
  };

  const selectedRoomData = selectedRoom ? activeRooms.get(selectedRoom) : null;

  // Check if user has admin access
  if (!hasAccess(["admin", "superadmin"])) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-red-500 mb-2">دسترسی محدود</h2>
          <p className="text-gray-400">شما دسترسی به بخش چت مدیریت را ندارید</p>
          <p className="text-gray-500 text-sm mt-2">
            فقط مدیران سیستم می‌توانند به این بخش دسترسی داشته باشند
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Chat Panel</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-gray-800/50 border-r border-gray-700 flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              چت های فعال
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {activeRooms.size} گفتگو
            </p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-96">
            {activeRooms.size === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-400">هنوز چیزی برای نمایش نیست</p>
              </div>
            ) : (
              <>
                {Array.from(activeRooms.entries())
                  .sort(([, a], [, b]) => {
                    // Sort by online status first, then by new messages, then by last message time
                    if (a.isOnline !== b.isOnline) return b.isOnline ? 1 : -1;
                    if (a.hasNewMessage !== b.hasNewMessage)
                      return b.hasNewMessage ? 1 : -1;
                    return 0;
                  })
                  .map(([roomName, roomData]) => (
                    <div
                      key={roomName}
                      onClick={() => openChat(roomName)}
                      className={`p-4 border-b border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-all ${
                        selectedRoom === roomName
                          ? "bg-blue-600/20 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-medium truncate">
                              {roomData.userName}
                            </h3>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                roomData.isOnline
                                  ? "bg-green-400"
                                  : "bg-gray-500"
                              }`}
                            ></div>
                          </div>
                          {roomData.messages.length > 0 && (
                            <p className="text-gray-400 text-sm truncate mt-1">
                              {
                                roomData.messages[roomData.messages.length - 1]
                                  .text
                              }
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {roomData.isOnline ? "Online" : "Offline"}
                          </p>
                        </div>
                        <div className="flex flex-col items-end ml-3">
                          {roomData.hasNewMessage && (
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {hasMoreHistory && (
                  <div className="p-4">
                    <button
                      onClick={loadMoreHistory}
                      disabled={loadingMore}
                      className="w-full py-2 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loadingMore
                        ? "در حال بارگیری"
                        : "بارگذاری تاریخچه بیشتر"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedRoom && selectedRoomData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">
                      {selectedRoomData.userName}
                    </h2>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedRoomData.isOnline
                          ? "bg-green-400"
                          : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {selectedRoomData.isOnline
                      ? "آنلاین"
                      : "آخرین بار اخیرا دیده شده است"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50"
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

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedRoomData.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.name === "Admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.name === "Admin"
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs opacity-70 font-medium mr-3">
                          {msg.name}
                        </span>
                        <span className="text-xs opacity-70 whitespace-nowrap ml-auto">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mt-1">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="پاسخ خود را تایپ کنید..."
                    value={selectedRoomData.inputValue}
                    onChange={(e) =>
                      updateInputValue(selectedRoom, e.target.value)
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && sendAdminMessage(selectedRoom)
                    }
                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => sendAdminMessage(selectedRoom)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all"
                  >
                    ارسال
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-16 h-16 text-gray-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  یک چت را انتخاب کنید
                </h3>
                <p className="text-gray-500">
                  برای شروع چت، یک مکالمه را از نوار کناری انتخاب کنید
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
