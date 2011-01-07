//steal/js funcit/editor/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('funcit/editor/scripts/build.html',{to: 'funcit/editor'});
});
