steal.plugins('jquery/controller')
	.then(function($){
/**
 * Controls special command types that display a menu of options for the user 
 * to select.  Reuses the same element over and over.
 */
$.Controller("Funcit.SelectMenu", 
	{
		update: function(el, options, callback){
			var offset = el.offset();
			this.element.html('//funcit/commands/views/select.ejs', {
				options: options
			})
			.offset({
				top: offset.top,
				left: offset.left
			})
			.show()
			
			this.callback = callback;
		}
	})

	// initialize the menu right away
	$(function(){
	    var menu = $("<div />")
		    .hide()
		    .appendTo(document.body)
		    .funcit_select_menu();
    })

});