steal.plugins('jquery/controller',
	'jquery/dom/selection',
	'funcit/rowheight').then(function($){

/**
 * Keeps the last selected text for a textarea.
 */
$.Controller("Lastselection",{
	init : function(){
		var pre = $("<pre><span>W</span></pre>").appendTo(this.element.parent());
		
		this.dims = {
			height: this.element.rowheight(),
			width : pre.find('span').width()
		}
		this.cursor = 
		$('<div class="selection-cursor"/>')
			.css({position: 'absolute'})
			
			.appendTo(this.element.parent())
			.width( this.dims.width )
			.height( this.dims.height ).hide();
			
		pre.remove();
	},
	update : function(options){
		if(!this.focused){
			this.last = options;
			var locs = $.fn.rowheight.lineLoc(this.element.val(), this.last.start),
				off = this.element.offset();

			this.cursor.show().offset({
				top : off.top+(locs.line - 1)*this.dims.height,
				left : off.left+(locs.from - 1)*this.dims.width
			})
		}
	},
	"focusin" : function(){
		this.focused = true;
		this.last = null;
		this.cursor.hide();
	},
	"focusout" : function(){
		this.focused = false;
		this.update(this.element.selection());
	},
	val : function(){
		return this.last || this.element.selection();
	}
})

});