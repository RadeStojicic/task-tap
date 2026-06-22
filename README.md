# TaskTap

A mobile app for reporting and tracking maintenance issues. Built with Expo, React Native, and Supabase.

## Features

- Submit maintenance reports with title, location, items, categories, and photos
- Track report status: **New**, **In Progress**, **Resolved**
- Admin dashboard to view all reports, update statuses, and assign to team members
- Role-based access - regular users see only their own reports
- Photo uploads per report item

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Expo Go app on your device, or an Android/iOS simulator

### Setup

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Create a Supabase project and copy your credentials into `lib/env.ts`:

```ts
export const env = {
  supabaseUrl: "https://your-project.supabase.co",
  supabaseAnonKey: "your-anon-key",
  restUrl: "https://your-project.supabase.co/rest/v1",
};
```

3. Start the dev server:

```bash
pnpm start
```

Scan the QR code with Expo Go or press `a` / `i` for Android / iOS simulator.

## Project Structure

```
app/
  index.tsx           # Welcome screen
  (auth)/             # Login & register screens
  (tabs)/             # Main tab navigator (Reports, New Report, Profile)
  report/[id].tsx     # Report detail screen
lib/
  auth.tsx            # Auth context + Supabase session management
  api.ts              # REST API helpers
  storage.ts          # Photo upload
components/           # Shared UI components
```

## Roles

| Role  | Can do                                                  |
| ----- | ------------------------------------------------------- |
| User  | Submit reports, view own reports                        |
| Admin | View all reports, update status, assign to self, delete |
