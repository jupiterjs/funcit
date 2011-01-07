steal.plugins('jquery/controller').then(function($){

/**
 * Manages a test or setup function and the textarea that represents its code.
 * 
 * If active, when something happens, it writes the next statement.
 * 
 */
$.Controller("Funcit.Editor",{
	addEvent : function(ev){
		console.log('holler!')
	}
})

});