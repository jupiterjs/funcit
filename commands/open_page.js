steal.plugins('jquery/controller')
	.then(function($){
/**
 * Opens a new page in iframe
 */
$.Controller("Funcit.OpenPage", 
	{
		'.green-button click': function(el, ev){
			var addr = $.String.strip(this.element.find('.text-input').val());
			if(addr != ""){
				
				/* $('iframe:first').load(function(){
					$('.syncing').fadeOut(function(){ $(this).remove() });
				}).attr('src', addr); */
				
				$('iframe:first').replaceWith($('<iframe src="' + addr + '"></iframe>').load(function(){
					$('.syncing').fadeOut(function(){ $(this).remove() });
				}));
				
				
			}
		}
	})

});