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
	
	toggleRecord: function(record){
		var el = this.find(".rec");
		if(!record){ // turn off recording
			el.text("Record").removeClass("recording")
			this.publish("funcit.record", {recording: false});
		} else {
			el.text("Recording").addClass("recording")
			this.publish("funcit.record", {recording: true});
		}
	},
	openResultsTab: function(){
		$("#tabs li:eq(1)").trigger("activate");
	},
	// start running a test because someone clicked the run button
	".runtest click": function(){
		this.toggleRecord(false);
		this.openResultsTab();
		this.runnerTimeout = null;
		this.isFirstStatement = true;
		this.lineCounter = {};
		// get test name
		//QUnit.config.filters = [testName];
		$("iframe").funcit_runner(this.textarea.val(), this.callback('runnerCallback'));
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
			buttonTop;
			
		// TODO implement caching for this, so you're not removing/creating these buttons every time
		this.find(".runtest").remove();
		tests.each(function(i, val){
			buttonTop = (val.line-1)*lineheight-4;
			$("<div class='runtest'></div>")
				.appendTo(wrapper)
				.data('testName', 'soemthing')
				.css('top', buttonTop);
		})
	}
})

});