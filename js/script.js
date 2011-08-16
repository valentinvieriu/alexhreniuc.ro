var flickr = new Flickr('bab05ea17002c5f9f458a145df6ff286');
flickr.collection('68069990@N00', function(data) {
    // console.dir(data);
    $("#collections").html($.mustache($("script#menu_tpl").text(),data));
});

flickr.setOptions({
    max: 100,
    thumbSize: 'small',
    sort: 'interestingness-desc',
    imageSize: 'big'
}).set('517452', function(data) {
    // console.log(data);
    // $("#gallery").html($.mustache($("script#gallery_tpl").text(),data));
});