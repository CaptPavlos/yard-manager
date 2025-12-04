# YachtPinpoint - Maritime Work Management

A professional yacht work list and project management platform designed for yacht crew and captains. Similar to Pinpoint Works, this application allows you to manage maintenance tasks, repairs, and projects using interactive GA (General Arrangement) plans.

![YachtPinpoint Dashboard](./screenshots/dashboard.png)

## Features

### Core Features
- **Interactive GA Plans**: Upload yacht general arrangement plans and place work item pins directly on the plan
- **Work Item Management**: Create, assign, and track work items with status, priority, due dates, and custom fields
- **Real-time Collaboration**: @mention team members, add comments, and attach photos/videos
- **Dashboard & Analytics**: Visual progress tracking with charts and customizable views
- **Mobile-Responsive PWA**: Full Progressive Web App support for iOS/Android with offline mode

### Technical Features
- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, Drizzle ORM
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: Session-based auth with role-based access control
- **File Storage**: Support for image/video attachments
- **Dark Mode**: Beautiful maritime-themed dark and light modes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom maritime theme
- **Database**: Neon PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL account (https://neon.tech)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/yacht-pinpoint.git
cd yacht-pinpoint
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@your-neon-host.neon.tech/neondb?sslmode=require"

# Optional: Auth secret for sessions
AUTH_SECRET="your-secret-key-here"

# Optional: File upload storage URL
STORAGE_URL="your-storage-url"
```

4. Push the database schema:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Dashboard layout group
│   │   ├── dashboard/     # Main dashboard
│   │   ├── projects/      # Projects list & detail
│   │   ├── vessels/       # Vessels management
│   │   ├── work-items/    # Work items list
│   │   └── team/          # Team management
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Base UI components
│   ├── ga-plan/           # GA Plan viewer components
│   ├── work-item/         # Work item components
│   ├── dashboard/         # Dashboard components
│   └── layout/            # Layout components
├── lib/
│   ├── db/               # Database schema & connection
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `vessels` - Yacht/vessel information with GA plans
- `projects` - Project containers for work items
- `work_items` - Individual tasks with pins on GA plans
- `comments` - Threaded comments on work items
- `attachments` - File attachments for work items/comments
- `activity_log` - Audit trail of all actions

## Scripts

```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint

# Database
npm run db:generate   # Generate migrations
npm run db:migrate    # Run migrations
npm run db:push       # Push schema to database
npm run db:studio     # Open Drizzle Studio
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `DATABASE_URL` - Your Neon connection string
4. Deploy!

### Environment Variables for Production

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `AUTH_SECRET` | Secret for session encryption | Yes |
| `STORAGE_URL` | File storage service URL | No |

## Design System

### Colors
- **Navy**: Primary dark colors for maritime theme
- **Ocean**: Accent colors (teal/cyan tones)
- **Gold**: Highlight and CTA colors
- **Teak**: Warm neutral accents

### Typography
- **Sans**: Inter for body text
- **Display**: Custom serif for headings (optional)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Pinpoint Works](https://www.pinpointworks.com)
- Built with [Next.js](https://nextjs.org)
- Database powered by [Neon](https://neon.tech)
- UI components from [Radix UI](https://radix-ui.com)
