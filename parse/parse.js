steal.plugins('jquery').then('resources/jslint',function($){
var isArray = Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},
	me = new Date();
window.Funcit = (window.Funcit || {});

// an arry of nodes ...
Funcit.Parse = function(str, context){
	if(!this._parse){
		return new arguments.callee(str);
	}
	if(typeof str == 'string'){
		//console.log(str)
		this._context = str;
		JSLINT(str,{devel: true, forin: true, browser: true, windows: true, rhino: true, predefined : true, indent:  1})
		str =  JSLINT.tree;
		
	}else{
		this._context = context;
	}
	if(context && typeof context != 'string'){
		console.log(context)
	}
	if(str._parse === me){
		str = $.makeArray(str)
	}
	
	if(!$.isArray(str)){
		str = [str]
	}
	this.push.apply(this, str);
};
var p = function(tree, context){
	return new Funcit.Parse(tree, context);
}
count = 100000;
bisect = function(tree, func, parent, fnc){
	count--;
	if(count <= 0){
		console.log('outa here')
		return false;
	}
	var res;
	if(!tree || typeof tree == 'string'){
		return;
	}else if(tree.length && tree[0]){
		for(var i=0; i< tree.length;i++){
			if(parent){
				tree[i].parent = parent;
			}
			if(fnc){
				tree[i].func = fnc;
			}
			res = bisect(tree[i], func, parent && tree)
			if(res === false){
				return res;
			}
		}
	}else{
		if(parent){
			tree.parent = parent;
		}
		
		if(tree.arity == 'statement'){
			
			res = func(tree);
			if(res === false){
				return res;
			}
			res = bisect(tree.first, func, tree);
			if(res === false){
				return res;
			}
		}else{
			res = bisect(tree.first, func, tree);
			if(res === false){
				return res;
			}
			res = func(tree);
			if(res === false){
				return res;
			}
		}
		
		
		if(tree.block){
			tree.block.definedIn = parent;
			res = bisect(tree.block, func, undefined, tree)
			if(res === false){
				return res;
			}
		}
		if(tree.second){
			if(typeof tree.second == "string"){
				//func(tree)
			}else{
				if(parent){
					tree.second.parent = parent
				}
				res = bisect(tree.second, func, tree);
				if(res === false){
					return res;
				}
			}
			
			
		}
	}	
}

$.extend( Funcit.Parse.prototype, {
	_parse : me,
	each : function(func){
		return $.each(this, func)
	},
	get : function(line, from, thru, func){
		matches = [];
		if(!func){
			func = thru;
			thru = from;
		}
		bisect(this.tree || this, function(tree){
			console.log(tree, tree.line , tree.from)
			if(tree.line == line && tree.from <= from &&  from < tree.thru){
				matches.push(tree);
				return func && func(tree) ;
			}
			
		});
		return p(matches, this._context);
	},
	func : function(line, from, thru, func){
		matches = [];

		bisect(this, function(tree){
			if (tree.arity === 'function') {
				var last = tree.end;
				if (tree.line <= line && line <= last.line &&
				    (
					 (tree.line !== line && last.line !== line) ||
				     ( tree.line == line && from >= tree.from) ||
				     ( last.line == line && from <= last.from))
					) {
					matches.push(tree);
					return func && func(tree);
				}
			}
		});
		return p(matches, this._context);
	},
	last : function(){
		var last = null;
		bisect(this, function(tree){
			if(!tree || tree.thru){
				last = tree
			}
		});
	},
	statement : function(){
		var matches = [];
		this.each(function(i, tree){
			while(tree.parent && (tree = tree.parent)){};
			matches.push(tree)
		})
		return p(matches, this._context);
	},
	find : function(obj, func){
		var matches = [] 
		bisect(this, function(tree){
			var equal = true;
			for(var name in obj){
				if(obj[name] != tree[name]){
					equal  = false;
					break;
				}
			}
			if(equal){
				matches.push(tree);
				return func && func(tree) ;
			}
			
		})
		return p(matches, this._context);
	},
	S : function(){
		return this.find({type: "(identifier)", value : 'S'})
	},
	args : function(obj, func){
		return this.up().second();
	},
	push: [].push,
	//gets the last part of a function
	second : function(){
		return p(this[0].second, this._context)
	},
	first : function(){
		return p(this[0].first, this._context)
	},
	up : function(){
		var first = this[0] 
		return p(first.parent || first.definedIn || first.func, this._context)
	},
	block : function(){
		return p(this[0].block, this._context)
	},
	eq : function(num){
		return p(this[num], this._context)
	},
	start : function(){
		return charLoc(this._context, this[0])
	},
	end : function(){
		return charLoc(this._context, this[0].end)
	},
	ender : function(){
		var end = this.end(),
			space = /[\t ;]/;
		while(end > 0){
			if(!space.test( this._context[end] )){
				break;
			}
			end --
		}
		//go backwards from endpoint
		return end
	},
	last : function(){
		return p(this[this.length-1], this._context)
	},
	startLine : function(){
		
	},
	endLine : function(){
		
	},
	hasSelector : function(selector){
		var s =  this.S();
		return s.length && s.args().length && s.args()[0].value == selector
	}
})

var charLoc = function(str, pos){
	var newLine = new RegExp("\n","g"),
		previous = 0,
		total = 0,
		lines = pos.line - 1;
	while(lines && newLine.exec(str) ){
		lines --;
	}
	return newLine.lastIndex+( (pos.from || pos.thru || 1) - 1 )
}
});