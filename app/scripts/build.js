//steal/js funcit/app/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('funcit/app/scripts/build.html',{to: 'funcit/app'});
});
