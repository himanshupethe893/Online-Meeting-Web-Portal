document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const chatButton = document.querySelector('.control-btn.chat');
    const chatBox = document.querySelector('.chatbox');
    const closeChatButton = document.querySelector('.close-chat');
    const sendChatButton = document.getElementById('sendChat');
    const chatInput = document.getElementById('chatMessage');
    const chatMessages = document.querySelector('.chat-messages');
    
    var video1= document.getElementById("LocalVideoPlayer");
    video1.style.width="300px";
    video1.style.height="150px";
    
    
    let screenStream;
    // const participants = ['Alice', 'Bob', 'Charlie', 'David']; // Example participant list

    // Chatbox visibility toggle
    chatButton.addEventListener('click', () => {
        chatBox.classList.toggle('hidden');
    });
    

    closeChatButton.addEventListener('click', () => {
        chatBox.classList.add('hidden');
    });

    const appendMessage = (sender, message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    sendChatButton.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            appendMessage('You', message);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendChatButton.click();
        }
    });

    

    
});
