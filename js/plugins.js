(function ($) {
  function showMenu( data ) {
    console.dir( data );
  };

  function callFlickr( options, params, callback ) {
    var url = "http://api.flickr.com/services/rest/?";
    params = $.extend({
      format: "json",
      jsoncallback: "?",
      api_key: options.api_key,
      user_id: options.user_id 
    }, params );
    
    $.each( params, function( key, value ) {
      url += "&" + key + "=" + value;
    });
    
    $.getJSON(url, function(data) {
      if ( data.stat === "ok" ) {
        console.dir( data );
        callback.call(data);
      }
      else {
        console.log( data.code.toString() + ' ' + data.stat + ': ' + data.message, true );
      }
    });
  };
  
  $.fn.flickrMenu = function (options) {
    var defaults = {
      user_id : "68069990@N00",
      api_key: "bab05ea17002c5f9f458a145df6ff286",
      exclude: "",
      oneChild: "true"  
    };
    
    if (options) {
      $.extend (defaults , options);
    }
    
    callFlickr( defaults, { method: 'flickr.collections.getTree'}, function ( data ) {
      console.dir( "data" );
    });
    
    return this;
  }
})(jQuery);