//Chat AI Ollama
const chatButton = document.getElementById('chat-button');
const chatWindow = document.getElementById('chat-window');
const closeChatBtn = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

//Bật/Tắt cửa sổ chat
function toggleChat () {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')){
        chatInput.focus();
    }
}

chatButton.addEventListener('click', toggleChat);
closeChatBtn.addEventListener('click', toggleChat);

//Thêm tin nhắn chat
function appendMessage (text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

//Xử lý nút submit chat
chatForm.addEventListener ('submit', async (e) => {
    e.preventDefault();
    const prompt = chatInput.value.trim();
    if (!prompt) return;

    //Thêm tin nhắn từ user
    appendMessage(prompt, 'user');
    chatInput.value = '';
    chatInput.disabled = true;

    //Hiển thị hiệu ứng loading...
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot';
    loadingDiv.textContent = '...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();

            //Loại bỏ hiệu ứng loading...
            chatMessages.removeChild(loadingDiv);

            if (response.ok) {
                const botText = data.response || data.content || (data.message && data.message.content) || JSON.stringify(data);
                appendMessage(botText, 'bot');
            } else {
                appendMessage('Error: ' + (data.message || 'Something went wrong'), 'error');
            }
        } catch (error) {
            chatMessages.removeChild(loadingDiv);
            appendMessage('Network error. Please try again.', 'error');
            console.error(error);
        } finally {
            chatInput.disabled = false;
            chatInput.focus();
    }
});
