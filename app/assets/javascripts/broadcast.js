function prepareBroadcast() {
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
	  	like = 0;
	  	dislike = 0;
	  	like_count = 0;
	  	dislike_count = 0;
	  	$('#room-' + room_id + " #like .num").text(like);
	  	$('#room-' + room_id + " #dislike .num").text(dislike);
	  	window.playSong(data.sc_ident);
	  	if(isMuted) {
	  		song.toggleMute();
	  	}
	  	$("#room-" + room_id + " #current-track").text(data.title);
	  });

	  source.addEventListener("like_or_dislike_"+room_id, function (e) {
	  	console.log('voted redis triggered');
	  	data = JSON.parse(e.data);
	  	console.log(data);
	  	if(data.vote === 'like') {
	  		like = data.likes;
	  		$('#room-' + room_id + " #like .num").text(like);
	  	} else if(data.vote === 'dislike') {
	  		dislike = data.dislikes;
	  		$('#room-' + room_id + " #dislike .num").text(dislike);

	  		if(dislike >= Math.ceil(data.users / 2)) {
	  			app.changeCurrentSong(data.sc_ident);
	  		}
	  	}
	  });
	}
}