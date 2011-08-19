(function ($) {
  var showMenu = function( data ) {
    $("#collections").html($.mustache($("script#menu_tpl").text(),data));
  };
  var buildMenu = function( data ) {
    if ( data.stat === "ok" ) {
      showMenu( data );
    }
    else {
      console.log( data.code.toString() + ' ' + data.stat + ': ' + data.message, true );
    }
  };
  var callFlickr = function( options, params, callback ) {
    var url = "http://api.flickr.com/services/rest/?";
    params = $.extend({
      format: "json",
      //jsoncallback: "buildMenu",
      nojsoncallback: "1",
      api_key: options.api_key,
      user_id: options.user_id 
    }, params );
     
     $.ajax({
        url: url,
        data: params,
        cache: true,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
            //console.log(data, textStatus, jqXHR);
            callback.call(this,data);
            
          },
        error:   function(data, textStatus, jqXHR) {
              console.error(data, textStatus, jqXHR);
            }
     });
     //$.getJSON(url,params);
    // $.each( params, function( key, value ) {
    //       url += "&" + key + "=" + value;
    //     });
    
    // $.getJSON(url, function(data) {
    //   if ( data.stat === "ok" ) {
    //     console.dir( data );
    //     //callback.call(data);
    //   }
    //   else {
    //     console.log( data.code.toString() + ' ' + data.stat + ': ' + data.message, true );
    //   }
    // });
  };
  
  $.fn.addFlickrCollections = function (options) {
    var defaults = {
      user_id : "68069990@N00",
      api_key: "bab05ea17002c5f9f458a145df6ff286",
      exclude: "",
      oneChild: "true"  
      };
    
    if (options) {
      $.extend (defaults , options);
    }
    callFlickr( defaults, { method: 'flickr.collections.getTree'}, buildMenu );
    return this;
  };
}( jQuery ) );