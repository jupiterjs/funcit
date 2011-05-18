var options = {output: ""}
runCommand('./js', 'funcit/scripts/check_commas.js', options)
if(options.output != ""){
	print("Some files contain errors (trailing commas or syntax errors)!");
	// print(options.output) // Print output from the script
}