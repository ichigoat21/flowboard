🧠 Realtime Kanban Board

A real-time Kanban board built with React and WebSockets (Socket.IO) where multiple users can collaborate on tasks and see updates instantly without page refreshes.

✨ Features

Create, update, delete, and move tasks between To Do / In Progress / Done

Real-time synchronization across all connected clients using WebSockets

Task priority support (Low / Medium / High)

Task categorization (Bug / Feature / Enhancement)

Attachment support (file placeholder & preview-ready)

Drag-and-drop task movement

Live task progress visualization (tasks per column & completion percentage)

🧪 Testing

Unit Tests (Vitest)

Task creation, updates, deletion

WebSocket event handling

Integration Tests (React Testing Library)

State sync across multiple clients

Drag-and-drop task movement

End-to-End Tests (Playwright)

Create, move, and delete tasks

Real-time UI updates between users

Priority & category selection

Attachment upload flow

Progress graph updates