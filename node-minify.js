/**
    Minify javascript code using UglifyJS
    @see https://github.com/mishoo/UglifyJS2
*/

var UglifyJS = require("uglify-js");
var fs = require("fs");

var ast = UglifyJS.parse(fs.readFileSync(process.argv[2], "utf8"));
ast.figure_out_scope();
compressor = UglifyJS.Compressor();
ast = ast.transform(compressor);
fs.writeFileSync(process.argv[3], ast.print_to_string());
