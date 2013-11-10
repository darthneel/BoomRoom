$(document).ready(function() {
  var source = new EventSource('/rooms/events');
  var room;

  // source.addEventListener('rooms.add_user', function (e) {
  //   data = JSON.parse(e.data);
  //   console.log(data);
  //   $("#" + data.room_id + " #user-list").append($('<li>').text(data.username));
  // });

  source.addEventListener('rooms.add_song', function (e) {
  	data = JSON.parse(e.data);
  	console.log(data);
  	$("#" + data.room_id + "#playlist").append($('<li>').text(data.title));
  });
});