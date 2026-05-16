# Pessoas Table Viewer

A Next.js application with TypeScript and Tailwind CSS for displaying data from a Supabase "pessoas" table.

## Setup

### 1. Configure Supabase Credentials

Edit `.env.local` and add your Supabase project details. Use either variable name (the app supports both):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Or with the newer Supabase naming:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
```

You can find these values in your Supabase project:
- Go to your Supabase dashboard
- Click "Connect" (top right) to see your credentials
- Or go to "Settings" → "API" for the full URL

### 2. Ensure Your Supabase Table

Make sure you have a table named `pessoas` with these columns:
- `id` (integer, primary key)
- `nome` (text)
- `email` (text)
- `telefone` (text)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- Displays all records from the `pessoas` table
- Responsive table layout with Tailwind CSS
- Error handling for Supabase connection issues
- Refresh button to reload data
- TypeScript for type safety

## Project Structure

- `app/` - Next.js app directory with main page
- `lib/supabase.ts` - Supabase client configuration
- `.env.local` - Environment variables (create with your credentials)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
