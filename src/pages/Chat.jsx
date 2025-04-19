import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import supabase from "../utils/supabase";

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) console.error("Error fetching messages:", error);
      else setMessages(data);
    };

    fetchMessages();

    // Real-time listener
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const { error } = await supabase.from("messages").insert([
      {
        text: newMessage,
        user_email: user?.email || "Anonymous",
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) console.error("Error sending message:", error);
    else setNewMessage("");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">Chat</h2>
      <div className="bg-gray-200 p-4 h-80 overflow-y-scroll">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <strong>{msg.user_email}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-orange-500 text-white px-4 py-2 ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
