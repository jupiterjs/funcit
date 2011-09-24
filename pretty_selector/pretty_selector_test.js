steal.plugins('funcunit/qunit').then('pretty_selector',function(){
	
module("funcit pretty_selector", { 
	setup: function(){
		$("#qunit-test-area").html("")
	}
});

test("id", function(){
	equals('#foo', $('<div id="foo"/>').appendTo( $("#qunit-test-area") ).prettySelector() )
	equals($('<div class="bar"/>').appendTo( $("#foo") ).prettySelector(), '#foo .bar'  )
	
	
	
});

test("weird ID", function(){
	var el = $('<div/>').attr('id',":b.what").appendTo( $("#qunit-test-area") ),
	pf = el.prettySelector();
	ok(el[0], "we have an element")
	ok( $(pf)[0] == el[0] , "can get weird selectors back" );
})

});


