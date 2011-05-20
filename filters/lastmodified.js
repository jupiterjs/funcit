steal(function(){
	
	var lastAction = [],
		modifiers = [],
		
	
	find = function(modifiers, target, type){
		for(var i =0; i < modifiers.length ;i++){
			var compare = modifiers[i].target.compare(target);
			console.log(compare, target, type)
			if( (compare & 0 || compare & 8 || compare & 16) && (type ? type==modifiers[i].type : true) ){
				return i;
			}
		}
	},
	getSuggestion = function(modifiers, previousEvent, nextEvent){
		// priority ...
		//  - something added that contains or is, what we do in the next event
		//  - something added with similar text
		//  - something added 
		
		
		
		// something added to what we just touched
		var lastAround = find(modifiers, nextEvent.target);
		if( lastAround > -1){
			for(var i =0; i < modifiers.length; i++){
				if(modifiers[i].similarText){
					return modifiers[i];
				}
			}
		}
		return modifiers[0];
	}
	Funcit.filters.lastmodified = function(ev){
	
		if($.inArray(ev.type, ['invisible','visible','added','removed']) > -1){
			
			modifiers.unshift(ev);
			return true;
		} else {
			
			var suggestion = getSuggestion(modifiers, lastAction, ev);
			lastAction = ev;
			modifiers = [];
			
			return [suggestion, ev]
		}
	};
	
})
