var search_return;

$(function() {

//***Connect to SoundCloud
	SC.initialize({
		client_id: '6fd538372b02e1f99a4145ee258cda36'
		// client_secret: '487edef04ffa1df054d3551e26d80cd1'
	});

//***Searches SC API and return results
	
	$('#search-button').on('click', function(){

		var search_string = $('#search-text').val();

		SC.get('/tracks', { q: search_string, license: 'cc-by-sa' }, function(tracks) {
		 	console.log(tracks); 
		 	search_return = tracks;
		 	var $search_results = $('#search-results');
		 	$search_results.empty();
	 		for(i=0; i<tracks.length; i++){
	 			var id = tracks[i].id;
	 			$search_results.append($("<div class='each-result' id='song-"+id+"' data-index='"+i+"'><ul><li>"+tracks[i].title+"<ul><li><h5>"+tracks[i].user.username+"</h5></li></ul></li></ul></div>"));
		 	}
	 	});
	});

//***Allows user to move songs from search results to playlist.  Also calls a function to add the song to the database

	$( "#search-results" ).on("click", "div", function() {
		console.log(this);
		var index = $(this).attr('data-index');
		var sc_ident = search_return[index].id;
		var title = search_return[index].title;
		var stream_url = search_return[index].stream_url;
		var artist = search_return[index].user.username;
		var album_art;
		if(search_return[index].artwork_url === null){
		 	album_art = "no image";
		} else {
		 	album_art = search_return[index].artwork_url;
		}
		app.addNewSong(title, artist, album_art, stream_url, sc_ident);
	});

});


