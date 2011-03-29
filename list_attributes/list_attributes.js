steal.plugins('jquery').then(function($){

/*!
 * listAttributes jQuery Plugin v1.1.0
 *
 * Copyright 2010, Michael Riddle
 * Licensed under the MIT
 * http://jquery.org/license
 *
 * Date: Sun Mar 28 05:49:39 2010 -0900
 */

$.fn.listAttributes = function(prefix) {
	var list = [];
	$(this).each(function() {
		var attributes = [];
		steal.dev.log(this.attributes)
		for(var key in this.attributes) {
			if(!isNaN(key)) {
				if(!prefix || this.attributes[key].name.substr(0,prefix.length) == prefix) {
					attributes.push(this.attributes[key].name);
				}
			}
		}
		list.push(attributes);
	});
	return (list.length > 1 ? list : list[0]);
}
$.fn.mapAttributes = function(prefix) {
	var maps = [];
	$(this).each(function() {
		var map = {};
		for(var key in this.attributes) {
			if(!isNaN(key)) {
				if(!prefix || this.attributes[key].name.substr(0,prefix.length) == prefix) {
					map[this.attributes[key].name] = this.attributes[key].value;
				}
			}
		}
		maps.push(map);
	});
	return (maps.length > 1 ? maps : maps[0]);
}

});