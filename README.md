# SweetSync 🍑

**Warm, Clear, Alive.** The social scheduling app that actually understands your group's free time.

SweetSync is a social coordination platform designed for friend groups and students. It moves away from the cold, productivity-focused feel of traditional calendars and moves toward a warm, group-chat-like experience.

## ✨ Key Features

- **AI Schedule Extraction**: Upload a screenshot or PDF of your syllabus or work schedule, and our Gemini-powered engine extracts your busy blocks automatically.
- **Group Heat Maps**: Visualize collective availability at a glance. Shaded from light peach to deep indigo based on group density.
- **AI-Found Slots**: SweetSync proactively identifies the best times for your group to meet, highlighting them directly on the heat map.
- **Voting Sessions**: Can't decide between a coffee catch-up or a study session? Run a quick activity vote alongside your time-slot votes.
- **Semantic Color System**: Peach for people, Indigo for AI/Scheduling, Mint for confirmed events. Know what's happening before you read a word.

## 🛠 Tech Stack

- **Frontend**: React Native (Expo) + TypeScript
- **Styling**: Vanilla React Native StyleSheet (Theme-driven)
- **Icons**: Phosphor Icons
- **Backend**: Supabase (Auth, Database, Real-time)
- **AI**: Google Gemini (via Supabase Edge Functions)
- **Navigation**: Expo Router (File-based routing)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Expo Go app on your mobile device (or iOS/Android emulators)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/SweetSync.git
   cd SweetSync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🎨 Design Philosophy

SweetSync is built on three core pillars:
1. **Warm**: Peach and indigo tones. It should feel like a group chat, not a spreadsheet.
2. **Clear**: Intentional spacing and semantic colors ensure the user always knows what to do next.
3. **Alive**: Display typography (Fraunces) and smooth animations make the app feel responsive and human.

## 📁 Project Structure

```
├── app/               # Expo Router pages & layouts
├── assets/            # Fonts, images, and static assets
├── components/        # Reusable UI Kit (Button, Card, Avatar, etc.)
├── constants/         # Theme (colors, spacing) and animations
├── hooks/             # Custom React hooks (useRoom, useAuth, etc.)
├── lib/               # Third-party service clients (Supabase, Gemini)
├── supabase/          # Migrations and Edge Functions
└── types/             # TypeScript definitions
```

## 📄 License

This project is private and intended for personal/portfolio use.
