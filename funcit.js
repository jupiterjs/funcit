steal
	.plugins('steal/less')
	.then(function($){
		steal.less('funcit')
	})
	.plugins('mxui/filler',
		'funcit/app',
		'funcit/test',
		'funcit/controls')
	.then(function(){
	
	var current,
		tests = $("#tests");
	
	$('#app').mxui_filler({parent: document.body})
		.funcit_app().bind("addEvent", function(ev, type, data, el){
		
		if(!current){
			$("#funcit").show()
			$('#setup').funcit_test({name: 'setup'}).funcit_test("show"); //activates this one
			$('#teardown').funcit_test({name: 'teardown'});
			
			var moveHere = $('<li/>').funcit_test().appendTo(tests);
			setTimeout(function(){
				moveHere.funcit_test("show");
				$(window).trigger("resize")
			},0)
		}
		current.funcit_test.apply(current,["addEvent"].concat( $.makeArray(arguments) ))
	});
	
	tests.delegate(".funcit_test","shown",function(){
		if(current){
			current.funcit_test("hide")
		}
		current = $(this);
	});
	
	$("#controls").funcit_controls();
	$("<div />").appendTo(document.body).funcit_wait_menu()

	
});