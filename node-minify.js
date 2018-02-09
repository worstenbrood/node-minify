/**
    Minify javascript/CSS using UglifyJS/UglifyCSS
    @see https://github.com/mishoo/UglifyJS2
    @see https://github.com/fmarcia/UglifyCSS
*/

var UglifyJS = require("uglify-js");
var UglifyCSS = require("uglifycss");
var fs = require("fs");
var path = require('path')

function ProcessJS(inFile, outFile) {
    var ast = UglifyJS.parse(fs.readFileSync(inFile, "utf8"));
    ast.figure_out_scope();
    compressor = UglifyJS.Compressor({hoist_funs: false});
    ast = ast.transform(compressor);
    ast.figure_out_scope();
    ast.compute_char_frequency();
    ast.mangle_names();
    fs.writeFileSync(outFile, ast.print_to_string());
}

function ProcessCSS(inFile, outFile) {
    var uglified = UglifyCSS.processFiles([inFile]);
    fs.writeFileSync(outFile, uglified);
}

if (process.argv.length != 4)
{
    process.stderr.write("Usage: " + path.basename(process.argv[1]) + " infile outfile\n");
    process.exit(-1);
}

var inFile = process.argv[2];
var outFile = process.argv[3];
var extension = path.extname(inFile).toLowerCase();

switch(extension)
{
    case ".js":
        ProcessJS(inFile, outFile);
        break;

    case ".css":
        ProcessCSS(inFile, outFile);
        break;

    default:
        process.stderr.write("Invalid extension: " + extension + "\n");
        process.exit(-1);
        break;
}


