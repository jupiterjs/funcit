//steal/js funcit/defaulttext/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('funcit/defaulttext/scripts/build.html',{to: 'funcit/defaulttext'});
});
