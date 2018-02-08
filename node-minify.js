/**
    Minify javascript code using UglifyJS2
    @see https://github.com/mishoo/UglifyJS2
    @param {String} code - The javascript code to minify
*/

var UglifyJS = require("uglify-js");
//var program = require("commander");
var fs = require("fs");

var ast = UglifyJS.parse(fs.readFileSync(process.argv[2], "utf8"));
ast.figure_out_scope();
compressor = UglifyJS.Compressor();
ast = ast.transform(compressor);
fs.writeFileSync(process.argv[3], ast.print_to_string());
