steal.plugins('jquery', 'jquery/view/ejs', 'jquery/class').then(function(){
		
	$.Class("Funcit.Modal",{
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
			$('.syncing').text('').fadeOut(function(){ $(this).hide().removeClass('syncing') });
		}
	}, {})
})