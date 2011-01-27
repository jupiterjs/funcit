steal.plugins('jquery/controller', 'jquery/controller/subscribe')
	.then(function($){

$.Controller("Funcit.Codewrapper", {
	init: function(){
		this.textarea = this.find('textarea');
		this.editor = $('#editor').controllers(Funcit.Editor)[0];
		this.rowHeight = this.textarea.rowheight();
	},
	".rec click": function(el){
		this.toggleRecord(!el.hasClass("recording"));
	},
	// runs test up to current cursor's statement
	".sync click": function(){
		//get an empty function or last statement
		var stmntOrFunc = this.editor.funcStatement();
		
		if(stmntOrFunc[0].arity == 'function'){
			// handle this
		}else{ // statement
			// get test up to current statement
			var endChar = stmntOrFunc.end(),
				test = this.textarea.val().substr(0,endChar)+"});"
		}
		
		// get test name
		// TODO refactor this code into editor or parse
		var testName = stmntOrFunc[0].func.parent[0].value;
		
		QUnit.config.filters = [testName];
		this.run(this.textarea.val());
	},
	toggleRecord: function(record){
		var el = this.find(".rec");
		if(!record){ // turn off recording
			el.removeClass("recording")
			this.publish("funcit.record", {recording: false});
		} else {
			el.addClass("recording")
			this.publish("funcit.record", {recording: true});
		}
	},
	openResultsTab: function(){
		$("#tabs li:eq(1)").trigger("activate");
	},
	run: function(test){
		this.toggleRecord(false);
		this.runnerTimeout = null;
		this.isFirstStatement = true;
		this.lineCounter = {};
		$("iframe").funcit_runner(this.textarea.val(), this.callback('runnerCallback'));
	},
	// start running a test because someone clicked the run button
	".runtest click": function(el, ev){
		this.openResultsTab();
		// get test name
		var testName = el.data('testName');
		QUnit.config.filters = [testName];
		this.run(this.textarea.val());
	},
	/**
	 * Assumes you have only one module.  Grabs that module and returns the string of its text
	 */
	// called by the runner module right before a statement is run
	// this will set up callbacks so that asynchrounous statements are highlighted, but synchronous ones are not
	runnerCallback: function(lineCount, stmnt){
		// only highlight statements for asynchronous stuff (actions and waits)
		if(this.runnerTimeout){
			clearTimeout(this.runnerTimeout);
			this.runnerTimeout = null;
		}
		this.runnerTimeout = setTimeout(this.callback('highlightStatement', lineCount, stmnt), 0);
	},
	// highlights the statement in the textarea as its being run
	highlightStatement: function(lineCount, stmnt) {
		// skip the first statement, because it will always be the last synchronous statement
		if (this.isFirstStatement) {
			this.isFirstStatement = false;
			return;
		}
		
		var count = 0;
		if(this.lineCounter[lineCount.toString()]){
			count = this.lineCounter[lineCount.toString()];
		}
		this.lineCounter[lineCount.toString()] = count+1;
		
		// places cursor at the end of the given statement
		var chains = (new Funcit.Parse(stmnt)).statement().chains(),
			$st = chains.eq(count);
			
		if(!$st.length) return;
		var start = {line: $st[0].line, from: $st[0].thru},
			end = {line: $st[0].line, from: $st[0].thru+$st[0].second.length};
			
		this.textarea.lastselection('highlight', start, end);
	},
	// call the method that adds run buttons
	"textarea keyup": function(){
		var self = this;
		if(this.keydownTimeout){
			clearTimeout(this.keydownTimeout);
		}
		this.keydownTimeout = setTimeout(function(){
			self.addTestButton();
		}, 300)
	},
	// 1. parse the textarea and find tests
	// 2. render test buttons in the right spots
	addTestButton: function(){
		var tests = this.editor.tests(),
			lineheight = this.rowHeight,
			wrapper = this.find(".wrapper"), 
			buttonTop, testName;
			
		// TODO implement caching for this, so you're not removing/creating these buttons every time
		this.find(".runtest").remove();
		tests.each(function(i, val){
			buttonTop = (val.line-1)*lineheight-4;
			testName = val.parent.second[0].value;
			$("<div class='runtest'></div>")
				.appendTo(wrapper)
				.data('testName', testName)
				.css('top', buttonTop);
		})
	}
})

});