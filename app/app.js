steal
	.plugins(
		'jquery/controller/subscribe',
		'funcunit/syn', 
		'funcit/highlight', 
		'mxui/layout/fit', 
		'jquery/dom/form_params',
		'jquery/dom/compare')
	.then(function($){
	var getKey =  function( code ) {
		for(var key in Syn.keycodes){
			if(Syn.keycodes[key] == code){
				return key
			}
		}
	}
	var specialKeys = [
		'up', 'down', 'right', 'left', 'escape', 'page-up', 'page-down', 'home', 'end', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8', 'num9', 'delete'
	];
	
	
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
			this._boundEvents = {};
			
			this.bind(document, 'keydown', this.callback('onDocumentKeydown'))
			
			// if the a test is appended to the URL, load it and skip the form
			// http://localhost:8000/funcit/funcit.html?url=/funcunit/syn/demo.html
			var pageURLMatch = location.search && location.search.match(/\?url\=(.*)/),
				pageURL = this.options.url || (pageURLMatch && pageURLMatch[1]) || Funcit.url;
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
			this.element.trigger("addEvent",["open",url]);
			
			this.bindEventsToIframe(ev.target.contentWindow.document)
			
			this.options.open && this.options.open()
		},
		bindEventsToIframe: function(target){
		  var self = this;
			target = target || $('iframe:first')[0].contentWindow.document;
			this._currentTarget = target;
			
			var events = "keydown keypress keyup mousedown mousemove mouseup change mouseover mouseout mousewheel".split(' ');
			//target.addEventListener(keydown,func, true)
			for(var i = 0, ii = events.length; i < ii; i++){
			  if(typeof this._boundEvents['on' + $.String.capitalize(events[i])] != 'undefined'){
			    target.removeEventListener(events[i], this._boundEvents['on' + $.String.capitalize(events[i])], true);
			  }
			  this._boundEvents['on' + $.String.capitalize(events[i])] = this.callback('on' + $.String.capitalize(events[i]));
			  target.addEventListener(events[i], this._boundEvents['on' + $.String.capitalize(events[i])], true);
			}
			var mutationEvents = "DOMAttrModified DOMNodeInserted DOMNodeInserted".split(' ');
			this._boundEvents['onModified'] = this.callback('onModified');
			
			for(var i = 0, ii = mutationEvents.length; i < ii; i++){
	      target.removeEventListener(mutationEvents[i], this._boundEvents['onModified'], true);
			  target.addEventListener(mutationEvents[i], this._boundEvents['onModified'], true);
			}
			/*$(target)
				.unbind('keydown')
				.unbind('keypress')
				.unbind('keyup')
				.unbind('mousedown')
				.unbind('mousemove')
				.unbind('mouseup')
				.unbind('change')
				.unbind('mouseenter')
				.unbind('mouseout')
				.unbind('mousewheel')
				.unbind('DOMAttrModified')
				.unbind('DOMNodeInserted')
				.unbind('DOMNodeRemoved')
				.keydown(this.callback('onKeydown'))
				.keypress(this.callback('onKeypress'))
				.keyup(this.callback('onKeyup'))
				.mousedown(this.callback('onMousedown'))
				.mousemove(this.callback('onMousemove'))
				.mouseup(this.callback('onMouseup'))
				.change(this.callback('onChange'))
				.mouseenter(this.callback('onMouseenter'))
				.mouseout(this.callback('onMouseout'))
				.mousewheel(this.callback('onMousewheel'))
				.bind("DOMAttrModified", this.callback('onModified'))
				.bind("DOMNodeInserted", this.callback('onModified'))
				.bind("DOMNodeRemoved", this.callback('onModified'))*/
			$($('iframe:first')[0].contentWindow)
			  .unbind('scroll')
			  .scroll(this.callback('onScroll'))
			$('iframe:first')
			  .unbind('load')
			  .load(function(ev){
			    self.bindEventsToIframe();
			  })
		},
		onModified: function(ev){
			if(ev.type == 'DOMNodeRemoved'){
				this.publish('funcit.suggestion',{
					el: ev.target,
					type: 'missing'
				})
				
			} else if(ev.type == 'DOMNodeInserted'){
				
				if($(ev.target).parents()[0].ownerDocument == this._currentTarget){
					$(ev.target).attr('funcit-dom-inserted', true)
				}
				
				this.publish('funcit.suggestion',{
					el: ev.target,
					type: 'exists'
				})
			} else {
				var newVal = ev.newValue,
					prop = ev.attrName;
				//steal.dev.log(prop, newVal, ev.target);
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
		onMouseover : function(ev){
			$(ev.target).scroll(this.callback('onScroll'));
		},
		onMouseout : function(ev){
			if($(ev.target).compare($(ev.relatedTarget)) != 20){
				$(ev.target).unbind('scroll');
			}
			
		},
		onKeydown : function(ev){
			this.preventKeypress = false;

			this.handleEscape(ev);
			this.stopMouseOrScrollRecording(ev);
			var key = getKey(ev.keyCode);
			var addImmediately = false;
			if(typeof key == 'undefined') return;
			if(ev.keyCode == 13){
				key = '\\r';
				addImmediately = true;
			} else if(ev.keyCode == 8){
				key = '\\b';
				addImmediately = true;
			} else if(ev.keyCode == 9){
				key = '\\t';
				addImmediately = true;
			}else if((Syn.key.isSpecial(ev.keyCode) || $.inArray(key, specialKeys) > -1) && this.lastSpecialKey != key){
				this.lastSpecialKey = key;
				key = "[" + key + "]";
				addImmediately = true;
			}
			if(addImmediately){
				this.element.trigger("addEvent",["char",key, ev.target]);
				this.preventKeypress = true;
			} else {
				var controller = this;
				this.keyDownTimeout = setTimeout(function(){
					if(controller.keytarget != ev.target){
						controller.current = [];
						controller.keytarget = ev.target;
					}
					if($.inArray(key, controller.downKeys) == -1){
						controller.downKeys.push(key);
						//h.showChar(key, ev.target);
						controller.element.trigger("addEvent",["char",key, ev.target])
					}
				}, 20);
			}
			
		},
		onKeypress : function(ev){

		  if(!this.preventKeypress){
		    var key = String.fromCharCode(ev.charCode);
  			clearTimeout(this.keyDownTimeout);
  			if(this.keytarget != ev.target){
  				this.current = [];
  				this.keytarget = ev.target;
  			}
  			this.element.trigger("addEvent",["char",key, ev.target])
		  }	

		},
		onKeyup : function(ev){
			var key = getKey(ev.keyCode),
				self = this;
			if(ev.keyCode == 13){
				key = '\\r';
			}
			if(Syn.key.isSpecial(ev.keyCode)){
				delete this.lastSpecialKey;
				this.element.trigger("addEvent",["char","[" +key+"-up]", ev.target])
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
			this._selector = $(ev.target).prettySelector();
			this.mousemoves = 0
			this.lastX = ev.pageX
			this.lastY = ev.pageY;
			this.isMouseDown = true;
		},
		
		onMouseup : function(ev){
			this.publish('funcit.close_select_menu');
			this.isMouseDown = false;
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
						var controller = this,
							target = ev.target
							//prettySel = $(target).prettySelector();
						this.clickTimeout = setTimeout(function(){
							controller.element.trigger("addEvent",["click",undefined, target]);
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
		onMousewheel : function(ev, delta, deltaX, deltaY){
			if(this.scroll != null){
				var direction = "top";
				var amount = this.scroll.y;
				if(amount == 0){
					direction = "left";
					amount = this.scroll.x;
				}
				this.element.trigger("addEvent",["scroll", direction, amount, this.scroll.target]);
			}
			//steal.dev.log(this.scroll)
			//var el   = $($('iframe:first')[0].contentWindow);
			/*var elements = $(ev.target).parents().toArray();
			elements.unshift($(ev.target)[0]);
			var el = null;
			for(var i = 0; i < elements.length; i++){
				if($(elements[i]).hasScrollBar()){
					el = elements[i];
				}
			}
			steal.dev.log(el)
			var ammount = {
											top: el.scrollTop(),
											left: el.scrollLeft()
										};
			var direction = 'left';
			if(deltaX == 0){
				direction = 'top';
			}
			this.element.trigger("addEvent",["scroll", direction, ammount[direction], el]);*/
		},
		onChange : function(ev){
			if(ev.target.nodeName.toLowerCase() == "select"){

				var el = $("option:eq("+ev.target.selectedIndex+")", ev.target);
				this.element.trigger("addEvent",["change",undefined, el])
			}
		},
		onScroll: function(ev){
		  var self = this;
			this.isScrolling = true;
			this.scroll = {
				x: ev.currentTarget.scrollLeft, 
				y: ev.currentTarget.scrollTop, 
				target: ev.currentTarget
			};
			if(!this.isMouseDown){
				this.scrollTimeout && clearTimeout(this.scrollTimeout);
				this.scrollTimeout = setTimeout(function(){
				  if(self.scroll != null){
						var direction = "top";
						var amount = self.scroll.y;
						if(amount == 0){
							direction = "left";
							amount = self.scroll.x;
						}
						self.element.trigger("addEvent",["scroll", direction, amount, self.scroll.target]);
						self.isScrolling = false;
					}
				}, 50)
			}
		},
		onDocumentKeydown: function(ev){
			return;
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
				steal.dev.log(this.mouse_recording_el)
				this.element.trigger("addEvent",["move", this.mouse_recording_el,
					this.mousemove_locations.start, this.mousemove_locations.end]);
			}
		},
		getSelector : function(){
			return this._selector;
		},
		'funcit.record_scroll subscribe': function(){
			this.scroll = null;
			this.record_scroll = true;
		},
		'funcit.record_mouse subscribe': function(calling, el){
			steal.dev.log(el)
			this.mousemove_locations = {};
			this.record_mouse = true;
			this.mouse_recording_el = el;
		}
	})
	
});