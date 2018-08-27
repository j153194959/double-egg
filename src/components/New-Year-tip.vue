<template>
    <div class="New-Year-tip">
      <header>
        <p>兴业证券恭祝您：</p>
        <p>新年鸿运到，财源滚滚来！</p>
      </header>
      <main>
        <div>
          <div>12月8日 新股</div>
          <p>宏达电子 &nbsp; 790651</p>
          <p>发行价格 &nbsp; 12.88元/股</p>
          <p>所属行业 &nbsp; 电子制造业</p>
        </div>
        <a href="javascript:void(0)"><img src="../assets/save.png" alt=""></a>
      </main>
      <footer>
        <div class="des">
          点击保存至相册，将新年锦囊图片发至朋友圈，并将朋友圈截图和您的<strong>2018新年愿望（格式“我的2018新年愿望是：+愿望”）</strong>发送至微信公众号”兴业证券”或“兴e通”后台，我们将对新年愿望进行征选评比，于2018年1月10日惊喜发布，敬请期待！
        </div>
        <p>
          优胜者将获得100元话费哦！
        </p>
        <div class="code"></div>
      </footer>
    </div>
</template>

<script>
export default {
  name: 'More',
  data () {
    return {
      Data: [
        {
          'score': '+10', // 筹码
          'tag': '投注10个', // 描述字段
          'type': '看涨', // 描述字段
          'imgUrl': './static/images/presented.png',
          'time': '7/08' // 时间
        }
      ]
    }
  },
  props: ['userInfo'], // 接收父组件的值
  methods: {
    /**
     * 获取数据
     */
    setAjax: function () {
      this.$ajax({
        'url': '/myScoreList',
        params: {
          account: this.userInfo.account,
          Token: this.userInfo.token,
          Client: this.userInfo.client
        }
      })
      .then((res) => {
      })
    }
  },
  mounted: function () {
    console.log('New-Year-tip')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.New-Year-tip{
    width: 100%;
    height: 100%;
    background: url('../assets/bg2.jpg');
    background-size: contain;
    box-sizing: border-box;
    header{
      padding: 2.222222rem 1.388889rem 0; /* 320 200 */
      p{
        line-height: .597222rem; /* 86 */
        font-family: "PingFang-SC-Heavy";
        font-size: .347222rem; /* 50 */
        color: #ffce8b;
        &:first-child{
          text-align: left;
        }
        &:last-child{
          text-align: right;
        }
      }
    }
    main{
      margin-top: .923611rem; /* 133 */
      > div{
        margin-left: 1.479167rem;
        width: 3.4375rem; /* 495 */
        div{
          line-height: .548611rem; /* 79 */
          font-family: "PingFang-SC-Bold";
          font-size: .375rem; /* 54 */
          color: #a73518;
          text-align: center;
          margin-bottom: .388889rem; /* 56 */
        }
        p{
          font-family: "PingFang-SC-Medium";
          font-size: .305556rem; /* 44 */
          color: #a73518;
          padding-left: .284722rem; /* 41 */
        }
      }
      > a{
        display: block;
        width: 4.666667rem; /* 672 */
        height: 1.3125rem; /* 189 */
        margin: 1.388889rem auto 0; /* 200 */
      }
    }
    footer{
      width: 6.791667rem; /* 978 */
      margin: .555556rem auto 0; /* 80 */
      border-top: .027778rem solid #FFE9CF;
      color: #FFE9CF;
      padding-top: .138889rem; /* 20 */
      .des{
        font-size: .319444rem; /* 46 */
        font-family: "PingFang-SC-Bold";
        line-height: .430556rem; /* 62 */
        strong{
          color: #A30506;
        }
      }
      p{
        font-family: "PingFang-SC-Heavy";
        font-size: .347222rem; /* 50 */
        line-height: .930556rem; /* 134 */
      }
    }
}
</style>
