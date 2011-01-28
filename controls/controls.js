steal.plugins('jquery/controller', 'funcit/selectel')
	.then('codewrapper')
	.then(function($){
/**
 * Controls the command tab and inserting waits/getters/asserts into the test.
 */
$.Controller("Funcit.Controls", 
	{
		moreActions: ['open', 'move', 'trigger', 'scroll'],
		asserts: ['ok', 'equal', 'notEqual', 'deepEqual', 'notDeepEqual', 'strictEqual', 'notStrictEqual', 'raises'],
		waits: ['width', 'height', 'attr', 'position', 'size', 'css', 'innerWidth', 'innerHeight', 'hasClass', 'offset', 'exists',
				'visible','outerWidth','outerHeight','val','scrollLeft','missing','invisible','text','scrollTop','html'],
	},
	{
		init: function(){
			this.element.html('//funcit/controls/views/sidebar.ejs', {
				waits: this.Class.waits,
				asserts: this.Class.asserts,
				actions: this.Class.moreActions
			})
		},
		".getter click": function(el, ev){
			this.getterSetter(el, 'getter');
		},
		".wait click": function(el, ev){
			this.getterSetter(el, 'wait');
		},
		getterSetter: function(el, category){
			var name = el.prevAll('.name').text();
			$("iframe:first").funcit_selectel(this.callback('selected', category, name));
		},
		// called after the user selects an option and submits the form on the menu
		selected: function(category, type, waitEl){
			$("#app").trigger("addEvent",[category,{
					type : type,
					value: $(waitEl)[type]()
				}, waitEl])
		}
	})

});