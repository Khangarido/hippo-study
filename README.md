# Hippo Study 🦛

A fun and interactive exam training web app for kids and students! Built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- 🦛 **Kid-Friendly Design**: Colorful, fun interface with hippo mascot
- 📱 **Fully Responsive**: Works perfectly on phones, tablets, and desktops
- 🔐 **Secure Authentication**: Email/password auth via Supabase
- 📊 **Student Dashboard**: View past exam results and statistics
- 🎯 **Interactive Exams**: Progress tracking, question navigation
- 📈 **Results Review**: Detailed review of correct and incorrect answers
- 🛡️ **Admin Panel**: Protected admin area for question management
- 🌐 **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS, Supabase

## Tech Stack

- **Framework**: Next.js 14 with App Router and TypeScript
- **Authentication + Database**: Supabase
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Version Control**: Git

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier is fine)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hippo-study
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and anon key
3. Copy the contents of `database-schema.sql` and run it in the Supabase SQL Editor

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup

### Database Schema

The `database-schema.sql` file contains all the necessary SQL to set up your database:

- **Questions table**: Stores exam questions with multiple choice answers
- **Attempts table**: Records exam attempts and scores
- **Attempt Answers table**: Stores per-question results for each attempt
- **User Roles table**: Manages admin permissions

### Row Level Security (RLS)

The schema includes comprehensive RLS policies:
- ✅ Authenticated users can read questions
- ✅ Users can only access their own exam attempts
- ✅ Only admins can create/update/delete questions
- ✅ Admin panel is protected by role-based access

### Making Yourself an Admin

After setting up Supabase and creating your account, run this SQL to make yourself an admin:

```sql
insert into user_roles (user_id, role) 
values ('your-user-id', 'admin');
```

To get your user ID, check the `auth.users` table in Supabase.

## GitHub Setup

### Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Hippo Study app"
```

### Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/yourusername/hippo-study.git
git push -u origin main
```

## Vercel Deployment

### Automatic Deployment

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### Manual Deployment

```bash
npm run build
npm start
```

## Project Structure

```
hippo-study/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── login/           # Login/signup page
│   │   ├── dashboard/       # Student dashboard
│   │   ├── exam/            # Exam interface
│   │   ├── results/         # Results review
│   │   └── admin/           # Admin panel
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── lib/                 # Utilities
│   │   └── supabase.ts     # Supabase client config
│   └── globals.css         # Global styles
├── database-schema.sql      # Database setup script
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Features Overview

### Student Experience

- **Dashboard**: View exam history, statistics, and quick actions
- **Exam Mode**: Interactive questions with progress tracking
- **Results Review**: Detailed breakdown of correct/incorrect answers
- **Mobile-First**: Perfect for tablets and phones

### Admin Features

- **Question Management**: Add, edit, delete questions
- **Category System**: Organize questions by subject
- **Protected Access**: Admin-only panel with role-based security
- **Bulk Operations**: Efficient question management

### Authentication

- **Email/Password Auth**: Secure login via Supabase
- **Role-Based Access**: Students vs Admin permissions
- **Protected Routes**: Middleware guards for sensitive pages
- **Session Management**: Automatic token handling

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |

### Sample Data

The database schema includes 5 sample questions to get you started:
- Math problems
- General knowledge
- Geography questions

## Troubleshooting

### Common Issues

1. **Supabase Connection**: Ensure your environment variables are correct
2. **Admin Access**: Make sure you've added your user ID to the `user_roles` table
3. **RLS Policies**: Verify Row Level Security is enabled on all tables
4. **Build Errors**: Check that all environment variables are set in Vercel

### Getting Help

- Check the Supabase dashboard for any errors
- Verify your SQL schema was applied correctly
- Ensure environment variables are properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ and 🦛 for students everywhere!
