steal.plugins('jquery/controller', 'jquery/controller/subscribe')
	.views('sync.ejs')
	.then(function($){

$.Controller("Funcit.Testbuttons", {
	init: function(){
		this.textarea = this.find('textarea');
		this.editor = $('#editor').controllers(Funcit.Editor)[0];
		this.rowHeight = this.textarea.rowheight();
	},
	".rec click": function(el){
		if(el.hasClass("recording")){
			$('.sync').addClass('out-of-sync');
		}
		
		this.toggleRecord(!el.hasClass("recording"));
		
	},
	
	'#new-file click' : function(el, ev){
	  if(confirm('Are you sure? You will lose all changes.')){
	  	$('iframe:first')[0].contentWindow.location.reload();
	    var pageURLMatch = location.search && location.search.match(/\?url\=(.*)/),
  			  pageURL = (pageURLMatch && pageURLMatch[1]) || Funcit.url;
  		    editor = editor = $('#editor').funcit_editor();
  				val = $.View("//funcit/views/init.ejs",{
  					module : pageURL,
  					test : "change me!"
  				})
  		var caretPos = val.indexOf('setup :') + 19;
  		editor.funcit_editor('val', val);
  		editor.funcit_editor('selection',{
  			start : caretPos,
  			end : caretPos
  		});
  		editor.trigger('keyup')
  		$('#app').trigger("addEvent",["open",pageURL]);
  		caretPos = editor.val().indexOf('test(') + 31;
  		editor.funcit_editor('selection',{
  			start : caretPos,
  			end : caretPos
  		});
	  }
	},
	// runs test up to current cursor's statement
	// grabs the entire textarea string up to the cursor and passes this testname as a filter to QUnit
	// since the text isn't modified, the highlighting still works
	// TODO there has to be a better way to do this
	".sync click": function(el, ev){
		//get an empty function or last statement
		
		console.log('here')
		
		var stmntOrFunc = this.editor.funcStatement({
			//previous: true
		});
		
		console.log(stmntOrFunc)
		
		
		//steal.dev.log(this.textarea[0].selectionStart)
		if(typeof stmntOrFunc[0] != 'undefined' && typeof stmntOrFunc[0].func != 'undefined'){
			
			if(stmntOrFunc[0].arity == 'function'){
				// handle this
			}else{ // statement*/
				// get test up to current statement
				//var endChar = stmntOrFunc.end()
				var endChar = this.textarea.val().indexOf("\n", this.textarea[0].selectionStart);
				var testCode = this.textarea.val().substr(0,endChar);
				var test = this.prepareCodeForSync(testCode);
				
				/*if(test == ""){
					test = this.prepareCodeForSync(testCode);
				}*/
				//var test = this.textarea.val().substr(0,endChar)+"\n});";

			}
			var testName = stmntOrFunc[0].func.parent[0].value;
			// TODO find better way to extract test name when cursor is inside of callback function
			if(testName == 'function'){
				var codeArray = test.split('test(');
				var testCode  = $.String.strip(codeArray[codeArray.length - 1]);
				testName      = testCode.split(testCode.charAt(0))[1]
			}
			QUnit.config.filters = [testName];
			// add the opaque mask
			Funcit.Modal.open($.View('//funcit/testbuttons/views/sync', {}))
			$('.sync').removeClass('out-of-sync').addClass('sync-running');
			this.run(test, this.callback('syncDone'));
		}
	},
	prepareCodeForSync : function(code){
		var length = code.length;
		var buffer = [];
		var openBrackets = [];
		var pairings = {'{': '}', '(': ')'};
		for(var i = 0; i < length; i++){
			var letter = code.charAt(i);
			if(letter == '{' || letter == "("){
				openBrackets.push(pairings[letter]);
			}
			if(letter == '}' || letter == ')'){
				letter = openBrackets.pop();
			}
			buffer.push(letter)
		}
		return buffer.join("") + "\n" + openBrackets.reverse().join("\n");
	},
	syncDone: function(){
		$('.sync-running').removeClass('sync-running');
		
		this.toggleRecord(true);
		delete this._caretAtLine
		Funcit.Modal.close();
		$('#app').funcit_app("bindEventsToIframe");
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
	run: function(test, doneCb){
		//$('.sync').addClass('sync-running');
		this.toggleRecord(false);
		this.lineCounter = {};
		
		$("iframe").funcit_runner(test, this.callback('runnerCallback'), doneCb);
	},
	// start running a test because someone clicked the run button
	".runtest click": function(el, ev){
		this.openResultsTab();
		// get test name
		var testName = el.data('testName');
		QUnit.config.filters = [testName];
		el.addClass('running-test');
		this.toggleRecord(false);
		this.run(this.textarea.val(), this.callback('runtestDone'));
	},
	runtestDone: function(){
		var self = this;
		setTimeout(function(){
			$('.out-of-sync').removeClass('out-of-sync');
			$('.running-test').removeClass('running-test');
			self.toggleRecord(true);
			$('#app').funcit_app("bindEventsToIframe");
		}, 100)
		
	},
	/**
	 * Assumes you have only one module.  Grabs that module and returns the string of its text
	 */
	// called by the runner module right before a statement is run
	// highlights the statement in the textarea as its being run
	runnerCallback: function(lineCount, stmnt){
		if(typeof stmnt == 'undefined') return;
		$('#editor').funcit_editor("scrollToLine", stmnt.line);
		// any line that should be highlighted will call the runnerCallback >1x
		// the first pass should be ignored (the synchronous pass)
		// the second pass should run the highlight
		var count = 0;
		if(this.lineCounter[lineCount.toString()]){
			count = this.lineCounter[lineCount.toString()];
		}
		this.lineCounter[lineCount.toString()] = count+1;
		
		// skip the first statement, because it will always be the synchronous statement
		/*if (count == 0) {
			return;
		}*/
		
		// places cursor at the end of the given statement
		var chains = (new Funcit.Parse(stmnt)).statement().chains(),
			$st = chains.eq(count-1);
			
		if(!$st.length) return;
		
		var start = {line: $st[0].line, from: $st[0].thru},
			end = {line: $st[0].line, from: $st[0].thru+$st[0].second.length},
			endLoc = this.editor.lastCharOfLine(end.line),
			cursorLoc = {line: end.line, from: endLoc};
		
			
		this.textarea.lastselection('updateCursor', cursorLoc);
		this.textarea.lastselection('highlight', start, end);
		
		
	},
	setCaret : function(el){
		this._caretAtLine = el.val().substr(0, el[0].selectionStart).split("\n").length
	},
	checkSync: function(el){
		if(typeof this._caretAtLine != 'undefined'){
			if(this._caretAtLine != el.val().substr(0, el[0].selectionStart).split("\n").length){
				$('.sync').addClass('out-of-sync');
			}
		}
	},
	"textarea mousedown" : function(el, ev){
		this.setCaret(el);
	},
	"textarea mouseup": function(el, ev){
		this.checkSync(el);
	},
	"textarea keydown": function(el, ev){
		this.setCaret(el);
	},
	// call the method that adds run buttons
	"textarea keyup": function(el, ev){ 
		this.checkSync(el);
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
			if(typeof val.parent.second != 'undefined'){
				buttonTop = (val.line-1)*lineheight-4;
				testName = val.parent.second[0].value;

				$("<div class='runtest'></div>")
					.appendTo(wrapper)
					.data('testName', testName)
					.css('top', buttonTop);
			}
		})
	}
})

});