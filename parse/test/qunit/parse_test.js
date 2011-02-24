steal
  .plugins('jquery',"funcunit/qunit", "funcit/parse").then(function(){


module("parse",{
	setup : function(){
		stop();
		var self = this;
		$.get(steal.root.join("funcit/parse/test/tabs_test.js"), function(text){
			this.tabsTest = text;
			start();
		},'text');
	}
});

test("parse testing works", function(){
	//Funcit.parse.statements("foo.bar\ncar\n.bar()");
	var s = "S('.foo').click(function(){ var a = 1; });\n"+
			"S('.bar').type('abc')"
	var p = new Funcit.Parse(s);
	
	p.get(1, 10, function(val){
		steal.dev.log(typeof val.second == 'string' ?
			val.second : val.value, val.from, val.thru, val)
	});
	p.statement(1,10, function(val){
		steal.dev.log(typeof val.second == 'string' ?
			val.second : val.value, val.from, val.thru, val)
			
		val.find({
			type: "(identifier)",
			value : "S"
		}, function(val){
			steal.dev.log( val.args() );
		})
	})
	//JSLINT(,{devel: true, forin: true, browser: true, windows: true, rhino: true, predefined : true});
});

})