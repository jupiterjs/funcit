steal.plugins('jquery/controller').then(function($){

$.Controller("Funcit.Defaulttext",
{
	defaults : {
		text : null,
		activeClass : "active"
	}	
},
{
	init : function(){
		if(!this.element.val()){
			this.element.val(this.options.text)
		}
	},
	"focusin" : function(el){
		if(el.val() == this.options.text){
			el.val("")
		}
		el.addClass(this.options.activeClass)
	},
	"focusout" : function(el){
		if(el.val() === ""){
			el.val(this.options.text)
			this.element.removeClass(this.options.activeClass)
		}
		
	}
})

});