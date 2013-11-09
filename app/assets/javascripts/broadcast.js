$(document).ready(function() {
  var source = new EventSource('/rooms/events');
  var room;

  source.addEventListener('rooms.add_user', function (e) {
    data = JSON.parse(e.data);
    console.log(data);
    $("#user-list-" + data.room_id).append($('<li>').text(data.username));
  });
});