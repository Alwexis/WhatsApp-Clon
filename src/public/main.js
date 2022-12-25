const _socket = io();

let profile_picture = './assets/no pfp.png';
let username = 'x-potato33';

//? Setting up
document.getElementById('profile-picture').setAttribute('src', profile_picture);
document.getElementById('username').innerHTML = username;

function changeUsername() {
    console.log('changed')
    username = 'independens-dei';
    document.getElementById('username').innerHTML = username;
}

function keyPress(e) {
    if (e.keyCode === 13) {
        sendMessage();
    }
}

function sendMessage() {
    const message = document.getElementById('message-input').value;
    if (message.length === 0) return;
    const message_element_SELF = `<div class='message own-message'>
                                    <p>${message}</p>
                                </div>`;
    const message_element_OTHER = `<div class='message other-message'>
                                    <p>${message}</p>
                                </div>`;
    document.getElementById('chat').innerHTML += message_element_SELF;

    _socket.emit('chat:message', { username: username, message: message_element_OTHER }); 
    document.getElementById('message-input').value = '';
}

_socket.on('chat:message_recieved', (data) => {
    if (data.username === username) return;
    document.getElementById('chat').innerHTML += data.message;
})