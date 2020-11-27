$(function () {
    var socket = io();
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
    var socket = io();
    $(document).on('click', '.card', function() {
        $('#user').append($(this).detach());
        socket.emit('card drafted', $(this).attr('id'));
    });
    socket.on('card drafted', function(id) {
        $('#' + id).remove();
    });
});

//handles adding cards to DOM
$(function () {
    var socket = io();
    socket.on('gen cards', function(cards) {
        console.log(cards.length);
        for(let key in cards) {
            $('#public').append(cards[key]);
        }
    });
});
