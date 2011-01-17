steal.plugins('jquery','funcunit').then(function($){

	$.fn.funcit_runner = function(text){
		
			//'restart' QUnit
			//eval text
		//QUnit.init();
		FuncUnit.frame = this[0]
		QUnit.testStart = function(name){
			console.log("test start")
		};
		
		eval(text)	
		QUnit.load()
	}

});