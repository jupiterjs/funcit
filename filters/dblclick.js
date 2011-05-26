steal(function(){

var events,
	timer;

// after a click collect all events until a timeout passes ... then it was a click or not
Funcit.filters.dblclick = function(ev, cb){

	var filterEvents = function(events, isDoubleClick){
		var mainEv, cleanEvents, mutationEvents = [];
		
		if(events.length == 1) return events[0];
		if(events.length == 2 && isDoubleClick) return events.slice(-1)[0];
		
		if(isDoubleClick){
			mainEv = events.slice(-1)[0];
			cleanEvents = events.slice(1,-1)
		} else {
			mainEv = events.slice(0,1)[0];
			cleanEvents = events.slice(1);
		}
		cleanEvents.unshift(mainEv)
		
		return cleanEvents;
	}


	if(ev.type == 'click'){
		
		if(timer){ // we were a double click
			ev.type = 'dblclick';
			events.push(ev)
			var call = filterEvents(events.slice(0), true);
			clearTimeout(timer);
			events = timer = undefined;
			
			return call;
		} else {
			
			events = [ev];
			timer = setTimeout(function(){
				var call = filterEvents(events.slice(0), false);
				timer = events = undefined;
				cb(call);
				
			},200)
			return true;
		}
		
	} else if(events){
		events.push(ev);
		return true;
	}
}
	
})
