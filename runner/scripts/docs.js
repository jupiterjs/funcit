//js funcit/runner/scripts/doc.js

load('steal/rhino/steal.js');
steal.plugins("documentjs").then(function(){
	DocumentJS('funcit/runner/runner.html');
});