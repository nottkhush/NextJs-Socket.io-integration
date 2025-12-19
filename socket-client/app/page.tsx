"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

/*
  I’m creating a socket connection as soon as this file loads.
  This connects my frontend to the backend Socket.IO server
  running locally on port 4000.
*/
const socket = io("http://localhost:4000");

/*
  This is the shape of a chat message in my app.
  Every message has:
  - a unique id (for React keys)
  - the actual text
  - who sent it (me or the other side)
  - a timestamp so I know when it was created
*/
type Message = {
  id: string;
  text: string;
  sender: "user" | "client";
  createdAt: number;
};

export default function Home() {
  /*
    This holds the entire chat history.
    Every time someone sends or receives a message,
    I push a new object into this array.
  */
  const [messages, setMessages] = useState<Message[]>([]);

  /*
    This is just the current value of the input box.
    Basically what I’m typing before hitting send.
  */
  const [newMessage, setMessage] = useState("");

  /*
    This ref points to an empty div at the bottom of the chat.
    I use it to auto-scroll whenever a new message comes in.
  */
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /*
    Here I’m setting up a socket listener.
    Whenever the backend emits "receiveMessage",
    I take that message and add it to my chat list
    as a message coming from the client side.
  */
  useEffect(() => {
    socket.on("receiveMessage", (msg: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: msg,
          sender: "client",
          createdAt: Date.now(),
        },
      ]);
    });

    /*
      Cleanup because React yells if I don’t.
      This makes sure I don’t stack multiple listeners
      if the component re-renders.
    */
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  /*
    This runs when I hit enter or click the Send button.
    It:
    - prevents page refresh
    - ignores empty messages
    - emits the message to the server
    - immediately adds it to my UI
  */
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit("sendMessage", newMessage);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: newMessage,
        sender: "user",
        createdAt: Date.now(),
      },
    ]);

    // clears the input after sending
    setMessage("");
  };

  /*
    Anytime the messages array updates,
    I scroll to the bottom so the latest message
    is always visible without manual scrolling.
  */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /*
    Everything below is just the UI.
    Tailwind is doing most of the heavy lifting here.
    I’ve got:
    - a glassmorphism chat container
    - a header with online indicator
    - message bubbles that change style based on sender
    - and an input box at the bottom
  */
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black">
      <div className="w-[28rem] h-[42rem] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Socket IQ</h1>
            <p className="text-xs text-white/60">Real-time chat</p>
          </div>
          <span className="w-2 h-2 bg-green-400 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 scrollbar-thin scrollbar-thumb-white/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 max-w-[75%] rounded-2xl text-sm shadow-md ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none"
                    : "bg-white/20 text-white rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={onFormSubmit} className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
              value={newMessage}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
