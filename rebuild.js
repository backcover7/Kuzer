var FuzzArr1 = ["/", "/" + randomStr() + "/", "\u0009", "\u000a", "\u000c", "\u000d", "\u0020", "\u002f"];
var FuzzArr23 = ["\u0009", "\u000a", "\u000c", "\u000d", "\u0020"];
var FuzzArr4 = ["\u0001", "\u0002", "\u0003", "\u0004", "\u0005", "\u0004", "\u0005", "\u0006", "\u0007", "\u0008", "\u0009", "\u000a", "\u000b", "\u000c", "\u000d", "\u000e", "\u000f", "\u0010", "\u0011", "\u0012", "\u0013", "\u0014", "\u0015", "\u0016", "\u0017", "\u0018", "\u0019", "\u001a", "\u001b", "\u001c", "\u001d", "\u001e", "\u001f", "\u0020"];
var FuzzArr56 = ["\u0009", "\u000a", "\u000d", "\u0061"];
var FuzzArr7 = ["~", "\u0009", "\u000a", "\u000b", "\u000c", "\u000d", "\u0020",  "\u0021", "\u002b", "\u002d", "\u003b", "\u007e", "\u003b", "\u00a0", "\u1680", "\u2000", "\u2001", "\u2002", "\u2003", "\u2004", "\u2005", "\u2006", "\u2007", "\u2008", "\u2009", "\u200a", "\u2028", "\u2029", "\u202f", "\u205f", "\u3000", "\ufeff"]
var FuzzArr8 = ["", ">", "/", ";", "\u0009", "\u000a", "\u000b", "\u0020"];
var FuzzArr9 = ["", ">", "/", ";", "\u0009", "\u000a", "\u000b", "\u000d", "\u0020"];

function rebuildHtmlTokens(token, options = null) {
    /*
    options = [hcode, hflag, ucode, uflag, jcode, jflag]

    hcode: {1: noEncode, 2: html10Encode, 3: html16Encode, 4: htmlSpecialEncode, others: mixed}
    ucode: {1: noEncode, 2: urlencode, others: mixed}
    jcode: {1: noEncode, 2: js8Encode, 3: js16Encode, 4: jsunicodeEncode, 5: jsfuckEncode, others: mixed}
    ccode: (has not been supported yet) {1: noEncode, 2: css16Encode, others: mixed}
    
    hcode: [1, 2, 3]
    ucode: [1, 2]
    jcode: [1, 2, 3, 4, 5]
    ccode: [1, 2]

    *flag: [true: variant payload, false: normal encoding]
    fuzzr: [true: fuzz!, false: noFuzz!]

    e.g. options = [0, true, null, false, 4, true, false]
    e.g. options = [0, true, 0, true, 0, true, true]  // Hardest encoding
    */
    let hcode = options[0];
    let hflag = options[1];
    let ucode = options[2];
    let uflag = options[3];
    let jcode = options[4];
    let jflag = options[5];
    let fuzzr = options[6];

    let rToken = "";

    if (token.nodeType == "text") {
        // Must be charRef
        rToken += htmlEncoder(token.content.value.content, hcode, hflag);
    }
    else {
        // Open Tag and Attributes
        if (["tag", "script", "style"].includes(token.nodeType)) {
            rToken += token.content.openStart.content;

            let attrs = token.content.attributes;
            if (attrs != null) {
                for (var i = 0; i < attrs.length; i++) {
                    rToken += variant(fuzzr[1], randomElem(FuzzArr1), " ") + attrs[i].key.content + variant(fuzzr[2], randomElem(FuzzArr23), "");   // [1], [2]

                    if (attrs[i].value != null) {
                        let attrValue = attrs[i].value.content;

                        if (attrs[i].key.content.substring(0, 2).toLowerCase() == "on") {
                            // onEvent attribute
                            attrValue = rebuildJsTokens(attrValue, jcode, jflag);    // The case of onEvent="javascript:url" has been covered
                        }
                        else {
                            // value of onEvent would not be decoded by URLdecoder
                            if (isUrl(attrValue)) {
                                let urlArray = urlParse(attrValue);
                                if (urlArray[0].toLowerCase() == "javascript:") {
                                    urlArray[0] = insertFuzzer("javascript", variant(fuzzr[5], randomElem(FuzzArr56), ""));           // [5]
                                    urlArray[0] += variant(fuzzr[6], randomElem(FuzzArr56), "") + ":" + variant(fuzzr[7], randomElem(FuzzArr7), "");    // [6], [7]
                                    urlArray[1] = rebuildJsTokens(urlArray[1], jcode, jflag);
                                }
                                attrValue = urlArray[0] + urlcomponentEncoder(urlArray[1], ucode, uflag);
                            } else if (["src", "href"].includes(attrs[i].key.content)) {
                                attrValue = urlcomponentEncoder(attrValue, ucode, uflag)
                            }
                        }
                        rToken +=  "=" + variant(fuzzr[3], randomElem(FuzzArr23), "");  // [3]
                        rToken += variant(fuzzr[0], "", (attrs[i].startWrapper?attrs[i].startWrapper.content:"")) + variant(fuzzr[4], randomElem(FuzzArr4), "");  // startWrapper, [4]
                        rToken += htmlEncoder(attrValue, hcode, hflag);
                        rToken += variant(fuzzr[0], "", (attrs[i].endWrapper?attrs[i].endWrapper.content:""));     // endWrapper
                    }
                }
            }
            
            if (token.content.openEnd != null) {
                rToken += token.content.openEnd.content.slice(0, -1) + variant(fuzzr[8], randomElem(FuzzArr8), ">");  // [8]
            }

            if (["script", "style"].includes(token.nodeType)) {
                // raw text element
                let rawValue = "";
                if (token.nodeType == "script") {
                    if (token.content.value != null) {
                        rawValue = rebuildJsTokens(token.content.value.content, jcode, jflag);
                    }
                }
                else {
                    // rawValue = cssEncoder(token.content.value.content)
                }
    
                if (isParentTokenType(token, "svg")) {       // math?
                    rawValue = htmlEncoder(rawValue, hcode, hflag);
                }
    
                // rToken += token.content.openStart.content;
                // rToken += token.content.openEnd.content.slice(0, -1) + variant(fuzzr[8], randomElem(FuzzArr8), ">");   // [8]
                rToken += rawValue;
            }
        }
        
        // Children
        if (token.content.children != null) {
            for (var j = 0; j < token.content.children.length; j++) {
                rToken += rebuildHtmlTokens(token.content.children[j], options);
            }
        }

        // Close Tag
        if (token.content.close != null) {
            // <u><svg><i></i></u> -> This is a variant html and </u> will not be parsed in AST
            // However, browser will autocomplete it to tolerate error so don't worry about this
            rToken += token.content.close.content.slice(0, -1) + variant(fuzzr[9], randomElem(FuzzArr9), ">");  // [9]
        }
    }

    return rToken;
}

function rebuildJsTokens(v, jcode, jflag) {
    let rToken = "";
    let length = 0;
    let tokens = getJsTokens(v);
    for(var i = 0; i < tokens.length; i++) {
        // Process space character
        if (tokens[i].range[0] != length) {
            rToken += " ".repeat(tokens[i].range[0] - length);
        }
        length = tokens[i].range[1];

        let tokenValue = tokens[i].value;
        if (tokens[i].type == "Identifier") {
            if (jcode.includes(4)) {
                idJcode = [getMapKeyByValue(jsMap, noEncode), getMapKeyByValue(jsMap, jsunicodeEncode)];
                tokenValue = jsEncoder(tokenValue, idJcode, jflag);      // unicode
            }
        }
        else if (tokens[i].type == "String") {
            tokenValue= tokenValue.slice(0,1) + jsEncoder(tokenValue.slice(1,-1), jcode, jflag) + tokenValue.slice(-1);
        }
        rToken += tokenValue;
    }
    return rToken;
}

function isParentTokenType(currentToken, targetType) {
    if (currentToken.parentRef != null) {
        if (currentToken.parentRef.content.name == targetType) {
            return true;
        }
        return isParentTokenType(currentToken.parentRef, targetType);
    }
    return false;
}