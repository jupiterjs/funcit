steal.plugins('jquery/controller', 'jquery/controller/subscribe')
	.then(function($){

$.Controller("Funcit.FileReader", {
	init : function(){
		
	},
	'span click' : function(el, ev){
		ev.preventDefault();
		ev.stopPropagation();
		this.element.find('input').toggle();
	},
	'input change' : function(el, ev){
		clearTimeout(this.removeError);
		$('#loader-error').fadeOut();
		var files = ev.target.files;
    for (var i = 0, f; f = files[i]; i++) {
			if(f.type == "application/x-javascript"){
				var code = f.getAsText('');
				var regex = /^\s*test\s*\(/;
				if(regex.test(code)){
					$('#editor').funcit_editor().val(code)
				} else {
					this.error();
				}
				
			} else {
				this.error();
			}
    }
	},
	error : function(){
		$('#loader-error').show();
		this.removeError = setTimeout(function(){
			$('#loader-error').fadeOut();
		}, 5000)
	}
})

});