const _socket = io();
const _profile_pictures = {
    1: './assets/Profile Pictures/Bagon.jpg',
    2: './assets/Profile Pictures/Bowser.jpg',
    3: './assets/Profile Pictures/Bulbasaur.jpg',
    4: './assets/Profile Pictures/Ceruledge.jpg',
    5: './assets/Profile Pictures/Charmander.jpg',
    6: './assets/Profile Pictures/Cyndaquil.jpg',
    7: './assets/Profile Pictures/Deedlit.jpg',
    8: './assets/Profile Pictures/Dreepy.jpg',
    9: './assets/Profile Pictures/Link.jpg',
    10: './assets/Profile Pictures/Link 2.jpg',
    11: './assets/Profile Pictures/Lucario.jpg',
    12: './assets/Profile Pictures/Magikarp.jpg',
    13: './assets/Profile Pictures/Mario.jpg',
    14: './assets/Profile Pictures/Mewtwo.jpg',
    15: './assets/Profile Pictures/Mimikyu.jpg',
    16: './assets/Profile Pictures/Morgana.jpg',
    17: './assets/Profile Pictures/Oshawott.jpg',
    18: './assets/Profile Pictures/Samus.jpg',
    19: './assets/Profile Pictures/Scizor.jpg',
    20: './assets/Profile Pictures/Slowpoke.jpg',
    21: './assets/Profile Pictures/Squirtle.jpg',
    22: './assets/Profile Pictures/Tetra.jpg',
    23: './assets/Profile Pictures/Thyplosion.jpg',
    24: './assets/Profile Pictures/Umbreon.jpg',
    25: './assets/Profile Pictures/Wario.jpg',
    26: './assets/Profile Pictures/Yoshi.jpg',
    27: './assets/Profile Pictures/Zelda.jpg',
}

let profile_picture = './assets/no pfp.png';
let username = 'x-potato' + Math.floor(Math.random() * 100);
let actual_room = 'global';

//? Setting up
document.getElementById('profile-picture').setAttribute('src', profile_picture);
document.getElementById('username').innerHTML = username;
document.getElementById('room-name').innerText = actual_room;

function changeUsername() {
    console.log('changed')
    username = 'independens-dei';
    document.getElementById('username').innerHTML = username;
}

function changePfp() {
    profile_picture = _profile_pictures[Math.floor(Math.random() * 27) + 1];
    document.getElementById('profile-picture').setAttribute('src', profile_picture);
}

function changeRoom() {
    const new_room = document.getElementById('join-create-room-input').value;
    document.getElementById('join-create-room-input').value = '';
    actual_room = new_room;
    document.getElementById('room-name').innerText = new_room;
    document.getElementById('chat').innerHTML = '';
    if (new_room.length === 0) return;
    _socket.emit('rooms:change',
        { username: username,
        actual_room: actual_room,
        new_room: new_room }
    );
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
                                    <img src='${profile_picture}' alt='Profile Picture'>
                                    <div>
                                        <span class='message-owner'>${username}</span>
                                        <p>${message}</p>
                                    </div>
                                </div>`;
    document.getElementById('chat').innerHTML += message_element_SELF;

    _socket.emit('chat:message', { username: username, message: message_element_OTHER, room: actual_room }); 
    document.getElementById('message-input').value = '';
}

_socket.emit('chat:connected', { username: username });

_socket.on('chat:message_recieved', (data) => {
    if (data.username === username || data.room !== actual_room) return;
    document.getElementById('chat').innerHTML += data.message;
})

_socket.on('rooms:joined', (data) => {
    if (data.room !== actual_room) return;
    document.getElementById('chat').innerHTML += `<div class='join-message'>
                                                    <p>${data.username} joined the room</p>
                                                </div>`;
});