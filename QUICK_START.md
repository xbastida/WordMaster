# Quick Start Guide

## For Windows Users

### 1. Install Node.js
- Go to https://nodejs.org/
- Download the LTS version (recommended)
- Run the installer (it will install both Node.js and npm)

### 2. Verify Installation
Open PowerShell or Command Prompt and type:
```powershell
node --version
npm --version
```
You should see version numbers (e.g., v18.17.0 and 9.6.7)

### 3. Install Project Dependencies
Open PowerShell in your project folder and run:
```powershell
npm install
```
This will take a few minutes - it's downloading all the packages (like `pip install` in Python).

### 4. Run the App

**Easiest way - Run both server and frontend together:**
```powershell
npm run dev
```
This starts both the backend server (port 3001) and the React frontend (port 3000).

**Alternative - Run separately:**
Open TWO PowerShell windows in your project folder:

**PowerShell Window 1:**
```powershell
npm run server
```
This starts the backend API server (you'll see "Server is running on http://localhost:3001")

**PowerShell Window 2:**
```powershell
npm start
```
This starts the React frontend (it will open in your browser at http://localhost:3000)

---

## What's Different from Python?

| What You Do in Python | What You Do in Node.js |
|----------------------|------------------------|
| `python -m venv venv` | ❌ Not needed! |
| `venv\Scripts\activate` | ❌ Not needed! |
| `pip install -r requirements.txt` | ✅ `npm install` |
| `python app.py` | ✅ `npm start` |

**Key Difference:** Node.js projects automatically isolate dependencies in a `node_modules` folder. You don't need to activate anything - just run `npm install` once per project!

---

## Troubleshooting

**"npm is not recognized"**
- Node.js isn't installed or not in PATH
- Restart your terminal after installing Node.js

**"Port 3000 is already in use"**
- Close other applications using port 3000
- Or kill the process: `netstat -ano | findstr :3000` then `taskkill /PID <pid> /F`

**"Cannot connect to server" or API errors**
- Make sure the backend server is running (`npm run server` or `npm run dev`)
- Check that port 3001 is not being used by another application
- The database file (`database.sqlite`) will be created automatically on first run

---

## Next Steps

Once the app is running:
1. Click "New Words"
2. Click "+ New Language"
3. Use the slider to select a language
4. Click "Confirm"
5. Start adding words!

