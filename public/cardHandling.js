let nextPick = false;
const socket = io();

$(function () {
    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
});

//handles cards being clicked on and taken out of the draft pool
$(function () {
    $(document).on('click', '.card', function() {
        if(nextPick && $(this).parent('#public').length)  {
            $('#user').css("background", "ivory");
            $('#user').append($(this).detach());
            socket.emit('card drafted', $(this).attr('id'));
            nextPick = false;
        }
    });
    socket.on('card drafted', function(id) {
        $('#' + id).remove();
    });
});

//handles adding cards to DOM
$(function () {
    socket.on('gen cards', function(cards) {
        console.log(cards.length);
        for(let key in cards) {
            $('#public').append(cards[key]);
        }
        socket.emit('register drafter');
    });
});

//handles becoming the active drafter
$(function () {
    socket.on('next pick', function() {
        nextPick = true;
        $('#user').css("background", "cyan");
    });
});
