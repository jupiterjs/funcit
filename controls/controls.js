steal.plugins('jquery/controller').then(function($){

$.Controller("Funcit.Controls", {
		init: function(){
			this.lastInspecting = 0;
		},
		// user has clicked Wait or Assert
		"a click": function(el, ev){
			ev.preventDefault();
			this.type = el.attr('class');
			this.addMask();
			this.find('.step2').show();
			this.find('.step1').hide();
		},
		addMask: function(){
			if(!this.mask){
				this.mask = $("<div class='controls_overlay' />").appendTo(document.body);
				this.mask.mousemove(this.callback('mask_mousemove'));
				this.mask.mouseup(this.callback('mask_mouseup'));
			}
			
			this.document = $("iframe:first")[0].contentDocument;
			
			var body = $(this.document.body),
				offset = body.offset(),
				width = body.width(),
				height = body.height();
				
			this.mask
				.offset({
					left: offset.left,
					top: offset.top
				})
				.width(width)
				.height(height)
				.show()
		},
		removeMask: function(){
			this.mask.hide()
		},
		mask_mousemove: function(ev){
	        if (new Date().getTime() - this.lastInspecting > 30) {
				this.mask.hide();
				this.highlightedEl = this.document.elementFromPoint(ev.clientX, ev.clientY);
				this.mask.show();
				$(this.highlightedEl).highlight();
			}
            this.lastInspecting = new Date().getTime();
		},
		mask_mouseup: function(ev){
			$(".funcit_wait_menu").controller().open(this.callback('selected', this.highlightedEl), this.highlightedEl);
			this.removeMask();
			this.find('.step2').hide();
			this.find('.step1').show();
		},
		// called after the user selects an option and submits the form on the menu
		selected: function(waitEl, type, value){
			$(this.highlightedEl).unhighlight();
			$("#app").trigger("addEvent",[this.type,{
					type : type,
					value: value
				}, waitEl])
		},
		destroy: function(){
			this.mask.remove();
		}
	})

});