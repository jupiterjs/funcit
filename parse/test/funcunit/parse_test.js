module("parse test", { 
	setup: function(){
		S.open("//funcit/parse/parse.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});