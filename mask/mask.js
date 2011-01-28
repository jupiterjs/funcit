steal.plugins('jquery/controller')
	.then(function($){

$.fn.mask = function(){
	if(!$.fn.mask.el){
		$.fn.mask.el = $("<div class='controls_overlay' />").appendTo(window.document.body);
	}
	
	var document = this[0].contentDocument, 
		el = $.fn.mask.el;
	
	var body = $(document.body),
		offset = body.offset(),
		width = body.width(),
		height = body.height();
		
	el.offset({
			left: offset.left,
			top: offset.top
		})
		.width(width)
		.height(height)
		.show()
		
	return el;
}

});