steal.plugins('jquery/controller',
	'funcit/parse',
	'jquery/dom/selection',
	'funcit/lastselection',
	'funcit/grow',
	'jquery/dom/cur_styles').then(function($){
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
	func : function(line, from){
		return this.parser().func(line, from, from);
	},
	addEvent : function(ev, eventType){
		
		if(this.first && eventType == 'open'){
			
			
			//find the module's setup function, add to the end
			var found = this.find({type: "(identifier)", value : 'setup'})

			var lastChar = found[0].first.end,
				text = this.val(),
				loc = charLoc(text, lastChar)
			
			this.selection({
				start : loc,
				end : loc
			});
			setTimeout(this.callback('moveToLastTest'),13)
			//console.log(lastChar.line, lastChar.from)
			//this.writeBefore("Hello",lastChar)
			//this.openFunction(found[0], lastChar);
			//this.first = false;
		}
		
		var args = $.makeArray(arguments);
		
		this["add"+$.String.capitalize(eventType)].apply(this,args.slice(2))
	},
	moveToLastTest : function(){
		var found = this.find({type: "(identifier)", value : 'test'}),
			func = Funcit.Parse(found[found.length-1].parent).find({ arity: "function" }),
			end = func[0].end,
			line = this.line(end.line-1),
			chr = charLoc(this.val(), {line:  end.line - 1, from: line.length+1});
		
		this.selection({start: chr, end: chr});
		//console.log(chr)
	},
	click : function(){
		this.parse = new Funcit.Parse(this.val());
		PARSE = this.parse;
		var selection = lineLoc(this.selection().start)
		
		
		var f = this.parse.func(selection.line,selection.from,selection.from)
		//console.log(this.selection(), selection, f)
	},
	writeBefore : function(text, pos){
		
	},
	openFunc : function(func){
		if(func.line == func.end.line){
			// add a line between them
			this.insert("\n"+this.indent(func.line), func.end, func.end )
		}
	},
	line : function(line){
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
	addOpen : function(url){
		this.writeLn("S.open('"+url+"')")
	},
	addClick : function(options, el){
		//this.write("S('"+$(el).prettySelector()+"').click();")
	},
	addDrag : function(options, el){
		this.write("S('"+$(el).prettySelector()+"').drag("+$.toJSON(options)+");")
	},
	addWait: function(options, el){
		var val = options.value||"";
		if(typeof options.value == "string") {
			val = "'"+val+"'";
		}
		this.write("S('"+$(el).prettySelector()+"')."+options.type+"("+val+");")
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
		//need to check what's before current place
	},
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
	},
	writeLn : function(text){
		//only writes statements ...
		var selection = this.selection(),
			pos = lineLoc(this.val(), selection.start),
			func = this.func(pos.line, pos.from),
			last;
		
		this.openFunc(func[0]);
		
		//now insert a line where we are
		selection = this.selection();
		pos = lineLoc(this.val(), selection.start);
		func = this.func(pos.line, pos.from),
		
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
		//last character
		
		
		//this.insert("\n")
		//console.log('func', func)
		/*		
		ta.val(before+(before ? "\n" : "")+text+after) ;
		this.lastSelection ={
			start : before.length + text.length,
			end : before.length + text.length
		}

		ta.trigger("keyup")*/
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