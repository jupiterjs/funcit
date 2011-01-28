steal.plugins('jquery/controller', 'funcit/selectel')
	.then('codewrapper')
	.then(function($){
/**
 * Controls the command tab and inserting waits/getters/asserts into the test.
 */
$.Controller("Funcit.Controls", {
		init: function(){
			this.lastInspecting = 0;
		},
		// user has clicked Wait or Assert
		"a click": function(el, ev){
			ev.preventDefault();
			this.type = el.text();
			this.category = el.closest(".commandcol").attr("id");
			$("iframe:first").funcit_selectel(this.callback('selected'));
		},
		// called after the user selects an option and submits the form on the menu
		selected: function(waitEl){
			$("#app").trigger("addEvent",[this.category,{
					type : this.type,
					value: $(waitEl)[this.type]()
				}, waitEl])
		}
	})

});