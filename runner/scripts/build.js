//steal/js funcit/runner/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('funcit/runner/scripts/build.html',{to: 'funcit/runner'});
});
