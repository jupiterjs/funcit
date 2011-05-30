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
		var suggestors = {
			suggestSameOrParent: function(){
				if(nextEvent.target){
					var evTarget = nextEvent.target[0];

					for(var i = 0; i < modifiers.length; i++){
						var modifier = modifiers[i];
						var modifierTarget = modifier.target[0];
						if(($.isFunction(nextEvent.target.parents) && $.inArray(nextEvent.target.parents(), modifier.target) > -1) || evTarget  === modifierTarget){
							if(evTarget === modifierTarget){ // adjust the selector to fix race condition
								modifier.selector = nextEvent.selector;
							}
							return modifier;
						}
					}
				}
				
			},

			suggestSimilarText: function(){
				// something added to what we just touched
				var lastAround = find(modifiers, nextEvent.target);
				if( lastAround > -1){
					for(var i =0; i < modifiers.length; i++){
						if(modifiers[i].similarText){
							return modifiers[i];
						}
					}
				}
			},

			suggestClosestTouchedElement: function(){
				var distance = 1/0;
				var modifier, x, y;
				if(typeof nextEvent.pageX != 'undefined' && typeof nextEvent.pageY != 'undefined'){
					x = nextEvent.pageX;
					y = nextEvent.pageY;
				} else {
					if($.isFunction(nextEvent.target.offset)){
						var offset = nextEvent.target.offset();
					}
					if(typeof offset == 'undefined' || offset == null){
						return;
					}
					x = offset.left;
					y = offset.top;
				}
				for(var i = 0; i < modifiers.length; i++){
					var el = modifiers[i].target;
					var elDistance = Math.abs(Math.sqrt(Math.pow((x-el.offset().left),2) + Math.pow((y-el.offset().top),2)));
					if(elDistance < distance){
						modifier = modifiers[i];
						distance = elDistance;
					}
				}
				if(distance < 201){ // Arbitrary distance in which we look for changed elements
					return modifier;
				}
			}
		}
		
		var suggestorsOrder = "SameOrParent SimilarText ClosestTouchedElement".split(' ');
		var modifier = modifiers[0] || false;
		
		for(var i = 0; i < suggestorsOrder.length; i++){
			var suggestion = suggestors['suggest' + suggestorsOrder[i]]()
			if(typeof suggestion != 'undefined'){
				modifier = suggestion;
				break;
			}
		}
		return modifier;
	}
	Funcit.filters.lastmodified = function(ev, cb){
		if($.inArray(ev.type, ['invisible','visible','added','removed']) > -1){
			//if(!(/style|script/).test(ev.selector)){
				modifiers.unshift(ev);
			//}
			cb(false);
			return true;
		} else {
			if(ev.type == 'char') return ev;
			
			var suggestion = getSuggestion(modifiers, lastAction, ev);
			lastAction = ev;
			modifiers = [];

			if(suggestion !== false && typeof suggestion !== 'undefined')
				return [suggestion, ev];
			return [ev];
		}
	};
	
})
