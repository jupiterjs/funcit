steal.plugins('jquery/controller', 'funcit/mask')
	.then(function($){

$.Controller("Funcit.Selectel", {
		// this.element is an iframe
		init: function(){
			this.mask = this.element.mask();
			this.mask.hide();
			this.mask.mousemove(this.callback('mask_mousemove'));
			this.mask.mouseup(this.callback('mask_mouseup'));
		},
		update: function(callback){
			$("#tooltip-click").show();
			this.document = this.element[0].contentDocument;
			this.mask.show();
			this.lastInspecting = 0;
			this.callback = callback;
		},
		removeMask: function(){
			this.mask.hide()
		},
		mask_mousemove: function(ev){
			// throttle this function a little
			setTimeout(function(){$("#tooltip-click").fadeOut()}, 500);
	        if (new Date().getTime() - this.lastInspecting > 30) {
				this.mask.hide();
				this.highlightedEl = this.document.elementFromPoint(ev.clientX, ev.clientY);
				this.mask.show();
				if(this.highlightedEl) {
					$(this.highlightedEl).highlight();
				}
			}
            this.lastInspecting = new Date().getTime();
		},
		mask_mouseup: function(ev){
			this.removeMask();
			$(this.highlightedEl).unhighlight();
			this.callback(this.highlightedEl, ev);
		},
		destroy: function(){
			this.mask.remove();
		}
	})

});