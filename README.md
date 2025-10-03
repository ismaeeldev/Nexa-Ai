# Nexa-Ai

![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs)
![Stream](https://img.shields.io/badge/Stream-Video%20%26%20Chat-4EA1F7?logo=stream)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-LLM-yellow?logo=huggingface)
![License](https://img.shields.io/badge/License-MIT-green)
![Build](https://img.shields.io/github/workflow/status/ismaeeldev/Nexa-Ai/CI)

## Description

**Nexa-Ai** is a modern SaaS platform for real-time video meetings, AI-powered chat, and agent-assisted coaching. It integrates Stream Video, Stream Chat, and Hugging Face LLM to deliver seamless, interactive experiences for users and teams. Nexa-Ai automates meeting summaries, agent responses, and provides a robust, scalable foundation for virtual collaboration.

## Features

- 🔒 Secure video meetings with Stream Video
- 💬 Real-time chat powered by Stream Chat
- 🤖 AI agent replies and meeting summaries via Hugging Face LLM
- 🎤 Text-to-Speech (TTS) for agent messages
- 📄 Automated meeting lifecycle management (webhooks)
- 🗂️ TRPC-powered data hydration and queries
- 🧑‍💼 Role-based authentication (Better Auth)
- 🖥️ Responsive, dark-themed UI with Shadcn UI & Tailwind CSS
- 📝 Meeting summaries, recordings, and agent notes
- 🚀 Production-ready deployment (Vercel, Railway, Docker supported)

## Tech Stack

| Technology         | Purpose                                 |
|--------------------|-----------------------------------------|
| Next.js 15 + Turbopack | Frontend & API routes                |
| Stream Video & Chat| Real-time video and chat                |
| Hugging Face LLM   | AI agent replies & summaries            |
| TRPC               | Type-safe API & hydration               |
| Drizzle ORM        | Database access (PostgreSQL)            |
| Better Auth        | Authentication                          |
| Tailwind CSS + Shadcn UI | UI components & styling           |
| PostgreSQL (Neon)  | Database                                |
| Vercel/Railway/Docker | Deployment options                   |

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/ismaeeldev/Nexa-Ai.git
cd Nexa-Ai

# 2. Install dependencies
npm install

# 3. Copy and edit environment variables
cp .env.local.example [.env.local](http://_vscodecontentref_/0)
# Fill in your API keys and DB credentials

# 4. Run database migrations (if using Drizzle)
npm run db:migrate

# 5. Start the development server
npm run dev
```
---

## Author

**Muhammad Ismaeel**  
📧 [m.ismaeel.developer@gmail.com](mailto:m.ismaeel.developer@gmail.com)

---

<p align="center">
  Built with ❤️ by <strong>Muhammad Ismaeel</strong>.<br>
  For more info or support, feel free to reach out via email.
</p>

---
