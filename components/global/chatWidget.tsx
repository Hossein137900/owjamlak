"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Message, User, ChatSocket } from "../../types/chat";
import { usePathname } from "next/navigation";

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
  const [shouldShowWidget, setShouldShowWidget] = useState<boolean>(true);
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
            setShouldShowWidget(false);
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
          // Load chat history immediately for authenticated users
          loadChatHistoryWithToken(savedToken);
        } else {
          setShouldShowWidget(false);
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

      const handleMessage = (data: { userName?: string; name?: string; text: string; time: string }) => {
        setActivity("");

        
        const uiMessage = {
          name: data.userName || data.name || "Unknown",
          text: data.text,
          time: data.time
        };
        setMessages((prev) => [...prev, uiMessage]);
        
        const currentUser = getCurrentUserName();

        const senderName = data.userName || data.name;
        if (!isModalOpen && senderName !== currentUser) {
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
    // Disconnect existing socket if any
    if (socket && socket.connected) {
      socket.disconnect();
    }

    const currentToken = token || localStorage.getItem("token");
    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500",
      {
        auth: {
          token: currentToken,
        },
        forceNew: true,
        transports: ['websocket', 'polling']
      }
    ) as ChatSocket;

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
        const history: { userName: string; text: string; time: string }[] = await response.json();
        const uiMessages = history.map(msg => ({
          name: msg.userName,
          text: msg.text,
          time: msg.time
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

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (message.trim()) {
      if (socket) {
        const userName = getCurrentUserName();

        socket.emit("message", { 
          text: message.trim(),
          userName: userName
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
  if (!shouldShowWidget) {
    return null;
  }
  if (pathname === "/auth") {
    return null;
  }
  return (
    <>
      {/* Chat Icon Button */}
      <button
        onClick={() => {
          setIsModalOpen(true);
          setHasNewMessages(false);
          // Only initialize chat for authenticated users
          if (!socket && token) {
            initializeChat();
          } else if (!token) {
            // Show signup message for non-authenticated users
            setMessages([{
              name: "WhatsApp",
              text: "لطفا ابتدا ثبت نام کنید در سایت",
              time: new Intl.DateTimeFormat("default", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }).format(new Date())
            }]);
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
                {!token && messages.length === 0 && (
                  <div className="flex justify-center mb-4">
                    <div className="max-w-[80%] p-3 rounded-2xl backdrop-blur-sm border border-blue-400/20 shadow-lg bg-gradient-to-r from-gray-700 to-gray-600 text-blue-300">
                      <p className="text-sm text-center">لطفا ابتدا ثبت نام کنید در سایت</p>
                    </div>
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
                  <p className="text-blue-200/70 text-sm">برای ارسال پیام ابتدا وارد شوید</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
