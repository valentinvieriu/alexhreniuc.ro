var buildMenu = function( data ) {
  console.dir(data);
  if ( data.stat === "ok" ) {
    $.each(data.collections.collection, function(index, collection) {
      if (collection.set[0].title === collection.title) {
        collection.setid = collection.set[0].id;
        console.log(collection.title,collection.setid);
      }
      
    });
    $("#collections").html($.mustache($("script#menu_tpl").text(),data));
  }
  else {
    console.log( data.code.toString() + ' ' + data.stat + ': ' + data.message, true );
  }
};
(function ($) {
  var showMenu = function( data ) {
    $("#collections").html($.mustache($("script#menu_tpl").text(),data));
  };

  var callFlickr = function( options, params, callback ) {
    var url = "http://api.flickr.com/services/rest/?";
    params = $.extend({
      format: "json",
      //jsoncallback: "buildMenu",
      // nojsoncallback: "1",
      api_key: options.api_key,
      user_id: options.user_id 
    }, params );
     
     $.ajax({
        url: url,
        data: params,
        cache: true,
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        jsonpCallback: callback,
        // success: function(data, textStatus, jqXHR) {
        //     //console.log(data, textStatus, jqXHR);
        //     callback.call(this,data);
        //     
        //   },
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
    callFlickr( defaults, { method: 'flickr.collections.getTree'}, 'buildMenu' );
    return this;
  };
}( jQuery ) );