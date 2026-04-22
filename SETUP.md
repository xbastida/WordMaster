# Setup Guide for Aprender Idioma

## Option 1: Direct Installation (Recommended)

### Step 1: Install Node.js

1. **Download Node.js** from [nodejs.org](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version
   - This will install both Node.js and npm (Node Package Manager)

2. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Project Dependencies

Navigate to the project folder and run:
```bash
npm install
```

This is similar to `pip install -r requirements.txt` in Python - it installs all dependencies listed in `package.json`.

### Step 3: Run the Application

**For development:**

**Easiest way - Run both together:**
```bash
npm run dev
```
This starts both the backend server (port 3001) and React frontend (port 3000) simultaneously.

**Alternative - Run separately:**

You need **two terminal windows** open:

**Terminal 1** - Start the backend API server:
```bash
npm run server
```
You should see "Server is running on http://localhost:3001" and "Connected to SQLite database"

**Terminal 2** - Start the React frontend:
```bash
npm start
```
This will open the app in your browser at `http://localhost:3000`

**Note:** 
- Unlike Python where you activate a virtual environment, Node.js projects store dependencies in a `node_modules` folder in your project directory. Each project has its own dependencies.
- The SQLite database file (`database.sqlite`) is created automatically in the project root when you first run the server.

---

## Option 2: Using Docker

You can use Docker to run the entire application in a containerized environment.

### Step 1: Install Docker Desktop

1. Download from [docker.com](https://www.docker.com/products/docker-desktop)
2. Install and start Docker Desktop

### Step 2: Build and Run

```bash
# Build the Docker image
docker-compose build

# Run the container
docker-compose up
```

The app will be available at `http://localhost:3000`
The API server will be at `http://localhost:3001`

**Note:** The database file will be stored in the Docker volume, so data persists between container restarts.

---

## Option 3: Using nvm (Node Version Manager) - Similar to pyenv

If you want to manage multiple Node.js versions (like `pyenv` for Python):

### Windows:
1. Install nvm-windows from [github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
2. Install Node.js:
   ```bash
   nvm install 18
   nvm use 18
   ```

### Mac/Linux:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js
nvm install 18
nvm use 18
```

---

## Comparison with Python

| Python | Node.js |
|--------|---------|
| `python -m venv venv` | Not needed (each project has its own `node_modules`) |
| `source venv/bin/activate` | Not needed |
| `pip install -r requirements.txt` | `npm install` |
| `python app.py` | `npm start` or `node app.js` |
| `requirements.txt` | `package.json` |

---

## Troubleshooting

**If you get permission errors:**
- Windows: Run terminal as Administrator
- Mac/Linux: You might need `sudo`, but try without first

**If npm install is slow:**
- This is normal, npm downloads many packages
- It's similar to pip installing many packages

**If Electron doesn't open:**
- Make sure you ran `npm start` first (in one terminal)
- Then run `npm run electron-dev` (in another terminal)

---

## Quick Start Commands

```bash
# Install dependencies (one time)
npm install

# Development mode (run both commands in separate terminals)
npm start              # Terminal 1
npm run electron-dev   # Terminal 2

# Build for production
npm run build
npm run electron-pack
```

