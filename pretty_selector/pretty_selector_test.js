module("pretty_selector test", { 
	setup: function(){
		S.open("//funcit/pretty_selector/pretty_selector.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});