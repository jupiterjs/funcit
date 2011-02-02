steal.plugins('jquery/controller')
	.then(function($){
/**
 * Controls special command types that display a menu of options for the user 
 * to select.  Reuses the same element over and over.
 */
$.Controller("Funcit.SelectMenu", 
	{
		update: function(ev, options, callback){
			this.element.html('//funcit/commands/views/select.ejs', {
				options: options
			})
			.offset({
				top: ev.clientY-30,
				left: ev.clientX
			})
			.show()
			
			this.callback = callback;
		},
		"input change": function(el, ev){
			var selection = $.trim(el.closest('label').text());
			this.callback(selection);
			this.close();
		},
		".close click": function(el, ev){
			this.close();
		},
		close: function(){
			this.element.hide();
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