steal.plugins('jquery/controller', 'funcit/mask')
	.then(function($){

$.Controller("Funcit.Selectel", {
		// this.element is an iframe
		init: function(){
			this.selecting = false;
			this.mask = $.fn.mask.el
				.hide()
				.mousemove(this.callback('mask_mousemove'))
				.mouseup(this.callback('mask_mouseup'));
		},
		update: function(callback){
			this.element.mask().show();
			$("#tooltip-click").show();
			this.document = this.element[0].contentDocument;
			this.lastInspecting = 0;
			this.callback = callback;
			this.selecting = true;
		},
		removeMask: function(){
			this.mask.hide()
		},
		mask_mousemove: function(ev){
			if(!this.selecting) return;
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
			if(!this.selecting) return;
			this.removeMask();
			$(this.highlightedEl).unhighlight();
			this.callback(this.highlightedEl, ev);
			this.selecting = false;
		},
		destroy: function(){
			this.mask.remove();
		}
	})

});