# Cloud Database Setup for CBT Platform

## Step-by-Step Migration Guide

### Step 1: Choose and Set Up Cloud Database

#### Option A: Neon (Recommended)
1. Visit [neon.tech](https://neon.tech)
2. Sign up with GitHub or Google
3. Click "Create Project"
4. Choose region closest to you
5. Copy the connection string (looks like: `postgresql://username:password@hostname/database`)

#### Option B: Supabase
1. Visit [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" under "Connection parameters"

### Step 2: Update Your Local Environment

Create a `.env` file in your project root:
```
DATABASE_URL=your_cloud_database_connection_string_here
SESSION_SECRET=your_random_session_secret_here
```

### Step 3: Set Up Database Schema

In your local VS Code terminal:
```bash
# Install dependencies
npm install

# Push your schema to the new database
npm run db:push
```

### Step 4: Import Your Data

Run the migration script:
```bash
# If using psql (install PostgreSQL client tools):
psql "your_connection_string" -f migration-data.sql

# OR copy/paste the SQL from migration-data.sql into your cloud database's SQL editor
```

### Step 5: Test Your Application

```bash
# Start the development server
npm run dev
```

**Test Login:**
- Admin ID: ADM001
- Password: admin123

## Environment Variables Needed

```env
# Database
DATABASE_URL=postgresql://username:password@hostname/database

# Session Security
SESSION_SECRET=your-super-secret-random-string-here

# Optional: Node Environment
NODE_ENV=development
```

## Troubleshooting

**Connection Issues:**
- Ensure your IP is whitelisted (most cloud providers auto-allow)
- Check if the connection string includes SSL parameters

**Schema Issues:**
- Run `npm run db:push --force` if schema sync fails
- Verify all tables were created before running migration script

**Data Import Issues:**
- Ensure you've run `npm run db:push` first to create tables
- Check that UUIDs in migration script match your schema requirements