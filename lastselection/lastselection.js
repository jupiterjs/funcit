steal.plugins('jquery/controller',
	'jquery/dom/selection',
	'funcit/rowheight').then(function($){

/**
 * Keeps the last selected text for a textarea.
 */
$.Controller("Lastselection",{
	init : function(){
		var pre = $("<pre><span>M</span></pre>").appendTo(this.element.parent());
		
		this.dims = {
			height: this.element.rowheight(),
			width : pre.find('span').width()
		}
		this.cursor = 
		$('<div class="selection-cursor"/>')
			.css({position: 'absolute'})
			
			.appendTo(this.element.parent())
			.width( this.dims.width )
			.click(this.callback('showCursor'))
			.height( this.dims.height ).hide();
			
		this.highlightBox = 
		$('<div class="selection-highlight"/>')
			.css({position: 'absolute'})
			
			.appendTo(this.element.parent())
			.height( this.dims.height ).hide();
			
		pre.remove();
		this.padding = {
			top: parseInt(this.element.css('padding-top'), 10),
			left: parseInt(this.element.css('padding-left'), 10)
		}
	},
	update : function(options){
		if(!this.focused){
			this.last = options;
			var loc = $.fn.rowheight.lineLoc(this.element.val(), this.last.start);
			this.updateCursor(loc);
		}
	},
	/**
	 * Update the cursor with the given location
	 * @param {Object} loc some object like {line: 3, from: 4}
	 */
	updateCursor: function(loc){
		var off = this.element.offset();
		this.cursor.show().offset({
			top : off.top+this.padding.top+(loc.line - 1)*this.dims.height,
			left : (off.left+this.padding.left+(loc.from - 1)*this.dims.width)
		})
	},
	/**
	 * 
	 * @param {Object} start some object like {line: 3, from: 4}
	 * @param {Object} end some object like {line: 3, from: 4}
	 */
	highlight : function(start, end){
		var off = this.element.offset();
		var modifier = 0;
		if((/OS X/).test(navigator.userAgent)) modifier = 6;
		
		// single line highlight
		if(start.line == end.line){
			var width = (end.from - start.from)*this.dims.width,
				line = start.line;
		}
		
		this.highlightBox.show()
			.width(width)
			.offset({
				top : off.top+this.padding.top+(line- 1)*this.dims.height,
				left : off.left+this.padding.left+(start.from - 1)*this.dims.width - modifier
			})
	},
	
	"mouseenter": function(){
		this.hideHighlight();
		this.showCursor();
	},
	
	hideHighlight: function(){
		this.highlightBox.hide();
	},
	
	showCursor: function(ev){
		var val = this.val()
		this.element.selection(val.start)
	},
	focusin : function(){
		this.focused = true;
		this.last = null;
		this.cursor.hide();
		this.hideHighlight();
	},
	// called after cursor is gone, can't get a selection
	focusout : function(){
		this.focused = false;
		var sel = this.element.selection();
		this.update(sel);
	},
	val : function(){
		return this.last || this.element.selection();
	}
})

});