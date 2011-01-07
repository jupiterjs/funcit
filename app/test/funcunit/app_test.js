module("app test", { 
	setup: function(){
		S.open("//funcit/app/app.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});