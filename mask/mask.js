steal.plugins('jquery/controller')
	.then(function($){

$.fn.mask = function(){
	var el = $("<div class='controls_overlay' />").appendTo(window.document.body),
		body = $(this),
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