const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

function addMessageToChat(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (sender === "Usuario") {
        messageDiv.classList.add("user-message");
    } else {
        messageDiv.classList.add("bot-message");

        const avatarDiv = document.createElement("div");
        avatarDiv.classList.add("bot-avatar");

        const avatarImg = document.createElement("img");
        avatarImg.src = "img/UPSA-BOT.jpg"; 
        avatarImg.alt = "Bot Avatar"; 
        avatarImg.classList.add("avatar-img");

        avatarDiv.appendChild(avatarImg);
        messageDiv.appendChild(avatarDiv);
    }

    const messageText = document.createElement("p");
    messageText.textContent = message;
    messageDiv.appendChild(messageText);

    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendButton.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) {
        addMessageToChat("Usuario", message);

        fetch("http://localhost:5000/send-chat-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error en el servidor: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.response) {
                    addMessageToChat("Bot", data.response);
                } else {
                    addMessageToChat("Bot", "Respuesta inválida del servidor.");
                }
            })
            .catch((error) => {
                console.error("Error en la comunicación con el backend:", error);
                addMessageToChat("Bot", "No se pudo conectar con el servidor.");
            });

        userInput.value = "";
    }
});

userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendButton.click();
    }
});
