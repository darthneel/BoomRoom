var app = app || {}

var app = {
	// Function to send an AJAX request to return the current song play time
	// after a new user is added to the room.

	// TODO: Need to add get_time method to Rooms controller and have it
	// 			 render json for the soundcloud stream url
	afterAddNewUser: function(room_id) {
		$.ajax({
			url: '/rooms/get_time',
			type: 'POST',
			dataType: 'json',
			data: {room_id: room_id}
		}).done(function(data) {
			console.log(data);
			// Need to set the media player to the data.elapsed that is passed back

		});
	},

	// Function to send an AJAX request to add new song to the database
	// and include it in the current room song list

	// TODO: Need to add add_song method to Rooms controller and have it
	// 			 create the song and append it to Room.songs. Find out how 
  //       we'll be accessing song object data to pass back
	addNewSong: function() {
		$.ajax({
			type: 'POST',
			url: '/rooms/add_song',
			dataType: 'json',
			data: {song: {artist: , title: , sc_link: , album_art: }}
		});
	}
}