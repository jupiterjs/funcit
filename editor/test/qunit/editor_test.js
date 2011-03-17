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

test("typing", function(){
	editor.funcit_editor('addEvent', null, "char", "a", $('#wrapper'))
	// verify that typing inserts statement
	ok($('#editor').val().indexOf("S(\"#wrapper\").type('a')") > -1, "typing works");
	editor.funcit_editor('addEvent', null, "char", "b", $('#wrapper'));
	editor.funcit_editor('addEvent', null, "char", "c", $('#wrapper'));
	// verify the multiple type calls are reduced to one call
	ok($('#editor').val().indexOf("S(\"#wrapper\").type('abc')") > -1, "typing multiple letter works as expected");
});

test("opening", function(){
	editor.funcit_editor('addEvent', null, "open", "http://url");
	// verify that open inserts correct statement
	ok($('#editor').val().indexOf("S.open('http://url')") > -1, "opening works");
});

test("clicking", function(){
	editor.funcit_editor('addEvent', null, "click", {}, $('#wrapper'));
	// verify that clicking inserts statement
	ok($('#editor').val().indexOf("S(\"#wrapper\").click()") > -1, "clicking works");
});

test("right clicking", function(){
	editor.funcit_editor('addEvent', null, "rightClick", {}, $('#wrapper'));
	// verify that right clicking inserts statement
	ok($('#editor').val().indexOf('S("#wrapper").rightClick()') > -1, "right clicking works");
});

test("double clicking", function(){
	editor.funcit_editor('addEvent', null, "doubleClick", {}, $('#wrapper'));
	// verify that double clicking inserts statement
	ok($('#editor').val().indexOf('S("#wrapper").dblclick()') > -1, "double clicking works");
});

test("trigger", function(){
	editor.funcit_editor('addEvent', null, "trigger", {test: 'test'}, $('#wrapper'));
	// verify that trigger inserts statement
	ok($('#editor').val().indexOf('S("#wrapper").trigger({"test":"test"})') > -1, "trigger works");
});

test("drag", function(){
	editor.funcit_editor('addEvent', null, "drag", {from: '0x0', to: '1x1'}, $('#wrapper'));
	// verify that drag inserts statement
	ok($('#editor').val().indexOf('S("#wrapper").drag({"from":"0x0","to":"1x1"})') > -1, "trigger works");
});

test("move", function(){
	editor.funcit_editor('addEvent', null, "move", $('#wrapper'), {x: '0', y: '0'}, {x: '1', y: '1'});
	// verify that move inserts statement
	ok($('#editor').val().indexOf('S("#wrapper").move("1x1")') > -1, "trigger works");
});

test("scroll", function(){
	editor.funcit_editor('addEvent', null, "scroll", 'top', 0, window);
	ok($('#editor').val().indexOf('S("window").scroll("top", 0);') > -1, "window scroll works");
	editor.funcit_editor('addEvent', null, "scroll", 'top', 0, $('#wrapper'));
	ok($('#editor').val().indexOf('S("#wrapper").scroll("top", 0);') > -1, "window scroll works");
});

test("wait for attr or css", function(){
	editor.funcit_editor('addEvent', null, "wait", {result: 'Wrapper title', value: 'title', type: 'attr'}, $('#wrapper'));
	ok($('#editor').val().indexOf('S("#wrapper").attr("title", \'Wrapper title\');') > -1, "wait works");
});

test("wait for invisible, visible, exists, missing", function(){
	editor.funcit_editor('addEvent', null, "wait", {type: 'exists'}, $('#wrapper'));
	ok($('#editor').val().indexOf('S("#wrapper").exists();') > -1, "wait works");
});

test("wait for everything else", function(){
	editor.funcit_editor('addEvent', null, "wait", {type: 'height', value: 20}, $('#wrapper'));
	ok($('#editor').val().indexOf('S("#wrapper").height(20);') > -1, "wait works");
});

test("getter", function(){
	editor.funcit_editor('addEvent', null, "getter", {type: 'height', value: 20}, $('#wrapper'));
	ok($('#editor').val().indexOf('var height_1 = S(\'#wrapper\').height();') > -1, "wait works");
});
