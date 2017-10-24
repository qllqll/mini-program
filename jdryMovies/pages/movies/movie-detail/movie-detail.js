var util = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    var detailUrl = app.globalData.gloabalBaseUrl + '/v2/movie/subject/' + options.movieId
    util.getHttp(detailUrl, this.successCallBack);
  },

  //   网络请求回调
  successCallBack: function (movieDetail) {
    wx.hideLoading();    
    if (!movieDetail) {
      return;
    }

    var director = {
      avatar: "",
      name: "",
      id: ""
    }

    if (movieDetail.directors[0] != null) {
      if (movieDetail.directors[0].avatars != null) {
        director.avatar = movieDetail.directors[0].avatars.large;
      }
      director.name =movieDetail.directors[0].name;
      director.id =movieDetail.directors[0].id;     
    }

    var movie = {
      movieImg: movieDetail.images ? movieDetail.images.large : "",      
      country:movieDetail.countries[0],
      title:movieDetail.title,
      year:movieDetail.year,
      collect:movieDetail.collect_count,
      comment:movieDetail.comments_count,
      originalTitle:movieDetail.original_title,
      stars: util.convertToStarsArray(movieDetail.rating.stars),
      director:director,
      average:movieDetail.rating.average,
      casts:util.castsTocasString(movieDetail.casts),
      genres:movieDetail.genres.join('、'),
      summary:movieDetail.summary,
      castsInfo:util.castsToArray(movieDetail.casts)
    }

    console.log(movieDetail);
    this.setData({
      movie:movie
    });
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