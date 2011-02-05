steal.plugins('jquery/controller')
	.then(function($){
/**
 * this is called on iframes
 */
$.fn.mask = function(){
	var el = $.fn.mask.el,
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

$(document).ready(function(){
	$.fn.mask.el = $("<div class='controls_overlay' />").appendTo(window.document.body);
})

});