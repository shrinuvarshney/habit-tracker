# ✨ Habit Tracker SaaS - Build Better Routines

A modern, privacy-focused Habit Tracker built with **Next.js 14** and **Tailwind CSS**. Designed to help you build and maintain positive habits through gamification, insightful analytics, and a beautiful, distracting-free interface.

![Habit Tracker Dashboard](./public/screenshot-dashboard.png)
*(Note: Add a screenshot of your dashboard here)*

## 🚀 Features

### Core Productivity

- **Habit Management**: Create, edit, and delete daily habits with varying difficulty levels.
- **Streak Tracking**: automatically calculates current and best streaks to keep you motivated.
- **Completion History**: Visual calendar view of your consistency.
- **Dark Mode**: A fully polished, eye-friendly dark theme optimized for night owls (`Zinc` palette).

### 🎮 Gamification

- **XP System**: Earn specific XP amounts based on habit difficulty (Easy: 5 XP, Medium: 10 XP, Hard: 20 XP).
- **Leveling Up**: Progress through levels as you accumulate XP.
- **Badges**: Unlock achievements like "First Step", "Consistency is Key", and "Centurion" as you hit milestones.
- **AI Coach (Beta)**: Context-aware motivational tips based on your daily performance.

### 📊 Analytics

- **Heatmap**: GitHub-style contribution graph for your habits.
- **Weekly Charts**: Visual breakdown of your productivity over the last 7 days.
- **Key Metrics**: Track completion rates, best streaks, and total completions.

### 👤 Personalization

- **User Avatars**: Choose from a collection of fun, generated avatars.
- **Settings**: Manage your profile and preferences.
- **Notifications**: In-app alerts for Level Ups, Badges, and Habit Reminders.

### 💼 SaaS Features (New!)

- **Hybrid Auth**: Support for "Guest" (Local) and "Cloud" (SaaS) accounts.
- **Admin Dashboard**: Secure owner-only view for business metrics (`/admin`).
- **Feature Gating**: Premium features like AI Insights are locked for free users.
- **Monetization**: "Upgrade to Premium" UI flows with mock Stripe integration.

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **Persistence**: LocalStorage (Privacy-first client-side data)
- **Deployment**: Vercel

## ⚡ Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites

- Node.js 18+ installed

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/YOUR_USERNAME/habit-tracker.git
    cd habit-tracker
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the development server:

    ```bash
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
