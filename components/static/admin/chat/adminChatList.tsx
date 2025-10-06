import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAdminAuth } from "../../../../contexts/AdminAuthContext";
import { AdminSocket, AdminRoomData, Message } from "../../../../types/chat";

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
  const [loadingMore] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem("token");
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500";
    console.log("Admin connecting to:", socketUrl);
    const newSocket = io(socketUrl, {
      auth: {
        token: adminToken,
        userType: "admin",
      },
      forceNew: true,
      transports: ["websocket", "polling"],
    }) as AdminSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      loadRecentChats();
    });

    newSocket.on("connect_error", () => {
      // Connection error handled
    });

    newSocket.on(
      "newUserMessage",
      (data: { sessionId?: string; userName?: string }) => {
        const roomId = data.sessionId;
        if (roomId) {
          if (!activeRooms.has(roomId)) {
            createRoomCard(roomId, data.userName || "Unknown User", true);
            newSocket.emit("adminJoinRoom", { room: roomId });
          } else {
            setActiveRooms((prev) => {
              const newRooms = new Map(prev);
              if (newRooms.has(roomId)) {
                const roomData = newRooms.get(roomId)!;
                newRooms.set(roomId, { ...roomData, hasNewMessage: true });
              }
              return newRooms;
            });
          }
        }
      }
    );

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

    newSocket.on(
      "message",
      (
        data: Message & { room?: string; sessionId?: string; userName?: string }
      ) => {
        const roomId = data.room || data.sessionId;
        if (roomId) {
          setActiveRooms((prev) => {
            const newRooms = new Map(prev);
            if (newRooms.has(roomId)) {
              const roomData = newRooms.get(roomId)!;
              const messageExists = roomData.messages.some(
                (msg) =>
                  msg.text === data.text &&
                  msg.time === data.time &&
                  msg.name === data.name
              );
              if (!messageExists) {
                const senderName = data.name || data.userName || "Unknown";
                newRooms.set(roomId, {
                  ...roomData,
                  messages: [
                    ...roomData.messages,
                    {
                      name: senderName,
                      text: data.text,
                      time: data.time,
                    },
                  ],
                  hasNewMessage: senderName !== "Admin",
                });
              }
            } else {
              const senderName = data.name || data.userName || "Unknown";
              createRoomCard(roomId, senderName, true);
              setTimeout(() => {
                setActiveRooms((prev) => {
                  const newRooms = new Map(prev);
                  if (newRooms.has(roomId)) {
                    const roomData = newRooms.get(roomId)!;
                    newRooms.set(roomId, {
                      ...roomData,
                      messages: [
                        ...roomData.messages,
                        {
                          name: senderName,
                          text: data.text,
                          time: data.time,
                        },
                      ],
                      hasNewMessage: senderName !== "Admin",
                    });
                  }
                  return newRooms;
                });
              }, 100);
            }
            return newRooms;
          });
        }
      }
    );

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const loadRecentChats = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:3500"
        }/api/admin/sessions`
      );
      const sessions: ChatSession[] = await response.json();
      const userSessions = sessions.filter(
        (session) =>
          session.userId !== localStorage.getItem("userId") &&
          !session.userName?.toLowerCase().includes("admin")
      );
      userSessions.forEach((session) => {
        createRoomCard(session.sessionId, session.userName, false);
      });
    } catch {
      // Error handled silently
    }
  };

  const loadMoreHistory = async (): Promise<void> => {
    setHasMoreHistory(false);
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
        setTimeout(() => loadRoomHistory(sessionId), 200);
      }
      return newRooms;
    });
  };

  const loadRoomHistory = async (sessionId: string): Promise<void> => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:3500"
        }/api/messages/${sessionId}`
      );
      if (response.ok) {
        const messages: { userName: string; text: string; time: string }[] =
          await response.json();
        const uiMessages = messages.map((msg) => ({
          name: msg.userName,
          text: msg.text,
          time: msg.time,
        }));

        setActiveRooms((prev) => {
          const newRooms = new Map(prev);
          if (newRooms.has(sessionId)) {
            const roomData = newRooms.get(sessionId)!;
            newRooms.set(sessionId, { ...roomData, messages: uiMessages });
          }
          return newRooms;
        });
      }
    } catch {
      // Error handled silently
    }
  };

  const openChat = async (roomName: string) => {
    setSelectedRoom(roomName);
    await loadRoomHistory(roomName);
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

      setActiveRooms((prev) => {
        const newRooms = new Map(prev);
        const updatedRoom = newRooms.get(roomName)!;
        newRooms.set(roomName, {
          ...updatedRoom,
          inputValue: "",
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

  if (!hasAccess(["admin", "superadmin"])) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#66308d] via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
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
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-3">
            دسترسی محدود
          </h2>
          <p className="text-gray-300 text-lg mb-2">
            شما دسترسی به بخش چت مدیریت را ندارید
          </p>
          <p className="text-gray-400 text-sm">
            فقط مدیران سیستم می‌توانند به این بخش دسترسی داشته باشند
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-[#66308d]/10 to-gray-900 flex flex-col md:flex-row">
        {/* Chat List Sidebar */}
        <div
          className={`w-full md:w-96 bg-gradient-to-b from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-b md:border-b-0 md:border-l border-gray-700/50 flex flex-col transition-all shadow-2xl ${
            selectedRoom ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-[#66308d]/20 to-[#01ae9b]/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#66308d] to-[#01ae9b] rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#66308d] via-purple-400 to-[#01ae9b] bg-clip-text text-transparent">
                چت های فعال
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-gradient-to-r from-[#66308d] via-purple-500 to-[#01ae9b] rounded-full opacity-50"></div>
              <p className="text-gray-300 text-sm font-medium px-3 py-1 bg-gray-700/50 rounded-full">
                {activeRooms.size} گفتگو
              </p>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#66308d] scrollbar-track-gray-800/50">
            {activeRooms.size === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-400 text-base">
                  هنوز چیزی برای نمایش نیست
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  پیام‌های جدید اینجا نمایش داده می‌شوند
                </p>
              </div>
            ) : (
              <>
                {Array.from(activeRooms.entries())
                  .sort(([, a], [, b]) => {
                    if (a.isOnline !== b.isOnline) return b.isOnline ? 1 : -1;
                    if (a.hasNewMessage !== b.hasNewMessage)
                      return b.hasNewMessage ? 1 : -1;
                    return 0;
                  })
                  .map(([roomName, roomData]) => (
                    <div
                      key={roomName}
                      onClick={() => openChat(roomName)}
                      className={`p-4 m-2 rounded-xl cursor-pointer transition-all duration-200 border ${
                        selectedRoom === roomName
                          ? "bg-gradient-to-r from-[#66308d]/30 to-[#01ae9b]/30 border-[#66308d]/50 shadow-lg shadow-[#66308d]/20 scale-[0.98]"
                          : "bg-gray-800/40 border-gray-700/30 hover:bg-gray-700/50 hover:border-[#01ae9b]/30 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#66308d] to-[#01ae9b] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {roomData.userName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-gray-800 ${
                              roomData.isOnline
                                ? "bg-[#01ae9b] shadow-lg shadow-[#01ae9b]/50"
                                : "bg-gray-500"
                            }`}
                          ></div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-white font-semibold truncate text-base">
                              {roomData.userName}
                            </h3>
                            {roomData.messages.length > 0 && (
                              <span className="text-xs text-gray-400">
                                {
                                  roomData.messages[
                                    roomData.messages.length - 1
                                  ].time
                                }
                              </span>
                            )}
                          </div>
                          {roomData.messages.length > 0 && (
                            <p className="text-gray-400 text-sm truncate leading-relaxed">
                              {
                                roomData.messages[roomData.messages.length - 1]
                                  .text
                              }
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                roomData.isOnline
                                  ? "text-[#01ae9b] bg-[#01ae9b]/10"
                                  : "text-gray-500 bg-gray-700/30"
                              }`}
                            >
                              {roomData.isOnline ? "آنلاین" : "آفلاین"}
                            </span>
                            {roomData.hasNewMessage && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-[#01ae9b] rounded-full animate-pulse shadow-lg shadow-[#01ae9b]/50"></div>
                                <span className="text-xs text-[#01ae9b] font-medium">
                                  پیام جدید
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {hasMoreHistory && (
                  <div className="p-4">
                    <button
                      onClick={loadMoreHistory}
                      disabled={loadingMore}
                      className="w-full py-3 text-sm font-medium text-gray-300 hover:text-white bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/50 hover:border-[#66308d]/50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore
                        ? "در حال بارگیری..."
                        : "بارگذاری تاریخچه بیشتر"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div
          className={`flex-1 flex flex-col ${
            selectedRoom ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedRoom && selectedRoomData ? (
            <>
              {/* Chat Header */}
              <div className="p-5 bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedRoom(null)}
                      className="p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-[#66308d]/20 transition-all md:hidden"
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#66308d] to-[#01ae9b] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {selectedRoomData.userName?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-gray-800 ${
                          selectedRoomData.isOnline
                            ? "bg-[#01ae9b] shadow-lg shadow-[#01ae9b]/50"
                            : "bg-gray-500"
                        }`}
                      ></div>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        {selectedRoomData.userName}
                      </h2>
                      <p
                        className={`text-sm font-medium ${
                          selectedRoomData.isOnline
                            ? "text-[#01ae9b]"
                            : "text-gray-400"
                        }`}
                      >
                        {selectedRoomData.isOnline ? "آنلاین است" : "آفلاین"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-red-500/20 transition-all hidden md:block"
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
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#66308d] scrollbar-track-gray-800/50 bg-gradient-to-b from-gray-900/50 to-gray-900/80">
                {selectedRoomData.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.name === "Admin" ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                        msg.name === "Admin"
                          ? "bg-gradient-to-br from-[#66308d] to-[#66308d]/80 text-white rounded-br-md"
                          : "bg-gradient-to-br from-[#01ae9b]/90 to-[#01ae9b]/70 text-white rounded-bl-md"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2 gap-3">
                        <span className="text-xs font-semibold opacity-90">
                          {msg.name}
                        </span>
                        <span className="text-xs opacity-75 whitespace-nowrap">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base leading-relaxed break-words">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm border-t border-gray-700/50 shadow-lg">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="پیام خود را بنویسید..."
                    value={selectedRoomData.inputValue}
                    onChange={(e) =>
                      updateInputValue(selectedRoom, e.target.value)
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && sendAdminMessage(selectedRoom)
                    }
                    className="flex-1 px-4 py-3.5 bg-gray-700/50 text-white rounded-xl border border-gray-600/50 focus:border-[#66308d] focus:ring-2 focus:ring-[#66308d]/30 focus:outline-none transition-all placeholder-gray-400 text-sm sm:text-base shadow-inner"
                  />
                  <button
                    onClick={() => sendAdminMessage(selectedRoom)}
                    className="px-5 sm:px-7 py-3.5 bg-gradient-to-r from-[#66308d] to-[#01ae9b] text-white rounded-xl hover:from-[#66308d]/90 hover:to-[#01ae9b]/90 transition-all font-medium text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <span>ارسال</span>
                    <svg
                      className="w-4 h-4"
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
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-900/50 to-gray-900/80">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-[#66308d]/20 to-[#01ae9b]/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-gray-700/30">
                  <svg
                    className="w-12 h-12 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#66308d] to-[#01ae9b] bg-clip-text text-transparent mb-3">
                  یک چت را انتخاب کنید
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  برای شروع مکالمه، یک گفتگو را از نوار کناری انتخاب کنید
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #66308d;
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #7d3ca8;
        }

        .scrollbar-thumb-\#66308d ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #66308d, #01ae9b);
        }
      `}</style>
    </>
  );
}
