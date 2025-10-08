# Complete Beginner's Guide: Moving CBT Platform to VS Code

## Prerequisites (Install These First)

### 1. Install Node.js
1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the setup wizard
4. **Test installation**: Open Command Prompt/Terminal and type:
   ```
   node --version
   npm --version
   ```
   You should see version numbers.

### 2. Install VS Code
1. Go to [code.visualstudio.com](https://code.visualstudio.com)
2. Download and install VS Code for your operating system
3. Launch VS Code

### 3. Install Git (Optional but Recommended)
1. Go to [git-scm.com](https://git-scm.com)
2. Download and install Git
3. Use default settings during installation

## Step-by-Step Setup

### Step 1: Get Your Project Files

**Option A: Download from Replit**
1. In your Replit project, click the **3 dots menu** (⋮) in the file tree
2. Select **"Download as ZIP"**
3. Save the ZIP file to your computer
4. **Extract the ZIP** to a folder (e.g., `C:\Projects\CBT-Platform` or `~/Projects/CBT-Platform`)

**Option B: Clone with Git (if you set up a GitHub repo)**
1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
3. Type "Git: Clone" and select it
4. Enter your GitHub repository URL

### Step 2: Open Project in VS Code

1. **Open VS Code**
2. Click **"File" → "Open Folder"**
3. Navigate to your extracted CBT-Platform folder
4. Click **"Select Folder"** to open the project

### Step 3: Install Dependencies

1. **Open Terminal in VS Code**:
   - Press `Ctrl+`` (backtick) or go to **"Terminal" → "New Terminal"**

2. **Install all required packages**:
   ```bash
   npm install
   ```
   This will download all the libraries your project needs (may take 2-3 minutes).

### Step 4: Set Up Environment Variables

1. **Create a new file** called `.env` in your project root folder:
   - Right-click in the VS Code file explorer
   - Select **"New File"**
   - Name it exactly: `.env` (with the dot at the beginning)

2. **Add your database connection**:
   ```
   DATABASE_URL=your_neon_connection_string_here
   SESSION_SECRET=your-super-secret-random-string-here
   NODE_ENV=development
   ```

3. **Replace the values**:
   - `DATABASE_URL`: Use your Neon connection string (starts with `postgresql://`)
   - `SESSION_SECRET`: Create any random string (e.g., `my-super-secret-key-12345`)

### Step 5: Test Your Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Check for success**:
   - You should see: `serving on port 5000`
   - No error messages about missing modules

3. **Open your browser**:
   - Go to: `http://localhost:5000`
   - You should see your CBT platform homepage

### Step 6: Test Login

1. **Try admin login**:
   - Admin ID: `ADM001`
   - Password: `admin123`

2. **Check features**:
   - View dashboard with statistics
   - Check courses and questions are loaded
   - Test adding/editing questions

## Common Issues & Solutions

### Issue: "npm: command not found"
**Solution**: Node.js not installed properly
- Reinstall Node.js from [nodejs.org](https://nodejs.org)
- Restart your computer after installation

### Issue: "Cannot find module" errors
**Solution**: Dependencies not installed
```bash
npm install
```

### Issue: "Database connection failed"
**Solution**: Check your `.env` file
- Ensure `DATABASE_URL` is correct
- No extra spaces or quotes around the URL
- File is named exactly `.env` (not `.env.txt`)

### Issue: "Port 5000 already in use"
**Solution**: Stop other applications using port 5000
- Close other development servers
- Or change the port in your code to 3000 or 8000

### Issue: Can't see the `.env` file
**Solution**: Show hidden files
- **Windows**: In VS Code, the file should be visible
- **Mac**: Press `Cmd+Shift+.` in Finder to show hidden files

## Useful VS Code Extensions

Install these to make development easier:

1. **ES7+ React/Redux/React-Native snippets**
2. **Prettier - Code formatter**
3. **Auto Rename Tag**
4. **Bracket Pair Colorizer**
5. **Thunder Client** (for testing API endpoints)

To install extensions:
1. Click the **Extensions icon** in VS Code sidebar (4 squares)
2. Search for the extension name
3. Click **"Install"**

## Development Workflow

### Daily Development:
1. **Open VS Code** → Open your project folder
2. **Start server**: `npm run dev` in terminal
3. **Make changes** to files
4. **Browser auto-refreshes** with your changes
5. **Stop server**: Press `Ctrl+C` in terminal when done

### Adding New Features:
1. **Database changes**: Edit `shared/schema.ts`
2. **Push changes**: `npm run db:push` 
3. **Frontend changes**: Edit files in `client/src/`
4. **Backend changes**: Edit files in `server/`

## Backup & Version Control

### Save Your Work:
1. **Initialize Git** (one time):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Save changes regularly**:
   ```bash
   git add .
   git commit -m "Describe what you changed"
   ```

3. **Push to GitHub** (optional):
   - Create a repository on GitHub
   - Follow GitHub's instructions to push your code

## Next Steps

Once everything is working:
- **Customize**: Add your own questions and courses
- **Deploy**: Consider platforms like Vercel, Netlify, or Railway for hosting
- **Backup**: Regularly export your database or commit code to GitHub
- **Learn**: Explore React, Node.js, and PostgreSQL documentation

## Getting Help

If you encounter issues:
1. **Check the terminal** for error messages
2. **Google the error message** - most issues are common
3. **Check VS Code's "Problems" tab** for code issues
4. **Restart VS Code** and try again
5. **Restart your computer** if nothing else works

Your CBT platform is now ready for local development in VS Code! 🎉