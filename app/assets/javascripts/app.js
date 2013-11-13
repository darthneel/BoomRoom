var app = app || {};

var app = {
	// Function to send an AJAX request to return the current song play time
	// after a new user is added to the room.

	// TODO: Need to add get_time method to Rooms controller and have it
	// 			 render json for the soundcloud stream url
	newUser: function(room_id) {
		$.ajax({
			url: '/rooms/get_time',
			type: 'POST',
			dataType: 'json',
			async: false,
			data: {room_id: room_id}
		}).done(function(data) {
			console.log(data.elapsed);
			if(data.sc_ident) {
				$("#room-" + room_id + " #current-track").text(data.title);
				window.playSong(data.sc_ident, data.elapsed);
			}
		});
	},

	removeUser: function(id) {
		$.ajax({
			url: '/rooms/remove_user',
			async: false,
			type: 'POST',
			dataType: 'json',
			data: {room_id: id}
		});
	},

	// Function to send an AJAX request to add new song to the database
	// and include it in the current room song list

	// TODO: Need to add add_song method to Rooms controller and have it
	// 			 create the song and append it to Room.songs. Find out how 
  //       we'll be accessing song object data to pass back
	addNewSong: function(artist, title, stream_url, album_art, sc_ident, genre) {
		$.ajax({
			type: 'POST',
			url: '/rooms/add_song',
			async: false,
			dataType: 'json',
			// TODO: Find out how to get the song info into this param
			data: {song: {artist: artist , title: title , stream_url: stream_url, album_art: album_art, sc_ident: sc_ident, genre: genre}}
		});
	},

	// Function to send an AJAX request to change the current song in the room
	// and to return the next song to the room?
	changeCurrentSong: function(sc_ident) {
		$.ajax({
			type: 'POST',
			url: '/rooms/change_song',
			dataType: 'json',
			async: false,
			// TODO: Find out how to get the id of current song into this param
			data: {current_sc_ident: sc_ident}
		});
	},

	// Function to send like or dislike to all users
	likeOrDislike: function(val) {
		$.ajax({
			type: 'POST',
			url: '/rooms/like_or_dislike',
			dataType: 'json',
			async: false,
			data: {vote: val}
		});
	}

};

