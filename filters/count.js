steal(function(){

	//adds a count (how many times something has been modified) 
	var throbs = [],
		text,
		index = function(selector){
			// also checks they are in the page and removes if they are not
			for(var i =0; i < throbs.length; i++){
				
				if(throbs[i].selector === selector){
					return i;
				}
			}
			return -1;
		},
		modifiers = ['invisible','visible','added','removed'];
			
			
	Funcit.filters.count = function(ev){
	
		
		if($.inArray(ev.type, modifiers) > -1){
			// record how many times this selector has been changed ...
			var i = index(ev.selector);
			if(i > -1){
				var throb = throbs.splice(i, 1)[0]
			} else{
				throb = {selector: ev.selector, count: 0}
			}
			throb.count++;
			throbs.unshift(throb);
			ev.count = throb.count;
			console.log(throb.count)
			if(throbs.length > 100){
				throbs.pop();
			}
		}
	}
	
})