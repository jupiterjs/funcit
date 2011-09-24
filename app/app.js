steal(
		'jquery/controller/subscribe',
		'funcunit/syn', 
		'funcit/highlight', 
		'mxui/layout/fit', 
		'jquery/dom/form_params',
		'jquery/dom/compare',
<<<<<<< HEAD
		function($){
=======
		'funcit/filter')
	.then(function($){
		

	var events = "DOMAttrModified DOMNodeInserted DOMNodeRemoved keydown keypress keyup mousedown mousemove mouseup change mouseover mouseout mousewheel".split(' ');
	
>>>>>>> cfc7e6583d2c9cc7f00c664c0b1e65dec7ed00b7
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
			this._boundEventHandler;
			
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
			
		  var self = this,
		  	  old = this._boundEventHandler;
			target = target || $('iframe:first')[0].contentWindow.document;
			this._currentTarget = target;
			
			this._boundEventHandler = this.callback('handler');
			
			//$('iframe:first').funcit_record(this._boundEventHandler)
			var calls = []
			var fs = Funcit.filters;
			$('iframe:first').funcit_filter(fs.visible,
				fs.dblclick,
				fs.similarText,
				fs.count,
				fs.lastmodified, this._boundEventHandler)
			
			
			$('iframe:first')
			  .unbind('load')
			  .load(function(ev){
			    self.bindEventsToIframe();
			  })
		},
		inFrame : function(target){
			return true // TODO: Fix this !!!!
			return target[0] && target[0].ownerDocument.defaultView == this._currentTarget 
		},
		handler : function(ev){
			/*$(ev.target).funcit_filter(Funcit.filter.dblclick, function(cb){
				cb()
				console.log('bleeeeee')
			})*/
			
			console.log('Event: ', ev)
			// understands what a user is doing
			
			// triggers addEvent ['event', data, target, prettySelector]
			
			this.element.trigger("addEvent", [ev.type, ev]);
			
			return
			
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
					this.element.trigger("addEvent",["scroll", this.scroll.target, direction, amount]);
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