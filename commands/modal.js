steal.plugins('jquery', 'jquery/view/ejs').then(function(){
		
	Funcit.Modal = {
		open: function(html){
			$("iframe:first")
				.mask()
				.addClass('syncing')
				.html(html)
		},
		/**
		 * 
		 * @param {Object} delay a delay in ms before the close happens
		 */
		close: function(){
			$('.syncing').fadeOut(function(){ $(this).remove() });
		}
	}
})