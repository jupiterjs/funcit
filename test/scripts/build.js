//steal/js funcit/test/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('funcit/test/scripts/build.html',{to: 'funcit/test'});
});
