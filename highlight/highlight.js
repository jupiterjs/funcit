steal.plugins('jquery')
// TODO add this back (right now it breaks the build)
//	.css('highlight')
	.then(function($){
	
	// highlights an element
	$.fn.highlight = function(){
		var hl = $.fn.highlight;
		//Firebug.Inspector.drawOutline(this[0])
		// 
		var borders = ['l', 'r', 't', 'b'];
		for(var i = 0; i < borders.length; i++){
			if(!hl[borders[i] + 'Border']){
				hl[borders[i] + 'Border'] = $("<div class='highlight " + borders[i] + "Border' />").appendTo(document.body);
			}
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
		var borders = ['l', 'r', 't', 'b'];
		for(var i = 0; i < borders.length; i++){
			if(hl[borders[i] + 'Border']){
				hl[borders[i] + 'Border'].hide();
			}
		}
	}
});