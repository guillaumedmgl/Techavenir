document.getElementById('discoverBtn').addEventListener('click', () => {
    alert('Bienvenue dans le futur de l’éducation avec Techavenir !');
  });

  async function sendMessage(message) {
    addMessage('Vous: ' + message, 'user');
    input.value = '';
    addMessage('...en attente...', 'bot');
  
    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
      });
  
      const data = await response.json();
      chat.lastChild.remove();
      addMessage('Bot: ' + data.response, 'bot');
    } catch (error) {
      chat.lastChild.remove();
      addMessage('Erreur : ' + error.message, 'bot');
    }
  }

