steal.plugins('jquery/controller',
	'funcit/parse',
	'jquery/dom/selection',
	'funcit/lastselection',
	'funcit/grow',
	'jquery/dom/cur_styles',
	'jquery/lang/json').then(function($){
var lineLoc = function(str, num, name){
	var newLine = new RegExp("\n","g"),
		previous = 0,
		count = 0,
		res = {};
	name = name || 'from';
	while(newLine.exec(str) && newLine.lastIndex <= num){
		previous = newLine.lastIndex;
		count++;
	}
	res.line = count+1;
	res[name] = num - previous+1;
	return res;
},
charLoc = function(str, pos){
	var newLine = new RegExp("\n","g"),
		previous = 0,
		total = 0,
		lines = pos.line - 1;
	while(lines && newLine.exec(str) ){
		lines --;
	}
	return newLine.lastIndex+( (pos.from || pos.thru || 1) - 1 )
}
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
		//this.element[0].contentEditable = true;
		//this.element.attr('tabindex',0)
		
		//this.element.curStyles('borderTopWidth','paddingTop','paddingLeft')
		
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
			chr = charLoc(this.val(), {line:  end.line - 1, from: line.length+1});
		
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
	// going to set the cursor
	//   if we are in 'record' mode, get current location, and run test
	//   
	click : function(){
		var funcStatement = this.funcStatement(),
			moduleText = this.module().up().text();
			

		console.log(funcStatement, module)
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
		if(this.first && eventType == 'open'){
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
		this.writeLn("S.open('"+url+"')")
	},
	addClick : function(options, el){
		this.chainOrWriteLn($(el).prettySelector(),".click()")
		//this.write("S('"+$(el).prettySelector()+"').click();")
	},
	addDrag : function(options, el){
		this.chainOrWriteLn($(el).prettySelector(),".drag("+$.toJSON(options)+")");
	},
	addWait: function(options, el){
		var val = options.value||"";
		if(typeof options.value == "string") {
			val = "'"+val+"'";
		}
		this.chainOrWriteLn($(el).prettySelector(),"."+options.type+"("+val+")");
	},
	
	addAssert: function(options, el){
		var val = options.value||"";
		if(typeof options.value == "string") {
			val = "'"+val+"'";
		}
		this.write("equals(S('"+$(el).prettySelector()+"')."+options.type+"(), "+val+", '"+
			options.type+" is correct');")
	},
	addChar : function(text, el){
		
		var stmntOrFunc = this.funcStatement(),
			selector = $(el).prettySelector();
		
		// if a function
		if(stmntOrFunc[0].arity == 'function'){
			//we have an empty function, insert in the 'right' place
			this.writeInFunc("S('"+selector+"').type("+text+")", stmntOrFunc)
			
		}else{
			var stmnt = stmntOrFunc,
				indent = this.funcIndent(stmnt.up()[0])
			if(stmnt.hasSelector(selector)){
				//check if method calls
				console.log(stmnt);
				if(stmnt.first()[0].second == "type"){
					var firstArg = stmnt.second().eq(0),
						str = firstArg[0].value,
						start = firstArg.start();
					
					this.insert(str+text, start+1,start+str.length+1);
				}else{
					this.insert("\n"+indent+this.indent()+this.indent()+".type(\""+text+"\")", stmnt.ender()+1);
				}
			}else{
				this.insert("\n"+indent+this.indent()+"S('"+selector+"').type(\""+text+"\");",stmnt.end()+1);
			}
		}
		
	},
	/**
	 * Inserts text into the textarea from start to end
	 * @param {Object} text
	 * @param {Object} start
	 * @param {Object} end
	 */
	insert : function(text, start, end ){
		var ta = this.element,
			current = this.val(),
			sel = this.selection();
		if(!start){
			start = sel.start
		}
		if(typeof start == 'object'){
			start = charLoc(current, start)
		}
		if(end === undefined){
			end = start;
		}
		if(typeof end == 'object'){
			end = charLoc(current, end)
		}
		var before = current.substr(0,start),
			after = current.substr(end);
			
		this.val(before+( "")+text+after);
		
		this.selection({
			start : before.length + text.length,
			end : before.length + text.length
		});
		this.element.trigger("keyup")
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
		//get an empty function or last statement
		var stmntOrFunc = this.funcStatement();
		
		// if a function
		if(stmntOrFunc[0].arity == 'function'){
			//we have an empty function, insert in the 'right' place
			this.writeInFunc("S('"+selector+"')"+text, stmntOrFunc)
			
		}else{
			var stmnt = stmntOrFunc,
				indent = this.funcIndent(stmnt.up()[0])
			if(stmnt.hasSelector(selector)){
				this.insert("\n"+indent+this.indent()+this.indent()+text, stmnt.ender()+1)
			}else{
				this.insert("\n"+indent+this.indent()+"S('"+selector+"')"+text+";",stmnt.end()+1)
			}
		}
	},
	selectPos : function(){
		return  lineLoc(this.val(), this.selection().start)
	},
	funcStatement : function(){
		var func = this.func(),
			last,
			val;
		if(func.length){
			this.openFunc(func[0]);
		}else{
			return func;
		}
		
		
		//now insert a line where we are
		var selection = this.selection();
		func = this.func();
		
		//go through the current function's statements, find the 'last' one.  Add after its end.
		var blocks = func.block();
		for(var i =0; i < blocks.length ; i++){
			var loc = blocks.eq(i).end() // charLoc(val, blocks[i].end );
			if(loc > selection.start){
				return blocks.eq(i);
			}
		}
		return blocks.length ? blocks.last() : func;
	}
	
});
var getWindow = function( element ) {
		return element.ownerDocument.defaultView || element.ownerDocument.parentWindow
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