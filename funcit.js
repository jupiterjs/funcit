steal
	.plugins('funcunit')
	.then(function(){
		// leave this empty to force funcunit
	})
	.plugins('steal/less')
	.then(function($){
		steal.less('funcit')
	})
	.plugins(
		'mxui/filler',
		'mxui/tabs',
		'funcit/app',
		'funcit/editor',
		'funcit/grow',
		'funcit/controls',
		'funcit/runner',
		'jquery/view/ejs')
	.then(function(){
	
	var editor,
			first = false;
	
	$('#app').mxui_filler({parent: document.body})
		.funcit_app().bind("addEvent", function(ev, type, data, el){
			
		// run this here so we can include the URL in the module name
		if(!first){
			
			$('#funcit').show();
			editor = $('#editor').funcit_editor();
			$("#test").funcit_codewrapper();
			$("#controls").funcit_controls();
			$("<div />").appendTo(document.body).funcit_wait_menu()
			$("#tabs").mxui_tabs();
			$("#results").funcit_results();
			$("iframe:first").funcit_selectel();
			
			editor.funcit_editor('val',"//funcit/views/init.ejs",{
				module : data,
				test : "change me!"
			})
			
			editor.trigger("keyup")
			$(window).trigger("resize");
			first = true;
		}
		
		
		editor.funcit_editor.apply(editor,["addEvent"].concat( $.makeArray(arguments) ))
	});
});