
window.scrollTo(document.body.offsetWidth * 0.2, 0);


$(function(){

  function animateAlbumArt(){
    var $container = $('#album-art-container');
    
    var msnry = $container.data('masonry');

    $container.masonry({
      itemSelector: '.cover-art',
      columnWidth: 125,
      isAnimated: true
    });
  
      var $image = $( "<div id='art-"+sc_ident+"' class='cover-art'><img src="+album_art+">" );
      $container.prepend( $image ).masonry( 'reload' );
    }

});




  // var window_width = $(window).width();
  // $("#main-container").css("width", (window_width + (window_width * 0.2)));