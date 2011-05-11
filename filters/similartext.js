steal(function(){
	
	//adds a similar text flag to modifiers that are 'similar'
	
	var recent,
		text,
		modifiers = ['invisible','visible','added','removed'];
			
	Funcit.filters.similarText = function(event){
		if(event.type == 'char'){
			// we are typing something
			text = event.target.val();
		}
		
		if(text && text.length > 4 && $.inArray(event.type, modifiers) > -1){
			if( event.target.is(':contains('+text+')') ){
				event.similarText = true;
				event.selector = event.target.prettySelector(text);
			} else {
				var has = event.target.find(':contains('+text+')');
				if(has.length){
					console.log("YES?")
					return [event,{
						type: ev.type,
						target: has.eq(0),
						selector: has.prettySelector(text),
						similarText : true
					}]
				}
			}
		}
	};

	
})
