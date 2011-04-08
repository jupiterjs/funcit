steal.plugins('jquery/controller', 'jquery/controller/subscribe')
	.then(function($){

$.Controller("Funcit.FileReader", {
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
				var regex = /^\s*test\s*\(/m;
				if(regex.test(code)){
					$('#editor').val(code).funcit_editor().trigger('keyup');
					this.element.find('input').hide();
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