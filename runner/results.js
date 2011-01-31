steal.plugins('jquery/controller', 'jquery/controller/subscribe')
	.then(function($){

$.Controller("Funcit.Results", {
	init: function(){
		QUnit.log = this.callback('assert');
		QUnit.moduleStart = this.callback('module_start');
		QUnit.testStart = this.callback('test_start');
		QUnit.testDone = this.callback('test_done');
	},
	assert: function(result, message){
		this.element.append('//funcit/runner/views/assert.ejs', {
			result: result,
			message: message
		})
	},
	module_start: function(name){
		this.module = name;
	},
	test_start: function(name){
		this.element.html('//funcit/runner/views/test.ejs', {
			test: name,
			module: this.module
		})
	},
	test_done: function(name, failures, total){
		var passes = total-failures;
		this.find('.totals').text('//funcit/runner/views/done.ejs', {
			failures: failures,
			total: total,
			passes: passes
		})
	}
})

});