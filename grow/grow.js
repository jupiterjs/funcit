steal.plugins('jquery/controller').then(function($){

$.Controller("Funcit.Grow",{
	init : function(){
		this.element.css("overflow","hidden").attr("rows",1)
		
		var v = this.element.val(),
			sh = this.element[0].scrollHeight;
		
		this.element.val(v+"\n ")
		this.diff = this.element[0].scrollHeight - sh;
		this.element.val(v);
		this.numLines = this.lines();
		this.checkHeight();
	},
	lines : function(){
		return this.element.val().split("\n").length
	},
	keyup : function(){
		this.checkHeight();
		//setTimeout(,0)
	},
	checkHeight : function(){
		var sh = this.element[0].scrollHeight,
			ch = this.element.height(),
			lines = this.lines();
		if(sh > ch){
			this.element.height(sh)
			this.numLines = this.lines();
		}
		if(this.numLines !== lines ){
			this.element.height( ch - (this.numLines - lines)*this.diff );
			//make sure it's ok
			setTimeout(this.callback('checkHeight'),0)
		}
	}
})

});