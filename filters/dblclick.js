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
		for(var i = 0, ii = cleanEvents.length; i < ii; i++){
			var ev = cleanEvents[i];
			//if($.inArray(ev.type, ['invisible','visible','added','removed']) > -1){
			if($.inArray(ev.type, ['visible','added']) > -1){
				mutationEvents.push(ev);
			}
		}
		
		mainEv.mutationEvents = mutationEvents;
		
		return mainEv;
	}


	if(ev.type == 'click'){
		
		if(timer){ // we were a double click
			ev.type = 'dblclick';
			//console.log(events)
			events.push(ev)
			var call = filterEvents(events.slice(0), true);
			clearTimeout(timer);
			events = timer = undefined;
			
			return call;
		} else {
			
			events = [ev];
			timer = setTimeout(function(){
				var call = filterEvents(events.slice(0), false);
				//console.log(cb)
				//call.push(call[0])
				//var otherEvs = events.slice(1)
				//console.log('dbl', call)
				timer = events = undefined;
				cb(call);
				/*if(otherEvs.length > 0){
					cb(otherEvs);
				}*/
				
			},200)
			return true;
		}
		
	} else if(events){
		events.push(ev);
		//events.unshift(ev);
		return true;
	}
}
	
})
