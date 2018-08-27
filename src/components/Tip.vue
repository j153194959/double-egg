<template>
    <div class="New-Year-tip">
        <img v-bind:src=img alt="">
        <!-- <div>手机截图保存</div> -->
    </div>
</template>

<script>
export default {
  name: 'Tip',
  data () {
    return {
      img: '' // 图片路径
    }
  },
  props: ['userInfo'], // 接收父组件的值
  mounted: function () {
    console.log(this.userInfo.tip)
    this.img = './static/tips/' + this.userInfo.tip + '.jpg'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.New-Year-tip{
  background-color: #EC393C;
  width: 100%;
  height: 100%;
  img{
    position: absolute;
    bottom: 0;
  }
  div{
    position: absolute;
    bottom: 3.055556rem; /* 450 */
    text-indent: 2em;
    color: #FFE4D1;
    font-size: .277778rem; /* 40 */
    font-family: "PingFang-SC-Bold";
    left: .402778rem; /* 58 */
    font-weight: bold;
    background-color: #FCEAD2;
  }
}
</style>
