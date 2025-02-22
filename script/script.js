const themeToggleBtn = document.getElementById('themechange');
const body = document.body;
const logo = document.getElementById('logo');
const chatbox = document.querySelector('.chatbox');
const attachBtn = document.getElementById("attach-button");
const sendBtn = document.getElementById("send-button");
const messageInput = document.getElementById("input-box");
const chatBox = document.querySelector(".messages");
const uploadsBox = document.getElementById("uploads");
const down = document.getElementById("down");

let selectedFiles = [];

function updateRemoveButtonColors() {
    const removeButtons = document.querySelectorAll(".remove");
    if (body.classList.contains('light-mode')) {
        removeButtons.forEach(button => {
            button.style.color = "black"; 
        });
    } else {
        removeButtons.forEach(button => {
            button.style.color = "white"; 
        });
    }
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const messages = document.querySelectorAll(".message");

    if (body.classList.contains('light-mode')) {
        body.style.backgroundColor = "#ffffff";
        body.style.color = "white";
        chatbox.style.backgroundColor = "#AAB99A";
        down.style.backgroundColor = "#AAB99A";
        messageInput.style.backgroundColor = "#AAB99A";
        messageInput.style.color = "white";
        uploadsBox.style.backgroundColor = "#AAB99A";

        attachBtn.style.backgroundColor = "#727d73";
        attachBtn.style.color = "white";
        sendBtn.style.backgroundColor = "#727d73";
        sendBtn.style.color = "white";

        messages.forEach(msg => {
            msg.style.backgroundColor = "#727d73";
            msg.style.color = "white";
        });

        themeToggleBtn.src = './images/dark-mode.png';
        if (logo) logo.src = './images/icon_placeholder_green.png';
    } else {
        body.style.backgroundColor = "#303030";
        body.style.color = "white";
        chatbox.style.backgroundColor = "#212121";
        down.style.backgroundColor = "#212121";
        messageInput.style.backgroundColor = "#212121";
        messageInput.style.color = "white";
        uploadsBox.style.backgroundColor = "#212121";

        attachBtn.style.backgroundColor = "#303030";
        attachBtn.style.color = "white";
        sendBtn.style.backgroundColor = "#303030";
        sendBtn.style.color = "white";

        messages.forEach(msg => {
            msg.style.backgroundColor = "#303030";
            msg.style.color = "white";
        });

        themeToggleBtn.src = './images/light-mode.png';
        if (logo) logo.src = './images/icon_placeholder_white.png';
    }

    updateRemoveButtonColors();
});

attachBtn.addEventListener("click", () => {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    fileInput.multiple = true;

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            Array.from(fileInput.files).forEach(file => {
                selectedFiles.push(file);
                
                let fileElement = document.createElement("div");
                fileElement.classList.add("upload-item");
                fileElement.style.display = "inline-block";
                fileElement.style.margin = "0 5px";
                fileElement.textContent = `📎 ${file.name}`;
                
                let removeBtn = document.createElement("button");
                removeBtn.innerHTML = "&times;";
                removeBtn.classList.add("remove");
                removeBtn.style.marginLeft = "10px";
                removeBtn.addEventListener("click", () => {
                    selectedFiles = selectedFiles.filter(f => f !== file);
                    fileElement.remove();
                });

                if (body.classList.contains('light-mode')) {
                    removeBtn.style.color = "black";
                } else {
                    removeBtn.style.color = "white";
                }
                
                fileElement.appendChild(removeBtn);
                uploadsBox.appendChild(fileElement);
            });
        }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
});

sendBtn.addEventListener("click", async () => {
    handleSend();
});

messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && !event.shiftKey && !sendBtn.disabled) {
        event.preventDefault();
        handleSend();
    }
});

messageInput.addEventListener("input", adjustTextareaHeight);

function adjustTextareaHeight() {
    const lineHeight = 24;
    const minHeight = 40;
    const maxHeight = 250;

    const numberOfLines = Math.floor(messageInput.scrollHeight / lineHeight);

    if (numberOfLines >= 3) {
        messageInput.style.height = `${minHeight + lineHeight * numberOfLines}px`;
    } else {
        messageInput.style.height = `${minHeight}px`;
    }

    if (parseInt(messageInput.style.height) > maxHeight) {
        messageInput.style.height = `${maxHeight}px`;
    }

    if (messageInput.value.trim() === "") {
        messageInput.style.height = `${minHeight}px`;
    }
}

async function handleSend() {
    sendBtn.disabled = true;
    sendMessage();
    await new Promise(resolve => setTimeout(resolve, 100));
    loadingMessage();
    await new Promise(resolve => setTimeout(resolve, 2000));
    botMsg();
    sendBtn.disabled = false;
}

function sendMessage() {
    let message = messageInput.value.trim();
    
    if (!message && selectedFiles.length === 0) {
        alert("Type a message or attach a file!");
        return;
    }

    let messageElement = document.createElement("div");
    messageElement.classList.add("message", "sent");
    
    if (message) {
        messageElement.textContent = message;
    }

    selectedFiles.forEach(file => {
        let fileLink = document.createElement("a");
        fileLink.href = URL.createObjectURL(file);
        fileLink.textContent = `📎 ${file.name}`;
        fileLink.style.display = "block";
        fileLink.style.color = "white";
        fileLink.download = file.name;

        messageElement.appendChild(fileLink);
    });

    selectedFiles = [];
    uploadsBox.innerHTML = "";

    chatBox.appendChild(messageElement);
    messageInput.value = "";
    messageInput.style.height = "40px";
    chatBox.scrollTop = chatBox.scrollHeight;

    updateMessageStyles();
}

function botMsg() {
    let botMessage = "This is a bot response. This will be generated through a trained AI. Anything you say can and will be used against you in the court of law. Whatever";
    let botElement = document.createElement("div");
    botElement.classList.add("message", "received");
    botElement.textContent = botMessage;
    chatBox.appendChild(botElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    updateMessageStyles();
}

function loadingMessage() {
    let loading = "";
    let msgElement = document.createElement("div");
    msgElement.classList.add("blank");
    msgElement.classList.add("received");
    msgElement.textContent = loading;

    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(() => {
        msgElement.classList.add("hide");
    }, 2000);
}

function updateMessageStyles() {
    const messages = document.querySelectorAll(".message");

    if (body.classList.contains('light-mode')) {
        messages.forEach(msg => {
            msg.style.backgroundColor = "#727d73";
            msg.style.color = "black";
        });
    } else {
        messages.forEach(msg => {
            msg.style.backgroundColor = "#303030";
            msg.style.color = "white";
        });
    }
}