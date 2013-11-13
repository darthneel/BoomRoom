
// $(function(){


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

  

  // });


// $(document).ready(function() {

//   var $container = $('#masonry-container');

//   $container.masonry({
//     columnWidth: 200,
//     itemSelector: '.test',
//     isFitWidth: true,
//     isAnimated: !Modernizr.csstransitions
//   }).imagesLoaded(function() {
//     $(this).masonry('reload');
//   });

// });
  
    


    // $('#add-image').on("click", function(){
    //   var $image = $( boxMaker.makeBoxes() );
    //   $container.prepend( $boxes ).masonry( 'reload' );
    // });


    // <div class="test">
    //   <p>HELLO WORLD!</p>
    // </div>