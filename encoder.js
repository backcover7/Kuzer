var htmlMap = {1: noEncode, 2: html10Encode, 3: html16Encode, 4: htmlSpeicalEncode};
var urlMap = {1: noEncode, 2: wholeurlEncode};
var jsMap = {1: noEncode, 2: js8Encode, 3:js16Encode, 4: jsunicodeEncode, 5: jsfuckEncode};
var cssMap = {1: noEncode, 2: css16Encode};

function htmlEncoder(v, code, flag) {
    // Since htmlEncoded char will be decoded at first, so some of the appended character like a digit will be considered as part the previous encoded character. Then browser will parse the payload to an expected string. This issue will only occured when the last ";" which is like a border character is ignored when encoding with variant model.
    let res = "";
    let previous = 0;   // set 1 when using variant html10Encode or variant html16Encode without ";"
    for (var i = 0; i < v.length; i++) {
        let fn = htmlMap[code.length === 0?1:code[randomNum(0, code.length - 1)]];
        if (previous === 2) {
            if (res.slice(-1) != ";") {
                if (res.endsWith("&amp") || res.endsWith("&lt") || res.endsWith("&gt") || res.endsWith("&nbsp") || res.endsWith("&quot") || res.endsWith("&bsol")) {
                    res += ";";
                }
            }
        }
        if (fn === noEncode) {
            if (previous === 1) {
                if (res.slice(-1) != ";") {
                    res += ";";
                }
            }
            res += fn(v[i], previous)
            previous = 0;
        }
        else if (fn === htmlSpeicalEncode) {
            res += fn(v[i], flag);
            previous = 2;
        }
        else {
            cValue = fn(v[i], flag);
            if (cValue.slice(-1) != ";") {
                previous = 1;
            }
            else if (cValue.slice(-1) === ";" && previous === 1) {
                previous = 0;
            }
            res += cValue;
        }
    }
    return res;
}

function jsEncoder(v, code, flag) {
    let res = "";
    let fn;
    for (var i = 0; i < v.length; i++) {
        fn = jsMap[code.length === 0?1:code[randomNum(0, code.length - 1)]];
        res += fn(v[i], flag);
    }

    if (fn === jsfuckEncode || code === 4) {
        // Delete "+" character in the last position.
        res.slice(0, -1);
    }

    return res;
}

function urlcomponentEncoder(v, code, flag) {
    let res = "";
    for (var i = 0; i < v.length; i++) {
        fn = urlMap[code.length === 0?1:code[randomNum(0, code.length - 1)]];
        res += fn(v[i], flag);
    }
    return res;
}

function cssEncoder(v, code, flag) {
    let res = "";
    for (var i = 0; i < v.length; i++) {
        fn = cssMap[code.length === 0?1:code[randomNum(0, code.length - 1)]];
        res += fn(v[i], flag);
    }
    return res;
}

function noEncode(v) {
    return v;
}

function htmlSpeicalEncode(v, flag = false) {
    let s = ""
    switch(v) {
        case "&":
            s = "&amp";
            break;
        case "<":
            s = "&lt";
            break;
        case ">":
            s = "&gt";
            break;
        case " ":
            s = "&nbsp";
            break;
        case "\"":
            s = "&quot";
            break;
        case "\\":
            s = "&bsol";
            break;
        default:
            return v;
    }
    s += variant(flag, randomFlag(";", ""), ";");;
    return s;
}

function html10Encode(v, flag = false) {
    return "&#" + variant(flag, padding0s(randomNum(0, 10))) + v.charCodeAt(0) + variant(flag, randomFlag(";", ""), ";");
}

function html16Encode(v, flag = false) { return "&#" + variant(flag, randomFlag('x'.toLowerCase(), 'x'.toUpperCase()), "x") + variant(flag, padding0s(randomNum(0, 10))) + variant(flag, randomFlag(v.charCodeAt(0).toString(16).toLowerCase(), v.charCodeAt(0).toString(16).toUpperCase()), v.charCodeAt(0).toString(16).toLowerCase()) + variant(flag, randomFlag(";", ""), ";"); }

function js8Encode(v) { return "\\" + v.charCodeAt(0).toString(8); }

function js16Encode(v, flag = false) { return "\\x" + variant(flag, randomFlag(v.charCodeAt(0).toString(16).toLowerCase(), v.charCodeAt(0).toString(16).toUpperCase()), v.charCodeAt(0).toString(16).toLowerCase()); }

function jsunicodeEncode(v, flag = false) {
    var hexNum = variant(flag, randomFlag(v.charCodeAt(0).toString(16).toLowerCase(), v.charCodeAt(0).toString(16).toUpperCase()), v.charCodeAt(0).toString(16).toLowerCase());
    return "\\u" + variant(flag, randomFlag("00" + hexNum, "{" + padding0s(randomNum(0, 10)) + hexNum + "}"), "00" + hexNum);
}

function jsfuckEncode(v) { return JSFuck.encode(v) + "+"; }

function wholeurlEncode(v) { return "%" + v.charCodeAt(0).toString(16); }

function css16Encode(v, flag = false) {
    var hexNum = variant(flag, randomFlag(v.charCodeAt(0).toString(16).toLowerCase(), v.charCodeAt(0).toString(16).toUpperCase()), v.charCodeAt(0).toString(16).toLowerCase());
    var numOf0s = 6 - 1 - hexNum.length;
    return "\\" + variant(flag, padding0s(randomNum(0, numOf0s))) + hexNum;
}
