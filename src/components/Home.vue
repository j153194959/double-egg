<template>
  <div class="home" ref="home">
    <!-- 头部 -->
    <header>
      <!-- 头部 背景 -->
      <img src="../assets/bg.png" alt="">
      <!-- 分享 + 签到 -->
      <div class="position">
        <div class="border">
          <a @click="share" href="javascript:void(0)"><img src="../assets/share.png" alt="" /></a>
          <a @click="openMask(3)" href="javascript:void(0)">活动规则</a>
          <div>
            <p>您已积累获得</p>
            <p><i><img src="../assets/gift-box-small.png" alt=""></i><span> x {{mainData.total}}</span></p>
          </div>
        </div>
        <ul>
          <li v-for="(value, index) in treeData" :key="index">
            <a @click="openMask(4, index)" href="javascript:void(0)"><img v-bind:src=value alt=""></a>
          </li>
        </ul>
      </div>
    </header>
    <!-- 主体 -->
    <main ref="main">
      <a @click="startGame" href="javascript:void(0)"><img src="../assets/start2.png" alt=""></a>
      <p>拿稳手机，好礼接不停</p>
      <div class="description">
        <p>今日可玩<i>{{userInfo.leftTimes}}</i>次</p>
        <p>元旦节和周末每天可玩<i>5</i>次哦</p>
      </div>
      <div class="container">
        <ul>
          <li v-for="(value, index) in mainData.conversionList" :key="index">
            <div><img src="../assets/broadcast.png" alt=""></div>
            <div>{{getOthersTime(value.createTime)}}</div>
            <div>{{value.phone}}</div>
            <div class="one-txt-cut">已成功{{value.flag === 1 ? '兑换' : '抽到'}}{{value.flag === 3 ? '新年锦囊' : value.tag}}</div>
          </li>
        </ul>
      </div>
    </main>
    <!-- 奖品兑换 -->
    <footer ref="footer">
      <div class="prize-redemption">
        <h2>
          <div><img src="../assets/title.png" alt=""></div>
        </h2>
        <div class="gift-box">
          <h3>礼盒</h3>
          <div class="container">
            <nav>
              <div @click="navClick(0)" v-bind:class="{current: !navControl}">可兑换礼盒 <i>{{mainData.score}}</i> 个</div>
              <div @click="navClick(1)" v-bind:class="{current: navControl}">已兑换礼盒 <i>{{mainData.used}}</i> 个</div>
            </nav>
            <!-- 可兑换 -->
            <ul v-if="!navControl" class="convertible">
              <li v-for="(value, index) in mainData.prizeList" :key="index">
                <!-- <a href="#" class="exchange1">兑换</a> -->
                <a v-if="value.status !== 2" @click="conversion(value.id, value.status, value.price, index, value.name)" href="javascript:void(0)" v-bind:class="[value.status ? 'exchange2' : 'exchange1']">{{value.status === 1 ? '已兑换' : '兑换'}}</a>
                <a v-if="value.status === 2" @click="conversion(value.id, value.status)" href="javascript:void(0)" class="exchange3">抢光啦<br>兑换结束</a>
                <div>
                  <p>{{value.name}}</p>
                  <p><i>{{value.price}}</i>个礼盒可兑换 &nbsp;<span>数量有限，先到先得</span></p>
                </div>
              </li>
              <li>
                <a @click="lottery" href="javascript:void(0)" v-bind:class="[this.mainData.score >= 18 ? 'exchange1' : 'exchange2']">抽奖</a>
                <div>
                  <p><i>18</i>个礼盒可兑换1次抽奖机会</p>
                  <p>每日抽奖<i>次数不限 &nbsp;&nbsp; 100%有礼</i></p>
                </div>
                <ul class="clearfix">
                  <li v-for="(value, index) in paper1" :key="index">
                    <p>{{value.txt1}}</p>
                    <p>{{value.txt2}}</p>
                  </li>
                </ul>
                <ul class="ul2 clearfix">
                  <li v-for="(value, index) in paper2" :key="index">
                    <p>{{value.txt1}}</p>
                    <p>{{value.txt2}}</p>
                  </li>
                </ul>
              </li>
            </ul>
            <!-- 已兑换 -->
            <ul v-if="navControl" class="converted">
              <li v-for="(value, index) in mainData.exchangeList" :key="index">
                <div>{{getOthersTime(value.createTime, 1)}}</div>
                <div>{{getOthersTime(value.createTime)}}</div>
                <div>{{value.score}}礼盒</div>
                <div v-bind:class="[value.flag === 1 ? '' : 'isTip']">{{value.flag === 1 ? '兑' : '抽'}}</div>
                <div class="one-txt-cut" v-if="value.flag !== 3">{{value.tag}}</div>
                <a v-if="value.flag === 3" @click="clickTips(value.tag)" href="javascript:void(0)">新年锦囊</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
    <!-- 浮层 -->
    <div class="supernatant">
      <!-- 分享弹窗 -->
      <div v-if="mask.shareIsShow" class="share_supernatant shade_supernatant">
        <div class="container">
          <div class="title">分享</div>
          <div class="des">
            该活动仅支持在<br>
            “兴业证券优理宝APP”参与
          </div>
          <a @click="goDownload" class="button" href="javascript:void(0)">立即前往</a>
        </div>
      </div>
      <!-- 兑换成功 失败弹窗 -->
      <div v-if="mask.exResultIsShow" class="exchange_result shade_supernatant">
        <div class="container">
          <div class="title">{{exResultControl.title}}</div>
          <div class="des">
            {{exResultControl.prize}}<br>
            {{exResultControl.txt1}}<br>
            {{exResultControl.txt2}}
          </div>
          <a @click="closeMask(1)" href="javascript:void(0)">知道了</a>
        </div>
      </div>
      <!-- 抽奖结果弹窗 -->
      <div v-if="mask.loResultIsShow" class="lottery_result shade_supernatant">
        <div class="container">
          <div class="title">恭喜您！</div>
          <div class="des">
            <strong>抽中{{loResultControl.get}}</strong><br>
            {{loResultControl.txt1}}<br>
            {{loResultControl.txt2}}<strong>{{loResultControl.txt3}}</strong>
          </div>
          <a @click="closeMask(2, loResultControl.id)" href="javascript:void(0)">{{loResultControl.btn}}</a>
        </div>
      </div>
      <!-- 规则弹窗 -->
      <div v-if="mask.ruleIsShow" class="rule shade_supernatant">
        <div class="container">
          <button @click="closeMask(3)">确定</button>
          <div @click="closeMask(3)" class="close"><img src="../assets/close.png" alt=""></div>
          <h2>活动规则</h2>
          <div class="rule-box">
            <h4>A. 活动对象</h4>
            <p>所有手机号（兴证通账号）登录的用户。</p>
            <h4>B. 活动时间</h4>
            <p> 即日起至2018年1月5日17:00。</p>
            <h4>C. 活动次数</h4>
            <p>活动期间用户每天有2次游戏机会：</p>
            <p>a) 元旦节（2018.1.1）和周末（2017.12.23-2017.12.24、2017.12.30-2017.12.31）和每天有5次游戏机会；</p>
            <p>b）用户每天在登录状态下首次分享活动后可多获得1次游戏机会。</p>
            <h4>D. 游戏规则</h4>
            <p>a) 开始游戏后，按住屏幕下方的礼物袋左右移动，尽量多地接住掉下来的礼盒，注意需要避开炸弹，礼物袋若被炸弹击中，则该局结束；</p>
            <p>b）活动期间，用户接到的礼盒累积计数，达到相应数量即可兑换礼物或抽奖。</p>
            <h4>E. 活动奖品及发放</h4>
            <div class="table clearfix">
              <div class="left fl">
                <div class="thead">累计礼盒</div>
                <div class="tbody">
                  58个 <br>
                  158个 <br>
                  288个 <br>
                  288个 <br>
                  618个 <br>
                  18个
                </div>
              </div>
              <div class="right fl">
                <div class="thead">兑换礼物或抽奖</div>
                <div class="tbody">
                  沪深Level-2一个月 <br>
                  优酷VIP会员·月卡 <br>
                  优酷VIP200元年卡 <br>
                  流量1G <br>
                  京东E卡500元  <br>
                  1次抽奖机会，100%有礼
                </div>
              </div>
            </div>
            <p>a) 用户可多次兑换奖品，每种奖品只能兑换一次，数量有限，先到先得，兑完为止；</p>
            <p>b) 抽奖次数不限，抽奖奖品含有iPhoneX（64G）、天猫800元享淘卡、格瓦拉500元电影卡、京东E卡200元、优酷会员200元年卡、小米充电宝（10000毫安）、话费流量等；</p>
            <p>c) 兑换或抽取到的礼品将于活动结束后的15个工作日内完成发放，用户可在“已兑换”中查看历史奖品明细。</p>
            <h4>F.  免责声明</h4>
            <p>a）同一手机号、资金账号均视为同一用户,若存在任何作弊行为的用户,兴业证券将取消其参与资格,有权收回已经发放的奖品。</p>
            <p>b）请确保网络和系统通畅,若因网络原因或系统原因,造成游戏中断、奖品未到账的情况，兴业证券将不再补发奖品。</p>
            <p>c）用户参与活动，即视为同意以上活动规则和免责声明。</p>
            <p>d）本次活动最终解释权归兴业证券股份有限公司所有。</p>
            <p>e）本活动所涉及奖品与苹果公司无关。</p>
          </div>
        </div>
      </div>
      <!-- 气泡弹窗 -->
      <div @click="closeMask(4)" v-if="mask.bubbleIsShow" class="bubble shade_supernatant">
        <div class="container">
          <!-- <div class="iphone"><img src="./static/images/iphone.png" alt=""></div> -->
          <!-- <div class="shop"><img src="./static/images/shop-card.png" alt=""></div> -->
          <!-- <div class="leve"><img src="./static/images/leve2.png" alt=""></div> -->
          <!-- <div class="vip"><img src="./static/images/vip-card.png" alt=""></div> -->
          <div v-bind:class=bubbleResult.class><img v-bind:src=bubbleResult.img2 alt=""></div>
          <h4>{{bubbleResult.h4}}</h4>
          <p>
            {{bubbleResult.txt1}}<br>
            {{bubbleResult.txt2}}
          </p>
        </div>
      </div>
      <!-- 开始游戏失败弹窗 -->
      <div v-if="mask.startFailIsShow" class="startFail shade_supernatant">
        <div class="container">
          <div class="title">{{startFailControl.title}}</div>
          <div class="des">
            {{startFailControl.txt1}}<br>
            {{startFailControl.txt2}}
          </div>
          <a @click="failLeft(startFailControl.type)" href="javascript:void(0)">{{startFailControl.btn1}}</a>
          <a @click="failRight(startFailControl.type)" href="javascript:void(0)">{{startFailControl.btn2}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      isLeftOk: false, // 是否得到用户数据
      footerTop: 0, // 兑换奖品的Scroll值
      mainData: { // 接口获得数据
        leftTimes: 2, // 剩余游戏次数
        total: 0, // 总共获得的积分
        score: 0, // 当前积分
        used: 0, // 已经使用的积分
        isShare: 0, // 是否分享
        prizeList: [
          {
            id: '20171211154325', // 编号
            name: 'Level-2一个月', // 奖品名称
            price: 8, // 多少积分可兑换
            status: 2 // 状态 0-可兑换;1-已兑换;2-无库存;3-不可兑换
          }
        ],
        exchangeList: [
          /* {
            id: '1000001603934101', // 无关
            createTime: 1513305605000, // 时间戳
            score: 2, // 积分
            flag: 2, // 1-兑换;2-抽奖
            tag: '新年锦囊' // 奖品名称
          } */
        ],
        conversionList: [
          {
            createTime: 1513321244000, // 时间
            flag: 2, // 1-兑换;2-抽奖
            phone: '159****5678',
            tag: '新年锦囊'
          },
          {
            createTime: 1513321244000, // 时间
            flag: 2, // 1-兑换;2-抽奖
            phone: '159****5678',
            tag: '新年锦囊'
          },
          {
            createTime: 1513321244000, // 时间
            flag: 2, // 1-兑换;2-抽奖
            phone: '159****5678',
            tag: '新年锦囊'
          },
          {
            createTime: 1513321244000, // 时间
            flag: 2, // 1-兑换;2-抽奖
            phone: '159****5678',
            tag: '新年锦囊'
          },
          {
            createTime: 1513321244000, // 时间
            flag: 2, // 1-兑换;2-抽奖
            phone: '159****5678',
            tag: '新年锦囊'
          },
          {
            createTime: 1513321244000, // 时间
            flag: 2, // 1-兑换;2-抽奖
            phone: '159****5678',
            tag: '新年锦囊'
          },
          {
            createTime: 1513321244000, // 时间
            flag: 2, // 1-兑换;2-抽奖
            phone: '159****5678',
            tag: '新年锦囊'
          },
          {
            createTime: 1513321244000, // 时间
            flag: 2, // 1-兑换;2-抽奖
            phone: '159****5678',
            tag: '新年锦囊'
          },
          {
            createTime: 1513321244000, // 时间
            flag: 2, // 1-兑换;2-抽奖
            phone: '159****5678',
            tag: '新年锦囊'
          },
          {
            createTime: 1513321244000, // 时间
            flag: 2, // 1-兑换;2-抽奖
            phone: '159****5678',
            tag: '新年锦囊'
          }
        ]
      },
      mask: {
        shareIsShow: false, // 分享弹窗是否显示
        exResultIsShow: false, // 兑换结果是否显示
        loResultIsShow: false, // 抽奖结果弹窗是否显示
        ruleIsShow: false, // 规则弹窗是否显示
        bubbleIsShow: false, // 气泡弹窗是否显示
        startFailIsShow: false // 开始失败弹窗是否显示
      },
      exResultControl: {
        title: '恭喜您！申请兑换成功！',
        prize: '',
        txt1: '奖品将于15个工作日内发放',
        txt2: '至您登录参加游戏的手机号!'
      },
      loResultControl: {
        get: '30M流量！',
        txt1: '奖品将于15个工作日内发放',
        txt2: '至您登录参加游戏的手机号!',
        txt3: '',
        btn: '知道了',
        id: ''
      },
      startFailControl: {
        title: '天天接礼盒',
        type: 1, // 0--可分享 1--不可分享
        txt1: '今日游戏次数已用完，请明日再来~',
        txt2: '天天接礼盒，豪礼多多多',
        btn1: '知道了',
        btn2: '兑换奖品'
      },
      navControl: 0, // 奖品兑换导航栏控制 0 为可兑换 1 为已兑换
      treeData: [ // 树上奖品
        './static/images/bubble1.png',
        './static/images/bubble2.png',
        './static/images/bubble3.png',
        './static/images/bubble4.png',
        './static/images/bubble5.png'
      ],
      bubbleResult: { // 气泡结果
        class: 'iphone', // 类名
        img2: './static/images/iphone.png', // 弹窗图片路径
        h4: 'iPhone X（64G）', // 弹窗h4
        txt1: '疯狂送不停，新年发发发！', // 弹窗txt1
        txt2: '参加游戏，轻松赢iPhone！'
      },
      paper1: [
        {txt1: '天猫800元', txt2: '享淘卡'},
        {txt1: 'iPhoneX', txt2: '(64G)'},
        {txt1: '优酷', txt2: 'VIP年卡'},
        {txt1: '小米', txt2: '充电宝'}
      ],
      paper2: [
        {txt1: '话费', txt2: '100元'},
        {txt1: '格瓦拉500元', txt2: '电影卡'},
        {txt1: '京东E卡', txt2: '200元'},
        {txt1: '流量', txt2: '20M-1G'},
        {txt1: '新年', txt2: '锦囊'}
      ]
    }
  },
  props: ['userInfo', 'againLogin'], // 接收父组件的值
  methods: {
    /**
     * 微信 前往下载
     */
    goDownload: function () {
      // 猜涨跌二期_分享页_下载优理宝 埋点
      // TDAPP.onEvent("猜涨跌二期_分享页_下载优理宝","",{})
      window.location.href = 'http://wap.xyzq.com.cn'
    },
    /**
     * 点击分享
     */
    share: function () {
      if (this.userInfo.isWechat) {
        this.scrollTop = this.$parent.$refs.app.scrollTop
        this.$refs.home.style.top = -this.scrollTop + 'px'
        // console.log(this.$parent.$refs.app.scrollTop)
        this.$refs.home.style.position = 'fixed'
        this.mask.shareIsShow = true
        return
      }
      // 是否已登录
      if (!this.userInfo.isLogin) {
        this.againLogin()
        return
      }
      // 数据是否得到
      if (!this.isLeftOk) return
      this.$ajax({
        url: '/share',
        params: {phone: this.userInfo.phone}
      })
      .then((res) => {
        console.log(res.data)
        if (res.data.resphead && res.data.resphead.respcode === '0000') {
          this.userInfo.leftTimes++
          this.userInfo.isShare++
        }
      })
      navigator.uniaccount.ulbShare('元旦有豪礼 兴年你最旺', 'http://static.xyzq.cn/activity/double-egg/static/images/share_thumbnail.jpg', '接礼盒换礼物迎祝福，祝大家新年快乐~', 'http://static.xyzq.cn/activity/double-egg/index.html#/')
    },
    /**
     * 获取数据
     */
    setData: function (type) {
      this.$ajax({
        url: '/index',
        params: {phone: this.userInfo.phone}
      })
      .then((res) => {
        var Data = res.data.respbody
        console.log(Data)
        this.mainData.leftTimes = Data.leftTimes
        this.mainData.isShare = Data.isShare
        this.mainData.score = Data.score
        this.mainData.total = Data.total
        this.mainData.used = Data.used
        this.mainData.prizeList = []
        // this.mainData.prizeList = Data.prizeList
        for (let i = 0; i < Data.prizeList.length; i++) {
          const el = Data.prizeList[i]
          if (el.id === '20171211154440') continue
          var obj = {}
          obj.price = el.price
          obj.id = el.id
          obj.name = el.name
          obj.status = el.status
          this.mainData.prizeList.push(obj)
        }
        // console.log(this.mainData.prizeList)
        // this.mainData.conversionList = Data.conversionList
        // alert(JSON.stringify(listData))
        // console.log(Data.conversionList)
        this.mainData.conversionList = this.setAimate(Data.conversionList)
        var gotoF = {
          leftTimes: this.mainData.leftTimes,
          prizeNum: 0,
          isShare: this.mainData.isShare,
          isChangeTo: 0,
          tip: 0
        }
        this.$emit('transferUser', gotoF)
        if (type) {
          this.isLeftOk = true
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
    /**
     * 已兑换列表 将时间戳改为时间格式 type 为1 输出年月日 为0 输出时分
     */
    getOthersTime: function (str1, type) {
      var date, Y, M, D, h, m, time
      var str2 = parseInt(str1)
      date = new Date(str2)
      Y = date.getFullYear() + '.'
      M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.'
      D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
      h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
      if (type) {
        time = (Y + M + D)
      } else {
        time = (h + m)
      }
      return time
    },
    /**
     * 点击导航栏
     */
    navClick: function (type) {
      this.navControl = type
    },
    /**
     * 显示弹窗
     * index：弹窗种类
     * type：分类
     */
    openMask: function (index, type, des) {
      // console.log(this.$refs.home.scrollTop)
      var arr = ['shareIsShow', 'exResultIsShow', 'loResultIsShow', 'ruleIsShow', 'bubbleIsShow', 'startFailIsShow']
      // for (let i = 0; i < arr.length; i++) {
      //   this.mask[arr[i]] = false
      // }
      if (index === 0) {
        console.log('微信分享')
      } else if (index === 1) {
        if (type) {
          this.exResultControl.title = '恭喜您！申请兑换成功！'
          this.exResultControl.prize = des
          this.exResultControl.txt1 = '奖品将于15个工作日内发放'
          this.exResultControl.txt2 = '至您登录参加游戏的手机号！'
        } else {
          this.exResultControl.title = '哎呀，慢了一点点'
          this.exResultControl.prize = ''
          this.exResultControl.txt1 = '该奖品已被抢光......'
          this.exResultControl.txt2 = '拼手速好运到，再接再厉加油哦！'
        }
      } else if (index === 2) {
        if (type) {
          this.loResultControl.get = '1份新年锦囊！'
          this.loResultControl.txt1 = '赶紧点开查看~'
          this.loResultControl.txt2 = ''
          this.loResultControl.txt3 = '有机会获得100元话费哦！'
          this.loResultControl.btn = '立即查看新年锦囊'
          this.loResultControl.id = des
        } else {
          this.loResultControl.get = des
          this.loResultControl.txt1 = '奖品将于15个工作日内发放'
          this.loResultControl.txt2 = '至您登录参加游戏的手机号!'
          this.loResultControl.txt3 = ''
          this.loResultControl.btn = '知道了'
          this.loResultControl.id = ''
        }
      } else if (index === 4) {
        var resultArr = [
          {
            class: 'iphone', // 类名
            img2: './static/images/iphone.png', // 弹窗图片路径
            h4: 'iPhone X（64G）', // 弹窗h4
            txt1: '疯狂送不停，新年发发发！', // 弹窗txt1
            txt2: '参加游戏，轻松赢iPhone！'
          },
          {
            class: 'vip', // 类名
            img2: './static/images/vip-card.png', // 弹窗图片路径
            h4: '优酷VIP会员卡', // 弹窗h4
            txt1: '优酷尊享VIP月卡、年卡', // 弹窗txt1
            txt2: '闲暇刷剧不用愁！'
          },
          {
            class: 'shop', // 类名
            img2: './static/images/shop-card.png', // 弹窗图片路径
            h4: '天猫/京东购物卡', // 弹窗h4
            txt1: '天猫800元享淘卡、京东E卡500元', // 弹窗txt1
            txt2: '简单粗暴送福利，抢购年货嗨翻天！'
          },
          {
            class: 'leve', // 类名
            img2: './static/images/leve2.png', // 弹窗图片路径
            h4: '沪深Level-2', // 弹窗h4
            txt1: '极速十档行情，全新上线免费送！！', // 弹窗txt1
            txt2: '不同活动领取到的level-2时长可以叠加哦~'
          },
          {
            class: 'calls', // 类名
            img2: './static/images/calls.png', // 弹窗图片路径
            h4: '话费/流量', // 弹窗h4
            txt1: '话费100元、流量1G', // 弹窗txt1
            txt2: '三网通用，不惧流量告急~'
          }
        ]
        this.bubbleResult = resultArr[type]
      }
      this.scrollTop = this.$parent.$refs.app.scrollTop
      this.$refs.home.style.top = -this.scrollTop + 'px'
      this.$refs.home.style.position = 'fixed'
      this.mask[arr[index]] = true
    },
    /**
     * 关闭弹窗
     * index：弹窗种类
     */
    closeMask: function (index, type) {
      var arr = ['shareIsShow', 'exResultIsShow', 'loResultIsShow', 'ruleIsShow', 'bubbleIsShow', 'startFailIsShow']
      if (index === 2 && type) {
        var gotoF = {
          leftTimes: this.userInfo.leftTimes,
          prizeNum: this.userInfo.prizeNum,
          isShare: this.userInfo.isShare,
          isChangeTo: this.userInfo.isChangeTo,
          tip: type
        }
        this.$emit('transferUser', gotoF)
        window.location.href = '#/Tip'
        // window.location.href = '/tips/' + type + '.jpg'
        console.log('跳转图片' + type)
      }
      this.$refs.home.style.position = 'static'
      this.$parent.$refs.app.scrollTop = this.scrollTop
      this.mask[arr[index]] = false
    },
    /**
     * 点击开始游戏
     */
    startGame: function () {
      // 开始游戏 埋点
      TDAPP.onEvent("chrismas","",{})
      // 是否是微信页面 或者微博
      if (this.userInfo.isWechat) {
        this.openMask(0)
        return
      }
      // alert('isLogin: ' + this.userInfo.isLogin + '--- isLeftOk: ' + this.isLeftOk)
      // 是否已登录
      if (!this.userInfo.isLogin) {
        this.againLogin()
        return
      }
      // 数据是否得到
      if (!this.isLeftOk) return
      if (!this.userInfo.leftTimes) {
        console.log(this.userInfo.isShare)
        if (this.userInfo.isShare) {
          this.startFailControl.title = '天天接礼盒'
          this.startFailControl.txt1 = '今日游戏次数已用完，请明日再来~'
          this.startFailControl.txt2 = '天天接礼盒，豪礼多多多'
          this.startFailControl.btn1 = '知道了'
          this.startFailControl.btn2 = '兑换奖品'
          this.startFailControl.type = 1
        } else {
          this.startFailControl.title = '分享多一次游戏机会哦~'
          this.startFailControl.txt1 = '今日游戏次数已用完'
          this.startFailControl.txt2 = '分享立即多获得1次游戏机会哦~'
          this.startFailControl.btn1 = '兑换奖品'
          this.startFailControl.btn2 = '立即分享'
          this.startFailControl.type = 0
        }
        this.openMask(5)
        return
      }
      this.$ajax({
        url: '/start',
        params: {phone: this.userInfo.phone}
      })
      .then((res) => {
        console.log(res.data)
        if (res.data.respbody || res.data.respbody === 0) {
          var gotoF = {
            leftTimes: this.userInfo.leftTimes,
            prizeNum: res.data.respbody,
            isShare: this.userInfo.isShare,
            isChangeTo: 0,
            tip: 0
          }
          this.$emit('transferUser', gotoF)
          window.location.href = '#/Game'
        }
      })
      // window.location.href = '#/Game'
    },
    /**
     * 兑换记录数据
     */
    exchangeRecords: function () {
      this.$ajax({
        url: '/record',
        params: {phone: this.userInfo.phone}
      })
      .then((res) => {
        if (res.data.respbody) {
          this.mainData.exchangeList = []
          this.mainData.exchangeList = res.data.respbody
        }
      })
    },
    /**
     * 点击抽奖
     */
    lottery: function () {
      if (this.mainData.score < 2) return
      this.$ajax({
        url: '/lottery',
        params: {phone: this.userInfo.phone}
      })
      .then((res) => {
        console.log(res.data)
        if (res.data.resphead && res.data.resphead.respcode === '0000') {
          if (res.data.respbody.name === '新年锦囊') {
            this.openMask(2, 1, res.data.respbody.tag)
          } else {
            this.openMask(2, 0, res.data.respbody.name)
          }
          this.mainData.score -= 18
          this.mainData.used += 18
          this.setData()
          this.exchangeRecords()
        }
      })
    },
    /**
     * 点击兑换
     */
    conversion: function (id, status, price, index, name) {
      // console.log(id, status, price, index)
      if (status === 2) {
        this.openMask(1)
        return
      }
      if (!status) {
        this.$ajax({
          url: '/conversion',
          params: {phone: this.userInfo.phone, id: id, xuid: this.userInfo.xuid}
        })
        .then((res) => {
          // console.log(res.data)
          if (res.data.resphead && res.data.resphead.respcode === '0000') {
            this.openMask(1, 1, name)
            this.mainData.score -= price
            this.mainData.used += price
            // this.$set(this.mainData.prizeList[index], 'status', 1)
            this.setData()
            this.exchangeRecords()
          } else if (res.data.resphead.respcode === '1005') {
            this.openMask(1)
            this.$set(this.mainData.prizeList[index], 'status', 2)
          }
        })
      }
    },
    /**
     * 点击锦囊
     */
    clickTips: function (id) {
      var gotoF = {
        leftTimes: this.userInfo.leftTimes,
        prizeNum: this.userInfo.prizeNum,
        isShare: this.userInfo.isShare,
        isChangeTo: this.userInfo.isChangeTo,
        tip: id
      }
      this.$emit('transferUser', gotoF)
      window.location.href = '#/Tip'
      // window.location.href = 'http://static.xyzq.cn/activity/double-egg/tips/' + id + '.jpg'
      console.log(id)
    },
    /**
     * 设置消息动画
     */
    setAimate: function (data) {
      var guessList = data
      var listData = []
      if (guessList.length === 0) {
        guessList = [
          {
            createTime: 1513321244000, // 时间
            flag: 3, // 1-兑换;2-抽奖;3-新年锦囊
            phone: '159****5678',
            tag: '新年锦囊'
          }
        ]
      }
      var j = 0
      for (var i = 0; i < 10; i++) {
        if (i < guessList.length) {
          listData.push(guessList[i])
        } else {
          listData.push(guessList[j])
          j++
          if (j === guessList.length) {
            j = 0
          }
        }
      }
      return listData
    },
    /**
     * 开始失败弹窗左边
     */
    failLeft: function (type) {
      if (type) {
        this.closeMask(5)
      } else {
        this.closeMask(5)
        this.$parent.$refs.app.scrollTop = this.footerTop
      }
    },
    /**
     * 开始失败弹窗左边
     */
    failRight: function (type) {
      if (type) {
        this.closeMask(5)
        this.$parent.$refs.app.scrollTop = this.footerTop
      } else {
        this.closeMask(5)
        this.share()
      }
    }
  },
  beforeMount: function () {
  },
  mounted: function () {
    if (document.documentElement.clientWidth <= 350) {
      this.$refs.main.style.top = '-50px'
    }
    var rem = parseFloat(document.querySelector('html').style.fontSize)
    this.footerTop = this.$refs.footer.offsetTop - 0.381944 * rem + 1
    this.setData()
    console.log(this.userInfo.isChangeTo)
    if (this.userInfo.isChangeTo) {
      this.$parent.$refs.app.scrollTop = this.footerTop
    }
    var that = this
    var timer = setInterval(() => {
      // console.log('定时器')
      if (this.userInfo.isLogin) {
        clearInterval(timer)
        that.setData(1)
        that.exchangeRecords()
      }
    }, 300)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.home{
  header{
    position: relative;
    height: 11.256944rem; /* 1621 */
    .position{
      .border{
        position: absolute;
        right: 0;
        top: 0;
        width: 2.083333rem; /* 140 */
        text-align: right;
        a{
          display: inline-block;
          &:first-child{
            width: 1.048611rem; /* 151 */
            height: 1.020833rem; /* 147 */
            margin: 1.791667rem .173611rem 0 0; /* 258 25 */
          }
          &:last-of-type{
            height: .444444rem; /* 64 */
            line-height: .444444rem; /* 64 */
            border-radius: .222222rem 0 0 .222222rem; /* 32 */
            margin-top: 1.625rem; /* 234 25 */
            color: #BA2F28;
            background-color: #E89D9D;
            padding: 0 .069444rem 0 .208333rem; /* 10 30 */
            box-sizing: border-box;
            font-family: "PingFang-SC-Bold";
            font-size: .319444rem; /* 46 */
          }
        }
        div{
          margin-top: .5rem; /* 72 */
          background-color: #E38989;
          text-align: center;
          color: #fff;
          border-radius: .138889rem 0 0 .138889rem; /* 20 */
          height: .909722rem; /* 131 */
          line-height: .451389rem; /* 65 */
          font-family: "PingFang-SC-Bold";
          font-size: .277778rem; /* 40 */
          display: inline-block;
          padding: 0 .069444rem; /* 10 */
          p:last-child{
            line-height: .347222rem; /* 50 */
            color: #393838;
            font-family: "PingFang-SC-Heavy";
            font-size: .222222rem; /* 34 */
            font-weight: bold;
            i{
              display: inline-block;
              width: .340278rem; /* 49 */
              height: .333333rem; /* 48 */
              vertical-align: middle;
            }
            span{
              vertical-align: middle;
            }
          }
        }
      }
      ul{
        > li{
          a{
            position: absolute;
          }
          &:nth-child(1){
            a{
              width: 1.708333rem; /* 246 */
              height: 1.708333rem; /* 246 */
              left: 2.930556rem; /* 422 */
              top: 4.930556rem; /* 710 */
            }
          }
          &:nth-child(2){
            a{
              width: 1.833333rem; /* 264 */
              height: 1.833333rem; /* 264 */
              left: 4.284722rem; /* 617 */
              top: 6.458333rem; /* 930 */
            }
          }
          &:nth-child(3){
            a{
              width: 1.763889rem; /* 254 */
              height: 1.763889rem; /* 254 */
              left: 1.548611rem; /* 223 */
              top: 6.388889rem; /* 920 */
            }
          }
          &:nth-child(4){
            a{
              width: 1.680556rem; /* 242 */
              height: 1.680556rem; /* 242 */
              left: 2.9375rem; /* 423 */
              top: 7.777778rem; /* 1120 */
            }
          }
          &:nth-child(5){
            a{
              width: 1.520833rem; /* 219 */
              height: 1.520833rem; /* 219 */
              left: .951389rem; /* 137 */
              top: 8.125rem;
            }
          }
        }
      }
    }
  }
  main{
    position: relative;
    > a{
      display: block;
      width: 4.625rem; /* 66 */
      height: 1.020833rem; /* 147 */
      margin: 0 auto;
    }
    > p{
      color: #fff;
      text-align: center;
      height: .625rem; /* 90 */
      line-height: .625rem; /* 90 */
      font-size: .347222rem; /* 50 */
      font-family: "PingFang-SC-Bold";
    }
    > .description{
      color: #FFD938;
      padding: 0 .208333rem 0 .25rem; /* 30 36 */
      height: .416667rem; /* 60 */
      line-height: .416667rem; /* 60 */
      font-family: "PingFang-SC-Medium";
      font-size: .222222rem; /* 32 */
      p{
        &:first-child{
          float: left;
          color: #FFCCCC;
        }
        &:last-child{
          text-align: right;
          padding-left: 1.388889rem;
        }
        i{
          font-family: "PingFang-SC-Bold";
          font-size: .25rem; /* 36 */
          color: #FFD938;
        }
      }
    }
    > .container{
      background-color: #ECA38D;
      height: .555556rem; /* 80 */
      line-height: .555556rem; /* 80 */
      color: #4C4C4C;
      font-family: "PingFang-SC-Medium";
      font-size: .263889rem; /* 38 */
      margin-top: 1px;
      overflow: hidden;
      ul{
        transform: translateY(0);
        animation: information linear 20s infinite;
        -webkit-animation: information linear 20s infinite; /* Safari 与 Chrome */
        li{
          div{
            display: inline-block;
            height: .555556rem; /* 80 */
            &:nth-child(1){
              width: .305556rem; /* 44 */
              height: .277778rem; /* 40 */
              margin-left: .229167rem; /* 33 */
            }
            &:nth-child(2){
              margin-left: .069444rem; /* 10 */
              width: 1.138889rem; /* 164 */
            }
            &:nth-child(3){
              width: 1.736111rem; /* 250 */
            }
            &:nth-child(4){
              width: 3.333333rem; /* 480 */
              overflow: visible !important;
            }
          }
        }
      }
      @keyframes information {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-90%);
        }
      }
    }
  }
  footer{
    .prize-redemption{
      background: url('../assets/exchange-bg.jpg');
      background-size: 100% 100%;
      width: 7.013889rem; /* 1010 */
      padding-bottom: .854167rem; /* 123 */
      margin: .381944rem auto; /* 55 */
      h2{
        text-align: center;
        height: 1.694444rem; /* 244 */
        line-height: 1.694444rem; /* 244 */
        display:-webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        justify-content: center;
        align-items: center;
        div{
          width: 3.159722rem; /* 455 */
          height: 1.013889rem; /* 146 */
        }
      }
      .gift-box{
        width: 6.416667rem; /* 924 */
        margin: 0 auto;
        h3{
          height: .805556rem; /* 116 */
          line-height: .805556rem; /* 116 */
          background: url('../assets/rectangle.png');
          background-size: cover;
          text-align: center;
          color: #fff;
          font-size: .347222rem; /* 50 */
          font-family: "PingFang-SC-Bold";
        }
        .container{
          height: 9.618056rem; /* 1385 */
          border-radius: 0 0 .173611rem .173611rem; /* 25 */
          border: .020833rem solid #E02D48; /* 3 */
          padding: 0 .145833rem; /* 21 */
          background-color: #FFF9EB;
          nav{
            div{
              height: .569444rem; /* 82 */
              line-height: .569444rem; /* 82 */
              width: 49%;
              display: inline-block;
              text-align: center;
              color: #4C4C4C;
              font-size: .243056rem; /* 35 */
              font-family: "PingFang-SC-Medium";
              position: relative;
              i{
                color: #D03A3B;
              }
            }
            .current::after{
              content: '';
              position: absolute;
              width: .715278rem; /* 103 */
              height: .041667rem; /* 6 */
              background-color: #D03A3B;
              bottom: .076389rem; /* 13 */
              left: 50%;
              transform: translateX(-50%);
              -ms-transform: translateX(-50%);
              -moz-transform: translateX(-50%);
              -webkit-transform: translateX(-50%);
              -o-transform: translateX(-50%);
            }
          }
          .convertible{
            > li{
              border: 1px solid #FFDEB5;
              box-sizing: border-box;
              padding: 0 .1875rem 0 .131944rem; /* 27 19 */
              margin-bottom: .125rem; /* 18 */
              a{
                float: right;
                width: 1.194444rem; /* 172 */
                height: .555556rem; /* 80 */
                line-height: .555556rem; /* 80 */
                box-sizing: border-box;
                border: 1px solid #D03A3B;
                border-radius: .069444rem; /* 10 */
                font-size: .263889rem; /* 38 */
                text-align: center;
                margin-top: .208333rem; /* 30 */
              }
              .exchange1{
                color: #D03A3B;
                background-color: #FCD6CF;
                border-color: #D03A3B;
              }
              .exchange2{
                color: #848484;
                background-color: #E8E8E8;
                border-color: #848484;
              }
              .exchange3{
                color: #848484;
                background-color: #E8E8E8;
                border-color: #848484;
                line-height: .277778rem; /* 40 */
              }
              div{
                padding-right: 1.375rem; /* 198 */
                p{
                  height: .513889rem; /* 74 */
                  line-height: .513889rem; /* 74 */
                  font-family: "PingFang-SC-Bold";
                  &:first-child{
                    font-size: .305556rem; /* 44 */
                    color: #323232;
                    i{
                      color: #D03A3B;
                    }
                  }
                  &:last-child{
                    font-size: .25rem; /* 36 */
                    font-family: "PingFang-SC-Medium";
                    color: #666666;
                    span{
                      font-size: .222222rem; /* 32 */
                      font-family: "PingFang-SC-Bold";
                    }
                    i, span{
                      color: #D03A3B;
                    }
                  }
                }
              }
              li{
                float: left;
                width: 1.104167rem; /* 159 */
                height: 1.083333rem; /* 156 */
                color: #D03A3B;
                font-family: "PingFang-SC-Medium";
                font-size: .222222rem; /* 32 */
                background: url('../assets/lottery-box.png') no-repeat;
                background-size: contain;
                box-sizing: border-box;
                padding: .347222rem .104167rem 0; /* 58 15 */
                text-align: center;
                line-height: .222222rem; /* 32 */
                &:nth-child(1){
                  margin-top: .263889rem; /* 38 */
                  margin-left: .590278rem; /* 85 */
                  padding-right: .208333rem; /* 30 */
                  padding-top: .208333rem; /* 30 */
                }
                &:nth-child(2){
                  margin-top: .347222rem; /* 50 */
                  margin-left: .173611rem; /* 25 */
                }
                &:nth-child(3){
                  margin-top: .208333rem; /* 30 */
                  margin-left: .208333rem; /* 30 */
                }
                &:nth-child(4){
                  margin-top: .243056rem; /* 35 */
                  margin-left: .305556rem; /* 44 */
                }
              }
              .ul2{
                li{
                  &:nth-child(1){
                    margin-top: 0;
                    margin-left: 0;
                    padding-right: .208333rem; /* 30 */
                  }
                  &:nth-child(2){
                    margin-top: .159722rem; /* 23 */
                    margin-left: .069444rem; /* 10 */
                    padding-top: .208333rem; /* 30 */
                  }
                  &:nth-child(3){
                    margin-top: -.020833rem; /* 3 */
                    margin-left: .069444rem; /* 10 */
                  }
                  &:nth-child(4){
                    margin-top: .111111rem; /* 16 */
                    margin-left: .069444rem; /* 10 */
                  }
                  &:nth-child(5){
                    margin-top: -.034722rem; /* 5 */
                    margin-left: 0; /* 13 */
                    margin-right: -.069444rem; /* 10 */
                    margin-bottom: .486111rem; /* 70 */
                  }
                }
              }
            }
          }
          .converted{
            max-height: 8.777778rem; /* 1264 */
            box-sizing: border-box;
            border: 1px solid #FFDEB5;
            overflow-y: scroll;
            li{
              line-height: .451389rem; /* 65 */
              height: .451389rem; /* 65 */
              > div{
                display: inline-block;
                color: #000;
                font-size: .236111rem; /* 34 */
                font-family: "PingFang-SC-Medium";
                text-align: center;
                &:nth-child(1){
                  width: 1.388889rem; /* 200 */
                }
                &:nth-child(2){
                  width: .555556rem; /* 80 */
                }
                &:nth-child(3){
                  width: 1.111111rem; /* 160 */
                }
                &:nth-child(4){
                  width: .305556rem; /* 44 */
                  height: .305556rem; /* 44 */
                  line-height: .305556rem; /* 44 */
                  border-radius: 50%;
                  color: #D03A3B;
                  border: 1px solid #D03A3B;
                  vertical-align: middle;
                  margin: 0 .069444rem;
                }
                &:nth-child(5){
                  width: 1.840278rem; /* 265 */
                  text-align: right;
                }
              }
              > a{
                display: inline-block;
                color: #D03A3B;
                width: 1.840278rem; /* 265 */
                text-align: right;
                font-size: .236111rem;
                font-family: "PingFang-SC-Medium";
                text-decoration: underline;
              }
              > .isTip{
                color: #3A7DD0 !important;
                border-color: #3A7DD0 !important;
              }
            }
            .one-txt-cut{
              overflow: visible;
            }
          }
        }
      }
    }
  }
  .supernatant{
    width: 100%;
    /* 浮层公共样式 */
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
        border-radius: .347222rem; /* 50 */
        background-color: #fff;
        position: relative;
        .title{
          background: url("../assets/banner.png");
          width: 7.083333rem; /* 1020 */
          height: 1.333333rem; /* 192 */
          background-size: cover;
          position: absolute;
          top: 0;
          left: -.416667rem; /* 60 */
          font-family: "PingFang-SC-Heavy";
          font-size: .486111rem; /* 70 */
          line-height: 1.138889rem; /* 164 */
          color: #fff;
          text-align: center;
        }
        .des{
          text-align: center;
          line-height: .451389rem; /* 65 */
          font-family: "PingFang-SC-Medium";
          font-size: .375rem; /* 54 */
          color: #666;
        }
        > a{
          height: .833333rem; /* 120 */
          line-height: .833333rem; /* 119 */
          text-align: center;
          color: #fff;
          background-color: #E54137;
          box-shadow: 0 -.069444rem .069444rem #BA2F28 inset;
          border-radius: .416667rem; /* 60 */
          font-size: .347222rem; /* 50 */
          font-family: "PingFang-SC-Medium";
        }
      }
    }
    > .share_supernatant{
      .container{
        border-radius: .347222rem; /* 50 */
        background-color: #fff;
        position: relative;
        padding-top: 1.333333rem; /* 192 */
        width: 6.25rem;
        text-align: center;
        .title{
          background: url("../assets/banner.png");
          width: 7.083333rem; /* 1020 */
          height: 1.333333rem; /* 192 */
          background-size: cover;
          position: absolute;
          top: 0;
          left: -.416667rem; /* 60 */
          font-family: "PingFang-SC-Heavy";
          font-size: .486111rem; /* 70 */
          line-height: 1.138889rem; /* 164 */
          color: #fff;
          text-align: center;
        }
        .des{
          text-align: center;
          line-height: .451389rem; /* 65 */
          font-family: "PingFang-SC-Medium";
          font-size: .375rem; /* 54 */
          text-align: center;
          color: #666;
          padding: 1.006944rem 0 1.111111rem 0; /* 145 160 */
        }
        .button{
          display: inline-block;
          height: .833333rem; /* 120 */
          line-height: .833333rem; /* 119 */
          width: 80%; /* 364 */
          text-align: center;
          color: #fff;
          border-radius: .416667rem; /* 60 */
          font-size: .347222rem; /* 50 */
          font-family: "PingFang-SC-Medium";
          margin-left: .388889rem; /* 56 */
          margin-bottom: .347222rem; /* 50 */
          background-color: #E54137;
          color: #fff;
        }
      }
    }
    > .exchange_result{
      .container{
        width: 6.25rem; /* 900 */
        padding-top: 1.333333rem; /* 192 */
        .des{
          padding: 1.041667rem 0;
        }
        > a{
          display: block;
          width: 5.416667rem; /* 780 */
          margin: 0 auto;
          margin-bottom: .340278rem; /* 49 */
        }

      }
    }
    > .lottery_result{
      .container{
        width: 6.25rem; /* 900 */
        padding-top: 1.333333rem; /* 192 */
        .des{
          padding: .451389rem 0; /* 65 */
          strong{
            font-weight: bold;
            color: #E54137;
          }
          i{
            color: #E54137;
          }
        }
        > a{
          display: block;
          width: 5.416667rem; /* 780 */
          margin: 0 auto;
          margin-bottom: .340278rem; /* 49 */
        }

      }
    }
    > .rule{
      .container{
        width: 90%;
        height: 80%;
        background-color: #FFF6E0;
        box-sizing: border-box;
        padding-bottom: .840278rem; /* 121 */
        border-radius: .173611rem; /* 25 */
        position: relative;
        font-size: 0.236111rem; /* 34px */
        line-height: .3125rem; /* 45 */
        > h2{
          width: 3.083333rem; /* 444 */
          height: .736111rem; /* 106 */
          line-height: .736111rem; /* 106 */
          position: absolute;
          left: 50%;
          top: -.118056rem; /* 17 */
          margin-left: -1.541667rem; /* 222 */
          background: url("../assets/title-bg.png");
          background-size: cover;
          text-align: center;
          color: #FFF6E0;
          font-family: "PingFang-SC-Heavy";
          font-size: .361111rem; /* 52 */
          z-index: 5;
        }
        > button{
          position: absolute;
          bottom: 0;
          left: 0;
          height: .840278rem; /* 121 */
          line-height: .840278rem; /* 121 */
          text-align: center;
          width: 100%;
          background-color: #E34F4B;
          color: #fff;
          font-family: "PingFangSC-Regular";
          font-size: .347222rem; /* 50 */
          border: none;
          border-radius: 0 0 .173611rem .173611rem; /* 25 */
          z-index: 5;
        }
        .close{
          width: .756944rem; /* 109 */
          height: .756944rem; /* 109 */
          position: absolute;
          top: -.138889rem; /* 20 */
          right: -.138889rem; /* 20 */
          z-index: 5;
        }
        .rule-box{
          height: 100%;
          width: 94%; /* 950 */
          /* padding-bottom: .840278rem; */ /* 121 */
          overflow-y: scroll;
          box-sizing: border-box;
          border: .138889rem solid #FFE4AB;
          border-radius: .138889rem;
          border-bottom: none;
          margin: .208333rem auto 0; /* 30 */
          padding: .416667rem .138889rem; /* 60 20 */
          overflow-y: scroll;
          h4{
            color: #c96c29;
            font-weight: bold;
          }
          p{
            text-indent: 2em;
            color: #696969;
          }
          .table{
            border: 1px solid #c96c29;
            display: inline-block;
            color: #696969;
            .left{
              border-right: 1px solid #c96c29;
              .thead, .tbody{
                width: 1.145833rem; /* 166 */
              }
            }
            .right{
              .thead, .tbody{
                width: 3.263889rem; /* 470 */
              }
            }
            .thead{
              border-bottom: 1px solid #c96c29;
              height: 0.506944rem; /* 73px */
              line-height: 0.506944rem; /* 73px */
              text-align: center;
              font-size: 0.236111rem; /* 34px */
              font-weight: bold;
              background-color: #FFF7B4;
              font-family: "PingFangSC-Semibold";
            }
            .tbody{
              line-height: .347222rem; /* 50 */
              font-size: .222222rem; /* 32 */
              text-align: center;
            }
          }
          .tx_in0{
            text-indent: 0;
          }
          p a{
            color: #8bc6db;
          }
        }
      }
    }
    > .bubble{
      .container{
        width: 6.680556rem; /* 962 */
        height: 6.680556rem; /* 962 */
        background: url("../assets/bubble.png");
        background-size: cover;
        text-align: center;
        color: #fff;
        > div{
          margin: 1.375rem auto .131944rem; /* 198 19 */
        }
        h4{
          font-family: "PingFang-SC-Heavy";
          font-size: .430556rem; /* 62 */
          line-height: .833333rem; /* 120 */
        }
        p{
          font-family: "PingFang-SC-Bold";
          font-size: .319444rem; /* 46 */
          line-height: .388889rem; /* 56 */
        }
        .shop{
          width: 3.430556rem; /* 494 */
          height: 2.201389rem; /* 317 */
          margin-top: 1.375rem; /* 198 */
        }
        .iphone{
          width: 1.833333rem; /* 264 */
          height: 2.805556rem; /* 404 */
          margin-top: .763889rem; /* 110 */
        }
        .leve{
          width: 2.888889rem; /* 416 */
          height: 1.888889rem; /* 272 */
          margin-top: 1.111111rem; /* 160 */
        }
        .vip{
          width: 2.638889rem; /* 380 */
          height: 2.645833rem; /* 381 */
          margin-top: .902778rem; /* 130 */
        }
        .calls{
          width: 3rem; /* 432 */
          height: 2.027778rem; /* 292 */
          margin-top: 1.041667rem; /* 150 */
        }
      }
    }
    > .startFail{
      .container{
        border-radius: .347222rem; /* 50 */
        background-color: #fff;
        position: relative;
        padding-top: 1.333333rem; /* 192 */
        width: 6.25rem;
        .title{
          background: url("../assets/banner.png");
          width: 7.083333rem; /* 1020 */
          height: 1.333333rem; /* 192 */
          background-size: cover;
          position: absolute;
          top: 0;
          left: -.416667rem; /* 60 */
          font-family: "PingFang-SC-Heavy";
          font-size: .486111rem; /* 70 */
          line-height: 1.138889rem; /* 164 */
          color: #fff;
          text-align: center;
        }
        .des{
          text-align: center;
          line-height: .451389rem; /* 65 */
          font-family: "PingFang-SC-Medium";
          font-size: .375rem; /* 54 */
          text-align: center;
          color: #666;
          padding: 1.006944rem 0 1.111111rem 0; /* 145 160 */
        }
        > a{
          display: inline-block;
          height: .833333rem; /* 120 */
          line-height: .833333rem; /* 119 */
          width: 2.527778rem; /* 364 */
          text-align: center;
          color: #fff;
          border-radius: .416667rem; /* 60 */
          font-size: .347222rem; /* 50 */
          font-family: "PingFang-SC-Medium";
          margin-left: .388889rem; /* 56 */
          margin-bottom: .347222rem; /* 50 */
          &:first-of-type{
            background-color: #FADB2C;
            color: #C90A0B;
            box-shadow: 0 -.069444rem .069444rem #E28704 inset;
          }
          &:last-of-type{
            background-color: #E54137;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
