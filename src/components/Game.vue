<template>
  <div class="Game" ref="Game">
    <div ref="bar" class="progress-bar">
      <div ref="timeLeft">{{timeLeft}}s &nbsp;</div>
      <div>8s &nbsp;</div>
    </div>
    <ul class="container" ref="ul">
      <li v-for="(value, index) in game.position" :key="index" v-bind:style="value" v-bind:class="game.className[index]"></li>
    </ul>
    <div class="gift-bag" ref="bag"><img src="../assets/gift-bag.png" alt=""></div>
    <!-- 弹窗 -->
    <div v-if="game.gameOver" class="supernatant shade_supernatant">
      <div class="container">
        <div class="title">{{maskControl.title}}</div>
        <div v-if="maskControl.type" class="des">
          {{maskControl.txt1}}<br>
          {{maskControl.txt2}}
        </div>
        <div v-if="!maskControl.type" class="get">
          <p>本次游戏获得</p>
          <div>
            <i><img src="../assets/gift-box.png" alt=""></i>
            礼盒<span> X {{game.prizeNum}}</span>
          </div>
        </div>
        <a @click="clickLeft(maskControl.type)" href="javascript:void(0)">{{maskControl.btn1}}</a>
        <a @click="clickRight(maskControl.type)" href="javascript:void(0)">{{maskControl.btn2}}</a>
      </div>
    </div>
    <!-- 气泡弹窗 -->
    <div @click="startGame" v-if="bubbleIsShow" class="bubble shade_supernatant">
      <div class="container">
        <div class="shop"><img src="../assets/game-guide.png" alt=""></div>
        <br>
        <p>
          按住屏幕下方的礼物袋，左右移动接住礼盒<br>
          注意避开炸弹哦！
        </p>
        <br>
        <!-- <p>点击开始游戏</p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Game',
  data () {
    return {
      prizeNum: 3, // 奖品数量
      tip: 0, // 纪录奖品出现次数
      num: 30, // 掉落数量
      leftNums: 30, // 剩余掉落数量
      timeLeft: 8, // 剩余时间
      timeOut: null, // 延时定时器
      maskControl: { // 弹窗控制
        type: 0, // 0: 还有机会可以再玩   1：机会用完，可分享    2：机会用完，不可分享
        title: '恭喜您！',
        txt1: '今日游戏次数已用完',
        txt2: '分享立即多获得1次游戏机会哦~',
        btn1: '兑换奖品',
        btn2: '再玩一次'
      },
      game: { // 游戏控制
        position: [], // 所有位置
        className: [], // 所有类名
        gameOver: false, // 游戏是否结束
        prizeNum: 0, // 接到奖品个数
        collisionY: 0, // 碰撞y值
        moveY: 0 // 可移动y值
      },
      position: [ // 可选位置 9 个
        {
          left: '3.118056rem', // 449
          top: '.819444rem' // 118
        },
        {
          left: '1.388889rem', // 200
          top: '1.979167rem' // 285
        },
        {
          left: '4.763889rem', // 686
          top: '1.9375rem' // 279
        },
        {
          left: '2.868056rem', // 413
          top: '2.097222rem' // 302
        },
        {
          left: '.972222rem', // 140
          top: '3.5625rem' // 513
        },
        {
          left: '5.701389rem', // 821
          top: '4.5625rem' // 657
        },
        {
          left: '5.3125rem', // 765
          top: '2.895833rem' // 417
        },
        {
          left: '3.659722rem', // 527
          top: '4rem' // 576
        },
        {
          left: '2.229167rem', // 321
          top: '4.166667rem' // 600
        }
      ],
      className: [ // 可选类名 7 个
        'box3',
        'box4',
        'box5',
        'box6',
        'box7',
        'box1',
        'box2'
      ],
      bag: { // 收集袋
        left: 0,
        width: 0,
        height: 0
      },
      box: { // 掉落盒子
        width: [],
        height: [],
        left: []
      },
      bubbleIsShow: true // 气泡弹窗是否显示
    }
  },
  props: ['userInfo'], // 接收父组件的值
  methods: {
    /**
     * 每个礼盒位置换成px格式
     */
    changePx: function () {
      var rem = parseFloat(document.querySelector('html').style.fontSize)
      var arr = [
        [3.118056, 0.819444],
        [1.388889, 1.979167],
        [4.763889, 1.9375],
        [2.868056, 2.097222],
        [0.972222, 3.5625],
        [5.701389, 4.5625],
        [5.3125, 2.895833],
        [3.659722, 4],
        [2.229167, 4.166667]
      ]
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i]
        this.position[i].left = rem * el[0] + 'px'
        this.position[i].top = rem * el[1] + 'px'
      }
    },
    /**
     * 每个礼盒宽高换成px格式
     */
    changePx2: function () {
      var rem = parseFloat(document.querySelector('html').style.fontSize)
      var boxArr = [
        [1.430556, 1.465278],
        [1.208333, 1.284722],
        [0.875, 1.180556],
        [1.243056, 1.236111],
        [0.805556, 1.208333],
        [0.986111, 0.986111],
        [0.805556, 1.208333]
      ]
      for (let i = 0; i < boxArr.length; i++) {
        boxArr[i][0] = rem * boxArr[i][0]
        boxArr[i][1] = rem * boxArr[i][1]
      }
      var result = {
        box1: boxArr[0],
        box2: boxArr[1],
        box3: boxArr[2],
        box4: boxArr[3],
        box5: boxArr[4],
        box6: boxArr[5],
        box7: boxArr[6]
      }
      // console.log(boxArr)
      return result
    },
    /**
     * 单个礼盒布置
     */
    singleLayout: function (tip) {
      var round1 = parseInt(Math.random() * this.className.length) // 随机获取类名
      if (this.leftNums <= this.prizeNum - this.tip) { // 让礼盒掉完
        var round3 = parseInt(Math.random() * 2)
        round1 = round3 ? 5 : 6
      }
      this.game.className.push(this.className[round1])
      if (round1 === 5 || round1 === 6) { // 礼盒掉完的情况不出现礼盒
        this.tip++
        if (this.tip === this.prizeNum) {
          this.className.splice(5, 2)
        }
      }
      var round2 = parseInt(Math.random() * this.position.length) // 随机获取位置
      this.game.position.push(this.position[round2])
    },
    /**
     * 布置所有礼盒 假设布置30个
     */
    allLayout: function (num) {
      var time = parseInt(8000 / num) // 每个奖品出现的间隔时间
      var tip = 0 // 纪录出现奖品数
      // 放好每个盒子
      // for (var i = 0; i < this.num; i++) {
      //   this.singleLayout(tip)
      //   tip++
      //   this.leftNums--
      // }
      // 保存每个盒子的left值
      for (let i = 0; i < this.game.position.length; i++) {
        const el = parseFloat(this.game.position[i].left)
        this.box.left.push(el)
      }
      // 保存每个盒子的宽高
      var result = this.changePx2()
      for (let i = 0; i < this.game.className.length; i++) {
        const el = this.game.className[i]
        this.box.width.push(result[el][0])
        this.box.height.push(result[el][1])
      }
      // 保存可移动高度
      var barH = this.$refs.bar.offsetHeight
      var pageH = this.$refs.Game.offsetHeight
      this.game.moveY = pageH - barH
      this.game.collisionY = this.game.moveY - this.bag.height
      // 让每个盒子动起来
      tip = 0
      var elapsed = 0 // 已用时间
      var timer1 = setInterval(() => {
        if (this.game.gameOver) {
          clearInterval(timer1)
        }
        var index = tip
        var result = this.game.className[index] + ' animation'
        this.$set(this.game.className, index, result)
        tip++
        if (tip === num) {
          clearInterval(timer1)
          this.timeOut = setTimeout(() => {
            this.maskControl.title = '恭喜您！'
            this.maskControl.type = 0
            this.maskControl.btn1 = '兑换奖品'
            this.maskControl.btn2 = '再玩一次'
            if (!this.game.prizeNum) {
              this.maskControl.title = '好遗憾~'
            }
            this.game.gameOver = true
            this.submit(this.game.prizeNum)
          }, 3000)
        }
      }, time)
      var timer2 = setInterval(() => {
        if (this.game.gameOver) {
          clearInterval(timer2)
        }
        elapsed += 25
        var rate = ((8000 - elapsed) / 8000 * 100).toFixed(2) + '%'
        this.$refs.timeLeft.style.width = rate
        this.timeLeft = parseInt((8000 - elapsed) / 1000)
        if (elapsed >= 8000) {
          clearInterval(timer2)
        }
      }, 25)
    },
    /**
     * 发生碰撞
     */
    collision: function () {
      var lis = document.querySelectorAll('.container li')
      var top = [] // 所有掉落盒子top值
      for (let i = 0; i < lis.length; i++) {
        top.push(lis[i].offsetTop)
      }
      for (let i = 0; i < top.length; i++) {
        const el = top[i]
        // 如果top值已满足条件
        if (el >= this.game.collisionY && el <= this.game.moveY) {
          // 如果发生碰撞
          if (this.box.left[i] > this.bag.left - this.box.width[i] && this.box.left[i] < this.bag.left + this.bag.width) {
            // console.log(this.game.className[i].indexOf('box1'))
            // 如果接到的是奖品
            if (this.game.className[i].indexOf('box1') >= 0 || this.game.className[i].indexOf('box2') >= 0) {
              this.game.prizeNum++
              // 如果接到的是炸弹
            } else if (this.game.className[i].indexOf('box6') >= 0) {
              this.maskControl.type = 0
              this.maskControl.title = '接到炸弹了(｡•ˇ‸ˇ•｡)'
              this.maskControl.btn1 = '兑换奖品'
              this.maskControl.btn2 = '再玩一次'
              this.game.gameOver = true
              // this.game.prizeNum = 0
              this.submit(this.game.prizeNum)
              if (this.timeOut) {
                clearTimeout(this.timeOut)
              } else {
                var tip = 0
                var timer = setInterval(() => {
                  tip++
                  if (this.timeOut) {
                    clearTimeout(this.timeOut)
                    clearInterval(timer)
                    return
                  }
                  if (tip > 7) {
                    clearInterval(timer)
                  }
                }, 1000)
              }
            }
            // 隐藏接到的东西
            this.$set(this.game.className, i, '')
          }
        }
      }
      // console.log(top)
    },
    /**
     * 礼盒类名，位置布置
     */
    setBox: function (prizeNum) {
      var max = 50
      var boomNum = Math.ceil(prizeNum * 0.3) // 炸弹数量
      var classArr = []
      var allArr = []
      // 当没有无用掉落时
      if (prizeNum >= 38) {
        max = prizeNum + boomNum
      }
      this.num = max
      // 保存索引值
      for (let i = 0; i < max; i++) {
        allArr.push(i)
      }
      // 获取奖品的随机索引值 并放入类名
      for (let i = 0; i < prizeNum; i++) {
        const round = parseInt(Math.random() * (max - i))
        let round1 = parseInt(Math.random() * 2) ? 5 : 6
        classArr[allArr[round]] = this.className[round1]
        allArr.splice(round, 1)
      }
      // 获取炸弹的随机索引值 并放入类名
      // console.log(boomNum, this.className[3], this.className)
      for (let i = 0; i < boomNum; i++) {
        const round = parseInt(Math.random() * (max - prizeNum - i))
        classArr[allArr[round]] = this.className[3]
        allArr.splice(round, 1)
      }
      // 获取无用盒子索引值 并放入类名
      var noArr = [0, 1, 2, 4]
      for (let i = 0; i < allArr.length; i++) {
        const el = allArr[i]
        const round = parseInt(Math.random() * noArr.length)
        classArr[el] = this.className[noArr[round]]
        // console.log(el)
      }
      // 获取随机位置放入位置，并将类名填入
      for (let i = 0; i < classArr.length; i++) {
        const el = classArr[i]
        this.game.className.push(el)
        const round = parseInt(Math.random() * this.position.length) // 随机获取位置
        this.game.position.push(this.position[round])
      }
    },
    /**
     * 提交游戏结果
     */
    submit: function (times) {
      this.$ajax({
        url: '/commit',
        params: {phone: this.userInfo.phone, times: times}
      })
      .then((res) => {
        console.log(res.data)
        if (res.data.resphead && res.data.resphead.respcode === '0000') {
          this.userInfo.leftTimes--
        } else {
          this.maskControl.type = 2
          this.maskControl.title = '天天接礼盒'
          this.maskControl.txt1 = '今日游戏次数已用完，请明日再来~'
          this.maskControl.txt2 = '天天接礼盒，豪礼多多多'
          this.maskControl.btn1 = '知道了'
          this.maskControl.btn2 = '兑换奖品'
        }
      })
    },
    /**
     * 点击左边按钮
     */
    clickLeft: function (type) {
      // console.log('left')
      if (!type || type === 1) {
        // window.location.href = '?isChangeTo=1#/'
        this.clickChange()
      } else {
        this.game.gameOver = false
      }
    },
    /**
     * 点击右边按钮
     */
    clickRight: function (type) {
      // console.log('right')
      if (!type) {
        if (this.userInfo.leftTimes) {
          // window.location.href = '#/'
          window.history.back() // 返回上一页
          // this.clickChange()
        } else {
          if (this.userInfo.isShare) {
            this.maskControl.type = 2
            this.maskControl.title = '天天接礼盒'
            this.maskControl.txt1 = '今日游戏次数已用完，请明日再来~'
            this.maskControl.txt2 = '天天接礼盒，豪礼多多多'
            this.maskControl.btn1 = '知道了'
            this.maskControl.btn2 = '兑换奖品'
          } else {
            this.maskControl.type = 1
            this.maskControl.title = '分享多一次游戏机会哦~'
            this.maskControl.txt1 = '今日游戏次数已用完'
            this.maskControl.txt2 = '分享立即多获得1次游戏机会哦~'
            this.maskControl.btn1 = '兑换奖品'
            this.maskControl.btn2 = '立即分享'
          }
        }
      } else if (type === 1) {
        console.log('分享')
        // window.location.href = '#/'
        window.history.back() // 返回上一页
      } else {
        // window.location.href = '?isChangeTo=1#/'
        this.clickChange()
      }
    },
    /**
     * 点击兑换奖品
     */
    clickChange: function () {
      var gotoF = {
        leftTimes: this.userInfo.leftTimes,
        prizeNum: this.userInfo.prizeNum,
        isShare: this.userInfo.isShare,
        isChangeTo: 1
      }
      this.$emit('transferUser', gotoF)
      // window.location.href = '#/'
      window.history.back() // 返回上一页
    },
    /**
     * 点击气泡开始游戏
     */
    startGame: function () {
      this.bubbleIsShow = false
      this.allLayout(this.num)
    }
  },
  beforeMount: function () {
    this.changePx()
    console.log(this.userInfo.prizeNum)
    this.setBox(this.userInfo.prizeNum)
  },
  mounted: function () {
    var bag = this.$refs.bag
    this.bag.width = bag.offsetWidth
    this.bag.height = bag.offsetHeight
    this.$refs.bag.style.left = document.documentElement.clientWidth / 2 - bag.offsetWidth / 2 + 'px'
    // this.allLayout(this.num)
    var that = this
    var touchEvent = (function () {
      var oDiv = bag // 获取可拖动元素

      var touchSatrtFunc, touchMoveFunc
      var startX, startPositionX, elemWidth, byWidth

      // 可拖动元素的宽度
      elemWidth = oDiv.offsetWidth

      // 触摸点下事件
      touchSatrtFunc = function (e) {
        e.preventDefault() // 阻止触摸时浏览器的缩放、滚动条滚动等
        var touch = e.touches[0] // 获取第一个触点
        var x = Number(touch.pageX) // 页面触点X坐标
        // 记录触点初始位置
        startX = x

        // 可拖动元素距离页面左侧的距离
        startPositionX = oDiv.offsetLeft
        // 网页可见区域宽
        byWidth = document.documentElement.clientWidth
      }

      // 触摸点下移动事件
      touchMoveFunc = function (e) {
        e.preventDefault() // 阻止触摸时浏览器的缩放、滚动条滚动等
        var touch = e.touches[0] // 获取第一个触点
        var x = Number(touch.pageX) // 页面触点X坐标

        var fnyLeft = startPositionX + (x - startX)

        // oIpt.value = "元素位置：" +startPositionX +":"+startPositionY
        // oIpt1.value = "触点位置：" +x +":"+y

        // 判断移动到边缘情况
        if (fnyLeft <= 0) {
          oDiv.style.left = 0
          that.bag.left = 0
        } else if (fnyLeft >= (byWidth - elemWidth)) {
          oDiv.style.left = byWidth - elemWidth + 'px'
          that.bag.left = byWidth - elemWidth
        } else if (fnyLeft > 0 && fnyLeft < (byWidth - elemWidth)) {
          oDiv.style.left = fnyLeft + 'px'
          that.bag.left = fnyLeft
        }
      }

      var touchs = function () {
        oDiv.addEventListener('touchstart', touchSatrtFunc, false)
        oDiv.addEventListener('touchmove', touchMoveFunc, false)
      }

      return {
        getTouch: touchs,
        touchSatrtFunc: touchSatrtFunc,
        touchMoveFunc: touchMoveFunc
      }
    })()
    touchEvent.getTouch()
    var collision = setInterval(() => {
      if (this.game.gameOver) {
        clearInterval(collision)
      }
      this.collision()
    }, 50)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.Game{
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .progress-bar{
    width: 6.944444rem; /* 1000 */
    height: .277778rem; /* 40 */
    line-height: .277778rem; /* 40 */
    text-align: right;
    margin: 0 auto; /* 62 100 */
    padding: .430556rem 0 .694444rem;
    overflow: hidden;
    font-size: .25rem;
    font-family: "PingFang-SC-Semibold";
    div{
      width: 100%;
      height: 100%;
      color: #fff;
      background-color: #C5C5C5;
      border-radius: .138889rem; /* 20 */
      &:first-child{
        float: left;
        width: 100%;
        background-color: #FDCB23;
      }
    }
  }
  > .container{
    width: 100%;
    height: 7.173611rem;
    background: url("../assets/game-bg.png");
    background-size: cover;
    position: relative;
    li{
      background-size: cover;
      position: absolute;
      opacity: 0;
    }
    .box1{
      width: 1.430556rem; /* 206 */
      height: 1.465278rem; /* 211 */
      background-image: url('../assets/gift-box1.png');
    }
    .box2{
      width: 1.208333rem; /* 174 */
      height: 1.284722rem; /* 185 */
      background-image: url('../assets/gift-box2.png');
    }
    .box3{
      width: .875rem; /* 126 */
      height: 1.180556rem; /* 170 */
      background-image: url('../assets/lantern.png');
    }
    .box4{
      width: 1.243056rem; /* 179 */
      height: 1.236111rem; /* 178 */
      background-image: url('../assets/crutch.png');
    }
    .box5{
      width: .805556rem; /* 116 */
      height: 1.208333rem; /* 174 */
      background-image: url('../assets/candy.png');
    }
    .box6{
      width: .986111rem; /* 142 */
      height: .986111rem; /* 124 */
      background-image: url('../assets/bomb.png');
    }
    .box7{
      width: .805556rem; /* 116 */
      height: 1.208333rem; /* 174 */
      background-image: url('../assets/candy.png');
    }
    .animation{
      opacity: 1;
      top: 900px !important;
      transition: top 3s ease;
      -webkit-transition: top 3s ease;
    }
  }
  .gift-bag{
    width: 1.944444rem; /* 280 */
    height: 1.180556rem; /* 170 */
    position: absolute;
    bottom: 0;
    left: 0;
  }
  /* 浮层公共样式 */
  > .shade_supernatant{
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
    }
  }
  > .supernatant{
    .container{
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
      .get{
        font-family: "PingFang-SC-Medium";
        font-size: .375rem; /* 54 */
        padding: .1875rem 1.111111rem .861111rem; /* 27 160 124 */
        color: #666;
        p{
          line-height: 1.180556rem; /* 170 */
        }
        div{
          line-height: .826389rem; /* 119 */
          i{
            width: .826389rem; /* 119 */
            height: .826389rem; /* 119 */
            display: inline-block;
            vertical-align: middle;
          }
          span{
            font-size: .430556rem;
            font-family: "PingFang-SC-Bold";
            vertical-align: middle;
            margin-left: .833333rem; /* 120 */
            color: #E54137;
          }
        }
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
    }
  }
}
</style>
