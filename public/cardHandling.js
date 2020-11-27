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

$(function () {
    var socket = io();
    $('.card').on('click', function() {
        $('#user').append($(this).detach());
        socket.emit('card drafted', $(this).attr('id'));
    });
    socket.on('card drafted', function(id) {
        $('#' + id).remove();
    });
});