const attachBtn = document.getElementById("attach-button");
const sendBtn = document.getElementById("send-button");
const messageInput = document.getElementById("input-box");
const chatBox = document.querySelector(".messages");
const uploadsBox = document.getElementById("uploads");

let selectedFile = null;
let fileElement = null;

attachBtn.addEventListener("click", () => {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            selectedFile = fileInput.files[0];
            
            fileElement = document.createElement("div");
            fileElement.classList.add("upload-item");
            fileElement.textContent = `📎 ${selectedFile.name}`;
            
            let removeBtn = document.createElement("button");
            removeBtn.innerHTML = "&times;";
            removeBtn.classList.add("remove");
            removeBtn.style.marginLeft = "10px";
            removeBtn.addEventListener("click", () => {
                selectedFile = null;
                fileElement.remove();
                fileElement = null;
            });
            
            fileElement.appendChild(removeBtn);
            // fileElement.style.margin("0 10px");
            uploadsBox.appendChild(fileElement);
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
    
    if (!message && !selectedFile) {
        alert("Type a message or attach a file!");
        return;
    }

    let messageElement = document.createElement("div");
    messageElement.classList.add("message", "sent");
    
    if (message) {
        messageElement.textContent = message;
    }

    if (selectedFile) {
        let fileLink = document.createElement("a");
        fileLink.href = URL.createObjectURL(selectedFile);
        fileLink.textContent = `📎 ${selectedFile.name}`;
        fileLink.style.display = "block";
        fileLink.style.color = "white";
        fileLink.download = selectedFile.name;

        messageElement.appendChild(fileLink);
        selectedFile = null;
        if (fileElement) {
            fileElement.remove();
            fileElement = null;
        }
    }

    chatBox.appendChild(messageElement);
    messageInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

function botMsg() {
    let botMessage = "This is a bot response. This will be generated through a trained AI. Anything you say can and will be used against you in the court of law. Whatever";
    let botElement = document.createElement("div");
    botElement.classList.add("message", "received");
    botElement.textContent = botMessage;
    chatBox.appendChild(botElement);
    chatBox.scrollTop = chatBox.scrollHeight;
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