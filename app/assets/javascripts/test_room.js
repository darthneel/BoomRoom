var search_return;

$(function() {

	SC.initialize({
		client_id: '6fd538372b02e1f99a4145ee258cda36'
		// client_secret: '487edef04ffa1df054d3551e26d80cd1'
	});

	
	$('#search-button').on('click', function(){

		var search_string = $('#search-text').val();

		SC.get('/tracks', { q: search_string, license: 'cc-by-sa' }, function(tracks) {
		 	console.log(tracks); 
		 	search_return = tracks;
		 	var $search_results = $('#search-results');
		 	$search_results.empty();
	 		for(i=0; i<tracks.length; i++){
	 			var id = tracks[i].id;
	 			$search_results.append($("<div class='each-result' id='song-"+id+"'><ul><li>"+tracks[i].title+"<ul><li><h5>"+tracks[i].user.username+"</h5></li></ul></li></ul></div>"));
		 	}
	 	});
	});


});



// ($("<div class='each-result'><ul><li>"+tracks[i].title+"</li><li>"+tracks</ul></div>"));