const attachBtn = document.getElementById("attach-button");
const sendBtn = document.getElementById("send-button");
const messageInput = document.getElementById("input-box"); 
const chatBox = document.querySelector(".messages"); 

let selectedFile = null;

attachBtn.addEventListener("click", () => {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            selectedFile = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                const fileData = event.target.result;
                localStorage.setItem("uploadedFile", fileData);
                alert("File saved to web storage!");
            };

            reader.readAsDataURL(selectedFile);
        }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
});

function sendMessage() {
    let message = messageInput.value.trim();
    let savedFile = localStorage.getItem("uploadedFile");

    if (message === "" && !savedFile) {
        alert("Type a message or attach a file!");
        return;
    }

    let messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add("sent");

    if (message) {
        messageElement.textContent = message;
    }

    if (savedFile) {
        let fileLink = document.createElement("a");
        fileLink.href = savedFile;
        fileLink.textContent = "📎 Attached File";
        fileLink.style.display = "block";

        messageElement.appendChild(fileLink);
        localStorage.removeItem("uploadedFile");
    }

    chatBox.appendChild(messageElement);
    messageInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", () => {
    sendMessage();
    setTimeout(botMsg, 1000);
});

messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
        setTimeout(botMsg, 1000);
    }
});


function botMsg() {
    let botMessage = "This is a bot message, and its content will be generated through AI.";
    let msgElement = document.createElement("div");
    msgElement.classList.add("message");
    msgElement.classList.add("received");
    msgElement.textContent = botMessage;

    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}