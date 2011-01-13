steal
	.plugins('steal/less')
	.then(function($){
		steal.less('funcit')
	})
	.plugins('mxui/filler',
		'funcit/app',
		'funcit/editor',
		'funcit/grow',
		'funcit/controls',
		'jquery/view/ejs')
	.then(function(){
	
	var editor,
			first = false;
	
	$('#app').mxui_filler({parent: document.body})
		.funcit_app().bind("addEvent", function(ev, type, data, el){
		
		if(!first){
			$('#funcit').show();
			editor = $('#editor').funcit_editor();
			//if(!editor.val()){
				editor.funcit_editor('val',"//funcit/views/init.ejs",{
					module : data,
					test : "change me!"
				})
			//}
			//editor.funcit_grow();
			$(window).trigger("resize");
			first = true;
		}
		
		
		
		editor.funcit_editor.apply(editor,["addEvent"].concat( $.makeArray(arguments) ))
	});
	
	
	
	$("#controls").funcit_controls();
	$("<div />").appendTo(document.body).funcit_wait_menu()

	
});