# AIISTECH Projects Showcase 🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini%20AI-blue)](https://ai.google.dev/)

> AI-powered project showcase featuring Google Gemini AI integration for intelligent project analysis and interactive assistance

## Overview

This website showcases the three AIISTECH projects (AIISTECH-Website, AIISTECH-Backend, AIISTECH-Dashboard) with AI-powered features using Google Gemini AI. The site dynamically generates project descriptions, provides deep technical insights, and includes an interactive AI chatbot to answer questions about the projects.

### ✨ AI-Powered Features

- 🤖 **Dynamic Project Descriptions**: Gemini AI generates engaging, context-aware summaries for each project
- 🔍 **Deep Technical Analysis**: AI-powered insights including architecture assessment, strengths, and improvement suggestions
- 💬 **Interactive AI Chatbot**: Ask questions about any project and get intelligent, context-aware responses
- 📊 **Real-time GitHub Integration**: Live repository statistics (stars, forks, language, last updated)
- 🎨 **Modern Responsive Design**: Beautiful dark-mode UI that works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- A web browser (Chrome, Firefox, Safari, or Edge)
- A free Google Gemini API key
- Internet connection (for API calls)

### Setup Instructions

1. **Get Your Free Google Gemini API Key**
   
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your new API key

2. **Configure the Website**

   ```bash
   # Clone the repository (if you haven't already)
   git clone https://github.com/RRussell11/AIISTECH-Website.git
   cd AIISTECH-Website
   
   # Copy the config template
   cp js/config.example.js js/config.js
   ```

3. **Add Your API Key**
   
   Open `js/config.js` in a text editor and replace `YOUR_API_KEY_HERE` with your actual Gemini API key:
   
   ```javascript
   const CONFIG = {
       GEMINI_API_KEY: 'your-actual-api-key-here',  // Replace this!
       GITHUB_USERNAME: 'RRussell11',
       PROJECTS: [
           'AIISTECH-Website',
           'AIISTECH-Backend',
           'AIISTECH-Dashboard'
       ]
   };
   ```

4. **Run the Website**
   
   Simply open `index.html` in your web browser:
   
   ```bash
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   
   # On Windows
   start index.html
   ```
   
   Or use a local web server:
   
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (with http-server installed globally)
   npx http-server
   ```
   
   Then visit `http://localhost:8000` in your browser.

## 📁 Project Structure

```
AIISTECH-Website/
├── index.html              # Main HTML page
├── css/
│   └── style.css          # Responsive styles and animations
├── js/
│   ├── app.js             # Main application logic
│   ├── config.example.js  # Configuration template (committed)
│   └── config.js          # Your actual config (gitignored)
├── .gitignore             # Excludes config.js from version control
└── README.md              # This file
```

## 🎯 Features in Detail

### 1. AI-Generated Project Content

Each project card displays:
- **Project name and icon**: Visual identification
- **AI-generated description**: Gemini creates engaging 2-3 sentence summaries based on repository metadata
- **GitHub statistics**: Real-time stars, forks, primary language, and last update date
- **Quick actions**: Direct links to GitHub and AI insights generation

### 2. Deep Project Insights

Click "Generate Insights" on any project to get comprehensive AI analysis:
- Technical overview and architectural approach
- Key strengths and notable features
- Technology stack assessment
- Constructive improvement suggestions
- Best use cases and applications

### 3. Interactive AI Chatbot

The built-in chatbot can:
- Answer questions about any of the three projects
- Compare features and technologies between projects
- Provide technical explanations and details
- Suggest learning resources
- Maintain conversation context for natural interactions

Example questions to try:
- "What's the difference between the Website and Dashboard projects?"
- "Which project uses the most modern tech stack?"
- "How do these projects work together?"
- "What language is the Backend written in?"

### 4. Real-time GitHub Integration

The website automatically fetches current data from GitHub:
- Repository statistics (stars, forks)
- Primary programming language
- Last update timestamp
- Repository description

## 🛠️ Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **AI Integration**: Google Gemini AI API (gemini-pro model)
- **Data Source**: GitHub REST API v3
- **Styling**: Custom CSS with CSS Grid, Flexbox, and animations
- **Fonts**: Google Fonts (Inter)

## 🔒 Security & Best Practices

### API Key Security

- ✅ **Never commit `js/config.js`** - It's in `.gitignore` by default
- ✅ **Use the template** - Share `js/config.example.js` instead
- ✅ **Regenerate if exposed** - If you accidentally commit your API key, regenerate it immediately at [Google AI Studio](https://makersuite.google.com/app/apikey)
- ✅ **Set API restrictions** - In Google Cloud Console, restrict your API key to specific domains

### Rate Limiting

Google Gemini AI has generous free tier limits:
- 60 requests per minute
- 1,500 requests per day

The website is designed to be efficient with API calls to stay within these limits.

## 🐛 Troubleshooting

### "Configuration Required" Modal Appears

**Problem**: The config modal shows when you open the website.

**Solution**: 
1. Make sure you copied `js/config.example.js` to `js/config.js`
2. Verify your API key is correctly pasted (no extra spaces)
3. Refresh the page

### Projects Not Loading

**Problem**: The projects section shows a loading spinner indefinitely.

**Solutions**:
- Check your internet connection
- Verify the GitHub username in `config.js` is correct (`RRussell11`)
- Check browser console (F12) for error messages
- Ensure the repositories are public

### AI Features Not Working

**Problem**: Chatbot or insights generation fails.

**Solutions**:
- Verify your Gemini API key is valid
- Check if you've hit the rate limit (wait a few minutes)
- Ensure your API key has the correct permissions
- Check browser console for specific error messages

### "CORS Error" in Console

**Problem**: Blocked by CORS policy.

**Solution**: 
- Use a local web server instead of opening the HTML file directly
- Try: `python -m http.server 8000` or `npx http-server`

## 📸 Screenshots

### Projects Section
The main showcase displays all three AIISTECH projects with AI-generated descriptions and live GitHub statistics.

### AI Insights
Click "Generate Insights" to get comprehensive technical analysis powered by Gemini AI.

### Interactive Chatbot
Ask questions about the projects and get intelligent, context-aware responses.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Improve documentation
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Google Gemini AI](https://ai.google.dev/) - Get your free API key
- [GitHub API Documentation](https://docs.github.com/en/rest) - GitHub REST API reference
- [AIISTECH Projects](https://github.com/RRussell11) - View all AIISTECH repositories

## 💡 Tips for Best Experience

1. **First time setup**: Follow the setup instructions carefully
2. **API Key**: Keep your API key secure and never share it publicly
3. **Ask specific questions**: The chatbot works best with clear, specific questions
4. **Explore insights**: Generate insights for all three projects to compare their technical approaches
5. **Mobile friendly**: The site works great on phones and tablets too!

---

Made with ❤️ using Google Gemini AI

