steal.plugins('jquery/controller')
	.then(function($){
/**
 * Controls special commands that display a dialog for users to enter a value.
 */
$.Controller("Funcit.Dialog", 
	{
		update: function(ev, callback){
			this.element.html('//funcit/commands/views/dialog.ejs', {})
			.offset({
				top: ev.clientY-30,
				left: ev.clientX
			})
			.show()
			
			this.callback = callback;
			this.element.find("input")[0].focus();
		},
		submit: function(el, ev){
			ev.preventDefault();
			var selection = $.trim(this.find('input:first').val());
			this.callback(selection);
			this.close();
		},
		".close click": function(el, ev){
			this.close();
		},
		close: function(){
			this.element.hide();
		},
		"funcit.escape_keydown subscribe": function(){
			Funcit.Modal.close();
		}
	})

	// initialize the menu right away
	$(function(){
	    var menu = $("<div />")
		    .hide()
		    .appendTo(document.body)
		    .funcit_dialog();
    })

});