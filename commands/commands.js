steal.plugins('jquery/controller/subscribe', 'funcit/selectel')
	.then('dialog', 'select_menu')
	.then(function($){
/**
 * Controls the command tab and inserting waits/getters/asserts into the test.
 */
$.Controller("Funcit.Commands", 
	{
		moreActions: ['open', 'move', 'trigger', 'scroll'],
		asserts: {
			'ok': 2, 
			'equal': 3, 
			'notEqual': 3, 
			'deepEqual': 3, 
			'notDeepEqual': 3, 
			'strictEqual': 3, 
			'notStrictEqual': 3, 
			'raises': 2
		},
		waits: ["attr", "css", "exists", "hasClass", "height", "html", "innerHeight", "innerWidth", "invisible", "missing", "offset", "outerHeight", "outerWidth", "position", "scrollLeft", "scrollTop", "size", "text", "val", "visible", "width"],
	},
	{
		init: function(){
			this.element.html('//funcit/commands/views/sidebar.ejs', {
				waits: this.Class.waits,
				asserts: this.Class.asserts,
				actions: this.Class.moreActions
			})
		},
		"#assert li click": function(el, ev){
			var name = el.text();
			$("#app").trigger("addEvent",['assert',{
					type : name
				}])
		},
		".getter click": function(el, ev){
			this.getterSetter(el, 'getter');
		},
		".wait click": function(el, ev){
			if(el.closest('.command').hasClass('suggestion')){
				return this.suggest();
			}
			this.getterSetter(el, 'wait');
		},
		'.open click': function(el, ev){
			ev.preventDefault();
			this.loadPrompt('//funcit/commands/views/open.ejs');
		},
		'.trigger click': function(el, ev){
			$("iframe:first").funcit_selectel(this.callback('afterTrigger'));
		},
		afterTrigger: function(el, ev){
			var $el = $(el);
			var callback = this.callback('selected', el);
			$('.funcit_dialog').funcit_dialog(ev, callback);
		},
		loadPrompt: function(view_url){
			$("iframe:first").mask().addClass('syncing').html(view_url, {});
		},
		getterSetter: function(el, category){
			var name = el.prevAll('.name').text();
			if(this[name + 'Handler']){ // handle special cases
				return this[name + 'Handler'](el, category);
			}
			// default behavior
			$("iframe:first").funcit_selectel(this.callback('selected', category, name));
		},
		// called after the user selects an option and submits the form on the menu
		selected: function(category, type, el, val){
			var val = val || ($(el)[type]? $(el)[type](): null);
			$("#app").trigger("addEvent",[category,{
					type : type,
					value: val
				}, el]);
		},
		attrHandler: function(el, category){
			$("iframe:first").funcit_selectel(this.callback('afterAttr', category));
		},
		cssHandler: function(el, category){
			$("iframe:first").funcit_selectel(this.callback('afterCss', category));
		},
		hasClassHandler: function(el, category){
			$("iframe:first").funcit_selectel(this.callback('afterHasClass', category));
		},
		afterHasClass: function(category, el, ev){
			var $el = $(el);
			var options = $el.attr('class').split(/\s+/);
			var callback = this.callback('selected', category, "hasClass", el);
			$('.funcit_select_menu').funcit_select_menu(ev, options, callback, 'Select Class');
		},
		afterCss: function(category, el, ev){
			var $el = $(el), style = $el.attr('style');
			/* Naive CSS parsing */
			var styles = style.split(';');
			var styleNames = [];
			for(var i = 0, ii = styles.length; i < ii; i++){
				var declarationName = $.String.strip(styles[i].split(':')[0]);
				if(declarationName != '') 
					styleNames.push(declarationName);
			}
			var callback = this.callback('selected', category, "css", el);
			$('.funcit_select_menu').funcit_select_menu(ev, styleNames, callback, 'Select style');
		},
		afterAttr: function(category, el, ev){
			var $el = $(el);
			var options = $el.listAttributes();
			var callback = this.callback('selected', category, "attr", el);
			$('.funcit_select_menu').funcit_select_menu(ev, options, callback, 'Select Attribute');
		},
		// only one suggestion at a time
		// TODO throttle this a little
		"funcit.suggestion subscribe": function(called, params){
			this.find('.suggestion').removeClass('suggestion');
			this.find("."+params.type).addClass('suggestion');
			this.suggestion = {
				el: params.el,
				type: params.type
			}
		},
		suggest: function(){
			this.find('.suggestion').removeClass('suggestion');
			this.selected('wait', this.suggestion.type, this.suggestion.el)
		}
	})

});