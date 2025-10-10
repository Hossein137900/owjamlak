"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Message, User, ChatSocket } from "../../types/chat";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Chat() {
  const [socket, setSocket] = useState<ChatSocket | null>(null);
  const [, setIsConnected] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // this is for the data of the chat i mean the messages you can set message by this
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activity, setActivity] = useState<string>("");
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [hasNewMessages, setHasNewMessages] = useState<boolean>(false);
  const [, setShouldShowWidget] = useState<boolean>(true);

  const [, setSessionCreated] = useState<boolean>(false);
  const [lastAuthState, setLastAuthState] = useState<string | null>(null);

  // Form states
  const [token, setToken] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<ChatSocket | null>(null);

  const resetChatSession = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
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
    const currentAuthState = savedToken || "no-token";

    if (lastAuthState !== currentAuthState) {
      resetChatSession();
      setLastAuthState(currentAuthState);

      if (savedToken) {
        setToken(savedToken);
        try {
          const payload: JWTPayload = JSON.parse(
            atob(savedToken.split(".")[1])
          );

          if (payload.role && payload.role === "user") {
            setShouldShowWidget(true);
            loadChatHistoryWithToken(savedToken).then(() => {
              initializeChat();
              setSessionCreated(true);
            });
          } else {
            setShouldShowWidget(true);
          }
        } catch {
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
    const currentAuthState = savedToken || "no-token";
    setLastAuthState(currentAuthState);

    if (savedToken) {
      setToken(savedToken);
      try {
        const payload: JWTPayload = JSON.parse(atob(savedToken.split(".")[1]));

        if (payload.role && payload.role === "user") {
          setShouldShowWidget(true);
          // Load chat history and initialize socket for authenticated users
          loadChatHistoryWithToken(savedToken).then(() => {
            initializeChat();
          });
        } else {
          setShouldShowWidget(true);
        }
      } catch {
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

  // Load chat history whenever token changes
  useEffect(() => {
    if (token) {
      loadChatHistoryWithToken(token);
    }
  }, [token]);

  const initializeChat = (): void => {
    connectSocket();
    setCurrentRoom("پشتیبانی");
    setHasNewMessages(false);
    loadChatHistory();
  };

  const getCurrentUserName = (): string => {
    const currentToken = token || localStorage.getItem("token");
    if (currentToken) {
      try {
        const base64Url = currentToken.split(".")[1];
        if (!base64Url) return "User";

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const payload: JWTPayload = JSON.parse(jsonPayload);
        return payload.name || "User";
      } catch {
        return "User";
      }
    }
    return "User";
  };
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        setIsConnected(false);
      };

      const handleMessage = (data: {
        userName?: string;
        name?: string;
        text: string;
        time: string;
      }) => {
        setActivity("");

        const uiMessage = {
          name: data.userName || data.name || "Unknown",
          text: data.text,
          time: data.time,
        };
        setMessages((prev) => [...prev, uiMessage]);

        const currentUser = getCurrentUserName();

        const senderName = data.userName || data.name;
        if (!isModalOpen && senderName !== currentUser) {
          setHasNewMessages(true);
        }
      };

      const handleActivity = (name: string) => {
        setActivity(`${name} در حال تایپ است`);
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
    // Disconnect existing socket if any
    if (socket && socket.connected) {
      socket.disconnect();
    }

    const currentToken = token || localStorage.getItem("token");
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500";

    const newSocket = io(socketUrl, {
      auth: {
        token: currentToken,
      },
      forceNew: true,
      transports: ["websocket", "polling"],
    }) as ChatSocket;

    setSocket(newSocket);
    socketRef.current = newSocket;
  };

  const loadChatHistoryWithToken = async (authToken: string): Promise<void> => {
    if (!authToken) return;

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:3500"
        }/api/messages/current`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        const history: { userName: string; text: string; time: string }[] =
          await response.json();
        const uiMessages = history.map((msg) => ({
          name: msg.userName,
          text: msg.text,
          time: msg.time,
        }));
        setMessages(uiMessages);
      }
    } catch {
      // Error handled silently
    }
  };

  const loadChatHistory = async (): Promise<void> => {
    const currentToken = token || localStorage.getItem("token");
    await loadChatHistoryWithToken(currentToken || "");
  };

  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return timeString;
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (message.trim()) {
      if (socket) {
        const userName = getCurrentUserName();

        socket.emit("message", {
          text: message.trim(),
          userName: userName,
        });
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

  type JWTPayload = {
    name?: string;
    id?: string;
    phoneNumber?: string;
    role?: string;
    iat?: number;
    exp?: number;
  };

  const getMessageClass = (msgName: string): string => {
    const currentUser = getCurrentUserName();

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
  // if (!shouldShowWidget) {
  //   return null;
  // }
  if (pathname === "/auth") {
    return null;
  }
  return (
    <>
      {/* Chat Icon Button */}
      <button
        onClick={async () => {
          setIsModalOpen(true);
          setHasNewMessages(false);
          // Load chat history and initialize if needed
          if (token) {
            await loadChatHistoryWithToken(token);
            if (!socket) {
              initializeChat();
            }
          }
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
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div
            style={{
              backgroundImage:
                'linear-gradient(to bottom, rgba(102,48,141,0.8), rgba(1,174,155,0.8)), url("/assets/images/logo (2).png")',
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className="relative w-full max-w-md h-[600px] rounded-2xl shadow-2xl border border-gray-400 overflow-y-auto"
          >
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
                      : ""}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent bg-black/50">
                {!token && messages.length === 0 && (
                  <div className="flex justify-center items-center mb-6 px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="p-6 rounded-3xl flex flex-col justify-center items-center backdrop-blur-md border border-blue-300/30 shadow-xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 text-blue-100 max-w-md w-full"
                      role="region"
                      aria-labelledby="welcome-title"
                    >
                      <h2
                        id="welcome-title"
                        className="text-2xl font-semibold text-center mb-2"
                      >
                        خوش آمدید
                      </h2>
                      <p className="text-base text-center text-blue-200 mb-4">
                        لطفا برای ادامه، ثبت نام کنید یا وارد شوید
                      </p>
                      <Link
                        href="/auth"
                        className="bg-blue-500 text-white text-center rounded-xl px-4 py-2 font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
                        aria-label="ورود یا ثبت نام در سایت"
                      >
                        ورود/ثبت نام
                      </Link>
                    </motion.div>
                  </div>
                )}
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
                              {formatTime(msg.time)}{" "}
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

              {token ? (
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
              ) : (
                <div className="p-4 border-t border-blue-400/20 bg-white/10 text-center">
                  <p className="text-blue-200/70 text-sm">
                    برای ارسال پیام ابتدا وارد شوید
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
