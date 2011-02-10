steal.plugins('jquery', 'jquery/view/ejs').then(function(){
	
	$(document.body).append($.View('//funcit/commands/views/tooltip', {}))
	var tooltip = $("#tooltip-click");
		
	Funcit.Tooltip = {
		open: function(text){
			console.log(tooltip)
			tooltip
				.html(text)
				.show()
		},
		/**
		 * 
		 * @param {Object} delay a delay in ms before the close happens
		 */
		close: function(delay){
			delay = delay || 0;
			setTimeout(function(){tooltip.fadeOut()}, delay);
		}
	}
})