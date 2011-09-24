steal('jquery/controller', 
	'jquery/controller/subscribe',
	'./resources/downloadify/js/swfobject', 
	'./resources/downloadify/js/downloadify.min.js')
	.then(function($){

$.Controller("Funcit.FileWriter", {
	init : function(){
		this.element.downloadify({
			swf: 'file_writer/resources/downloadify/media/downloadify.swf',
			downloadImage: 'images/backgrounds/savefile.gif',
			width: '47px',
			height: '23px',
			filename: 'funcit_test.js',
			data: function(){
				return $('#editor').val();
			}
		});
	}
})

});