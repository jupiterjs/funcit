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
		'mxui/layout/fill',
		'mxui/nav/tabs',
		'funcit/app',
		'funcit/editor',
		'funcit/grow',
		'funcit/commands',
		'funcit/testbuttons',
		'funcit/runner',
		'funcit/list_attributes',
		'funcit/file_reader',
		'funcit/file_writer',
		'funcit/pretty_selector',
		'jquery/view/ejs')
	.resources('jquery.mousewheel.3.0.2/jquery.mousewheel', 'jquery.has_scrollbar', 'hasLocalStorage')
	.then(function(){
	$(document).ready(function(){
		localStorageKey = function(){
			return window.location.href;
		}
		$(document.body).append("//funcit/views/app", {})
		
		var editor,
				first = false;
		
		$('#app').mxui_layout_fill({parent: document.body})
			.funcit_app().bind("addEvent", function(ev, type, data, el){
				
			// run this here so we can include the URL in the module name
			if(!first){
				
				$('#funcit').show();
				editor = $('#editor').funcit_editor();
				$("#test").funcit_testbuttons();
				$("#commands").funcit_commands();
				$('.controls_overlay').funcit_selectel();
				$("#tabs").mxui_nav_tabs();
				$("#results").funcit_results();
				$('#file-reader').funcit_file_reader();
				$('#file-writer').funcit_file_writer();
				if(hasLocalStorage() && localStorage[localStorageKey()] != null && localStorage[localStorageKey()] != ""){
					editor.funcit_editor('val', localStorage[localStorageKey()]);
				}else{
					editor.funcit_editor('val',"//funcit/views/init.ejs",{
						module : data,
						test : "change me!"
					})
				}
				
				
				editor.trigger("keyup")
				$(window).trigger("resize");
				first = true;
			}
			
			
			editor.funcit_editor.apply(editor,["addEvent"].concat( $.makeArray(arguments) ))
		});
	})
})
.views('init.ejs', 'app.ejs');