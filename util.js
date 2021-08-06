function randomNum(minNum,maxNum) {
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}

function randomFlag(v1, v2) {
    if (randomNum(0, 1)) {
        return v1;
    }
    else {
        return v2;
    }
}

function randomElem(arr) {
    return arr[randomNum(0, arr.length - 1)];
}

function randomStr() {
    // 7 chars
    return (Math.random() + 1).toString(36).substring(7);
}

function insertFuzzer(v, fuzzer) {
    let position = randomNum(1, v.length - 1);  // index != 0 && index != length
    return [v.slice(0, position), fuzzer, v.slice(position)].join('');
}

function padding0s(length) {
    let result = "";
    for (var i = 0; i < length; i++)
    {
        result += "0";
    }
    return result;
}

function variant(flag, payload, str="") {
    if (flag) {
        return payload;
    }
    else {
        return str;
    }
}

function getMapKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function getById(id) {
    return document.getElementById(id);
}

function getSelectedValue(ids, type = null) {
    let arr = [];
    for (var i = 0; i < ids.length; i++) {
        var m = document.getElementById(ids[i]);
        var b = m.parentElement;
        var c = m.parentNode;
        if (document.getElementById(ids[i]).parentNode != null) {
            let clsname = document.getElementById(ids[i]).parentNode.className;
            if (clsname == "is-selected") {
                if (type == "fuzzr") {
                    arr.push(true);
                }
                else {
                    arr.push(parseInt(ids[i].slice(-1)));
                }
            }
            else if (type == "fuzzr") {
                arr.push(false);
            }
        }
    }
    return arr;
}

function isUrl(v) {
    let pattern = new RegExp("^.*[\/|:]");
    return pattern.test(v);
}

function urlParse(v) {
    /* v is a url like the following:
    http://example.com
    javascript:alert(1)
    //example.com
    \/example.com
    */
   let pattern = new RegExp("^.*[\/|:]");
   return [pattern.exec(v)[0], v.replace(pattern, "")];    // [protocol, pureUrl]
}