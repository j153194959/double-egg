<template>
  <div id="app" ref="app">
    <router-view :userInfo="userInfo" :againLogin="againLogin" @transferUser="getChild"></router-view>
    <div class="supernatant">
        <!-- 非资金帐号浮层 -->
        <div v-if="noNewIsShow" class="no_new_supernatant shade_supernatant">
          <div class="container container_supernatant">
            <div class="top">亲，请登录手机号或升级至最新版本参加游戏接豪礼哦^.^~</div>
            <div class="bottom">
              <a @click="upDate" href="javascript:void(0);">立即更新</a>
              <a @click="againLogin" href="javascript:void(0);">登录</a>
            </div>
            <a class="close" @click="closeMask" href="javascript:void(0)">X</a>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      userInfo: { // 用户信息
        // isLogin: true, // 用户是否登录
        // isWechat: false, // 是否加载完成
        // phone: '17621750993', // 电话号码
        // xuid: '235239', // xuid值
        // prizeNum: 0, // 可获奖品数
        // isChangeTo: 0, // 是否点击兑换奖品
        // tip: '', // 锦囊图片
        // isShare: 0, // 是否可分享 0---可分享 1---不可分享
        // leftTimes: 2 // 剩余刮奖次数
        isLogin: false, // 用户是否登录
        isWechat: false, // 是否加载完成
        phone: '', // 电话号码
        xuid: '', // xuid值
        prizeNum: 0, // 可获奖品数
        isChangeTo: 0, // 是否点击兑换奖品
        tip: '', // 锦囊图片
        isShare: 0, // 是否可分享 0---可分享 1---不可分享
        leftTimes: 2 // 剩余刮奖次数
      },
      noNewIsShow: false // 非资金账号浮层是否显示
    }
  },
  methods: {
    /**
     * cordova加载
     */
    cordovaLoad: function () {
      // 获取登录信息
      var that = this
      navigator.uniaccount.ulbAccLogin(function (data) {
        var response = data
        if (typeof data === 'string') {
          response = JSON.parse(response)
        }
        // alert(JSON.stringify(response))
        // 如果登录方式为兴证通方式则返回
        // alert(response.respBody.userinfo.accountType)
        if (response.respBody.userinfo.accountType !== '1') {
          that.noNewIsShow = true
          return
        }
        var xuid = response.respBody.clientservice_uni_acct_id
        var phone = response.respBody.userinfo.mobile
        that.userInfo.xuid = xuid
        that.userInfo.phone = phone
        that.userInfo.isLogin = true
        // alert('phone: ' + phone + '--xuid: ' + xuid)
      }, function (data) {
        alert('未登录')
      }, {reloginflag: '2', accounttype: '1'})
    },
    /**
     * 接收子组件的值
     */
    getChild: function (msg) {
      // console.log(msg)
      this.userInfo.prizeNum = msg.prizeNum
      this.userInfo.leftTimes = msg.leftTimes
      this.userInfo.isShare = msg.isShare
      this.userInfo.isChangeTo = msg.isChangeTo
      this.userInfo.tip = msg.tip
    },
    /**
     * 重新登录方法
     */
    againLogin: function () {
      var that = this
      navigator.uniaccount.ulbAccLogin(function (data) {
        var response = data
        if (typeof data === 'string') {
          response = JSON.parse(response)
        }
        // 如果登录方式为兴证通方式则返回
        if (response.respBody.userinfo.accountType !== '1') {
          that.noNewIsShow = true
          return
        }
        that.noNewIsShow = false
        var xuid = response.respBody.clientservice_uni_acct_id
        var phone = response.respBody.userinfo.mobile
        that.userInfo.xuid = xuid
        that.userInfo.phone = phone
        that.userInfo.isLogin = true
      }, function (data) {
        alert('登录失败')
      }, {reloginflag: '1', accounttype: '1'})
    },
    /**
     * 点击立即更新
     */
    upDate: function () {
      this.noNewIsShow = false
      navigator.uniaccount.jumpActivity({'linkType': '3', 'link': 'http://wap.xyzq.com.cn', 'linkParam': ''})
    },
    /**
     * 关闭弹窗
     */
    closeMask: function () {
      this.noNewIsShow = false
    },
    /**
     * 设置微信分享
     */
    setWeixinShare: function () {
      var SHARE_TITLE = '元旦有豪礼 兴年你最旺'
      var SHARE_DESC = '接礼盒换礼物迎祝福，祝大家新年快乐~'
      var SHARE_URL = 'http://static.xyzq.cn/activity/double-egg/index.html#/' // 必须是对的地址
      var SHARE_IMG = 'http://static.xyzq.cn/activity/double-egg/static/images/share_thumbnail.jpg'
      var appid = ''
      var timestamp = ''
      var noncestr = ''
      var signature = ''
      var currentDomain = window.location.href.split('?')
      history.replaceState('', document.title, (currentDomain[0]))

      this.$ajax({
        method: 'post',
        url: 'https://estock.xyzq.com.cn/coin/eightyeight/getWxInfo',
        params: { 'url': SHARE_URL }, // 微信直接分享地址会变
        responseType: 'json'
      })
      .then((res) => {
        var data = res.data
        // alert(JSON.stringify(data))
        if (data.resphead.respcode === '0000') {
          appid = data.respbody.appId
          timestamp = data.respbody.timestamp
          noncestr = data.respbody.nonceStr
          signature = data.respbody.signature
          console.log('appid: %s', appid)
          console.log('timestamp: %s', timestamp)
          console.log('noncestr: %s', noncestr)
          console.log('signature: %s', signature)

          wx.config({
            debug: false,
            appId: appid,
            timestamp: timestamp,
            nonceStr: noncestr,
            signature: signature,
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
            ]
          })
        }
      })
      wx.ready(function  ()  {
        wx.onMenuShareAppMessage({
            title: SHARE_TITLE, // 分享标题
            desc: SHARE_DESC, // 分享描述
            link: SHARE_URL, // 分享链接
            imgUrl: SHARE_IMG, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
        })
        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: SHARE_TITLE,
            desc: SHARE_DESC, // 分享描述
            link: SHARE_URL,
            imgUrl: SHARE_IMG, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function (res) {

            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
        })
        wx.error(function (res) {
            alert('wx.error' + res.errMsg)
        })
      })
    }
  },
  beforeMount: function () {
    var that = this
    if (this.GLOBAL.isWeixin()) {
      this.userInfo.isWechat = true
      window.onload = this.setWeixinShare
      return
    }
    if (this.GLOBAL.browser.versions.mobile) { // 判断是否是移动设备打开。browser代码在下面
      var ua = navigator.userAgent.toLowerCase() // 获取判断用的对象
      if ((ua.match(/MicroMessenger/i) + '') === 'micromessenger' || (ua.match(/WeiBo/i) + '') === 'weibo') {
        this.userInfo.isWechat = true
        return
      }
    }
    var ulbTimer = setInterval(function () {
      if (navigator.uniaccount.ulbAccLogin) {
        that.cordovaLoad()
        clearInterval(ulbTimer)
      } else {
        console.log('1')
      }
    }, 300)
  }
}
</script>

<style lang="less">
html, body{
    height: 100%;
    ::-webkit-scrollbar {/*隐藏滚轮*/
      display: none;
    }
}
#app {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: #D03A3B;
  > .supernatant{
    .shade_supernatant{
      position: fixed;
      z-index: 10;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.7);
      top: 0;
      left: 0;
      display:-webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      align-items: center;
      .container{
        width: 5.513889rem; /* 794px */
        /* height: 2.222222rem; */ /* 320px */
        background-color: #fff;
        border-radius: 0.173611rem; /* 25px */
        background-color: #fff;
        position: relative;
        .top{
          padding: 0.451389rem 0; /* 65px */
          line-height: 0.395833rem; /* 57px */
          color: #666;
          font-size: 0.319444rem; /* 46px */
          text-align: center;
          border-bottom: 1px solid #efefef;
        }
        .bottom{
          a{
            float: left;
            display: block;
            text-align: center;
            font-size: 0.319444rem; /* 46px */
            height: 0.902778rem; /* 130px */
            line-height: 0.902778rem; /* 130px */
            width: 50%;
            color: #666;
            &:first-child{
              border-right: 1px solid #efefef;
              box-sizing: border-box;
            }
          }
        }
        .close{
          width: .486111rem; /* 70 */
          height: .486111rem; /* 70 */
          line-height: .486111rem; /* 70 */
          position: absolute;
          font-size: .347222rem; /* 100 */
          top: 0;
          right: 0;
          text-align: cneter;
        }
      }
    }
  }
}
</style>
