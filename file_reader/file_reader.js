steal.plugins('jquery/controller', 'jquery/controller/subscribe')
	.then(function($){

$.Controller("Funcit.FileReader", {
	init : function(){
		
	},
	'input change' : function(el, ev){
		var files = ev.target.files;
    for (var i = 0, f; f = files[i]; i++) {
			if(f.type == "application/x-javascript"){
				var code = f.getAsText('');
				$('#editor').funcit_editor().val(code)
			}
    }
	}
})

});