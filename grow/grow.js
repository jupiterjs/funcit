steal.plugins('jquery/controller','funcit/rowheight').then(function($){

$.Controller("Funcit.Grow",{
	init : function(){
		this.element.css("overflow","hidden").attr("rows",1)
		
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
			this.element.height(sh);
			this.numLines = this.lines();
			$('#' + this.element.attr('id') + '_numbers').height(sh);
		}
		if(this.numLines !== lines ){
			this.element.height( ch - (this.numLines - lines)*this.element.rowheight() );
			$('#' + this.element.attr('id') + '_numbers').height(ch - (this.numLines - lines)*this.element.rowheight());
			//make sure it's ok
			setTimeout(this.callback('checkHeight'),0)
		}
		
	}
})

});