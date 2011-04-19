steal.plugins('funcunit/qunit','funcit/app','funcunit/syn').then(function(){

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
	
	
});
