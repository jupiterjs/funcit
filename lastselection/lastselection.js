steal.plugins('jquery/controller','jquery/dom/selection').then(function($){
var getLast = function(){
	clearTimeout(this.timer);
	this.timer = setTimeout(this.callback('setLast'),0)
}
$.Controller("Lastselection",{
	init : function(){
		this.timer = null;
		this.element.attr('tabindex',0)
		//this.bind('blur','blurred')
	},
	"focusin" : function(){
		$('#cursor').remove();
	},
	"focusout" : function(){
		//console.log('blur',this.element.selection())
		var sel = this.last,
			text = this.element.text(),
			before = text.substr(0,sel.start),
			after = text.substr(sel.start);
		
		this.element.html(before+"<span id='cursor'> </span>"+after);
		var cur = $('#cursor'),
			offset = cur.offset(),
			width = cur.width(),
			height = cur.height();
		cur.remove();
		
		$('<div id="cursor"/>').css({position: 'absolute'}).appendTo(document.body).width(width).height(height).offset(offset)
	},
	keyup : getLast,
	keypress : getLast,
	mouseleave : getLast,
	setLast : function(){
		//console.log('setting', this.element.selection())
		this.last = this.element.selection() || this.last;
	},
	val : function(){
		return this.last;
	}
})

});