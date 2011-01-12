steal.plugins('jquery/controller', 'mxui/fittable').then(function($){
	$.Controller("Funcit.WaitMenu",{
		// 0 - takes no params
		// 1 - takes 1 param and the default can be obtained from this method (ie: width)
		// 2 - special case
		commands: {
			width: 1, 
			height: 1,
			innerWidth: 1, 
			innerHeight: 1, 
			outerWidth: 1,
			outerHeight: 1,
			attr: 2,
			hasClass: 2,
			val: 1,
			text: 1,
			html: 1,
			position: 1,
			offset: 1,
			scrollLeft: 1,
			scrollTop: 1,
			size: 1,
			exists: 0,
			missing: 0,
			css: 2,
			visible: 0,
			invisible: 0
		}
	},{
		init: function(){
			this.element.hide();
		},
		// if we click inside the menu, don't let it close the menu
		click: function(el, ev){
			ev.stopPropagation();
		},
		"form submit": function(el, ev){
			ev.preventDefault();
			var params = el.formParams();
			this.callback(params.type, params.commandval);
			this.close();
		},
		".types li mouseover": function(el, ev){
			el.css('color', 'Black');
		},
		".types li mouseout": function(el, ev){
			el.css('color', '')
		},
		".types li click": function(el, ev){
			var round = function(num){
				return Math.round(num*100)/100
			}
			var type = el.text(), 
				valType = this.Class.commands[type];
			
			this.find('.selected').removeClass('selected');
			this.element.scrollTop(0);
			el.addClass('selected');
			el.find("input").attr("checked", true);
			
			// update the statement
			this.find('.statement .statement_type').text(type)
			
			// hide/show steps
			this.find('.step1').hide();
			this.find('.step2').show();
			
			// update the value selector
			if(valType == 0){
				this.find('.statement .statement_value').text("")
			} // no args, do nothing
			else if (valType == 1) { // single arg 
				var defaultVal = this.target[type]();
				this.find('.value_input input').val(defaultVal);
				this.find('.value_input').html("//funcit/app/views/singlearg", {
					value: defaultVal
				});
				this.find('.statement .statement_value').text(defaultVal)
			}
			else if (valType == 2) { // special case
				if(type == "hasClass"){
					var className = this.target.attr('class'), 
						options; 
					if(!/\w/.test(className)) {
						options = [];
					}
					else {
						options = className.split(" ");
					}
					this.find('.value_input').html("//funcit/app/views/hasclass", {
						options: options
					});
				}
			}
			
			this.find('.value_selector').show();
		},
		open: function(callback, target){
			this.callback = callback;
			this.target = $(target);
			this.element.html("//funcit/app/views/menu", {
				options: this.Class.commands,
				selector: this.target.prettySelector()
			})
			this.element.css("opacity",0);
			this.element.fit({
				within: 10,
				of: this.target
			})
			this.element.css("opacity",1);
			 
			this.appDocument = $($("iframe:first")[0].contentDocument);
			this.appClick = function(ev){ self.close(); }
			var self = this;
			setTimeout(function(){
				self.appDocument.click(self.appClick)
			}, 0);
		},
		close: function(){
			this.element.hide();
			$('.highlight').hide();
			if (this.appDocument) {
				this.appDocument.unbind('click', this.appClick);
			}
		}
	})
});