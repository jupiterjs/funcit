steal.plugins('jquery/controller/subscribe', 'funcit/selectel')
	.then('dialog', 'select_menu', 'tooltip','modal', 'open_page')
	.then(function($){
/**
 * Controls the command tab and inserting waits/getters/asserts into the test.
 */
$.Controller("Funcit.Commands", 
	{
		moreActions: ['open', 'move', 'trigger'],
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
		waits: ["attr", "css", "exists", "hasClass", "height", "html", "innerHeight", "innerWidth", "invisible", "missing", "offset", "outerHeight", "outerWidth", "position", "scrollLeft", "scrollTop", "size", "text", "val", "visible", "width"]
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
			ev.preventDefault();
			var name = el.text();
			$("#app").trigger("addEvent",['assert',{
					type : name
				}])
		},
		".getter click": function(el, ev){
			ev.preventDefault();
			this.getterSetter(el, 'getter');
		},
		".wait click": function(el, ev){
			ev.preventDefault();
			if(el.closest('.command').hasClass('suggestion')){
				return this.suggest();
			}
			this.getterSetter(el, 'wait');
		},
		'.open click': function(el, ev){
			ev.preventDefault();
			Funcit.Modal.open($.View('//funcit/commands/views/open.ejs'));
		},
		'.scroll click' : function(el, ev){
			ev.preventDefault();
			Funcit.Tooltip.open($.View('//funcit/commands/views/scroll'));
			this.publish('funcit.record_scroll')
		},
		'.trigger click': function(el, ev){
			ev.preventDefault();
			Funcit.Selectel.select(this.callback('afterTrigger'));
		},
		'.move click': function(el, ev){
			ev.preventDefault();
			//Funcit.Tooltip.open($.View('//funcit/commands/views/move'));
			Funcit.Selectel.select(this.callback('afterMove'))
		},
		afterTrigger: function(el, ev){
			var callback = this.callback('writeTrigger', el);
			$('.funcit_dialog').funcit_dialog(ev, callback);
		},
		writeOpen: function(url){
			$("#app").trigger("addEvent",["open", url]);
		},
		writeTrigger: function(el, eventName){
			$("#app").trigger("addEvent",["trigger", eventName, el]);
		},
		getterSetter: function(el, category){
			var name = el.prevAll('.name').text();
			if(this[name + 'Handler']){ // handle special cases
				return this[name + 'Handler'](el, category);
			}
			// default behavior
			Funcit.Selectel.select(this.callback('selected', category, name));
		},
		// called after the user selects an option and submits the form on the menu
		selected: function(category, type, el, selected){
			Funcit.Tooltip.close();
			var val, result;
						
			if(type == 'css'){
				val = selected;
				result = $(el).curStyles(val)[val];
			}else{
				val = $(el)[type]? $(el)[type](): null;
			}
				
			if(type == 'attr'){
				val = selected;
				result = $(el).attr(selected);
			} 
			
			if(type == 'hasClass'){
				val    = selected;
				result = selected;
			}
		
			if(type == 'position' || type == 'offset'){
			  val.top = Math.round((val.top || 0) * 10) / 10;
				val.left = Math.round((val.left || 0) * 10) / 10;
			}
		
			if($.inArray(type, ['height', 'innerHeight', 'innerWidth', 'outerHeight', 'outerWidth', 'scrollLeft', 'scrollTop', 'width']) > -1){
				val = Math.round((val || 0) * 10) / 10;
			}
		
			$("#app").trigger("addEvent",[category,{
					type : type,
					value: val,
					// result is used for commands that have key value pairs like css and attr
					result: result
				}, el]);
		},
		
		attrHandler: function(el, category){
			Funcit.Selectel.select(this.callback('afterAttr', category));
		},
		cssHandler: function(el, category){
			Funcit.Selectel.select(this.callback('afterCss', category));
		},
		hasClassHandler: function(el, category){
			Funcit.Selectel.select(this.callback('afterHasClass', category));
		},
		afterHasClass: function(category, el, ev){
			var $el = $(el);
			var options = $el.attr('class').split(/\s+/);
			var callback = this.callback('selected', category, "hasClass", el);
			$('.funcit_select_menu').funcit_select_menu(ev, options, callback, 'Select Class');
		},
		afterCss: function(category, el, ev){
			var $el = $(el), style = $el.attr('style');
			var styleNames = [];
			if(typeof style != 'undefined'){
				/* Naive CSS parsing */
				var styles = style.split(';');
				
				for(var i = 0, ii = styles.length; i < ii; i++){
					var declarationName = $.String.strip(styles[i].split(':')[0]);
					if(declarationName != '') 
						styleNames.push(declarationName);
				}
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
		afterMove : function(el, ev){
			this.publish('funcit.record_mouse', el)
			Funcit.Tooltip.open($.View('//funcit/commands/views/move_recording'));
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

})
.views(
	'dialog.ejs',
	'move_recording.ejs',
	'move.ejs',
	'open.ejs',
	'scroll.ejs',
	'select.ejs',
	'select.ejs',
	'sidebar.ejs',
	'tooltip.ejs'
);