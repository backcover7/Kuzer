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