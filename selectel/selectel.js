steal.plugins('jquery/controller', 'funcit/mask')
	.then(function($){

$.Controller("Funcit.Selectel", {
		select: function(callback){
			$("iframe:first").mask();
			$('.controls_overlay').funcit_selectel(callback);
		}
	},{
		// this.element is a mask over the iframe
		init: function(){
			this.selecting = false;
			this.iframe = $("iframe:first");
			this.document = this.iframe[0].contentDocument;
		},
		update: function(callback){
			this.iframe.mask().show();
			Funcit.Tooltip.open($.View('//funcit/selectel/views/tooltip', {}))
			this.lastInspecting = 0;
			this.callback = callback;
			this.selecting = true;
		},
		mousemove: function(el, ev){
			if(!this.selecting) return;
			// throttle this function a little
			Funcit.Tooltip.close(500);
	        if (new Date().getTime() - this.lastInspecting > 30) {
				this.element.hide();
				this.highlightedEl = this.document.elementFromPoint(ev.clientX, ev.clientY);
				this.element.show();
				if(this.highlightedEl) {
					$(this.highlightedEl).highlight();
				}
			}
            this.lastInspecting = new Date().getTime();
		},
		mouseup: function(el, ev){
			if(!this.selecting) return;
			this.element.hide();
			$(this.highlightedEl).unhighlight();
			this.callback(this.highlightedEl, ev);
			this.selecting = false;
		}
	})

});