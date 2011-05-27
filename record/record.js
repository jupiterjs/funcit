steal.plugins('jquery','funcit/pretty_selector',
'funcunit/syn', 
		'funcit/highlight', 
		'mxui/layout/fit', 
		'jquery/dom/form_params',
		'jquery/dom/compare').then(function(){
	var events = "DOMAttrModified DOMNodeInserted DOMNodeRemoved keydown keypress keyup mousedown mousemove mouseup change mouseover mouseout mousewheel".split(' ');
	
	
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
	
	$.fn.funcit_record = function(cb){
		
		var el = this[0],
			isFrame = el.nodeName.toLowerCase() === 'iframe',
			win = !isFrame ? el.ownerDocument.defaultView : this[0].contentWindow,
			target = !isFrame ? el : win.document,
			old = $.data(this[0],"handle"),
			data = {},
			eventHandler = function(ev){
				HANDLER.call(data, ev, cb, win);
			};
		
		$.data(this[0],"handle", eventHandler);
		$.each(events, function(){
			if(old){
				target.removeEventListener(""+this,old, true);
			}
			target.addEventListener(""+this, eventHandler, true);
		});
		if(old){
			target.removeEventListener('scroll',old, true);
		}
		target.addEventListener('scroll', eventHandler, true)
		
	};
	
	// set to true to prevent the next keypress from sending an event
	var preventKeypress,
		lastSpecialKey,
		keyDownTimeout,
		downKeys = [],
		keytarget,
		current,
		isScrolling;
	
	
	function HANDLER(ev, cb, win){
		// understands what a user is doing
		
		// triggers addEvent ['event', data, target, prettySelector]
		
		var target = $(ev.target);
		
		if ((target[0].ownerDocument && target[0].ownerDocument.defaultView !== win) || /firebug/i.test( target[0].className)) {
			return;		
		}
		
		
		//console.log(ev)
		switch(ev.type){
			case "DOMNodeRemoved":
				cb({type: "removed",
						target: target,
						selector: target.prettySelector()})
				break;
			case 'DOMNodeInserted':
				cb({type: "added",
						target: target,
						selector: target.prettySelector()})
				//this.element.trigger("addEvent",[]);
				break;
			case 'DOMAttrModified' : 
				cb(ev);
				break;
			case 'mousemove' :
				if(this.record_mouse){
					var loc = {x: e.pageX, y: e.pageY};
					if(!this.mousemove_locations.start){
						this.mousemove_locations.start = loc;
					}
					this.mousemove_locations.end = loc;
				}
				this.mousemoves++;
				break;
			case 'mouseover' : //listen for scrolling ...
				target.scroll($.proxy(onScroll, this));
				break;
			case 'mouseout' : 
				if(target.compare($(ev.relatedTarget)) != 20){
					target.unbind('scroll');
				}
				break;
			case 'keydown' : 
			
				// 
				
				var key = getKey(ev.keyCode),
					addImmediately = false;
				
				preventKeypress = false;
				
				if(ev.keyCode == 13){
					key = '\\r';
					addImmediately = true;
				} else if(ev.keyCode == 8){
					key = '\\b';
					addImmediately = true;
				} else if(ev.keyCode == 9){
					key = '\\t';
					addImmediately = true;
				}else if((Syn.key.isSpecial(ev.keyCode) || $.inArray(key, specialKeys) > -1) && lastSpecialKey != key){
					lastSpecialKey = key;
					key = "[" + key + "]";
					addImmediately = true;
				}
				if(addImmediately){
					cb({type: "char",
						key: key,
						target: target,
						selector: target.prettySelector()
					});
					preventKeypress = true;
				} else {
					keyDownTimeout = setTimeout(function(){
						if(keytarget != ev.target){
							current = [];
							keytarget = ev.target;
						}
						if($.inArray(key, downKeys) == -1){
							downKeys.push(key);
	
							cb({type: "char",
								key: key,
								target: target,
								selector: target.prettySelector()
							} )
						}
					}, 20);
				}
				break;
			case 'keypress':
				if(!preventKeypress){
				    var key = String.fromCharCode(ev.charCode);
					clearTimeout(keyDownTimeout);
					if(keytarget != ev.target){
						current = [];
						keytarget = ev.target;
					}
					cb({type: "char",
						key: key,
						target: target,
						selector: target.prettySelector()
					})
				}	
				break;
			case 'keyup':
				var key = getKey(ev.keyCode),
					self = this;
				if(ev.keyCode == 13){
					key = '\\r';
				}
				if(Syn.key.isSpecial(ev.keyCode)){
					lastSpecialKey = undefined;
					cb({type: "char",
						key: "[" +key+"-up]",
						target: target,
						selector: target.prettySelector()
					})
				}
				
				var location = $.inArray(key, downKeys);
				downKeys.splice(location,1);
				
				//this.justKey = true;
				//setTimeout(function(){
				//	self.justKey = false;
				//},20);
				break;
			case 'mousedown':
				target.scroll($.proxy(onScroll, this));

				this.mousedownEl =target;
				this._selector = $(ev.target).prettySelector();
				this.mousemoves = 0
				this.lastX = ev.pageX
				this.lastY = ev.pageY;
				this.isMouseDown = true;
				break;
			case 'mouseup':
				this.isMouseDown = false;

				if(isScrolling){ // block scrolling recording for now
					if(this.scroll != null){
						var direction = "top";
						var amount = this.scroll.y;
						if(amount == 0){
							direction = "left";
							amount = this.scroll.x;
						}
						cb({type: "scroll",
							direction: direction,
							amount: amount,
							selector: this._selector,
							target: $(ev.currentTarget)
						});
					}
					
					isScrolling = false;
				} else {
					if(/option/i.test(ev.target.nodeName)){
	
					}else if(ev.which == 3){
						cb({type: 'rightClick', target: target, selector: target.prettySelector()});
					}else if(!this.mousemoves || (this.lastX == ev.pageX && this.lastY == ev.pageY)){
						// handle dblclick in the filter stuff ...
						cb({type: "click",
							target: target,
							selector: target.prettySelector(),
							pageX : ev.pageX,
							pageY : ev.pageY
						});
						
					if(this.clickTimeout){
							clearTimeout(this.clickTimeout);
							delete this.clickTimeout;
							/*cb({type: "dblclick",
								target: target,
								selector: target.prettySelector()
							})*/;
						} else {
							var controller = this;
								//prettySel = $(target).prettySelector();
							this.clickTimeout = setTimeout(function(){
								
								delete controller.clickTimeout;
							}, 200);
						}
					}else if(this.mousemoves > 2 && this.mousedownEl){
						cb({type: "drag",
							pageX : ev.pageX,
							pageY: ev.pageY,
							target: this.mousedownEl,
							selector: this._selector
						});

					}
	
					this.mousedownEl = null;
					this.mousemoves = 0;
					this.lastY = this.lastX = null;
				}
				break;
			case 'mousewheel':
				if(this.scroll != null){
					var direction = "top";
					var amount = this.scroll.y;
					if(amount == 0){
						direction = "left";
						amount = this.scroll.x;
					}
					cb({type: "scroll",
							direction : direction,
							amount: amount,
							target:this.scroll.target,
							selector: this.scroll.target.prettySelector()
					});
				}
				break;
			case 'change':
				if(ev.target.nodeName.toLowerCase() == "select"){
	
					var el = $("option:eq("+ev.target.selectedIndex+")", ev.target);
					
					cb({type: "change",
							target:el,
							selector: el.prettySelector()
					});
				}
				break;
			case 'scroll':
				scrollHandler = $.proxy(onScroll, this);
				scrollHandler(ev)
				if(ev.target.nodeName.toLowerCase() == "select"){
	
					var el = $("option:eq("+ev.target.selectedIndex+")", ev.target);
					cb({type: "change",
							target:el,
							selector: el.prettySelector()
					});
				}
				break;
			
		}
		
		
		function onScroll(ev){
			isScrolling = true;
			this.scroll = {
				x: ev.currentTarget.scrollLeft, 
				y: ev.currentTarget.scrollTop, 
				target:$(ev.currentTarget) 
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
						cb(  {
							type: "scroll",
							direction: direction,
							amount: amount,
							target: self.scroll,
							selector: self.scroll.prettySelector()
						} );
						isScrolling = false;
					}
				}, 50)
			}
		}
	};
	
	
	 
})
