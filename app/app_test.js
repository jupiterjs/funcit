steal.plugins('funcunit/qunit','funcit/app','funcunit/syn', 'funcit/pretty_selector').then(function(){

var app = function(){
	return $('#app')
},
iframe = function(){
	return $( app().find('iframe')[0].contentWindow.document )
},
open = function(page, cb){
	app().funcit_app({url: steal.root.join(page),
			open : cb
		})
}
	
module("funcit/app",{
	setup : function(){
		$('#qunit-test-area').html("<div id='app'/>");
	}
});

test("typing backspace only ", 1, function(){
	stop();
	open("funcit/app/test/type.html", function(){
		Syn.type( "\b", iframe().find("#type")[0] , function(){
			start();
		});
	})
	app().bind("addEvent", function(ev, type, chr){
		if(type == 'char'){
			equals(chr, "\\b", "got backspace char")
		}
	})
	
});

test("event propagation", 1, function(){
	stop();
	open("funcit/app/test/stop_propagation.html", function(){
		Syn.click({},iframe().find("#type")[0],function(){
		})

	})
	app().bind("addEvent", function(ev, type){
		if(type == 'click'){
			ok(true, "got click")
			start();
		}
	})
	
});	
	
	
test("drag and drop", 1, function(){
	stop();
	open("funcit/app/test/drag_and_drop.html", function(){
		Syn.drag("+20 +20", iframe().find("div")[0], function(){
		})
	})
	app().bind("addEvent", function(ev, type){
		if(type == 'drag'){
			ok(true, "got drag")
			start();
		}
	})
	
});	

test("scroll", 1, function(){
	stop();
	open("funcit/app/test/scroll.html", function(){
		Syn.trigger('mouseover', {}, iframe().find("#scrollable")[0])
		iframe().find("#scrollable").scrollTop(30)
	})
	app().bind("addEvent", function(ev, type, direction, ammount, selector){
		if(type == 'scroll'){
			equals('div#scrollable-top30', 'div#' + selector.id + "-" + direction + ammount, 'scroll works')
			start();
		}
	})
	
});

test("special keys shouln't be recorded multiple times while they're pressed", 1, function(){
	stop();
	open("funcit/app/test/type.html", function(){
		Syn.trigger('keydown', {keyCode: '16'}, iframe().find("#type")[0]);
		Syn.trigger('keydown', {keyCode: '16'}, iframe().find("#type")[0]);
		Syn.trigger('keydown', {keyCode: '16'}, iframe().find("#type")[0]);
		Syn.trigger('keydown', {keyCode: '16'}, iframe().find("#type")[0]);
	})
	app().bind("addEvent", function(ev, type, chr){
		if(type == 'char'){
			ok(true, 'shift is recorded only once')
			
		}
		start();
	})


	
});


});
