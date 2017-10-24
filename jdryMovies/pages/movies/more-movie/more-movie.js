// pages/movies/more-movie/more-movie.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies: {},
        isEmpty: 'true',
        totalCount: 0,
        isLoadData: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var categoryTitle = options.categoryTitle;
        this.data.categoryTitle = categoryTitle;
        var url = '';
        switch (categoryTitle) {
            case '正在热映':
                url = app.globalData.gloabalBaseUrl + '/v2/movie/in_theaters';
                break;
            case '即将上映':
                url = app.globalData.gloabalBaseUrl + '/v2/movie/coming_soon';
                break;
            case 'top250':
                url = app.globalData.gloabalBaseUrl + '/v2/movie/top250';
                break;
        }
        this.setData({
            url: url
        });
        wx.startPullDownRefresh();
    },

    // 下拉刷新
    onPullDownRefresh: function () {
        var refreshUrl = this.data.url +
            "?start=0&count=20";
        this.data.isEmpty = true;
        this.data.totalCount = 0;
        this.data.movies = {};
        util.getHttp(refreshUrl, this.successCallBack);
        wx.showNavigationBarLoading();
    },

    // 上拉加载
    onReachBottom: function () {
        wx.showNavigationBarLoading();
        this.setData({
            isLoadData: true
        })
        var nextUrl = this.data.url + "?start=" + this.data.totalCount + "&count=20";
        util.getHttp(nextUrl, this.successCallBack);
    },

    // 网络请求成功回调
    successCallBack: function (moviesDouban) {
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
        var totalMovies = {};
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies: totalMovies
        });
        this.data.totalCount += 20;
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
        this.setData({
            isLoadData: false
        })
    },

        // 跳转至电影详情页
    onMovieDetail:function(event){
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '/pages/movies/movie-detail/movie-detail?movieId='+movieId
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.setNavigationBarTitle({
            title: this.data.categoryTitle
        })
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})