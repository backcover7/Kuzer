// Usage: browserify main.js -o bundle.js

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

global.getJsAst = function(js) {
    let jsTokens = esprima.tokenize(js, { range: true });
    // let jsAst = esprima.parseScript(js);
    return jsTokens;
}