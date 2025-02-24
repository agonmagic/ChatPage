const themeToggleBtn = document.getElementById("themechange");
const body = document.body;
const logo = document.getElementById("logo");
const attachBtn = document.getElementById("attach-button");
const sendBtn = document.getElementById("send-button");
const messageInput = document.getElementById("input-box");
const chatBox = document.querySelector(".messages");
const uploadsBox = document.getElementById("uploads");
let selectedFiles = [];

document.addEventListener("DOMContentLoaded", () => {
    themeToggleBtn.addEventListener("click", () => {
        body.classList.toggle("light-mode");

        themeToggleBtn.src = body.classList.contains("light-mode")
            ? "./images/dark-mode.png"
            : "./images/light-mode.png";

        if (logo) {
            logo.src = body.classList.contains("light-mode")
                ? "./images/icon_placeholder_green.png"
                : "./images/icon_placeholder_white.png";
        }
    });
});

attachBtn.addEventListener("click", () => {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    fileInput.multiple = true;

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length) {
            Array.from(fileInput.files).forEach(file => {
                selectedFiles.push(file);
                let fileElement = document.createElement("div");
                fileElement.classList.add("upload-item");
                fileElement.innerHTML = `📎 ${file.name} <button class="remove">&times;</button>`;

                uploadsBox.appendChild(fileElement);
            });
        }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
});

uploadsBox.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove")) {
        const fileName = e.target.parentElement.textContent.trim().replace("📎 ", "").replace("×", "");
        selectedFiles = selectedFiles.filter(f => f.name !== fileName);
        e.target.parentElement.remove();
    }
});

sendBtn.addEventListener("click", handleSend);
messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !sendBtn.disabled) {
        event.preventDefault();
        handleSend();
    }
});

messageInput.addEventListener("input", adjustTextareaHeight);

function adjustTextareaHeight() {
    messageInput.style.height = "40px";
    const scrollHeight = messageInput.scrollHeight;
    messageInput.style.height = `${Math.min(scrollHeight, 250)}px`;
}

async function handleSend() {
    if (!messageInput.value.trim() && selectedFiles.length === 0) {
        alert("Type a message or attach a file!");
        return;
    }

    sendBtn.disabled = true;

    sendMessage();
    await new Promise(resolve => setTimeout(resolve, 100));
    loadingMessage();
    await new Promise(resolve => setTimeout(resolve, 2000));
    botMsg();

    sendBtn.disabled = false;
}

function sendMessage() {
    let messageElement = document.createElement("div");
    messageElement.classList.add("message", "sent");

    if (messageInput.value.trim()) {
        messageElement.textContent = messageInput.value.trim();
    }

    selectedFiles.forEach(file => {
        let fileLink = document.createElement("a");
        fileLink.classList.add("message-file");
        fileLink.href = URL.createObjectURL(file);
        fileLink.textContent = `📎 ${file.name}`;
        fileLink.download = file.name;
        messageElement.appendChild(fileLink);
    });

    selectedFiles = [];
    uploadsBox.innerHTML = "";
    chatBox.appendChild(messageElement);
    messageInput.value = "";
    messageInput.style.height = "40px";
    chatBox.scrollTop = chatBox.scrollHeight;
}

function botMsg() {
    let botElement = document.createElement("div");
    botElement.classList.add("message", "received");
    botElement.textContent = "This is a bot response. This will be generated through a trained AI. Anything you say can or will be used against you in a court of law. Watchout!!!";
    chatBox.appendChild(botElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function loadingMessage() {
    let msgElement = document.createElement("div");
    msgElement.classList.add("blank", "received");
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        msgElement.remove();
    }, 2000);
}