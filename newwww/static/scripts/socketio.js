
document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    let room;


    socket.on('message', data => {
        const p= document.createElement('p');
        const span_username = document.createElement('span');
        const span_timestamp = document.createElement('span')
        const br = document.createElement('br');
        span_username.innerHTML=data.username;
        span_timestamp.innerHTML = data.time_stamp;
        p.innerHTML=span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML;
        document.querySelector('#display-message-section').append(p);

    });

    document.querySelector('#send_message').onclick=()=>{
        socket.send({'msg':document.querySelector('#user_message').value,'username':username, 'room' : room});
    }

    document.querySelectorAll('.select-room').forEach(p => {
        p.onclick = () => {
            let newRoom = p.innerHTML;
            if(newRoom == room){
                msg = `you are already in ${room} room.`
                printSyMsg(msg);
            }else{
                leaveRoom(room);
                joinRoom(newRoom);
                room = newRoom;
            }
        }
    });

    function leaveRoom(room){
        socket.emit('leave', {'username' : username, 'room' : room});
    }

    function joinRoom(room){
        socket.emit('join', {'username' : username, 'room' : room});
        document.querySelector('#display-message-section').innerHTML = ''
    }

    function printSyMsg(msg){
        const p = document.createElement('p');
        p.inert = msg;
        document.querySelector('#display-message-section').append(p);
    }
});