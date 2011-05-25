steal(function(){
	
	var lastAction = [],
		modifiers = [],
		
	
	find = function(modifiers, target, type){
		for(var i =0; i < modifiers.length ;i++){
			var compare = modifiers[i].target.compare(target);
			//console.log(compare, target, type)
			if( (compare & 0 || compare & 8 || compare & 16) && (type ? type==modifiers[i].type : true) ){
				return i;
			}
		}
		return -1;
	},
	getSuggestion = function(modifiers, previousEvent, nextEvent){
		// priority ...
		//  - something added that contains or is, what we do in the next event
		//  - something added with similar text
		//  - something added 
		

		// target contains or is the element we interact with

		//return previousEvent
		// 

			

		for(var i = 0; i < modifiers.length; i++){
			var modifier = modifiers[i];
			if($.isFunction(nextEvent.target.parents) && ($.inArray(nextEvent.target.parents(), modifier.target) > -1 || nextEvent.target === modifier.target)){
				return modifier;
			}
		}
		
		// something added to what we just touched
		var lastAround = find(modifiers, nextEvent.target);
		if( lastAround > -1){
			for(var i =0; i < modifiers.length; i++){
				if(modifiers[i].similarText){
					return modifiers[i];
				}
			}
		}
		
		var distance = 1/0;
		var mod, x, y;
		if(typeof nextEvent.pageX != 'undefined' && typeof nextEvent.pageY != 'undefined'){
			x = nextEvent.pageX;
			y = nextEvent.pageY;
		} else {
			var offset = nextEvent.target.offset();
			x = offset.left;
			y = offset.top;
		}
		for(var i = 0; i < modifiers.length; i++){
			var el = modifiers[i].target;
			var elDistance = Math.abs(Math.sqrt(Math.pow((x-el.offset().left),2) + Math.pow((y-el.offset().top),2)));
			if(elDistance < distance){
				mod = modifiers[i];
				distance = elDistance;
			}
		}
		if(typeof mod == 'undefined'){
			mod = false// modifiers[0];
		}
		return mod;
	}
	Funcit.filters.lastmodified = function(ev){
		
		//console.log('Lastmodified: ', ev)
		
	
		
		if($.inArray(ev.type, ['invisible','visible','added','removed']) > -1){
			modifiers.unshift(ev);
			return true;
		} else {
			
			
			if(ev.type == 'char') return ev;
			
			var suggestion = getSuggestion(modifiers, lastAction, ev);
			lastAction = ev;
			modifiers = [];
			
			if(typeof ev.mutationEvents != 'undefined'){
				modifiers = ev.mutationEvents.slice(0);
				delete ev.mutationEvents;
			}
			
			//console.log('lm2:', ev, suggestion)
			
			//console.log('suggestion', suggestion)
			
			if(suggestion !== false && typeof suggestion !== 'undefined')
				return [suggestion, ev];
			return [ev];
		}
	};
	
})
