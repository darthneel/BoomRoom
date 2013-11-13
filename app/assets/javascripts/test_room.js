var search_return;
var song;
var room_id;

$(function() {
//***Connect to SoundCloud
	SC.initialize({
		client_id: '6fd538372b02e1f99a4145ee258cda36'
	});

	searchButtonClick();
	searchResultClick();

//** Media buttons 
	$('#pause').on('click', function() {
		song.togglePause();
		console.log(song);
	});
	$('#mute').on('click', function() {
		song.toggleMute();
		console.log(song);
	});

	// TODO: Talk to one of instructors for better way to do this.
	if((document.URL).match(/\/rooms\/.+/)) {
		getRoomId();
		console.log(room_id);
		app.newUser(room_id);
	}
});

// *** Plays a song based on the soundcloud id that is being passed in
function playSong(sc_ident, position) {
	if(typeof(position)==='undefined') position = 0;
	SC.stream('/tracks/' + sc_ident, {position: position, onfinish: function() {
		app.changeCurrentSong(sc_ident);
	}}, function(sound) {
		if(song){
			song.unload();
		}
		song = sound;
		console.log(sound);
		song.setVolume(100);
		song.play();
	});
}

function getRoomId() {
	room_id_unparsed = $(".room").attr('id');
	room_id = parseInt(room_id_unparsed.replace("room-",""));
}

function searchButtonClick() {
	//***Searches SC API and return results
	$('#search-button').on('click', function() {
		var search_string = $('#search-text').val();
		SC.get('/tracks', { q: search_string, limit: 25, order: 'hotness', streamable: true }, function(tracks) {
			console.log(tracks); 
			search_return = tracks;
			var $search_results = $('#search-results');
			$search_results.empty();
			for(i=0; i<tracks.length; i++) {
				var id = tracks[i].id;
				$search_results.append($("<div class='each-result' id='song-"+id+"' data-index='"+i+"'><ul><li>"+tracks[i].title+"<ul><li><h4>"+tracks[i].user.username+"</h4></li></ul></li></ul></div>"));
			}
		});
	});
}

function searchResultClick() {
	//***Allows user to move songs from search results to playlist.  Also calls a function to add the song to the database
	$( "#search-results" ).on("click", "div", function() {
		console.log(this);
		var index = $(this).attr('data-index');
		var sc_ident = search_return[index].id;
		var title = search_return[index].title;
		var stream_url = search_return[index].stream_url;
		var artist = search_return[index].user.username;
		var album_art;
		var genre;
		if(search_return[index].artwork_url === null) {
			album_art = "no image";
		} else {
			album_art = search_return[index].artwork_url;
		}
		if(search_return[index].genre === null) {
			genre = "no genre"; 
		} else {
			genre = search_return[index].genre;
		}
		app.addNewSong(artist, title, stream_url, album_art, sc_ident, genre);
		if(typeof(song) === 'undefined'){
			app.changeCurrentSong(sc_ident);
			$('#current-track').text(title);
		}
	});
}

window.onbeforeunload = function(e) {
	if((document.URL).match(/\/rooms\/.+/)) {
		var id = parseInt(room_id);
		app.removeUser(id);
	  return null;
	}
};


