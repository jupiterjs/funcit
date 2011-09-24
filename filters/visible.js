steal('jquery/lang').then(function(){
	
	var props = function(val){
		var vals = {};
		$.each(val.split(';'), function(i, pair){
			var parts = pair.split(":");
			if(parts.length == 2){
				vals[ $.String.strip(parts[0]) ] = $.String.strip(parts[1]).toLowerCase();
			}
			
		});
		return vals;
	}
	
	//adds a similar text flag to modifiers that are 'similar'
	
			
	Funcit.filters.visible = function(ev){
		if(ev.type == 'DOMAttrModified'){
			// we are typing something
			if(ev.attrName == 'style'){
				
				var before = props(ev.prevValue)
					now = props(ev.newValue);
				
				//  only send an event
				if(now.display === 'block' && before.display !== 'block'){
					return {
						type: "visible",
						target: $(ev.target),
						selector: $(ev.target).prettySelector()
					};
				}
				
				if(now.display === 'none' && before.display !== 'none'){
					return {
						type: "invisible",
						target: $(ev.target),
						selector: $(ev.target).prettySelector()
					};
				}
			}
			// get rid of these ...
			return false;
		}
		
		
	};

	
})
