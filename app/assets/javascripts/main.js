// Global variables ----------------------------------------------------------------------
var song;
var room_id;
var like = 0;
var dislike = 0;
var like_count = 0; // Seems redundant, but being used to stop user from voting more than once per song
var dislike_count = 0; // Seems redundant, but being used to stop user from voting more than once per song
var isMuted = false; // Carries mute result from one song to the next
var volume = 50; // Default volume

// Document ready function ---------------------------------------------------------------
$(function() {
	// Connect to SoundCloud
	SC.initialize({
		client_id: '6fd538372b02e1f99a4145ee258cda36' // TODO: Make this an environment variable?
	});

	// Prepare event listeners and redis broadcasts
	prepareBroadcast(); // found at broadcast.js
	searchButtonClick(); // found below
	searchResultClick(); // found below
	voteClick(); // found below
	messageClick(); // found below
	volumeSlider(); // found below
	logoSearch(); // found below

	// Trigger certain events on room page load
	if((document.URL).match(/\/rooms\/.+/)) {
		getRoomId(); // change global variable
		console.log(room_id); 
		app.newUser(room_id); // add new user to room list
	}
});

// Window unload function ----------------------------------------------------------------
window.onbeforeunload = function(e) {
	if((document.URL).match(/\/rooms\/.+/)) {
		if(song) {
			song.unload(); // Backup. In case of error where song object carries out of room, unload it
			song = undefined;
		}
		isMuted = false;
		var id = parseInt(room_id);
		app.removeUser(id);
	  return null;
	}
};

// Plays a song based on SoundCloud ID and current song position --------------------------
function playSong(sc_ident, position) {
	if(typeof(position)==='undefined') position = 0; // If no position is given, defaults to 0
	SC.stream('/tracks/' + sc_ident, {position: position, onfinish: function() {
		app.changeCurrentSong(sc_ident); // Change song when previous one ends
	}}, function(sound) {
		if(song){
			song.unload(); // Safety. Unload song before new song is loaded
		}
		song = sound; // Assign song to global variable
		console.log(sound);
		song.setVolume(volume);
		song.play();
	});
}

// Assigns global variable to current room id --------------------------------------------
function getRoomId() {
	room_id_unparsed = $(".room").attr('id');
	room_id = parseInt(room_id_unparsed.replace("room-",""));
}

// Slides out search menu ----------------------------------------------------------------
function logoSearch() {
  $('#logo-search').on('click', function(){
    if ($("#main-container").hasClass('out-left')) {
      $('#main-container').animate({
        left: '0'
      }, 500);
      $('#main-container').toggleClass('out-left');
    } else {
      $('#main-container').animate({
        left: '-20%'
      }, 500);
      $('#main-container').toggleClass('out-left');
    }
  });
}

// Returns search results from SoundCloud on click ---------------------------------------
function searchButtonClick() {
	$('#search-button').on('click', function() {
		var search_string = $('#search-text').val();
		$search_text.val('');
		if(search_string !== '') {
			searchSC(search_string);
		}
	});

	var $search_text = $('#search-text');
  $search_text.on('keyup', function(e) {
    if(e.keyCode === 13) {
      search_string = $search_text.val();
      $search_text.val('');
      if(search_string !== '') {
				searchSC(search_string);
			}
    }
  });
}

function searchSC(search_string) {
	SC.get('/tracks', { q: search_string, limit: 25, order: 'hotness', streamable: true }, function(tracks) {
		console.log(tracks); 
		search_return = tracks; // Returns all search results from SoundCloud
		var $search_results = $('#search-results');
		$search_results.empty();
		for(i = 0; i < tracks.length; i++) {
			if(tracks[i].streamable === true) { // Checks to see if the track can be streamed
				var id = tracks[i].id;
				$search_results.append($("<div class='each-result' id='song-"+id+"' data-index='"+i+"'><div id='results-title'>"+tracks[i].title+"</div></div>"));
			}
		}
	});
}

function eachResultHover() {
	$('.each-result').on("hover", "div", function(){
		
	})
}

// Puts a song from the search results to room playlist on click -------------------------
function searchResultClick() {
	$( "#search-results" ).on("click", "div", function() {
		console.log(this);
		var index = $(this).attr('data-index');
		var sc_ident = search_return[index].id;
		var title = search_return[index].title;
		var stream_url = search_return[index].stream_url;
		var artist = search_return[index].user.username;
		var album_art;
		var genre;
		if(search_return[index].artwork_url === null || search_return[index].artwork_url === '') {
			album_art = "http://epilepsyu.com/wp-content/uploads/2013/10/brain_music-150x150.jpeg"; // Default album art
		} else {
			album_art = search_return[index].artwork_url;
		}
		if(search_return[index].genre === null || search_return[index].genre === '') {
			genre = "Not Given"; // Default genre
		} else {
			genre = search_return[index].genre;
		}
		app.addNewSong(artist, title, stream_url, album_art, sc_ident, genre);
		if(typeof(song) === 'undefined'){
			app.changeCurrentSong(sc_ident); // Plays if no song is in the room yet
			$('#current-track').text(title); // Changes currently playing text
		}
	});
}

// Submits like or dislike to currently played song --------------------------------------
function voteClick() {
	$('#like').on('click', function(e) {
		console.log('clicked');
		if(like_count === 0) { // If you haven't voted before, you can vote.
			app.likeOrDislike('like');
			like_count++;
		}
	});
	$('#dislike').on('click', function(e) {
		console.log('clicked');
		if(dislike_count === 0) { // If you haven't voted before, you can vote.
			app.likeOrDislike('dislike');
			dislike_count++;
		}
	});
}

// Submits message to chatroom when clicked or enter -------------------------------------
function messageClick() {
	$message_input = $('#message-input')

	$('#send').on('click', function(e) {
		e.preventDefault();
		message = $message_input.val(); // Gets the message content from input field
		$message_input.val('');
		if(message !== '') {
			app.sendMessage(message); // Sends message to be published
		}
	});

	$message_input.on('keyup', function(e) {
		if(e.keyCode === 13) { // Listens for user hitting enter while in input-field
			message = $message_input.val();
			$message_input.val('');
			if(message !== '') {
				app.sendMessage(message);
			}
		}
	});
}

// Mute button ---------------------------------------------------------------------------
function muteButton() {
	$('#mute').on('click', function() {
		song.toggleMute();
		isMuted = !isMuted; // Each time you click, toggles between true and false
		console.log(song);
	});
}

// jQuery UI slider for volume -----------------------------------------------------------
function volumeSlider() {
	$('#slider').slider({
		min: 0, // Ranges from 0-100 (SoundCloud volume range)
		max: 100, 
		value: 50,	// Default volume is 50
		slide: function(event, ui) {}
	});

	$('#slider').on('slide', function() {
		volume = $('#slider').slider('value');
		$('#vol').text(volume);
		if(song) {		
			song.setVolume(volume); // Changes song volume based on slider value
		}
	});

}