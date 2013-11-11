$(function() {
	if((document.URL).match(/\/rooms\/.+/)) {
	  getRoomId();

	  var source = new EventSource('/rooms/events?room_id=' + room_id);
	  var room;

	  source.addEventListener('add_song_'+room_id, function (e) {
	  	console.log('add song redis triggered');
	  	data = JSON.parse(e.data);
	  	console.log(data);
	  	$("#room-" + room_id + " #playlist").append($('<li>').text(data.title));
	  });

	  source.addEventListener('add_user_'+room_id, function (e) {
	  	console.log('add user redis triggered');
	    data = JSON.parse(e.data);
	    console.log(data);
	    $("#room-" + room_id + " #current-users").append($('<li>').text(data.user));
	  });

	  // source.addEventListener(room_id + '.change_song', function (e) {
	  // 	console.log('change song redis triggered');
	  // 	data = JSON.parse(e.data);
	  // 	console.log(data);
	  // 	window.playSong(data.sc_ident);
	  // });
	}
});