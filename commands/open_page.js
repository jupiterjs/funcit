steal.plugins('jquery/controller')
	.then(function($){
/**
 * Opens a new page in iframe
 */
$.Controller("Funcit.OpenPage", 
	{
		init: function(el, callback){
			this.callback = callback;
		},
		'submit' : function(el, ev){
			this.openPage();
		},
		'.green-button click': function(el, ev){
			this.openPage();
		},
		'.text-input keydown' : function(el, ev){
			if(ev.keyCode == 13){ // enter
				this.openPage();
			}
		},
		".close click": function(el, ev){
			ev.preventDefault();
			Funcit.Modal.close();
		},
		"funcit.escape_keydown subscribe": function(){
			Funcit.Modal.close();
		},
		openPage : function(){
			var self = this,
				addr = $.String.strip(this.element.find('.text-input').val());
			if(addr != ""){

				/* There is something seriously wrong with either implementation of open page functionality.
				   They both trigger "Unknown pseudo-class or pseudo-element 'first'" error. 
				*/

				/* $('iframe:first').load(function(){
					$('.syncing').fadeOut(function(){ $(this).remove() });
				}).attr('src', addr); */

				$('#app').controllers(Funcit.App)[0].loadIframe(addr);
				Funcit.Modal.close();
			}
		}
	})

});