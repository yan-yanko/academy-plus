class UI {
    constructor() {
        this.chatContainer = document.getElementById('chat-container');
        this.messageInput = document.getElementById('message-input');
        this.toast = document.getElementById('toast');
        
        this.handleOptionClick = null;
        this.initiateFileUpload = null;
    }
    
    setHandleOptionClick(callback) {
        this.handleOptionClick = callback;
    }
    
    setInitiateFileUpload(callback) {
        this.initiateFileUpload = callback;
    }
    
    addMessage(content, options = null, isUser = false, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (isLoading) {
            messageContent.innerHTML = this.createLoader();
        } else {
            messageContent.innerHTML = content;
            
            if (options) {
                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'options';
                
                options.forEach(option => {
                    const button = document.createElement('button');
                    button.className = 'option-button';
                    button.textContent = option.text;
                    button.onclick = () => this.handleOptionClick(option.action, option.text);
                    optionsDiv.appendChild(button);
                });
                
                messageContent.appendChild(optionsDiv);
            }
        }
        
        messageDiv.appendChild(messageContent);
        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        return messageDiv;
    }
    
    addUserMessage(content) {
        return this.addMessage(content, null, true);
    }
    
    addBotMessage(content, options = null, isUser = false, isLoading = false) {
        return this.addMessage(content, options, isUser, isLoading);
    }
    
    updateLoadingMessage(messageDiv, content, options = null) {
        const messageContent = messageDiv.querySelector('.message-content');
        messageContent.innerHTML = content;
        
        if (options) {
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options';
            
            options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = option.text;
                button.onclick = () => this.handleOptionClick(option.action, option.text);
                optionsDiv.appendChild(button);
            });
            
            messageContent.appendChild(optionsDiv);
        }
        
        this.scrollToBottom();
    }
    
    createLoader() {
        return `
            <div class="loader">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
    }
    
    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    clearInput() {
        this.messageInput.value = '';
    }
    
    showToast(message, duration = 3000) {
        this.toast.textContent = message;
        this.toast.style.display = 'block';
        
        setTimeout(() => {
            this.toast.style.display = 'none';
        }, duration);
    }
}

export default new UI(); 