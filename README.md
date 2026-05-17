# SAT Platform 📚

A complete SAT prep platform built with pure HTML, CSS and JavaScript — no server needed. Works entirely in the browser with localStorage.

## 🚀 Live Demo
Once deployed to GitHub Pages, open the URL provided by GitHub.

## 📁 Pages
| File | Description |
|------|-------------|
| `index.html` | Entry point — redirects to landing |
| `sat-landing.html` | Home / marketing page |
| `sat-signup.html` | Sign up page |
| `sat-login.html` | Login page |
| `sat-onboarding.html` | Target score & study plan setup |
| `sat-dashboard.html` | Main dashboard with all modules |
| `sat-practice.html` | Practice questions (December paper) |
| `sat-october-mock.html` | October paper with AI explanations |
| `sat-community.html` | Community chat — groups & DMs |

## ✨ Features
- 147 real SAT questions across 2 past papers
- Timed modules with real SAT scoring (200–800)
- AI-powered explanations after each answer (requires Anthropic API key)
- Community chat with groups and private messages
- Share questions to study groups via Telegram-style share sheet
- 9 topic drill modules (Vocabulary, Grammar, Transitions, etc.)
- Full mock tests (93Q December, 54Q October)
- Progress tracking in browser localStorage

## 🔑 AI Explanations Setup
The October Mock has AI-powered explanations. To enable:
1. Get a free API key at [console.anthropic.com](https://console.anthropic.com)
2. Open the October Mock
3. Click **✨ API Key** in the top nav and paste your key
4. Your key is saved in your browser — never shared

## 🛠️ Deploy to GitHub Pages
1. Create a new GitHub repository
2. Upload all HTML files to the repo
3. Go to **Settings → Pages**
4. Set source to **main branch / root folder**
5. Your site will be live at `https://yourusername.github.io/repo-name/`

## 📱 Tech Stack
- Pure HTML5, CSS3, JavaScript (no frameworks)
- Google Fonts (Playfair Display + DM Sans)
- localStorage for all data persistence
- Anthropic Claude API for AI explanations
