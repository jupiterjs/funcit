module("file_reader test", { 
	setup: function(){
		S.open("//funcit/file_reader/file_reader.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});