steal('funcit/record').then(function(){
	var cbs = [];
	
	window.Funcit || (window.Funcit = {});
	/**
	 * Takes a list of filter callbavcks (filterCB)
	 *  that get called with the event ...
	 * They are expected to callback with the event or 
	 * events to pass to the next filter function.
	 * 
	 * The goal is to have the right filters that pick the right events ...
	 * 
	 * Here's how a filter callback should work:
	 * 
	 *     filterCB(event, passNext(false|Array|undefined) ) -> true|false|undefined|Array
	 * 
	 * A filterCB is called and can decide to:
	 * 
	 *  - Mutate an event
	 *  - Prevent it from being passed to the next filterCB
	 *  - Add more events
	 *  - Delay calling the next filterCB
	 *  - Here's how you do each:
	 * 
	 * ### Mutate an event
	 * 
	 *     function(ev){
	 *       ev.someProperty = 'foo'
	 *     }
	 * 
	 * ### Prevent it from being passed
	 * 
	 *     function(ev){
	 *       return false;
	 *     }
	 * 
	 * ### Add more events
	 * 
	 *     function(ev){
	 *       return [ev, {custom: 'event'}]
	 *     }
	 * 
	 * Notice that you have to pass the original event
	 * 
	 * ### Delay calling the next filterCB
	 * 
	 * To delay calling the next fitlterCB, the function must return true;  It should then
	 * callback passNext with either undefined, false, or an array of events.
	 * 
	 * __undefined__ - calls the next filterCB with the event
	 * 
	 *     function(ev, passNext){
	 *       setTimeout(function(){
	 *         passNext()
	 *       },1000)
	 *      
	 *       return false;
	 *     }
	 * 
	 * __false__ - does not call the next filterCB with the event.  It will continue to the next event.
	 * 
	 *     function(ev, passNext){
	 *       setTimeout(function(){
	 *         passNext(false)
	 *       },1000)
	 *       
	 *       return false;
	 *     }
	 * 
	 * __array__  - calls the next filterCB with the events provided.  You MUST pass the original event if you want that to also be called.
	 * 
	 *     function(ev, passNext){
	 *       setTimeout(function(){
	 *         passNext([ev, {another: 'event'}])
	 *       },1000)
	 *       
	 *       return false;
	 *     }
	 * 
	 * @param {Object} feed
	 */
	Funcit.filter = function(feed){
		//console.log(arguments)
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
				//console.log(events)
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
				//console.log(filter)
				if(filter && current[eventNum]){
					//console.log(events)
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
}).then('funcit/filters/count.js',
		'funcit/filters/dblclick.js',
        'funcit/filters/lastmodified.js',
		'funcit/filters/similartext.js',
		'funcit/filters/visible.js',function(){
	
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
				console.log('Lastcallback: ', ev)
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

