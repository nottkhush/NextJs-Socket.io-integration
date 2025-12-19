# 💬 Real-Time Chat App (Next.js + Socket.IO)

A streamlined real-time chat application built to explore the integration of **Socket.IO** with **Next.js**. This project serves as a practical deep-dive into the architectural challenges of maintaining long-lived connections within modern web frameworks and serverless environments.

> **Note:** This project started as a “quick experiment” and evolved into a valuable lesson in architecture, real-time systems, and the nuances of serverless infrastructure. 😄

---

## 🚀 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express, Socket.IO, CORS |
| **Client Lib** | `socket.io-client` |

---

## 🏗 Architecture

To ensure stability and bypass the limitations of serverless environments, this project uses a **decoupled architecture**:

1.  **Next.js Frontend:** Handles the UI and client-side socket logic. 
    * *Requirement:* Client components with `"use client"` are mandatory for socket hooks.
2.  **Dedicated Express Server:** A standalone Node.js process that manages the Socket.IO instance and stateful connections.
3.  **Separation of Concerns:** No sockets are hosted inside Next.js API routes, avoiding the common pitfalls of ephemeral serverless functions.

### Connection Flow


```text
  [ Client (Next.js) ] <---- (Bidirectional) ----> [ Socket.IO Server (Express) ]
          |                                                 |
    (use client)                                     (Node.js / Port 4000)

```
## ✨ Features

* **Real-time Messaging:** Instant communication powered by **Socket.IO** events for low-latency interaction.
* **Event Handling:** Seamless management of `message`, `join`, and `broadcast` events to sync state across all users.
* **Auto-Scrolling UI:** Chat window automatically stays pinned to the latest message using the `useRef` hook.
* **Responsive Design:** A modern, mobile-friendly interface built with **Tailwind CSS**.

---

## 📚 Key Learnings

> [!IMPORTANT]
> **Serverless Constraints:** Next.js (when deployed on serverless platforms like Vercel) is not designed for long-lived WebSocket connections. A dedicated server is necessary.

* **Directive Necessity:** The `"use client"` directive is non-negotiable when working with socket state in the App Router to access browser APIs.
* **Decoupling:** Separating the socket server from the frontend framework is the most stable architecture for real-time React applications.
* **Persistence:** Without a database (like **Redis** or **MongoDB**), state is volatile; all chat history resets if the server restarts.


## 📌 Notes

* **Learning Purpose:** This project was created strictly for educational exploration.
* **Non-Production Ready:** Not production-hardened (no authentication, persistence, or scaling).
* **Core Objective:** Built to understand real-time behavior and architectural constraints in modern React frameworks.

---

## 🙌 Acknowledgements

A huge thanks to the developer community for sharing experiences, pitfalls, and creative solutions regarding real-time systems and Next.js integration.

---

## 🧠 Author

**Built by Khush**

*Learning in public, one bug at a time.*
