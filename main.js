// Usage: browserify main.js -o bundle.js

// Open only some of the functions from the required package to public to keep secure. (Some seldom used functions may be vulnerable if out-of-dated)

// https://astexplorer.net/

// HTML AST
// https://github.com/mykolaharmash/hyntax
const { tokenize, constructTree } = require('hyntax');

global.getHtmlAst = function(html) {
    const { tokens } = tokenize(html);
    const { ast } = constructTree(tokens);
    return ast;
}

// JavaScript AST
// https://github.com/jquery/esprima
let esprima = require('esprima');

global.getJsTokens = function(js) {
    let jsTokens = esprima.tokenize(js, { range: true });
    return jsTokens;
}

global.getJsAst = function(js) {
    let jsAst = esprima.parseScript(js);
    return jsAst;
}

// // https://npmdoc.github.io/node-npmdoc-ast-types/build/apidoc.html
// // https://github.com/benjamn/ast-types
// let astTypes = require('ast-types');

// global.getAstTypes = function() {
//     // Make all functions to public
//     return astTypes;
// }