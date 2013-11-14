
$(function(){

  function animateAlbumArt(sc_ident, album_art){
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

  var $search_text = $('#search-text');

  $search_text.on('keyup', function(e) {
    if(e.keyCode === 13) {
      search_text = $search_text.val();
        console.log(search_text);
      }
    });

});
  // var window_width = $(window).width();
  // $("#main-container").css("width", (window_width + (window_width * 0.2)));


