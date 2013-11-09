
$(function() {

	SC.initialize({
		client_id: '6fd538372b02e1f99a4145ee258cda36'
		// client_secret: '487edef04ffa1df054d3551e26d80cd1'
	});

	
	$('#search-button').on('click', function(){
		var search_string = $('#search-text').val();
		SC.get('/tracks', { q: search_string, license: 'cc-by-sa' }, function(tracks) {
	 	console.log(tracks); 
		});
	});

});