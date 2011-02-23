steal.plugins('jquery/controller',
	'funcit/parse',
	'jquery/dom/selection',
	'funcit/lastselection',
	'funcit/grow',
	'jquery/dom/cur_styles',
	'jquery/controller/subscribe',
	'jquery/lang/json').then(function($){
/**
 * Manages a test or setup function and the textarea that represents its code.
 * 
 * If active, when something happens, it writes the next statement.
 * 
 */
$.Controller("Funcit.Editor",{
	init : function(){
		this.element.funcit_grow().lastselection()
		this.first = true;
		this.modified = true;
		this.record = true;
	},
	val : function(){
		return this.element.val.apply(this.element, arguments);
	},
	selection : function(v){
		if(v){
			this.element.lastselection(v)
		}else{
			return this.element.controller('lastselection').val()
		}
	},
	parser : function(){
		// can say it hasn't been modified so we don't need to reparse
		if(this.modified){
			this.parse = new Funcit.Parse(this.val());
		}
		return this.parse;
	},
	find : function(){
		return this.parser().find.apply(this.parse,arguments)
	},
	statement : function(){
		
		//from our current selection, figure out what statement we
	},
	// gets the function at this location
	func : function(loc){
		loc = loc || this.selectPos();
		return this.parser().func(loc.line, loc.from, loc.from);
	},
	line : function(line){
		if(line === undefined){
			line  = this.selectPos().line
		}
		return this.val().split("\n")[line-1]
	},
	// returns the number of the last character in the given line
	lastCharOfLine: function(line){
		var linetxt = this.line(line);
		return linetxt.length+1;
	},
	indent : function(line){
		if(line){
			var line = this.line(line),
				index = line.search(/[^\s]/)
			return line.substr(0, index)
		}
		return new Array(4+1).join(" ");
	},
	
	moveToLastTest : function(){
		var found = this.find({type: "(identifier)", value : 'test'}),
			func = found.last().up().find({ arity: "function" }),
			end = func[0].end,
			line = this.line(end.line-1),
			chr = $.fn.rowheight.charLoc(this.val(), {line:  end.line - 1, from: line.length+1});
		
		this.selection({start: chr, end: chr});
		//console.log(chr)
	},
	openFunc : function(func){
		if(func.line == func.end.line){
			// add a line between them
			this.insert("\n"+this.indent(func.line), func.end, func.end )
		}
	},
	
	funcIndent : function(func){
		return this.indent(func.line)
	},
	//gets the module
	module : function(){
		return this.find({type: "(identifier)", value : 'module'})
			.eq(0);
	},
	//gets the module
	tests : function(){
		return this.find({type: "(identifier)", value : 'test'});
	},
	// gets the test with the given name
	test : function(testName){
		return this.find({type: "(identifier)", value : 'test'});
	},
	// going to set the cursor
	//   if we are in 'record' mode, get current location, and run test
	//   
	// 
	click : function(){
		var funcStatement = this.funcStatement(),
			moduleText = this.module().up().text();
			

		//console.log(funcStatement, moduleText)
		//find out what we clicked on ...
		
		//if an element, show in the page
		
		//if an S command, show dialoug
		
		//if a test run
		
		//
		//var found = this.find({type: "(identifier)", value : 'test'}),
		//	func = found.last().up().find({ arity: "function" })
		//console.log(this.selectPos(), func);
		
		//console.log(this.funcStatement())
		//this.trigger("run", this.val())
	},
	addEvent : function(ev, eventType){
		console.log(eventType)
		this.element.trigger('blur')
		if(this.first && eventType == 'open'){
			this.first = false;
			//find the module's setup function, add to the end
			var found = this.find({type: "(identifier)", value : 'setup'})
			var loc = found.first().end();
			
			this.selection({
				start : loc,
				end : loc
			});
			setTimeout(this.callback('moveToLastTest'),13)
		}
		
		var args = $.makeArray(arguments);
		this["add"+$.String.capitalize(eventType)].apply(this,args.slice(2))
	},
	addOpen : function(url){
		var stmt = this.funcStatement({
			previous: true
		});
		var indent = this.funcIndent(stmt.up()[0]);
		this.insert("\n"+indent+this.indent()+"S.open('"+url+"')*")
	},
	addChar: function(letter, el){
		var stmt = this.funcStatement(true);
		var text = stmt.text();
		if(/\.type\(/.test(text)){
			var line = stmt[0].end.line;
			var textArr = text.split("\n")
			var textareaValue = this.val().split("\n");
			var value = textArr[textArr.length - 1].substr(0, textArr[textArr.length - 1].length - 3) + letter + "*');";
			textareaValue[line - 1] = textareaValue[line -1].replace(textArr[textArr.length - 1], value);
			var newValue = textareaValue.join("\n");
			var start = newValue.indexOf('*');
			this.val(newValue.replace(/\*/,''));
			this.selection({
				start : start,
				end : start
			});
			this.element.trigger('keyup')
		}else{
			this.chainOrWriteLn($(el).prettySelector(),".type('" + letter + "*')");
		}
	},
	addClick : function(options, el){
		this.chainOrWriteLn($(el).prettySelector(),".click()*");
	},
	addRightClick : function(options, el){
		this.chainOrWriteLn($(el).prettySelector(),".rightClick()*")
	},
	addDoubleClick : function(options, el){
		this.chainOrWriteLn($(el).prettySelector(),".dblclick()*")
	},
	addTrigger : function(value, el){
		this.chainOrWriteLn($(el).prettySelector(),".trigger("+$.toJSON(value)+")*")
	},
	addDrag : function(options, el){
		this.chainOrWriteLn($(el).prettySelector(),".drag("+$.toJSON(options)+")*");
	},
	addMove: function(el, from, to){
		this.chainOrWriteLn($(el).prettySelector(), '.move("'+to.x+'x'+to.y+'")*');
	},
	addScroll : function(direction, amount, el){
		if(el.window == el){
			if(direction == "top")
				this.chainOrWriteLn('window', '.scroll('+$.toJSON(direction)+', '+el.scrollY+'*)');
			else
				this.chainOrWriteLn('window', '.scroll('+$.toJSON(direction)+', '+el.scrollX+'*)');
		} else {
			this.chainOrWriteLn($(el).prettySelector(), '.scroll('+$.toJSON(direction)+', '+amount+')*');
		}
		
	},
	addMousewheel : function(delta){
		this.chainOrWriteLn('body', '.mousewheel("' + delta + '")');
	},
	// if el is blank, add "target"
	addWait: function(options, el){
		var val = $.toJSON(options.value) || "",
			result = options.result, 
			sel = $(el).prettySelector();
		if(options.type == 'attr' || options.type == 'css'){
			this.chainOrWriteLn(sel,"."+options.type+"("+val+", '" + result +"')*");
		} else if($.inArray(options.type, ['exists', 'invisible', 'missing', 'visible']) > -1) {
			this.chainOrWriteLn(sel,"."+options.type+"()*");
		} else {
			this.chainOrWriteLn(sel,"."+options.type+"("+val+")*");
		}
		
	},
	addGetter: function(options, el){
		
		var val = $.toJSON(options.value) || "",
			result = options.result, 
			sel = $(el).prettySelector(),
			text = "S('"+sel+"')."+options.type+"(";
		
		if(options.type == 'attr' || options.type == 'css'){
			text = text + '"' + options.value + '"'
		}	
		
		
		
		var variableStmt = "var "+this.getVariableName(options.type)+" = "+text+")";
		
		//get an empty function or last statement
		var stmt = this.funcStatement({
			previous: true
		});
		if(typeof stmt[0] != 'undefined'){
			if (stmt[0].arity == 'function') {
				//we have an empty function, insert in the 'right' place
				this.writeInFunc(variableStmt, stmt)
			}
			else {
				var method = stmt[0].first.value;
				// if there's an assertion in the previous statment
				// TODO check if it has arguments, if so don't replace them
				if (stmt[0].arity == "infix" && Funcit.Commands.asserts[method]) {
					// insert in the first argument
					text = text + "), " + val + ", *";
					this.insert(text, stmt.end() - 1);
				} else {
					// otherwise add it as a variable
					var indent = this.funcIndent(stmt.up()[0]);
					this.insert("\n"+indent+this.indent()+variableStmt+";",stmt.end()+1);
				}
			}
			
		} else {
			this.insert("")
		}
		this.showCursor();
	},
	addAssert: function(options){
		var val = $.toJSON(options.value) || "";
		// * the location where insert will place the cursor
		var text = options.type+"(*)";
		
		// Add the statement inside a callback function, either:
		// 	- cursor is in a callback, add it here
		// 	- add a callback to the previous statement, add it there
		// 	- add it synchronously to the first line of the test
		
		//get an empty function or last statement
		var stmntOrFunc = this.funcStatement({
			previous: true
		});
		
		// if a function
		if(stmntOrFunc[0].arity == 'function'){
			//we have an empty function, insert in the 'right' place
			this.writeInFunc(text, stmntOrFunc)
			
		}else{
			var stmnt = stmntOrFunc;
			// if statement is an S and doesn't have a callback function, add one
			var s = stmnt.S(),
				isS = s.length > 0;
			if (isS) {
				this.addToCallbackFunc(stmnt, text);
			}
			else{
				var indent = this.funcIndent(stmnt[0]),
					txt = "\n"+indent+text+";",
					start = stmnt.end()+1;
					
				this.insert(txt,start);
			}
			 
		}
		this.showCursor();
	},
	getVariableName : function(varName){
		this._variableNames = this._variableNames || {};
		this._variableNames[varName] = this._variableNames[varName] || 0;
		this._variableNames[varName]++;
		return varName + "_" + this._variableNames[varName];
	},
	showCursor: function(){
		this.element.controller('lastselection').showCursor()
	},
	/**
	 * If the statement begins with an S, it creates a function as its last 
	 * parameter and places the cursor inside of it.  If this statement already 
	 * has a callback, it adds the new statement inside of the callback.
	 * @param {Object} stmnt
	 */
	addToCallbackFunc: function(stmnt, text){
		// does this statement have a callback?
		// check its last argument
		var lastArg = stmnt.second().last(),
			indent = this.funcIndent(stmnt[0]),
			insertTxt = "";
		if(lastArg.length && lastArg[0].arity == "function"){
			// grab the last statement, if there is one
			var lastInFunc = lastArg.block().last(),
				end = lastArg.end();
			if(lastInFunc.length){
				end = lastInFunc.end()+1;
			}
			insertTxt += "\n"+indent+indent+text+";";
			this.insert(insertTxt, end);
		} else { // create the callback
			// if theres another argument, add a comma
			if(stmnt.second().length){
				insertTxt += ", ";
			}
			insertTxt += "function(val){\n"+indent+indent+text+";\n"+indent+"}";
			this.insert(insertTxt, stmnt.end()-1);
		}
	},
	/**
	 * Inserts text into the textarea from start to end.
	 * If the string has a *, it is removed, and this is where the cursor is placed.
	 * @param {Object} text
	 * @param {Object} start
	 * @param {Object} end
	 */
	insert : function(text, start, end ){
		if(!this.recording()) return;
		var ta = this.element,
			current = this.val(),
			sel = this.selection();
			
		this.element.lastselection('hideHighlight');
			
		if(!start){
			start = sel.start
		}
		if(typeof start == 'object'){
			start = $.fn.rowheight.charLoc(current, start)
		}
		if(end === undefined){
			end = start;
		}
		if(typeof end == 'object'){
			end = $.fn.rowheight.charLoc(current, end)
		}
		var before = current.substr(0,start),
			after = current.substr(end);
			
		var start;
		if(/\*/.test(text)){
			start = before.length + text.indexOf("*");
			text = text.replace(/\*/,'');
		} else {
			start = before.length + text.length;
		}
		this.val(before+( "")+text+after);
		this.selection({
			start : start,
			end : start
		});
		// get the line number
		var pos = $.fn.rowheight.lineLoc(this.val(), start)
		this.scrollToLine(pos.line)
		this.element.trigger("keyup")
	},
	/**
	 * Scrolls the scrollable element containing the editor to the point where the 
	 * given line is visible.
	 * @param {Number} line the line number that we want to scroll to 
	 */
	scrollToLine: function(line){
		// if there's scrollbars
		if(this.element.height() > this.element.parent().height()) {
			var rowHeight = this.element.rowheight(),
				// if the cursor is not currently visible, scroll the textarea
				lastVisibleLine = this.element.parent().height()/rowHeight, 
				firstVisibleLine = this.element.parent().scrollTop()/rowHeight;
			if(lastVisibleLine < line || firstVisibleLine > line){
			     // scroll to current line
			     var scrollTop = (line - lastVisibleLine) * rowHeight;
				 this.element.parent().scrollTop(scrollTop);
			}
		}
	},
	writeLn : function(text){
		//only writes statements ...
		var func = this.func(),
			last;
		
		this.openFunc(func[0]);
		
		//now insert a line where we are
		func = this.func(),
		
		//go through the current function's statements, find the 'last' one.  Add after its end.
		func.block().each(function(i, stmnt){
			//console.log(stmnt)
		})
		if(last){
			//console.log('implement')
		}else{
			// no statement, this is the only thing in the function.
			this.insert(this.indent()+text+";\n"+this.indent())
		}
		this.element.trigger('keyup')
	},
	// writes text in an empty function
	writeInFunc : function(text, func){
		var line = this.line(),
			indent = this.funcIndent(func[0]),
			pos = this.selectPos();

		if(/[^\s]/.test(line)){
			// add a new line
			
		}else{
			this.insert(indent+this.indent()+text+";",{
				line: pos.line,
				from: 1
			},{
				line: pos.line,
				from: line.length
			})
		}
	},
	// chains on selector or writes a new line
	chainOrWriteLn : function(selector, text){
		var selector = selector? $.toJSON(selector): ''; 
		//get an empty function or last statement
		var stmntOrFunc = this.funcStatement();
		
		
		//console.log(stmntOrFunc)
		// if a function
		// 
		if(typeof stmntOrFunc[0] != 'undefined'){
			if(stmntOrFunc[0].arity == 'function'){
				//we have an empty function, insert in the 'right' place
				this.writeInFunc("S("+selector+")"+text, stmntOrFunc)

			}else{
				var stmnt = stmntOrFunc,
					indent = this.funcIndent(stmnt.up()[0])
				
				var selectors = this.element.val().substr(0,this.element[0].selectionStart).split('S("');
				var lastSelector = '"' + selectors[selectors.length-1].split('")')[0] + '"';
					
				//if(stmnt.hasSelector(selector)){
				if(lastSelector == selector){
					this.insert("\n"+indent+this.indent()+this.indent()+text, stmnt.ender()+1)
				}else{
					this.insert("\n"+indent+this.indent()+"S("+selector+")"+text+";",stmnt.end()+1)
				}
			}
		}
		
	},
	selectPos : function(){
		return  $.fn.rowheight.lineLoc(this.val(), this.selection().start)
	},
	/**
	 * 
	 * @param {Boolean} previous if true, gets the previous statement, otherwise gets the 
	 * next statement from the cursor position 
	 */
	funcStatement : function(options){
		options = options || {};
		var allfuncs = this.func(),
			func = allfuncs.last(),
			last,
			val;
		if(func.length){
			this.openFunc(func[0]);
		}else{
			return func;
		}
		
		
		//now insert a line where we are
		var selection = this.selection();
		
		//go through the current function's statements, find the 'last' one.  Add after its end.
		var blocks = func.block(), 
			blockEnd,
			blockStart,
			last = blocks.length ? blocks.last() : func;
		for(var i =0; i < blocks.length ; i++){
			blockEnd = blocks.eq(i).end();
			blockEnd = blocks.eq(i).start();
			if(blockEnd > selection.start && blockStart <= selection.start){
				if (options.previous) {
					return last;
				}
				return blocks.eq(i);
			}
			last = blocks.eq(i);
		}
		return blocks.length ? blocks.last() : func;
	},
	"funcit.record subscribe": function(called, params){
		if(params.recording) {
			this.record = true;
		} else {
			this.record = false;
		}
	},
	// returns true if we're recording, false otherwise
	recording: function(){
		return this.record;
	}
	
});
var getWindow = function( element ) {
		return element.defaultView || element.ownerDocument.defaultView || element.ownerDocument.parentWindow
	};
$.fn.prettySelector= function() {
	var target = this[0];
	if(!target){
		return null
	}
	
	var selector = target.nodeName.toLowerCase();
	//always try to get an id
	if(target.id){
		return "#"+target.id;
	}else{
		var parent = target.parentNode;
		while(parent){
			if(parent.id){
				selector = "#"+parent.id+" "+selector;
				break;
			}else{
				parent = parent.parentNode
			}
		}
	}
	if(target.className){
		selector += "."+target.className.split(" ")[0]
	}
	var others = $(selector, getWindow(target).document); //jquery should take care of the #foo if there
	
	if(others.length > 1){
		return selector+":eq("+others.index(target)+")";
	}else{
		return selector;
	}
};

});