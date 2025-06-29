(function() {
    'use strict';
    // Configuration
    const CHATBOT_CONFIG = {
        scriptName: 'embeddings.js',
        widgetClass: 'digital-pro-assist-chatbot',
        defaultContainer: 'body'
    };

    // Get the current script tag and extract apiKey
    function getCurrentScript() {
        const scripts = document.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            const script = scripts[i];
            if (script.src && script.src.includes(CHATBOT_CONFIG.scriptName)) {
                return script;
            }
        }
        console.log(`Digital Pro Assist: No script tag found with name ${CHATBOT_CONFIG.scriptName}.`);
        console.log("Script : "+document.currentScript);
        
        
        return document.currentScript;
    }

    function getApiKeyFromScript() {
        const currentScript = getCurrentScript();
        return currentScript ? currentScript.getAttribute('apiKey') : null;
    }

    function getContainerFromScript() {
        const currentScript = getCurrentScript();
        return currentScript ? currentScript.getAttribute('container') : null;
    }

    // Load external script dynamically
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Initialize the chatbot
    async function initializeChatbot() {
        try {
            const apiKey = getApiKeyFromScript();
            const container = getContainerFromScript();

            if (!apiKey) {
                console.error('Digital Pro Assist: API key is required. Please add apiKey="your-api-key" to the script tag.');
                return;
            }

            // Get the base URL from the current script
            const currentScript = getCurrentScript();
            const scriptSrc = currentScript ? currentScript.src : '';
            const baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);

            // Load the chatbot widget script if not already loaded
            if (!window.DigitalProAssistChatbot) {
                await loadScript(baseUrl + 'chatbot-widgets.js');
            }

            // Wait a bit for the script to fully load
            setTimeout(() => {
                if (window.DigitalProAssistChatbot) {
                    // Create container if it doesn't exist
                    let targetContainer = container;
                    if (!targetContainer) {
                        // Create a default container
                        const defaultContainer = document.createElement('div');
                        defaultContainer.id = 'digital-pro-assist-container';
                        defaultContainer.className = CHATBOT_CONFIG.widgetClass;
                        document.body.appendChild(defaultContainer);
                        targetContainer = '#digital-pro-assist-container';
                    }

                    // Initialize the chatbot widget
                    new window.DigitalProAssistChatbot(apiKey, targetContainer);
                    console.log('Digital Pro Assist Chatbot initialized successfully');
                } else {
                    console.error('Digital Pro Assist: Failed to load chatbot widget');
                }
            }, 100);

        } catch (error) {
            console.error('Digital Pro Assist: Initialization error', error);
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatbot);
    } else {
        initializeChatbot();
    }

    // Expose global API for manual initialization
    window.DigitalProAssist = {
        init: function(apiKey, container = null) {
            if (!apiKey) {
                console.error('Digital Pro Assist: API key is required');
                return;
            }

            // Load widget script if needed
            if (!window.DigitalProAssistChatbot) {
                console.error('Digital Pro Assist: Widget script not loaded');
                return;
            }

            return new window.DigitalProAssistChatbot(apiKey, container);
        },
        version: '1.0.0'
    };

})();