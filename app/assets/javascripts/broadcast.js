$(document).ready(function() {
  var source = new EventSource('/rooms/events');
  var room;

  source.addEventListener(room_id + '.add_song', function (e) {
  	console.log('add song redis triggered');
  	data = JSON.parse(e.data);
  	console.log(data);
  	$("#room-" + data.room_id + " #playlist").append($('<li>').text(data.title));
  });

  source.addEventListener(room_id + '.add_user', function (e) {
  	console.log('add user redis triggered');
    data = JSON.parse(e.data);
    console.log(data);
    $("#room-" + data.room_id + " #current-users").append($('<li>').text(data.user));
  });

  source.addEventListener(room_id + '.change_song', function (e) {
  	console.log('change song redis triggered');
  	data = JSON.parse(e.data);
  	console.log(data);
  	window.playSong(data.sc_ident);
  });
});