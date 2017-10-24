// 星星评分
function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        }
        else {
            array.push(0);
        }
    }
    return array;
}

// 获得影人的姓名
function castsTocasString(casts) {
    var castsString = '';
    if (casts.length != 0) {
        for (var i = 0; i < casts.length; i++) {
            if (i < casts.length - 1) {
                castsString += casts[i].name + '/';
            } else {
                castsString += casts[i].name;
            }
        }
    }
    return castsString;
}

// 获取影人的图片
function castsToArray(casts){
    var castsImagsArray = [];
    if (casts.length != 0) {
        for (var i = 0; i < casts.length; i++) {
          castsImagsArray.push(casts[i].avatars.large);
        }
    }
    return castsImagsArray;
}

// GET请求
function getHttp(url, successCallBack) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            'content-type': ' '
        },
        success: function (res) {
            successCallBack(res.data);
        },
        fail: function (error) {
            errorCallBack(error);
        }
    })
}

// POST请求
function postHttp(url, data, successCallBack, errorCallBack) {
    wx.request({
        url: url,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded '
        },
        data: data,
        success: function (res) {
            successCallBack(res.data);
        },
        fail: function (error) {
            errorCallBack(error);
        }
    })
}

module.exports = {
    convertToStarsArray: convertToStarsArray,
    getHttp: getHttp,
    postHttp: postHttp,
    castsTocasString: castsTocasString,
    castsToArray:castsToArray
}