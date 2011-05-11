steal(function(){

var events,
	timer;

// after a click collect all events until a timeout passes ... then it was a click or not
Funcit.filters.dblclick = function(ev, cb){
	if(ev.type == 'click'){
		
		if(timer){ // we were a double click
			ev.type = 'dblclick';
			
			var call = events.push(ev).slice(0);
			clearTimeout(timer);
			events = timer = undefined;
			
			
			
			return call;
		} else {
			events = [ev];
			timer = setTimeout(function(){
				var call = events.slice(0);
				//console.log("click", call)
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
