steal.plugins('jquery').then(function($){
	/**
	 * Returns the row height of a textarea (possibly other widgets eventually)
	 */
	$.fn.rowheight = function(force){
		if(this.data('rowheight')){
			return this.data('rowheight')
		}else{
			
			var v = this.val(),
				sh = this[0].scrollHeight,
				res;
		
			this.val(v+"\n ")
			res = this[0].scrollHeight - sh;
			this.data('rowheight',res)
			this.val(v);
			return res;
		}
	}
	$.extend( $.fn.rowheight , {
	 lineLoc : function(str, num, name){
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
	charLoc : function(str, pos){
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
	
});