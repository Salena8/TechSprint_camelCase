ShikshyaNode

Offline-First Local Learning Infrastructure(Server) for Rural Nepal

🚩 Problem

Many schools in rural Nepal operate with little or no internet connectivity, making modern digital learning platforms unusable. Most existing tools assume cloud access, continuous connectivity, and personal devices—conditions that rural classrooms do not meet. As a result, teachers lack offline digital tools, students miss interactive learning experiences, and a digital education gap continues to grow.

💡 Solution

ShikshyaNode is an offline-first, local network–based learning platform that transforms a teacher’s laptop, school computer, or low-cost hardware (e.g., Raspberry Pi) into a self-contained classroom server.
Students connect via a browser over a local Wi-Fi network, enabling real-time, multimedia learning without any internet dependency.

✨ Key Features

Offline Classroom Server – Runs entirely on a local device with no cloud services

Real-Time Slide Broadcasting – Teacher controls slide progression synced across all student devices

Offline Content Distribution – Upload and share PDFs, videos, and lesson packs for in-class and home use

Attendance & Activity Tracking – Automatic logging and basic analytics stored locally

Browser-Based Access – No app installation; works on any browser-enabled device

🏗️ System Overview

Content Layer: Local storage of lesson packs, PDFs, and videos

Interaction Layer: WebSocket-based real-time synchronization over LAN

Data Layer: SQLite database for attendance, participation, and results

Network Layer: Local Wi-Fi hotspot / LAN (no internet required)

🛠️ Tech Stack
Frontend

Next.js / React, 
 Tailwind CSS,
 Socket.IO Client,
 PDF.js (react-pdf),
 Progressive Web App (PWA)

Backend

Node.js (Express)
 Socket.IO,
 SQLite (better-sqlite3),
 Local file system for lesson storage

Networking

Local Area Network (LAN),
 WebSocket-based real-time communication

👥 Team Members

Salina Chhetri

Bhumika Rajvanshi
