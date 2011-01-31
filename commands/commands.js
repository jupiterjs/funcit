steal.plugins('jquery/controller/subscribe', 'funcit/selectel')
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
		"#assert li mousedown": function(el, ev){
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
		'#actions #action-open click': function(el, ev){
			ev.preventDefault();
			this.loadPrompt('//funcit/commands/views/open.ejs');
		},
		loadPrompt: function(view_url){
			$("iframe:first").mask().addClass('syncing').html(view_url, {});
		},
		getterSetter: function(el, category){
			var name = el.prevAll('.name').text();
			$("iframe:first").funcit_selectel(this.callback('selected', category, name));
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
		},
		// called after the user selects an option and submits the form on the menu
		selected: function(category, type, waitEl){
			var val = $(waitEl)[type]? $(waitEl)[type](): null;
			$("#app").trigger("addEvent",[category,{
					type : type,
					value: val
				}, waitEl])
		}
	})

});