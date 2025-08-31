"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Message, User, JWTPayload, ChatSocket } from "../../types/chat";

export default function Chat() {
  const [socket, setSocket] = useState<ChatSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activity, setActivity] = useState<string>("");
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [hasNewMessages, setHasNewMessages] = useState<boolean>(false);
  const [shouldShowWidget, setShouldShowWidget] = useState<boolean>(true);
  const [sessionCreated, setSessionCreated] = useState<boolean>(false);
  const [lastAuthState, setLastAuthState] = useState<string | null>(null);
  console.log(isConnected);
  console.log(shouldShowWidget);
  // Form states
  const [token, setToken] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<ChatSocket | null>(null);

 
  const resetChatSession = () => {
     if (socket) {
      socket.disconnect();
      setSocket(null);
     }
     setMessages([]);
    setUsers([]);
    setActivity("");
    setCurrentRoom("");
    setSessionCreated(false);
    setIsConnected(false);
  };

  const checkAuthState = () => {
    const savedToken = localStorage.getItem("token");
    const currentAuthState = savedToken || "guest";

    if (lastAuthState !== currentAuthState) {
      console.log(
        "Auth state changed from",
        lastAuthState,
        "to",
        currentAuthState
      );
      resetChatSession();
      setLastAuthState(currentAuthState);

      if (savedToken) {
        setToken(savedToken);
        try {
          const payload: JWTPayload = JSON.parse(
            atob(savedToken.split(".")[1])
          );
          const allowedRoles = ["user", "guest"];

          if (payload.role && allowedRoles.includes(payload.role)) {
            setShouldShowWidget(true);
            initializeChat();
            setSessionCreated(true);
          } else {
            setShouldShowWidget(false);
          }
        } catch (error) {
          console.log(error)
          setShouldShowWidget(true);
          setToken("");
        }
      } else {
        setShouldShowWidget(true);
        setToken("");
      }
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const currentAuthState = savedToken || "guest";
    setLastAuthState(currentAuthState);

    if (savedToken) {
      setToken(savedToken);
      try {
        const payload: JWTPayload = JSON.parse(atob(savedToken.split(".")[1]));
        const allowedRoles = ["user", "guest"];

        if (payload.role && allowedRoles.includes(payload.role)) {
          setShouldShowWidget(true);
        } else {
          setShouldShowWidget(false);
        }
      } catch (error) {
                  console.log(error)

        setShouldShowWidget(true);
        setToken("");
      }
    } else {
      setShouldShowWidget(true);
      setToken("");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", checkAuthState);
    const interval = setInterval(checkAuthState, 500);

    return () => {
      window.removeEventListener("storage", checkAuthState);
      clearInterval(interval);
    };
  }, [lastAuthState]);

  const initializeChat = (): void => {
    connectSocket();
    setCurrentRoom("پشتیبانی");
    setHasNewMessages(false);
    loadChatHistory();
  };

  // Remove auto-initialization for guests

  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        setIsConnected(true);
        console.log("Connected to server");
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        console.log("Disconnected from server");
      };

      const handleMessage = (data: Message) => {
        setActivity("");
        console.log("Received message from:", data.name);
        console.log("Current user name:", getCurrentUserName());
        setMessages((prev) => [...prev, data]);
        if (!isModalOpen && data.name !== getCurrentUserName()) {
          setHasNewMessages(true);
        }
      };

      const handleActivity = (name: string) => {
        setActivity(`${name} is typing...`);
        setTimeout(() => setActivity(""), 3000);
      };

      const handleUserList = ({ users }: { users: User[] }) => {
        setUsers(users);
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("message", handleMessage);
      socket.on("activity", handleActivity);
      socket.on("userList", handleUserList);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("message", handleMessage);
        socket.off("activity", handleActivity);
        socket.off("userList", handleUserList);
      };
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const connectSocket = (): void => {
    // Prevent multiple connections
    if (socket && socket.connected) return;

    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500",
      {
        auth: {
          token: token || null,
        },
      }
    ) as ChatSocket;

    setSocket(newSocket);
    socketRef.current = newSocket;
  };

  const loadChatHistory = async (): Promise<void> => {
    if (!token) {
      // Skip loading history for guest users
      return;
    }
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:3500"
        }/messages/current`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const history: Message[] = await response.json();
        setMessages(history);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (message.trim()) {
      if (!socket && !sessionCreated) {
        // For guests only - initialize on first message
        const messageToSend = message.trim();
        setMessage("");
        initializeChat();
        setSessionCreated(true);
        // Store message to send after connection
        const checkConnection = () => {
          if (socketRef.current && socketRef.current.connected) {
            console.log("Sending message as:", getCurrentUserName());
            socketRef.current.emit("message", { text: messageToSend });
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        setTimeout(checkConnection, 200);
      } else if (socket) {
        console.log("Sending message as:", getCurrentUserName());
        socket.emit("message", { text: message.trim() });
        setMessage("");
      }
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
    // Always check localStorage for the latest token
    const currentToken = token || localStorage.getItem("token");

    if (currentToken) {
      try {
        const payload: JWTPayload = JSON.parse(
          atob(currentToken.split(".")[1])
        );
        console.log(
          "getCurrentUserNameasdfasdfasdfasdfasdfas - payload:",
          payload.name
        );
        return payload.name || "Guest";
      } catch (error) {
        console.log("getCurrentUserName - token decode error:", error);
        return "Guest";
      }
    }
    return "Guest";
  };

  const getMessageClass = (msgName: string): string => {
    const currentUser = getCurrentUserName();
    console.log("Current user:", currentUser, "Message from:", msgName);
    if (msgName === currentUser) return "flex justify-end mb-4";
    if (msgName === "Admin" || msgName === "WhatsApp")
      return "flex justify-start mb-4";
    return "flex justify-start mb-4";
  };

  const getMessageBubbleClass = (msgName: string): string => {
    const currentUser = getCurrentUserName();
    if (msgName === currentUser)
      return "bg-gradient-to-r from-blue-600 to-blue-500 text-white";
    if (msgName === "Admin") return "bg-gray-800/80 text-blue-100";
    if (msgName === "WhatsApp")
      return "bg-gradient-to-r from-gray-700 to-gray-600 text-blue-300";
    return "bg-gray-800/80 text-blue-100";
  };

  // Don't render widget for admin roles
  if (!shouldShowWidget) {
    return null;
  }
  return (
    <>
      {/* Chat Icon Button */}
      <button
        onClick={() => {
          setIsModalOpen(true);
          setHasNewMessages(false);
        }}
        className="fixed bottom-16 right-3 z-50 w-16 h-16 bg-gradient-to-r from-[#66308d] to-[#01ae9b] text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group border border-blue-400/30"
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
        {hasNewMessages && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            !
          </div>
        )}
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md h-[600px] bg-gradient-to-b from-[#66308d]/80   to-[#01ae9b]/80 rounded-2xl shadow-2xl border border-gray-400 overflow-y-auto">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-blue-400/20 flex justify-between items-center bg-white">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-black/70 hover:text-black transition-colors"
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
                <div>
                  <h3 className="text-lg font-semibold text-black">
                    {currentRoom}
                  </h3>
                  <p className="text-sm text-black">
                    {users.length > 0
                      ? `${users.length} participant${
                          users.length > 1 ? "s" : ""
                        }`
                      : "بدون شرکت کننده"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent bg-black/50">
                {messages.map((msg, index) => (
                  <div key={index} className={getMessageClass(msg.name)}>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl backdrop-blur-sm border border-blue-400/20 shadow-lg ${getMessageBubbleClass(
                        msg.name
                      )}`}
                    >
                      {msg.name !== "WhatsApp" ? (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-sm opacity-90 mr-3">
                              {msg.name}
                            </span>
                            <span className="text-xs opacity-70 whitespace-nowrap ml-auto">
                              {msg.time}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed mt-1">
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
                  <div className="text-center text-sm text-blue-400/70 italic animate-pulse">
                    {activity}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-blue-400/20 bg-white/80">
                <form
                  onSubmit={handleSendMessage}
                  className="flex   gap-2"
                  dir="rtl"
                >
                  <input
                    type="text"
                    placeholder="پیام خود را بنویسید"
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setMessage(e.target.value)
                    }
                    onInput={handleTyping}
                    className="flex-1 px-4 py-3   border border-gray-400 rounded-xl placeholder:text-gray-400 text-black  focus:outline-none focus:ring-2 focus:ring-[#01ae9b]   backdrop-blur-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#01ae9b] to-[#66308d] text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-lg border border-blue-400/30"
                  >
                    <svg
                      className="w-5 h-5 rotate-270"
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
          </div>
        </div>
      )}
    </>
  );
}
