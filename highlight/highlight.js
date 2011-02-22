steal.plugins('jquery')
	//.then('firebug-lite-debug')
	.css('highlight')
	.then(function($){
	
	// highlights an element
	$.fn.highlight = function(){
		var hl = $.fn.highlight;
		//Firebug.Inspector.drawOutline(this[0])
		if(!hl.lBorder) {
			hl.lBorder = $("<div class='highlight lBorder' />").appendTo(document.body);
			hl.rBorder = $("<div class='highlight rBorder' />").appendTo(document.body);
			hl.tBorder = $("<div class='highlight tBorder' />").appendTo(document.body);
			hl.bBorder = $("<div class='highlight bBorder' />").appendTo(document.body);
		}
		var top = $(this[0].ownerDocument.defaultView).scrollTop();
		var offset = this.offset(),
			width = this.outerWidth(),
			height = this.outerHeight();
		
	    /**
	     * 
	     *   llttttttrr
	     *   llttttttrr
	     *   ll      rr
	     *   ll      rr
	     *   llbbbbbbrr
	     *   llbbbbbbrr
	     */
		hl.lBorder
			.offset({
				left: offset.left,
				top: offset.top - top
			})
			.height(height)
			.show();
		
		hl.rBorder
			.offset({
				left: offset.left + width - 2,
				top: offset.top - top
			})
			.height(height)
			.show();
		
		hl.tBorder
			.offset({
				left: offset.left,
				top: offset.top - top
			})
			.width(width)
			.show();
		
		hl.bBorder
			.offset({
				left: offset.left,
				top: offset.top + height - 2 - top
			})
			.width(width)
			.show();
	}
	
	$.fn.unhighlight = function(){
		//Firebug.Inspector.drawOutline(this[0])
		var hl = $.fn.highlight;
		hl.lBorder.hide();
		hl.rBorder.hide();
		hl.tBorder.hide();
		hl.bBorder.hide();
	}
});