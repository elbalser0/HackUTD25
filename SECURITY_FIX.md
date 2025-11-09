# 🔐 Security Fix: Removing API Keys from Git History

## ⚠️ IMPORTANT: Your API keys were committed to git!

Your `.env` file containing sensitive API keys was committed in commit `9037cd5`. 

## Steps to Fix:

### 1. Remove .env from Git History
Run these commands:

```powershell
cd C:\Users\melod\Desktop\HackUTD25

# Remove .env from git history (all branches)
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch pnc-productivity-app/.env" --prune-empty --tag-name-filter cat -- --all

# Force push to remote (WARNING: This rewrites history!)
git push origin --force --all
```

### 2. Rotate ALL API Keys Immediately

Since your keys were exposed in git history, you MUST rotate them:

#### A. OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Delete the old key
3. Create a new key
4. Update your local `.env` file

#### B. Firebase Configuration
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Go to Project Settings > General
4. Under "Your apps" section, find your web app
5. Click on the config snippet and regenerate if possible
6. For extra security, add domain restrictions:
   - Go to Google Cloud Console
   - Find Firebase API credentials
   - Add authorized domains/IP restrictions

### 3. Verify .env is Ignored
```powershell
# Check that .env is now properly ignored
git status

# The .env file should NOT appear in changes
```

### 4. Add and Commit .gitignore
```powershell
git add .gitignore
git commit -m "Add .gitignore to protect API keys"
git push origin main
```

## Going Forward

✅ **DO:**
- Keep `.env` file locally only
- Share `.env.example` with placeholder values
- Rotate keys regularly
- Use environment-specific keys (dev vs prod)

❌ **DON'T:**
- Commit `.env` files
- Share API keys in chat/email
- Use production keys in development
- Hardcode secrets in source code

## Already Made Public?

If you already pushed to a public repo:
1. Assume all keys are compromised
2. Rotate them IMMEDIATELY
3. Run the git filter-branch command above
4. Force push to overwrite history

## Questions?
Check the `.gitignore` file - it now properly excludes all `.env` files.
