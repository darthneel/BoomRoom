$(function() {
	if((document.URL).match(/\/rooms\/.+/)) {
	  getRoomId();

	  var source = new EventSource('/rooms/events?room_id=' + room_id);
	  var room;

	  source.addEventListener('add_song_'+room_id, function (e) {
	  	console.log('add song redis triggered');
	  	data = JSON.parse(e.data);
	  	console.log(data);
	  	$("#room-" + room_id + " #playlist").append($('<li >').text(data.title));
	  });

	  source.addEventListener('add_user_'+room_id, function (e) {
	  	console.log('add user redis triggered');
	    data = JSON.parse(e.data);
	    console.log(data);
	    $("#room-" + room_id + " #current-users").append($('<li>').attr('id', data.id).text(data.user));
	  });

	  source.addEventListener('remove_user_'+room_id, function (e) {
	  	console.log('remove user redis triggered');
	  	data = JSON.parse(e.data);
	  	console.log(data);
	  	$("#room-" + room_id + " #current-users #" + data.id).remove();
	  });

	  source.addEventListener('change_song_'+room_id, function (e) {
	  	console.log('change song redis triggered');
	  	data = JSON.parse(e.data);
	  	console.log(data);
	  	window.playSong(data.sc_ident);
	  	$("#room-" + room_id + " #current-track").text(data.title);
	  });
	}
});