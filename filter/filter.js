steal.plugins('funcit/record').then(function(){
	var cbs = [];
	
	window.Funcit || (window.Funcit = {});
	/**
	 * Takes a list of filter functions that get called with the event ...
	 * They are expected to callback with the event or events to pass to the next filter function
	 * @param {Object} feed
	 */
	Funcit.filter = function(feed){
		var filters = $.makeArray(arguments),
			feed = filters.shift();
		feed(function(ev){
			// we got an event from the feed ...
			
			// call filter with event
			
			// when 
			
			var filterNum = 0,
			eventNum = 0,
			current = [ev],
			passNext = function(events){
				if(events === false){
					current.splice(eventNum, 1);
				} else if(events){
					if( !$.isArray(events) ){
						events = [events];
					}
					// add the new events to be proccessed
					var len = events.length;
					events.unshift(eventNum, 1); //only remove the current one
					current.splice.apply(current, events );
					
					eventNum = len + eventNum;
				} else {
					eventNum++;
				}
				
				
				if(eventNum >= current.length){ // if we have processed all events for this filter ...
					//call the next filter
					++filterNum;
					// reset the eventNum
					eventNum = 0;
				}
				
				var filter = filters[filterNum];
				if(filter && current[eventNum]){
					
					var res = filter(current[eventNum], passNext);
					if(res === false){
						current.splice(eventNum, 1);
						passNext();
					} else if(res !== true){
						if( !$.isArray(res) ){
							res = [res || current[eventNum]];
						}
						passNext(res)
					}
				}
				
			};
			
			var filter = filters[filterNum];
			if(filter){
				var res = filter(ev, passNext);
				if(res === false){
					passNext(false);
				} else if(res !== true){
					if( !$.isArray(res) ){
						res = [res || ev];
					}
					passNext(res)
				}
			}
		})
	}

	
	// finds similar text in an element you typed in
	
	Funcit.filters = {};
}).then('//funcit/filters/count',
		'//funcit/filters/dblclick',
        '//funcit/filters/lastmodified',
		'//funcit/filters/similartext',
		'//funcit/filters/visible',function(){
	
	var fs = Funcit.filters;
	
	/**
	 * Listens on an element for events (produced by recorder).  You can pass in optional filters.
	 * @param {Object} finalCb
	 */
	$.fn.funcit_filter = function(finalCb){
		var args = $.makeArray(arguments);
		// if we only get one arg, assume it's the default filters ..
		if(args.length == 0){
			args = [function(ev){
				console.log(ev)
			}];
		}
		
		if(args.length == 1){
			args.unshift(fs.visible,
				fs.dblclick,
				fs.similarText,
				fs.count,
				fs.lastmodified)
		}
		
		var el = this;
		
		args.unshift(function(cb){
			el.funcit_record(cb)
		})
		
		Funcit.filter.apply(Funcit, args);
	}
	
});


// this should make waits based on type -> click

