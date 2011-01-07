steal.plugins('steal/less').then(function($){
	steal.less('funcit')
}).plugins('mxui/filler',
	'funcit/app',
	'funcit/test')
.then(function(){
	
	var current,
		tests = $("#tests");
	
	$('#app').mxui_filler({parent: document.body})
		.funcit_app().bind("addEvent", function(ev, type, data, el){
		
		if(!current){
			$("#funcit").show()
			$('<li/>').funcit_test({name: 'setup'}).appendTo(tests).funcit_test("show"); //activates this one
			var moveHere = $('<li/>').funcit_test().appendTo(tests);
			setTimeout(function(){
				moveHere.funcit_test("show");
				$(window).trigger("resize")
			},0)
		}
		current.funcit_test.apply(current,["addEvent"].concat( $.makeArray(arguments) ))
	});
	
	tests.delegate("li","shown",function(){
		if(current){
			current.funcit_test("hide")
		}
		current = $(this);
	});

	
});