var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({
    onLoad: function (option) {

        var postId = option.postId;
        var postData = postsData.postList[postId];
        this.setData({
            postList: postData,
            postCurrentId: postId,
            musicIsPlaying: false
        });
        if (app.globalData.isVoicePlaying && app.globalData.VoiceId == this.data.postCurrentId) {
            this.setData({
                musicIsPlaying: true
            })
        } else {
            app.globalData.isVoicePlaying = false;
            wx.stopBackgroundAudio();
        }
        var postsCollected = wx.getStorageSync("postCollected");
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            });
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('postCollected', postsCollected);
        }
        this.setVoiceMonitor();
    },
    onCollectionTap: function (event) {
        var postsCollected = wx.getStorageSync("postCollected");
        var postCollected = postsCollected[this.data.postCurrentId];
        postCollected = !postCollected;
        postsCollected[this.data.postCurrentId] = postCollected;
        wx.setStorageSync('postCollected', postsCollected);
        this.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected ? '成功收藏' : '取消收藏',
            icon: 'success'
        })
    },
    onShareTop: function (event) {
        wx.showShareMenu({
            withShareTicket: true
        })
    },

    // 音乐播放
    onMusicTap: function () {
        var musicData = this.data.postList.music;
        if (!this.data.musicIsPlaying) {
            wx.playBackgroundAudio({
                dataUrl: musicData.url,
                title: musicData.title,
                coverImgUrl: musicData.coverImg
            })
            this.setData({
                musicIsPlaying: true
            })
        } else {
            wx.pauseBackgroundAudio();
            this.setData({
                musicIsPlaying: false
            })
        }
        app.globalData.isVoicePlaying = this.data.musicIsPlaying;
        app.globalData.VoiceId = this.data.postCurrentId;
    },

    // 后台监听音乐的情况
    setVoiceMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function (event) {
            if (app.globalData.VoiceId == that.data.postCurrentId) {
                that.setData({
                    musicIsPlaying: true
                })
                app.globalData.isVoicePlaying = true;
            }
        })
        wx.onBackgroundAudioPause(function (event) {
            if (app.globalData.VoiceId == that.data.postCurrentId) {
                that.setData({
                    musicIsPlaying: false
                })
                app.globalData.isVoicePlaying = false;

            }
        })
        wx.onBackgroundAudioStop(function (event) {
            if (app.globalData.VoiceId == that.data.postCurrentId) {
                that.setData({
                    musicIsPlaying: false
                })
                app.globalData.isVoicePlaying = false;
                app.globalData.VoiceId = null;
            }
        })


    },

    onShareAppMessage: function () {
    }
})