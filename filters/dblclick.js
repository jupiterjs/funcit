steal(function(){

var events,
	timer;

// after a click collect all events until a timeout passes ... then it was a click or not
Funcit.filters.dblclick = function(ev, cb){

	if(ev.type == 'click'){
		
		if(timer){ // we were a double click
			ev.type = 'dblclick';
			//console.log(events)
			events.push(ev)
			var call = events.slice(0);
			clearTimeout(timer);
			events = timer = undefined;
			
			return call;
		} else {
			
			events = [ev];
			timer = setTimeout(function(){
				var call = events.slice(0);
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
