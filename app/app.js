steal.plugins('jquery/controller','funcunit/syn').css('app').then(function($){
	var getKey =  function( code ) {
		for(var key in Syn.keycodes){
			if(Syn.keycodes[key] == code){
				return key
			}
		}
	}
	/**
	 * addDrag, addChar, addClick
	 */
	$.Controller('Funcit.App',{
		defaults : {
			text : "Enter the starting page's url"
		}
	},
	{
		init : function(){
			this.element.html("<form action=''><input type='text' name='url'/></form>")
				.find('input').val(this.options.text);
			this.element.addClass('loading');
			this.downKeys = [];
			this.current = [];
			this.justKey = true;
			this.mousemoves =0;
		},
		"input focusin" : function(el){
			if(el.val() == this.options.text){
				el.val("")
			}
		},
		"input focusout" : function(el){
			if(el.val() === ""){
				el.val(this.options.text)
			}
		},
		"form submit" : function(){
			var url = this.find('[name=url]').val();
			this.element.html("");
			
			//now create an iframe, bind on it, and start sending everyone else messages
			//we might need to put a mask over it if people are stopPropagation
			$("<iframe src='"+url+"'></iframe>").load(this.callback('loaded', url)).appendTo(this.element)
		},
		loaded : function(url, ev){
			this.element.removeClass('loading')
			//listen to everything on this guy ...
			this.element.trigger("addEvent",["open",url, ev.target])
			$(ev.target.contentWindow.document)
				.keydown(this.callback('onKeydown'))
				.keyup(this.callback('onKeyup'))
				.mousedown(this.callback('onMousedown'))
				.mousemove(this.callback('onMousemove'))
				.mouseup(this.callback('onMouseup'))
				.change(this.callback('onChange'))
		},
		onMousemove : function(){
			this.mousemoves++;
		},
		onKeydown : function(ev){
			var key = getKey(ev.keyCode);
			if(this.keytarget != ev.target){
				this.current = [];
				this.keytarget = ev.target;
			}
			if($.inArray(key, this.downKeys) == -1){
				this.downKeys.push(key);
				//h.showChar(key, ev.target);
				this.element.trigger("addEvent",["char",key, ev.target])
			}
		},
		onKeyup : function(ev){
			var key = getKey(ev.keyCode),
				self = this;
			if(Syn.key.isSpecial(ev.keyCode)){
				this.element.trigger("addEvent",["char",key+"-up", ev.target])
			}
			
			var location = $.inArray(key, this.downKeys);
			this.downKeys.splice(location,1);
			this.justKey = true;
			setTimeout(function(){
				self.justKey = false;
			},20)
		},
		onMousedown : function(ev){
			this.mousedownEl = ev.target;
			this.mousemoves = 0
			this.lastX = ev.pageX
			this.lastY = ev.pageY;
		},
		onMouseup : function(ev){
			if(/option/i.test(ev.target.nodeName)){

			}else if(!this.mousemoves || (this.lastX == ev.pageX && this.lastY == ev.pageY)){
				this.element.trigger("addEvent",["click",undefined, ev.target]);
			}else if(this.mousemoves > 2 && this.mousedownEl){
				this.element.trigger("addEvent",["drag",{clientX : ev.clientX,
					clientY: ev.clientY}, this.mousedownEl])
			}
			
			this.mousedownEl = null;
			this.mousemoves = 0;
			this.lastY = this.lastX = null;
		},
		onChange : function(ev){
			if(!this.justKey && ev.target.nodeName.toLowerCase() == "select"){

				var el = $("option:eq("+ev.target.selectedIndex+")", ev.target);
				this.element.trigger("addEvent",["click",undefined, el[0]])
			}
		}
	})
});