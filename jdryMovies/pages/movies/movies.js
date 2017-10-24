var app = getApp()
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        theaters: {},
        comingSoon: {},
        top250: {},
        searchResult: {},
        showSeacherPanel: false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var theatersUrl = app.globalData.gloabalBaseUrl + '/v2/movie/in_theaters' + '?start=0&count=3';
        var comingSoonUrl = app.globalData.gloabalBaseUrl + '/v2/movie/coming_soon' + '?start=0&count=3';
        var top250Url = app.globalData.gloabalBaseUrl + '/v2/movie/top250' + '?start=0&count=3';
        this.getMovieListData(theatersUrl, 'theaters', '正在热映');
        this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
        this.getMovieListData(top250Url, 'top250', 'top250');
    },


    // 网络请求
    getMovieListData: function (url, key, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'content-type': ' '
            },
            success: function (res) {

                that.processDoubanData(res.data, key, categoryTitle);
            },
        })
    },

    processDoubanData: function (moviesDouban, key, categoryTitle) {
        if (moviesDouban == null) {
            return;
        }
        var movies = [];
        for (var i = 0; i < moviesDouban.subjects.length; i++) {
            var subject = moviesDouban.subjects[i];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...';
            }
            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                stars: util.convertToStarsArray(subject.rating.stars)
            }
            movies.push(temp);
        }
        var redayData = {};
        redayData[key] = {
            movies: movies,
            categoryTitle: categoryTitle
        };
        this.setData(redayData);
        wx.hideToast();

    },

    // 点击更多电影
    onTapMoreMovies: function (event) {
        var categoryTitle = event.currentTarget.dataset.categoryTitle;
        wx.navigateTo({
            url: '/pages/movies/more-movie/more-movie?categoryTitle=' + categoryTitle
        })
    },

    // 点击开始搜索
    onBindconfirm: function (event) {
        wx.showToast({
            title: '正在加载中...',
            icon: 'loading',
            duration: 2000
        })
        this.setData({
            showSeacherPanel: true
        })
        var text = event.detail.value;
        var searchUrl = app.globalData.gloabalBaseUrl + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
    },

    // 关闭搜索页面
    onCancelImgTap: function () {
        this.setData({
            showSeacherPanel: false
        })
        wx.hideToast();

    },

    // 跳转至电影详情页
    onMovieDetail: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '/pages/movies/movie-detail/movie-detail?movieId=' + movieId
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})