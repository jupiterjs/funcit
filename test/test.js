steal.css('test')
	.plugins('jquery/controller/view',
		'jquery/view/ejs',
		'funcit/grow',
		'funcit/defaulttext',
		'jquery/dom/selection',
		'jquery/lang/json').then(function($){

//manages a test
$.Controller("Funcit.Test",
{
	
},
{
	init : function(){
		console.log(this.element)
		this.element.html(this.view());
		setTimeout(this.callback('growTextarea'),0)
	},
	growTextarea : function(){
		this.find('textarea').funcit_grow();
		this.find('input').funcit_defaulttext({
			text : "add test name"
		});
	},
	"h3 input click" : function(el, ev){
		ev.stopImmediatePropagation();
	},
	"click" : function(){
		var funcBody = this.find('.func-body')
		
		if(this.element.hasClass("active")){
			
		}else{
			this.show();
			
		}
	},
	show : function(){
		//this.find('.show').hide();
		//this.find('.func-body').show();
		this.element.addClass("active"),
			ta = this.find('textarea');
		ta[0].focus()
		//ta.selection(ta.val().length);
		this.element.trigger("shown")
	},
	"textarea focusin" : function(){
		this.lastSelection = null;
	},
	"textarea focusout" : function(el){
		this.lastSelection = el.selection()
	},
	selection : function(){
		return this.lastSelection || this.find('textarea').selection();
	},
	hide : function(){
		this.element.removeClass("active");
		//this.find('.show').show();
		//this.find('.func-body').hide();
	},
	addEvent : function(ev, eventType){
		console.log("AddEvent",eventType)
		var args = $.makeArray(arguments);
		
		this["add"+$.String.capitalize(eventType)].apply(this,args.slice(2))
	},
	addOpen : function(url){
		this.write("S.open('"+url+"');")
	},
	addClick : function(options, el){
		this.write("S('"+$(el).prettySelector()+"').click();")
	},
	addDrag : function(options, el){
		this.write("S('"+$(el).prettySelector()+"').drag("+$.toJSON(options)+");")
	},
	addChar : function(text, el){
		//need to check what's before current place
	},
	write : function(text){
		//only writes statements ...
		var ta = this.find('textarea'),
			current = ta.val(),
			sel = this.selection(),
			before = current.substr(0,sel.start),
			after = current.substr(sel.end);
				
		ta.val(before+(before ? "\n" : "")+text+after) ;
		this.lastSelection ={
			start : before.length + text.length,
			end : before.length + text.length
		}

		ta.trigger("keyup")
	}
	
});
var getWindow = function( element ) {
		return element.ownerDocument.defaultView || element.ownerDocument.parentWindow
	};
$.fn.prettySelector= function() {
	var target = this[0];
	if(!target){
		return null
	}
	var selector = target.nodeName.toLowerCase();
	//always try to get an id
	if(target.id){
		return "#"+target.id;
	}else{
		var parent = target.parentNode;
		while(parent){
			if(parent.id){
				selector = "#"+parent.id+" "+selector;
				break;
			}else{
				parent = parent.parentNode
			}
		}
	}
	if(target.className){
		selector += "."+target.className.split(" ")[0]
	}
	var others = $(selector, getWindow(target).document); //jquery should take care of the #foo if there
	
	if(others.length > 1){
		return selector+":eq("+others.index(target)+")";
	}else{
		return selector;
	}
};
	
});