import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Head from "next/head";
import {
  AdminSocket,
  AdminRoomData,
  Message,
  User,
} from "../../../../types/chat";

export default function ChatAdmin() {
  const [socket, setSocket] = useState<AdminSocket | null>(null);
  const [activeRooms, setActiveRooms] = useState<Map<string, AdminRoomData>>(
    new Map()
  );

  useEffect(() => {
    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500",
      {
        auth: { token: null },
      }
    ) as AdminSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Admin connected, loading all rooms");
      loadAllRooms();
    });

    newSocket.on("roomList", ({ rooms }: { rooms: string[] }) => {
      console.log("Admin received room list:", rooms);
      rooms.forEach((room: string) => {
        if (!activeRooms.has(room)) {
          createRoomCard(room);
        }
      });
    });

    newSocket.on("message", (data: Message & { room?: string }) => {
      console.log("Admin received message:", data);
      if (data.room) {
        setActiveRooms((prev) => {
          const newRooms = new Map(prev);
          if (newRooms.has(data.room!)) {
            const roomData = newRooms.get(data.room!)!;
            newRooms.set(data.room!, {
              ...roomData,
              messages: [...roomData.messages, data],
            });
          }
          return newRooms;
        });
      }
    });

    newSocket.on(
      "userList",
      ({ users, room }: { users: User[]; room?: string }) => {
        if (room) {
          setActiveRooms((prev) => {
            const newRooms = new Map(prev);
            if (newRooms.has(room)) {
              const roomData = newRooms.get(room)!;
              newRooms.set(room, {
                ...roomData,
                userCount: users.length,
              });
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

  const loadAllRooms = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500"
        }/api/rooms`
      );
      const rooms: string[] = await response.json();
      console.log("Loaded rooms from DB:", rooms);
      rooms.forEach((room: string) => {
        if (!activeRooms.has(room)) {
          createRoomCard(room);
        }
      });
    } catch (error) {
      console.error("Error loading rooms:", error);
    }
  };

  const createRoomCard = (roomName: string): void => {
    setActiveRooms((prev) => {
      const newRooms = new Map(prev);
      if (!newRooms.has(roomName)) {
        newRooms.set(roomName, {
          name: roomName,
          messages: [],
          userCount: 0,
          inputValue: "",
        });
        // Join room to receive messages (admin joins silently)
        console.log("Admin joining room:", roomName);
        socket?.emit("adminJoinRoom", { room: roomName });
        loadRoomHistory(roomName);
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
          newRooms.set(roomName, {
            ...roomData,
            messages: messages,
          });
        }
        return newRooms;
      });
    } catch (error) {
      console.error("Error loading room history:", error);
    }
  };

  const handleAdminMessage = (
    roomName: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") {
      sendAdminMessage(roomName);
    }
  };

  const sendAdminMessage = (roomName: string): void => {
    const roomData = activeRooms.get(roomName);
    if (roomData && roomData.inputValue.trim()) {
      console.log("Sending admin message:", {
        room: roomName,
        text: roomData.inputValue.trim(),
      });
      socket?.emit("adminMessage", {
        room: roomName,
        text: roomData.inputValue.trim(),
      });

      // Clear input
      setActiveRooms((prev) => {
        const newRooms = new Map(prev);
        const updatedRoom = newRooms.get(roomName)!;
        newRooms.set(roomName, {
          ...updatedRoom,
          inputValue: "",
        });
        return newRooms;
      });
    }
  };

  const updateInputValue = (roomName: string, value: string): void => {
    setActiveRooms((prev) => {
      const newRooms = new Map(prev);
      const roomData = newRooms.get(roomName)!;
      newRooms.set(roomName, {
        ...roomData,
        inputValue: value,
      });
      return newRooms;
    });
  };

  return (
    <>
      <Head>
        <title>Admin Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold  mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xl text-slate-300">
              Monitor and respond to chat rooms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from(activeRooms.entries()).map(([roomName, roomData]) => (
              <div
                key={roomName}
                className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {roomName}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    {roomData.userCount} users
                  </span>
                </div>

                <div className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
                  {roomData.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl max-w-[85%] ${
                        msg.name === "Admin"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto"
                          : "bg-white/20 text-slate-100 mr-auto"
                      } backdrop-blur-sm border border-white/10 shadow-lg`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm opacity-90">
                          {msg.name}
                        </span>
                        <span className="text-xs opacity-70">{msg.time}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type response..."
                      value={roomData.inputValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateInputValue(roomName, e.target.value)
                      }
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        handleAdminMessage(roomName, e)
                      }
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    />
                    <button
                      onClick={() => sendAdminMessage(roomName)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
