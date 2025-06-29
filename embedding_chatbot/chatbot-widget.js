class DigitalProAssistChatbot {
    constructor(apiKey = null, containerSelector = null) {
        this.apiKey = apiKey || 'demo-key';
        this.apiEndpoint = 'https://n8n.anakanjeng.site/webhook/chatbot-digital-pro-assist';
        this.isEmbedded = !!containerSelector;
        this.container = null;
        this.isLoading = false;
        this.chatStorageKey = 'digitalProAssistChat';
        this.chatExpirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        this.init(containerSelector);
        this.setupEventListeners();
        this.loadChatHistory();
        
        // Set up periodic expiration check (every minute)
        this.expirationCheckInterval = setInterval(() => {
            this.checkChatExpiration();
        }, 60000); // 60 seconds
    }

    init(containerSelector) {
        if (this.isEmbedded) {
            this.createEmbeddedWidget(containerSelector);
        } else {
            this.setupStandalone();
        }
    }

    createEmbeddedWidget(containerSelector) {
        const targetElement = document.querySelector(containerSelector);
        if (!targetElement) {
            console.error('Digital Pro Assist: Target container not found');
            return;
        }

        // Create the widget HTML
        const widgetHTML = this.getWidgetHTML();
        targetElement.innerHTML = widgetHTML;
        
        // Add styles
        this.injectStyles();
        
        this.container = targetElement.querySelector('.chatbot-widget');
    }

    setupStandalone() {
        this.container = document.querySelector('.chatbot-container');
    }

    getWidgetHTML() {
        return `
            <div class="chatbot-widget" id="digitalProAssistWidget">
                <!-- Floating Button -->
                <div class="chatbot-toggle" id="chatbotToggle">
                    <svg class="chat-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                    <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </div>

                <!-- Chat Window -->
                <div class="chatbot-window" id="chatbotWindow">
                    <div class="chatbot-header">
                        <div class="header-content">
                            <div class="chatbot-title">Digital Pro Assist</div>
                        </div>
                        <div class="menu-button" id="menuButton">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="5" r="2"/>
                                <circle cx="12" cy="12" r="2"/>
                                <circle cx="12" cy="19" r="2"/>
                            </svg>
                        </div>
                    </div>
                    
                    <div class="contact-info-block show" id="contactInfoBlock">
                        <div class="contact-data">
                            <div class="contact-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                                <span>contact@digitalproassist.com</span>
                            </div>
                            <div class="contact-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                </svg>
                                <span>+6281234567890</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <div class="message bot">
                            <div class="message-bubble">
                                Hi! I'm your assistant, how can I help you today?
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <div class="input-wrapper">
                            <input 
                                type="text" 
                                class="chat-input" 
                                id="chatInput" 
                                placeholder="Compose your message..."
                                maxlength="500"
                            >
                            <button class="send-button" id="sendButton">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="error-message" id="errorMessage"></div>
                    </div>
                </div>
            </div>
        `;
    }

    injectStyles() {
        if (document.getElementById('digitalProAssistStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'digitalProAssistStyles';
        styles.textContent = `
            .chatbot-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .chatbot-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
                transition: all 0.3s ease;
                color: white;
                position: fixed;
                bottom: 20px;
                right: 20px;
            }

            .chatbot-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 35px rgba(0, 123, 255, 0.4);
            }

            .chatbot-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                overflow: visible;
                transform: translateY(20px) scale(0.9);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                flex-direction: column;
                
            }

            .chatbot-window.active {
                transform: translateY(0) scale(1);
                opacity: 1;
                visibility: visible;
            }

            .contact-info-block {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 0 0 15px 15px;
                max-height: 0;
                overflow: hidden;
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                border-top: 1px solid rgba(255, 255, 255, 0.3);
                top: 100%;
                left: 0;
                right: 0;
                z-index: 1000;
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            }

            .contact-data {
                margin: 15px 20px;
            }

            .contact-info-block.show {
                max-height: 120px;
                opacity: 1;
            }

            .chatbot-header {
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                color: white;
                padding: 20px;
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 20px 20px 0 0;
            }

            .header-content {
                text-align: start;
                flex: 1;
            }

            .chatbot-title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 5px;
            }

            .chatbot-subtitle {
                font-size: 12px;
                opacity: 0.9;
            }

            .menu-button {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .menu-button:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .contact-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 0;
                color: #333;
                font-size: 13px;
                transition: opacity 0.2s ease;
            }

            .contact-item:hover {
                opacity: 0.8;
            }

            .contact-item svg {
                color: #007bff;
                flex-shrink: 0;
            }

            .contact-item span {
                font-weight: 500;
                word-break: break-word;
            }

            .chat-messages {
                overflow-y: auto;
                padding: 20px;
                background: #f8f9fa;
                flex: 1;
            }

            .message {
                margin-bottom: 15px;
                animation: messageSlide 0.3s ease-out;
            }

            @keyframes messageSlide {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .message.user {
                text-align: right;
            }

            .message.user .message-bubble {
                background: #007bff;
                color: white;
                border-radius: 20px 20px 5px 20px;
            }

            .message.bot .message-bubble {
                background: white;
                color: #333;
                border-radius: 20px 20px 20px 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            .message-bubble {
                display: inline-block;
                padding: 12px 16px;
                max-width: 80%;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.4;
            }

            .typing-indicator {
                display: none;
                padding: 12px 16px;
                background: white;
                border-radius: 20px 20px 20px 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                max-width: 80px;
            }

            .typing-dots {
                display: flex;
                gap: 4px;
            }

            .typing-dot {
                width: 8px;
                height: 8px;
                background: #999;
                border-radius: 50%;
                animation: typingDots 1.4s infinite ease-in-out;
            }

            .typing-dot:nth-child(1) { animation-delay: -0.32s; }
            .typing-dot:nth-child(2) { animation-delay: -0.16s; }

            @keyframes typingDots {
                0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .chat-input-container {
                padding: 20px;
                background: white;
                border-top: 1px solid #e9ecef;
                position: relative;
                radius: 0 0 20px 20px;
                border-radius: 0 0 20px 20px;
                z-index: 1001;
            }

            .input-wrapper {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .chat-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #e9ecef;
                border-radius: 25px;
                outline: none;
                font-size: 14px;
                transition: border-color 0.3s ease;
            }

            .chat-input:focus {
                border-color: #007bff;
            }

            .send-button {
                width: 45px;
                height: 45px;
                background: #007bff;
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .send-button:hover {
                background: #0056b3;
                transform: scale(1.05);
            }

            .send-button:disabled {
                background: #ccc;
                cursor: not-allowed;
                transform: scale(1);
            }

            .error-message {
                color: #dc3545;
                font-size: 12px;
                margin-top: 5px;
                text-align: center;
            }

            @media (max-width: 480px) {
                .chatbot-window {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 140px);
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    setupEventListeners() {
        // For embedded widget
        if (this.isEmbedded) {
            document.addEventListener('click', (e) => {
                if (e.target.closest('#chatbotToggle')) {
                    this.toggleChat();
                }
                if (e.target.closest('#sendButton')) {
                    this.sendMessage();
                }
                if (e.target.closest('#menuButton')) {
                    this.toggleContactInfo();
                }
                // Close contact info when clicking outside
                if (!e.target.closest('#menuButton') && !e.target.closest('#contactInfoBlock')) {
                    this.hideContactInfo();
                }
            });

            document.addEventListener('keypress', (e) => {
                if (e.target.closest('#chatInput') && e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        } else {
            // For standalone version
            const sendButton = document.getElementById('sendButton');
            const chatInput = document.getElementById('chatInput');
            const menuButton = document.getElementById('menuButton');

            if (sendButton) {
                sendButton.addEventListener('click', () => this.sendMessage());
            }

            if (chatInput) {
                chatInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    }
                });
            }

            if (menuButton) {
                menuButton.addEventListener('click', () => this.toggleContactInfo());
            }

            // Close contact info when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#menuButton') && !e.target.closest('#contactInfoBlock')) {
                    this.hideContactInfo();
                }
            });
        }
    }

    toggleChat() {
        const chatWindow = document.getElementById('chatbotWindow');
        const toggle = document.getElementById('chatbotToggle');
        const chatIcon = toggle.querySelector('.chat-icon');
        const closeIcon = toggle.querySelector('.close-icon');

        if (chatWindow.classList.contains('active')) {
            chatWindow.classList.remove('active');
            chatIcon.style.display = 'block';
            closeIcon.style.display = 'none';
            // Hide contact info when closing chat
            this.hideContactInfo();
        } else {
            // Check for expired chat history before opening
            this.checkChatExpiration();
            chatWindow.classList.add('active');
            chatIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        }
    }

    toggleContactInfo() {
        const contactBlock = document.getElementById('contactInfoBlock');
        if (contactBlock) {
            contactBlock.classList.toggle('show');
        }
    }

    hideContactInfo() {
        const contactBlock = document.getElementById('contactInfoBlock');
        if (contactBlock) {
            contactBlock.classList.remove('show');
        }
    }

    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message || this.isLoading) return;

        // Clear any previous errors
        this.clearError();

        // Add user message to chat
        this.addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            this.isLoading = true;
            this.setButtonState(true);

            const response = await this.callAPI(message);
            this.hideTypingIndicator();
            // Parse response to handle HTML line breaks
            const formattedResponse = response.replace(/<\/br>/g, '\n');
            console.log(formattedResponse);
            
            this.addMessage(formattedResponse, 'bot');

        } catch (error) {
            this.hideTypingIndicator();
            this.showError('Sorry, I encountered an error. Please try again.');
            setTimeout(() => {
                this.clearError();
            }, 5000);
            console.error('Chatbot API Error:', error);
        } finally {
            this.isLoading = false;
            this.setButtonState(false);
        }
    }

    async callAPI(message) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                apiKey: this.apiKey,
                message: message
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.reply || data.message || data[0].reply || 'Thank you for your message!';
    }

    addMessage(text, sender) {
        this.addMessageToDOM(text, sender, true);
    }

    addMessageToDOM(text, sender, saveToStorage = true) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        // Convert \n to <br> tags for HTML display
        bubbleDiv.innerHTML = text.replace(/\n/g, '<br>');
        
        messageDiv.appendChild(bubbleDiv);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom with smooth animation
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save to localStorage if required
        if (saveToStorage) {
            this.saveChatHistory();
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        
        // Remove any existing typing indicator
        const existingIndicator = messagesContainer.querySelector('.typing-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.innerHTML = `
            <div class="typing-indicator" style="display: block;">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingIndicator = messagesContainer.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.closest('.message').remove();
        }
    }

    setButtonState(disabled) {
        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.disabled = disabled;
        }
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError() {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    // Clear all chat messages manually
    clearAllMessages() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="message bot">
                    <div class="message-bubble">
                        Hi! I'm your assistant, how can I help you today?
                    </div>
                </div>
            `;
        }
        this.clearChatHistory();
    }

    // Cleanup method to clear intervals and localStorage
    destroy() {
        if (this.expirationCheckInterval) {
            clearInterval(this.expirationCheckInterval);
        }
        this.clearChatHistory();
    }

    loadChatHistory() {
        try {
            const chatData = localStorage.getItem(this.chatStorageKey);
            if (!chatData) return;

            const { messages, timestamp } = JSON.parse(chatData);
            const now = Date.now();

            // Check if chat history has expired (5 minutes)
            if (now - timestamp > this.chatExpirationTime) {
                this.clearChatHistory();
                return;
            }

            // Load messages into chat
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer && messages.length > 0) {
                // Clear default welcome message
                messagesContainer.innerHTML = '';
                
                // Add saved messages
                messages.forEach(msg => {
                    this.addMessageToDOM(msg.text, msg.sender, false); // false = don't save to storage
                });
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            this.clearChatHistory();
        }
    }

    saveChatHistory() {
        try {
            const messagesContainer = document.getElementById('chatMessages');
            if (!messagesContainer) return;

            const messages = [];
            const messageElements = messagesContainer.querySelectorAll('.message');
            
            messageElements.forEach(messageEl => {
                // Skip messages that contain typing indicators
                if (messageEl.querySelector('.typing-indicator')) return;
                
                const bubble = messageEl.querySelector('.message-bubble');
                if (bubble) {
                    const text = bubble.textContent;
                    const sender = messageEl.classList.contains('user') ? 'user' : 'bot';
                    messages.push({ text, sender });
                }
            });

            const chatData = {
                messages,
                timestamp: Date.now()
            };

            localStorage.setItem(this.chatStorageKey, JSON.stringify(chatData));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    clearChatHistory() {
        try {
            localStorage.removeItem(this.chatStorageKey);
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    }

    checkChatExpiration() {
        try {
            const chatData = localStorage.getItem(this.chatStorageKey);
            if (!chatData) return;

            const { timestamp } = JSON.parse(chatData);
            const now = Date.now();

            if (now - timestamp > this.chatExpirationTime) {
                this.clearChatHistory();
                // Clear messages from DOM and show welcome message
                const messagesContainer = document.getElementById('chatMessages');
                if (messagesContainer) {
                    messagesContainer.innerHTML = `
                        <div class="message bot">
                            <div class="message-bubble">
                                Hi! I'm your assistant, how can I help you today?
                            </div>
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('Error checking chat expiration:', error);
        }
    }
}

// Initialize for standalone version
if (document.querySelector('.chatbot-container')) {
    document.addEventListener('DOMContentLoaded', () => {
        new DigitalProAssistChatbot();
    });
}

// Export for embedding
window.DigitalProAssistChatbot = DigitalProAssistChatbot;
