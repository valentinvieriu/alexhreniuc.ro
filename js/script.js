if (!window.console) console = {};
console.log = console.log || function(){};
console.warn = console.warn || function(){};
console.error = console.error || function(){};
console.info = console.info || function(){}; 




jQuery(document).ready(function($) {

  window.app = {
  	config : {
  		flickr_API: "bab05ea17002c5f9f458a145df6ff286",
  		user_ID: "66052014@N08",
  		fb_caption: "Hreniuc Alexandru",
  		fb_description: "http://www.facebook.com/fotohreniuc | www.alexhreniuc.ro | tel: 0040744586226",
  		active_set: "72157627503614426",
  		menu_template: $("script#menu_tpl").html(),
  		menu_output: "div#collections",
  		gallery_template: $("script#gallery_tpl").html(),
  		gallery_output: "div#gallery"
  	},
  	what_size: function () {
   		var height = $(window).height();
   		if ( height<860 ) {
   			$(app.config.gallery_output).addClass('medium');
   			return "medium";
   		} else{
   			return "big";
   		}
  	},
  	output_menu: function(data) {
      // console.log("Collection response:",data);
  		$(app.config.menu_output).html(Mustache.to_html(app.config.menu_template,data));
  	},
  	output_set: function(data) {
  		var result = [],
  			picture_id = window.location.hash.slice(1);
  			if ( picture_id.split('_')[1] ) {

  				$.each(data.data, function(index, picture) {
  					if ( picture.id == picture_id ) {
  						result.unshift(picture);
  					}
  					else {
  						result.push(picture);
  					}  
  				});
  				data.data = result;	
  			}
      // console.log("Set response:",data);
          $(app.config.gallery_output).html(Mustache.to_html(app.config.gallery_template,data));
  	},
  	change_set: function(setID) {
  		app.flickr.set(setID, function(data) {
  			app.output_set(data);
        	});
  	},
  	url_check: function() {
  		//the hash will be: #setID_photoID
  		app.config.active_set = window.location.hash.slice(1).split('_')[0] || app.config.active_set;
  		app.change_set(app.config.active_set);
  	},
  	init: function(){
  		app.flickr.collection(app.config.user_ID, app.output_menu);
  		app.url_check();
  	}
  };


  app.flickr = new Flickr(app.config.flickr_API);
  app.flickr.options = {
  	imageSize : app.what_size(),
  	max:50
  };
    app.init();

    $.extend(true, FB, {
      general_callback: function(response) {
        console.info(response);
      }
    });
    $(app.config.menu_output+' a').live('click', function(event) {
      $(app.config.gallery_output).empty();
      app.change_set(this.hash.slice(1));
      $(app.config.menu_output+' a').removeClass('active');
      $(this).addClass("active");
    });


  $(".image a").live('click', function(event) {
    var obj = {
	    app_id:"266780870023235",	
	    method: 'feed',
	    link: $(location).attr("origin")+$(this).attr("href"),
	    picture: $(this).attr("thumb"),
	    name: $(this).attr("title"),
	    caption: app.config.fb_caption,
	    description: app.config.fb_description    	
    };
    FB.ui(obj, FB.general_callback); 
  });
  
  $("#aboutme,#contact").live('click', function(e){
      $(this)
        .next("div")
        .slideToggle(300);
      e.preventDefault();
  });

  $("#JqPostForm").submit(function(e) {
    e.preventDefault();

    $.post("send.php", $("#JqPostForm").serialize(), function(data) {
      $("#JqPostForm").hide().after("<p><strong>Mesaj trimis ! </strong></p>");
    });
  });
 
});
