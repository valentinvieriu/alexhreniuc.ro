/**
 * @preserve Galleria Flickr Plugin 2011-08-01
 * http://galleria.aino.se
 *
 * Copyright 2011, Aino
 * Licensed under the MIT license.
 */

/*global jQuery, Galleria, window */

(function($) {


/**

    @class
    @constructor

    @example var flickr = new Flickr('API_KEY');

    @author http://aino.se

    @requires jQuery

    @param {String} [api_key] Flickr API key to be used, defaults to the Galleria key

    @returns Instance
*/

Flickr = function( api_key ) {

    this.api_key = api_key || 'bab05ea17002c5f9f458a145df6ff286';

    this.options = {
        max: 30,                       // photos to return
        imageSize: 'medium',           // photo size ( thumb,small,medium,big,original )
        thumbSize: 'thumb',            // thumbnail size ( thumb,small,medium,big,original )
        sort: 'interestingness-desc',  // sort option ( date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, interestingness-asc, relevance )
        description: false,            // set this to true to get description as caption
        complete: function(){},        // callback to be called inside the Galleria.prototype.load
        backlink: false                // set this to true if you want to pass a link back to the original image
    };
};

Flickr.prototype = {

    // bring back the constructor reference

    constructor: Flickr,

    /**
        Get the collection from an user

        @param {String|Number} user_id The used id of the user
        @param {Function} [callback] The callback to be called when the data is ready

        @returns Instance
    */

    collection: function( user_id, callback ) {
        return this._call({
            user_id: user_id,
            method: 'flickr.collections.getTree'
        }, callback);
    },
    /**
        Search for anything at Flickr

        @param {String} phrase The string to search for
        @param {Function} [callback] The callback to be called when the data is ready

        @returns Instance
    */

    search: function( phrase, callback ) {
        return this._find({
            text: phrase
        }, callback );
    },

    /**
        Search for anything at Flickr by tag

        @param {String} tag The tag(s) to search for
        @param {Function} [callback] The callback to be called when the data is ready

        @returns Instance
    */

    tags: function( tag, callback ) {
        return this._find({
            tags: tag
        }, callback);
    },

    /**
        Get a user's public photos

        @param {String} username The username as shown in the URL to fetch
        @param {Function} [callback] The callback to be called when the data is ready

        @returns Instance
    */

    user: function( userid, callback ) {
        return this._find({
                user_id: userid,
                method: 'flickr.people.getPublicPhotos'
            }, callback);
    },

    /**
        Get photos from a photoset by ID

        @param {String|Number} photoset_id The photoset id to fetch
        @param {Function} [callback] The callback to be called when the data is ready

        @returns Instance
    */

    set: function( photoset_id, callback ) {
        return this._find({
            photoset_id: photoset_id,
            method: 'flickr.photosets.getPhotos'
        }, callback);
    },

    /**
        Get photos from a gallery by ID

        @param {String|Number} gallery_id The gallery id to fetch
        @param {Function} [callback] The callback to be called when the data is ready

        @returns Instance
    */

    gallery: function( gallery_id, callback ) {
        return this._find({
            gallery_id: gallery_id,
            method: 'flickr.galleries.getPhotos'
        }, callback);
    },

    /**
        Search groups and fetch photos from the first group found
        Useful if you know the exact name of a group and want to show the groups photos.

        @param {String} group The group name to search for
        @param {Function} [callback] The callback to be called when the data is ready

        @returns Instance
    */

    groupsearch: function( group, callback ) {
        return this._call({
            text: group,
            method: 'flickr.groups.search'
        }, function( data ) {
            this.group( data.groups.group[0].nsid, callback );
        });
    },

    /**
        Get photos from a group by ID

        @param {String} group_id The group id to fetch
        @param {Function} [callback] The callback to be called when the data is ready

        @returns Instance
    */

    group: function ( group_id, callback ) {
        return this._find({
            group_id: group_id,
            method: 'flickr.groups.pools.getPhotos'
        }, callback );
    },

    /**
        Set flickr options

        @param {Object} options The options object to blend

        @returns Instance
    */

    setOptions: function( options ) {
        $.extend(this.options, options);
        return this;
    },


    // call Flickr and raise errors

    _call: function( params, callback ) {

        var url = 'http://api.flickr.com/services/rest/?';

        var scope = this;

        params = $.extend({
            format : 'json',
            jsoncallback : '?',
            api_key: this.api_key
        }, params );

        $.each(params, function( key, value ) {
            url += '&' + key + '=' + value;
        });

        $.getJSON(url, function(data) {
            if ( data.stat === 'ok' ) {
                callback.call(scope, data);
            } else {
                console.log( data.code.toString() + ' ' + data.stat + ': ' + data.message, true );
            }
        });
        return scope;
    },


    // "hidden" way of getting a big image (~1024) from flickr

    _getBig: function( photo ) {

        if ( photo.url_l ) {
            return photo.url_l;
        } else if ( parseInt( photo.width_o, 10 ) > 1280 ) {

            return 'http://farm'+photo.farm + '.static.flickr.com/'+photo.server +
                '/' + photo.id + '_' + photo.secret + '_b.jpg';
        }

        return photo.url_o || photo.url_z || photo.url_m;

    },


    // get image size by option name

    _getSize: function( photo, size ) {

        var img;

        switch(size) {

            case 'thumb':
                img = photo.url_t;
                break;

            case 'small':
                img = photo.url_s;
                break;

            case 'big':
                img = this._getBig( photo );
                break;

            case 'original':
                img = photo.url_o ? photo.url_o : this._getBig( photo );
                break;

            case 'normal':
                img = photo.url_z || photo.url_m;
                break;
            default:
                img = photo.url_z || photo.url_m;
                break;
        }
        return img;
    },


    // ask flickr for photos, parse the result and call the callback with the galleria-ready data array

    _find: function( params, callback ) {

        params = $.extend({
            method: 'flickr.photos.search',
            extras: 'url_t,url_m,url_o,url_s,url_l,url_z,description',
            sort: this.options.sort
        }, params );

        return this._call( params, function(data) {

            var gallery = [],
                photos = data.photos ? data.photos.photo : data.photoset.photo,
                photosetid = data.photoset ? data.photoset.id : 'none',
                len = Math.min( this.options.max, photos.length ),
                photo,
                i,
                mgallery = {};

            for ( i=0; i<len; i++ ) {

                photo = photos[i];

                gallery.push({
                    thumb: this._getSize( photo, this.options.thumbSize ),
                    image: this._getSize( photo, this.options.imageSize ),
                    big: this._getBig( photo ),
                    title: photo.title,
                    id: photosetid+'_'+photo.id,
                    description: this.options.description && photo.description ? photo.description._content : '',
                    link: this.options.backlink ? 'http://flickr.com/photos/' + photo.owner + '/' + photo.id : ''
                });
            }
            mgallery.data = gallery;
            callback.call( this, mgallery );
        });
    }
};


}( jQuery ) );