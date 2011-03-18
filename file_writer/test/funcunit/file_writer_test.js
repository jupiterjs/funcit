module("file_writer test", { 
	setup: function(){
		S.open("//funcit/file_writer/file_writer.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});