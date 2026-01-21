// AIISTECH Projects Showcase - Main Application
// Powered by Google Gemini AI

// Gemini AI API Configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GITHUB_API_URL = 'https://api.github.com/repos';

// Global state
let projectsData = [];
let chatHistory = [];

// Check if config is loaded
function checkConfig() {
    if (typeof CONFIG === 'undefined' || !CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        document.getElementById('config-modal').style.display = 'flex';
        return false;
    }
    return true;
}

// Initialize the application
async function init() {
    if (!checkConfig()) {
        return;
    }
    
    await loadProjects();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-chat');
    
    sendButton.addEventListener('click', sendChatMessage);
    clearButton.addEventListener('click', clearChat);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
}

// Fetch GitHub repository data
async function fetchGitHubRepo(repoName) {
    try {
        const response = await fetch(`${GITHUB_API_URL}/${CONFIG.GITHUB_USERNAME}/${repoName}`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${repoName}:`, error);
        return null;
    }
}

// Call Gemini AI API
async function callGeminiAPI(prompt, isChat = false) {
    try {
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };
        
        const response = await fetch(`${GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API error');
        }
        
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
            throw new Error('No response from Gemini AI');
        }
        
        return text;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
}

// Generate AI description for a project
async function generateProjectDescription(repoData) {
    const prompt = `Generate a concise, engaging 2-3 sentence description for this GitHub project:
    
Project Name: ${repoData.name}
Description: ${repoData.description || 'No description available'}
Language: ${repoData.language || 'Multiple languages'}
Topics: ${repoData.topics?.join(', ') || 'None'}

Focus on what makes this project valuable and interesting. Be professional and enthusiastic.`;
    
    try {
        return await callGeminiAPI(prompt);
    } catch (error) {
        return repoData.description || 'A software project by AIISTECH.';
    }
}

// Generate comprehensive project insights
async function generateProjectInsights(repoData) {
    const prompt = `As a senior software architect, provide a detailed technical analysis of this GitHub project:

Project: ${repoData.name}
Description: ${repoData.description || 'No description'}
Language: ${repoData.language || 'Multiple'}
Stars: ${repoData.stargazers_count}
Forks: ${repoData.forks_count}
Open Issues: ${repoData.open_issues_count}
Created: ${new Date(repoData.created_at).toLocaleDateString()}
Last Updated: ${new Date(repoData.updated_at).toLocaleDateString()}

Please provide:
1. **Technical Overview**: What this project does and its architectural approach
2. **Key Strengths**: 3-4 notable positive aspects
3. **Technology Assessment**: Analysis of the tech stack and design choices
4. **Improvement Suggestions**: 3-4 constructive recommendations
5. **Best Use Cases**: When and why to use this project

Format with clear sections using markdown-style headings.`;
    
    return await callGeminiAPI(prompt);
}

// Load and display all projects
async function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>Loading projects from GitHub...</p></div>';
    
    try {
        // Fetch all repository data
        const repoPromises = CONFIG.PROJECTS.map(project => fetchGitHubRepo(project));
        const repos = await Promise.all(repoPromises);
        
        // Filter out failed fetches
        const validRepos = repos.filter(repo => repo !== null);
        
        if (validRepos.length === 0) {
            projectsGrid.innerHTML = '<div class="error-message">Failed to load projects. Please check your internet connection and GitHub API access.</div>';
            return;
        }
        
        // Generate AI descriptions for all projects
        projectsGrid.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>Generating AI-powered descriptions...</p></div>';
        
        const projectsWithAI = await Promise.all(
            validRepos.map(async (repo) => {
                const aiDescription = await generateProjectDescription(repo);
                return { repo, aiDescription };
            })
        );
        
        projectsData = projectsWithAI;
        
        // Display projects
        projectsGrid.innerHTML = '';
        projectsWithAI.forEach(({ repo, aiDescription }) => {
            const card = createProjectCard(repo, aiDescription);
            projectsGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = `<div class="error-message">Error loading projects: ${error.message}</div>`;
    }
}

// Create a project card element
function createProjectCard(repo, aiDescription) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const icon = getProjectIcon(repo.name);
    
    card.innerHTML = `
        <div class="project-header">
            <span class="project-icon">${icon}</span>
            <h3 class="project-name">${repo.name}</h3>
        </div>
        
        <p class="project-description">${aiDescription}</p>
        
        <div class="project-stats">
            <div class="stat">
                <span class="stat-icon">⭐</span>
                <span class="stat-value">${repo.stargazers_count}</span>
                <span>Stars</span>
            </div>
            <div class="stat">
                <span class="stat-icon">🔱</span>
                <span class="stat-value">${repo.forks_count}</span>
                <span>Forks</span>
            </div>
            <div class="stat">
                <span class="stat-icon">💻</span>
                <span class="stat-value">${repo.language || 'Multiple'}</span>
            </div>
            <div class="stat">
                <span class="stat-icon">📅</span>
                <span class="stat-value">${new Date(repo.updated_at).toLocaleDateString()}</span>
            </div>
        </div>
        
        <div class="project-actions">
            <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn btn-primary">
                <span>View on GitHub</span>
                <span>→</span>
            </a>
            <button class="btn btn-secondary" onclick="generateInsights('${repo.name}')">
                <span>🤖 Generate Insights</span>
            </button>
        </div>
    `;
    
    return card;
}

// Get icon for project
function getProjectIcon(projectName) {
    const icons = {
        'AIISTECH-Website': '🌐',
        'AIISTECH-Backend': '⚙️',
        'AIISTECH-Dashboard': '📊'
    };
    return icons[projectName] || '📦';
}

// Generate and display insights for a project
async function generateInsights(projectName) {
    const project = projectsData.find(p => p.repo.name === projectName);
    if (!project) return;
    
    const insightsContainer = document.getElementById('insights-container');
    const insightsSection = document.getElementById('insights-section');
    
    // Scroll to insights section
    insightsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Show loading state
    insightsContainer.innerHTML = `
        <div class="insight-card">
            <div class="insight-header">
                <span class="project-icon">${getProjectIcon(projectName)}</span>
                <h3 class="insight-title">${projectName} - AI Analysis</h3>
            </div>
            <div class="loading-container">
                <div class="spinner"></div>
                <p>Gemini AI is analyzing the project...</p>
            </div>
        </div>
    `;
    
    try {
        const insights = await generateProjectInsights(project.repo);
        
        // Display insights
        insightsContainer.innerHTML = `
            <div class="insight-card">
                <div class="insight-header">
                    <span class="project-icon">${getProjectIcon(projectName)}</span>
                    <h3 class="insight-title">${projectName} - AI Analysis</h3>
                </div>
                <div class="insight-content">
                    ${formatInsights(insights)}
                </div>
            </div>
        `;
    } catch (error) {
        insightsContainer.innerHTML = `
            <div class="error-message">
                Failed to generate insights: ${error.message}
                <br><br>
                Please check your Gemini API key and try again.
            </div>
        `;
    }
}

// Format insights text to HTML
function formatInsights(text) {
    // Convert markdown-style formatting to HTML
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^## (.*$)/gim, '<h3>$1</h3>')
        .replace(/^# (.*$)/gim, '<h2>$1</h2>')
        .replace(/^\d+\.\s+\*\*(.*?)\*\*:\s*(.*$)/gim, '<div class="insight-section"><h4>$1</h4><p>$2</p></div>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    // Wrap consecutive <li> in <ul>
    formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    
    return `<p>${formatted}</p>`;
}

// Send chat message
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chat-messages');
    const sendButton = document.getElementById('send-button');
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Disable input while processing
    sendButton.disabled = true;
    input.disabled = true;
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        // Create context-aware prompt
        const projectsContext = projectsData.map(p => 
            `${p.repo.name}: ${p.repo.description || 'No description'} (${p.repo.language || 'Multiple languages'})`
        ).join('\n');
        
        const prompt = `You are an AI assistant helping users understand the AIISTECH projects. Here are the projects:

${projectsContext}

Previous conversation:
${chatHistory.slice(-4).map(h => `${h.role}: ${h.content}`).join('\n')}

User: ${message}

Provide a helpful, concise response about the AIISTECH projects. Be friendly and informative. If the user asks about comparisons, technical details, or specific features, provide insightful analysis.`;
        
        const response = await callGeminiAPI(prompt, true);
        
        // Remove typing indicator
        typingDiv.remove();
        
        // Add bot response
        addChatMessage(response, 'bot');
        
        // Update chat history
        chatHistory.push({ role: 'user', content: message });
        chatHistory.push({ role: 'assistant', content: response });
        
        // Keep only last 10 messages in history
        if (chatHistory.length > 10) {
            chatHistory = chatHistory.slice(-10);
        }
        
    } catch (error) {
        typingDiv.remove();
        addChatMessage(`Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`, 'bot');
    } finally {
        sendButton.disabled = false;
        input.disabled = false;
        input.focus();
    }
}

// Add message to chat
function addChatMessage(text, type) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = type === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${text.replace(/\n/g, '<br>')}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Clear chat history
function clearChat() {
    if (!confirm('Are you sure you want to clear the chat history?')) {
        return;
    }
    
    const chatMessages = document.getElementById('chat-messages');
    chatHistory = [];
    
    // Reset to welcome message
    chatMessages.innerHTML = `
        <div class="message bot-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>Hello! I'm your AI assistant powered by Google Gemini. I can help you learn about the AIISTECH projects, compare their features, and answer technical questions. What would you like to know?</p>
            </div>
        </div>
    `;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
