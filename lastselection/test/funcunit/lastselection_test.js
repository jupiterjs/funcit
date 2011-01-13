module("lastselection test", { 
	setup: function(){
		S.open("//funcit/lastselection/lastselection.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});