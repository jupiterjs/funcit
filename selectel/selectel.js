steal.plugins('jquery/controller', 'funcit/mask')
	.then(function($){

$.Controller("Funcit.Selectel", {
		// this.element is an iframe
		init: function(){
			this.selecting = false;
			$(document.body)
				.delegate(".controls_overlay", "mousemove", this.callback('mask_mousemove'))
				.delegate(".controls_overlay", "mouseup", this.callback('mask_mouseup'));
		},
		update: function(callback){
			this.mask = this.element.mask().show();
			$("#tooltip-click").text('Click on any HTML element to setup the action').show();
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
		}
	})

});