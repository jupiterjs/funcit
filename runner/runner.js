steal.plugins('jquery','funcunit','funcit/parse')
	.then('results')
	.then(function($){
	
	/**
	 * Takes JS text, parses it, adds a statement count before
	 * each statement and then evals it.
	 * 
	 * It also points FuncUnit to a particular iFrame and
	 * sets up QUnit.
	 * 
	 * Before each statement is run, it calls
	 * cb with that statement.  By giving a callback
	 * to funcit_runner, you can show which statement is being 
	 * run.
	 * @param {Object} text
	 * @param {Object} cb
	 */
	$.fn.funcit_runner = function(text, cb, doneCb){
		if (doneCb) {
			QUnit.done = doneCb;
		}
		var p = new Funcit.Parse(text),
			stated = p.stated(),
			ordered = p.ordered(),
			el = this;
		
		//console.log(stated)
		
		__s = function(statement){
			//console.log(ordered[statement])
			__s.cur = statement
			cb(statement, ordered[statement], ordered)
		}
		
		FuncUnit.frame = this[0]
		stop();
		eval(stated);
		QUnit.load();
	}
	
})
.views('assert.ejs', 'done.ejs', 'test.ejs');