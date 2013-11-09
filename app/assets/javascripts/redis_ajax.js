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
		});
	},

	// Function to send an AJAX request
	addNewSong: function() {
		$.ajax({
			type: 'POST',
			url: '/rooms/add_song',
			dataType: 'json',
			data: {}
		}).done(function(data) {

		});
	}
}