var editor;

module("editor", {
	setup: function(){
		editor = $('#editor').funcit_editor();
		editor.funcit_editor('val',"//funcit/views/init.ejs",{
			module : "General",
			test : "change me!"
		})
		editor.trigger("keyup");
		editor.funcit_editor('moveToLastTest');
	}
});

test("basic", function(){
	editor.funcit_editor('addEvent', null, "wait", {
		type : "hasClass",
		value: "one"
	}, $('#wrapper'));
	// verify the statement was inserted inside the function
	ok($('#editor').val().indexOf('S("#wrapper").hasClass("one")') > -1, "hasclass inserted");
});