steal.css('test')
	.plugins('jquery/controller/view',
		'jquery/view/ejs',
		'funcit/grow',
		'funcit/defaulttext').then(function($){

//manages a test
$.Controller("Funcit.Test",
{
	
},
{
	init : function(){
		this.element.html(this.view());
		setTimeout(this.callback('growTextarea'),0)
	},
	growTextarea : function(){
		this.find('textarea').funcit_grow();
		this.find('input').funcit_defaulttext({
			text : "add test name"
		})
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
		this.element.addClass("active");
		this.find('textarea')[0].focus()
		this.element.trigger("shown")
	},
	hide : function(){
		this.element.removeClass("active");
		//this.find('.show').show();
		//this.find('.func-body').hide();
	},
	addEvent : function(ev, eventType){
		console.log("AddEvent",eventType)
		var ta = this.find('textarea'),
			val = ta.val();
			
		ta.val( (val ? val+"\n" : "" )+eventType)
		ta.trigger("keyup")
	}
	
})
	
});