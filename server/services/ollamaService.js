    async function callOllama(messages) {
    const apiUrl = `${process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'}/api/chat`;

    const payload = {
        model: process.env.AI_MODEL || 'gpt-oss:120b-cloud',
        messages,
        stream: false,
        options: {
            temperature: 0.1,
            top_p: 0.9
        }
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    return data.message ? data.message.content : data.response;
}

module.exports = { callOllama };