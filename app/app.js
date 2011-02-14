steal
	.plugins('steal/less')
	.then(function($){
		//steal.less('app')
	})
	.plugins('jquery/controller/subscribe','funcunit/syn', 
		'funcit/highlight', 'mxui/fittable', 'jquery/dom/form_params', 
		'jquery/controller/subscribe')
	.then(function($){
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
			this.downKeys = [];
			this.current = [];
			this.justKey = true;
			this.mousemoves =0;
			this.hoveredEl = null;
			this.record = true;
			
			
			this.bind(document, 'keydown', this.callback('onDocumentKeydown'))
			
			// if the a test is appended to the URL, load it and skip the form
			// http://localhost:8000/funcit/funcit.html?url=/funcunit/syn/demo.html
			var pageURLMatch = location.search && location.search.match(/\?url\=(.*)/),
				pageURL = (pageURLMatch && pageURLMatch[1]) || Funcit.url;
			if(pageURL){
				this.loadIframe(pageURL);
				return;
			}
			
			this.element.html("<form action=''><input type='text' name='url'/></form>")
				.find('input').val(this.options.text);
			this.element.addClass('loading');
			
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
			this.loadIframe(url);
		},
		/**
		 * Called by the open command and starts the app up.  It either creates an iframe or, if one 
		 * exists, reloads it, calling loaded when its done.
		 * @param {Object} url The url of the page to load in the iframe
		 */
		loadIframe: function(url){
			var iframe = $("iframe"),
				callback = this.callback('loaded', url);
			if (!iframe.length) {
				//now create an iframe, bind on it, and start sending everyone else messages
				//we might need to put a mask over it if people are stopPropagation
				$("<iframe src='" + url + "'></iframe>").load(callback).appendTo(this.element)
			} else {
				FuncUnit.frame = iframe[0];
				FuncUnit._open(url);
				iframe.load(callback)
			}
			
		},
		loaded : function(url, ev){
			$(ev.target).unbind('load')
			var controller = this;
			this.element.removeClass('loading')
			//listen to everything on this guy ...
			this.element.trigger("addEvent",["open",url])
			this.bindEventsToIframe(ev.target.contentWindow.document)
		},
		bindEventsToIframe: function(target){
			console.log(target)
			target = target || $('iframe:first')[0].contentWindow.document;
			$(target)
				.keydown(this.callback('onKeydown'))
				.keyup(this.callback('onKeyup'))
				.mousedown(this.callback('onMousedown'))
				.mousemove(this.callback('onMousemove'))
				.mouseup(this.callback('onMouseup'))
				.change(this.callback('onChange'))
				.mouseover(this.callback('onMouseenter'))
				.mouseout(this.callback('onMouseout'))
//				.bind("DOMAttrModified",this.callback('onModified'))
//				.bind("DOMNodeInserted",function(ev){
//					//console.log(ev.originalEvent.attrName, ev.target, ev.originalEvent.newValue)
//				})
//				.bind("DOMNodeRemoved",function(ev){
//					//console.log(ev.originalEvent.attrName, ev.target, ev.originalEvent.newValue)
//				})
		},
		onModified: function(ev){
			var newVal = ev.originalEvent.newValue,
				prop = ev.originalEvent.attrName;
			//console.log(prop, newVal, ev.target);
			if(prop == 'style'){
				var attrArr = newVal.split(":"),
					attr = attrArr[0],
					val = attrArr[1];
				if(attr == 'display'){
					if (/block/.test(val)) {
						this.publish('funcit.suggestion',{
							el: ev.target,
							type: 'visible'
						})
					}
					else if (/none/.test(val)) {
						this.publish('funcit.suggestion',{
							el: ev.target,
							type: 'invisible'
						})
					}
				}
			}
		},
		onMousemove : function(e){
			if(this.record_mouse){
				var loc = {x: e.pageX, y: e.pageY};
				if(!this.mousemove_locations.start){
					this.mousemove_locations.start = loc;
				}
				this.mousemove_locations.end = loc;
			}
			this.mousemoves++;
		},
		onMouseenter : function(ev){
			//if(this.record_scroll){
				$(ev.target).scroll(this.callback('onScroll'));
			//}
		},
		onMouseout : function(ev){
			//if(this.record_scroll){
				$(ev.target).unbind('scroll');
			//}
		},
		onKeydown : function(ev){
			this.handleEscape(ev);
			this.stopMouseOrScrollRecording(ev);
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
			$(ev.target).scroll(this.callback('onScroll'));
			if(this.record_mouse){
				this.stopMouseRecording(true);
			}
			this.mousedownEl = ev.target;
			this.mousemoves = 0
			this.lastX = ev.pageX
			this.lastY = ev.pageY;
		},
		
		onMouseup : function(ev){
			this.publish('funcit.close_select_menu');
			if(this.isScrolling){
				if(this.scroll != null){
					var direction = "top";
					var amount = this.scroll.y;
					if(amount == 0){
						direction = "left";
						amount = this.scroll.x;
					}
					this.element.trigger("addEvent",["scroll", direction, amount, this.scroll.target]);
				}
				
				this.isScrolling = false;
			} else {
				if(/option/i.test(ev.target.nodeName)){

				}else if(ev.which == 3){
					this.element.trigger("addEvent", ['rightClick', undefined, ev.target]);
				}else if(!this.mousemoves || (this.lastX == ev.pageX && this.lastY == ev.pageY)){
					if(this.clickTimeout){
						clearTimeout(this.clickTimeout);
						delete this.clickTimeout;
						this.element.trigger("addEvent",["doubleClick",undefined, ev.target]);
					} else {
						var controller = this;
						this.clickTimeout = setTimeout(function(){
							controller.element.trigger("addEvent",["click",undefined, ev.target]);
							delete controller.clickTimeout;
						}, 200);
					}
				}else if(this.mousemoves > 2 && this.mousedownEl){
					this.element.trigger("addEvent",["drag",{clientX : ev.clientX,
						clientY: ev.clientY}, this.mousedownEl])
				}

				this.mousedownEl = null;
				this.mousemoves = 0;
				this.lastY = this.lastX = null;
			}
			
		},
		onChange : function(ev){
			if(!this.justKey && ev.target.nodeName.toLowerCase() == "select"){

				var el = $("option:eq("+ev.target.selectedIndex+")", ev.target);
				this.element.trigger("addEvent",["click",undefined, el[0]])
			}
		},
		onScroll: function(ev){
			this.isScrolling = true;
			this.scroll = {
				x: ev.currentTarget.scrollLeft, 
				y: ev.currentTarget.scrollTop, 
				target: ev.currentTarget
			};
		},
		onDocumentKeydown: function(ev){
			this.handleEscape(ev);
			this.stopMouseOrScrollRecording(ev);
		},
		handleEscape: function(ev){
			if(ev.keyCode == 27){
				this.stopMouseRecording(false);
				this.stopScrollRecording(false);
				this.publish('funcit.escape_keydown')
			}
		},
		stopMouseOrScrollRecording: function(ev){
			if(ev.keyCode == 83 /* s */ && this.begin_record_mouse){
				this.begin_record_mouse = false;
				this.record_mouse = true;
				Funcit.Tooltip.open($.View('//funcit/commands/views/move_recording'));
			}
			if (ev.keyCode == 70 /* f */ && this.record_mouse) {
				this.stopMouseRecording(true);
			}
			if(ev.keyCode == 83 && this.record_scroll){
				this.stopScrollRecording(true);
			}
		},
		stopScrollRecording: function(triggerEvent){
			this.record_scroll = false;
			Funcit.Tooltip.close();
			if(this.scroll != null){
				var direction = "top";
				var amount = this.scroll.y;
				if(amount == 0){
					direction = "left";
					amount = this.scroll.x;
				}
				if(triggerEvent){
					this.element.trigger("addEvent",["scroll", direction, amount, this.scroll.target]);
				}
			}
		},
		stopMouseRecording: function(triggerEvent){
			Funcit.Tooltip.close();
			this.record_mouse = false;
			if(triggerEvent){
				this.element.trigger("addEvent",["move", 
					this.mousemove_locations.start, this.mousemove_locations.end]);
			}
		},
		'funcit.record_scroll subscribe': function(){
			this.scroll = null;
			this.record_scroll = true;
		},
		'funcit.record_mouse subscribe': function(){
			this.mousemove_locations = {};
			this.begin_record_mouse = true;
		},
	})
	
});