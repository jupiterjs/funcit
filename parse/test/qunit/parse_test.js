steal
  .plugins("funcunit/qunit", "funcit/parse").then(function(){


module("parse");

test("parse testing works", function(){
	Funcit.parse.statements("foo.bar\ncar\n.bar()")
});

})