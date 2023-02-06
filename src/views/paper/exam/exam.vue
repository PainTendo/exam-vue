<template>

  <div class="app-container">

    <el-row :gutter="24">

      <el-col :span="24">
        <el-card style="margin-bottom: 10px">

          距离考试结束还有：
          <exam-timer v-model="paperData.leftSeconds" @timeout="doHandler()" />


          <el-button style="float: right; margin-top: -10px" type="primary" icon="el-icon-plus" :loading="loading" @click="handHandExam()">
            {{ handleText }}
          </el-button>

        </el-card>
      </el-col>

      <el-col :span="6" :xs="24" style="margin-bottom: 10px">

        <el-card>

          <p class="card-title">答题卡</p>
          <el-row :gutter="24" class="card-line" style="padding-left: 10px">
            <el-tag type="info">未作答</el-tag>
            <el-tag type="success">已作答</el-tag>
          </el-row>

          <div v-if="paperData.radioList!==undefined && paperData.radioList.length > 0">
            <p class="card-title">单选题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag v-for="item in paperData.radioList" :type="cardItemClass(item.answered, item.quId)" @click="handSave(item)"> {{ item.sort+1 }}</el-tag>
            </el-row>
          </div>

          <div v-if="paperData.multiList!==undefined && paperData.multiList.length > 0">
            <p class="card-title">多选题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag v-for="item in paperData.multiList" :type="cardItemClass(item.answered, item.quId)" @click="handSave(item)">{{ item.sort+1 }}</el-tag>
            </el-row>
          </div>

          <div v-if="paperData.judgeList!==undefined && paperData.judgeList.length > 0">
            <p class="card-title">判断题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag v-for="item in paperData.judgeList" :type="cardItemClass(item.answered, item.quId)" @click="handSave(item)">{{ item.sort+1 }}</el-tag>
            </el-row>
          </div>

          <div v-if="paperData.saqList!==undefined && paperData.saqList.length > 0">
            <p class="card-title">主观题</p>
            <el-row :gutter="24" class="card-line">
              <el-tag v-for="item in paperData.saqList" :type="cardItemClass(item.answered, item.quId)" @click="handSave(item)">{{ item.sort+1 }}</el-tag>
            </el-row>
          </div>

        </el-card>

      </el-col>

      <el-col :span="18" :xs="24">

        <el-card class="qu-content">
          <p v-if="quData.content">{{ quData.sort + 1 }}.{{ quData.content }}</p>
          <p v-if="quData.image!=null && quData.image!=''">
            <el-image :src="quData.image" style="max-width:100%;" />
          </p>
          <div v-if="quData.quType === 1 || quData.quType===3">
            <el-radio-group v-model="radioValue">
              <el-radio v-for="item in quData.answerList" :label="item.id">{{ item.abc }}.{{ item.content }}
                <div v-if="item.image!=null && item.image!=''" style="clear: both">
                  <el-image :src="item.image" style="max-width:100%;" />
                </div>
              </el-radio>
            </el-radio-group>
          </div>

          <div v-if="quData.quType === 2">

            <el-checkbox-group v-model="multiValue">
              <el-checkbox v-for="item in quData.answerList" :label="item.id">{{ item.abc }}.{{ item.content }}
                <div v-if="item.image!=null && item.image!=''" style="clear: both">
                  <el-image :src="item.image" style="max-width:100%;" />
                </div>
              </el-checkbox>
            </el-checkbox-group>

          </div>

          <div v-if="quData.quType === 4">

            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 15}"
              placeholder="请输入内容"
              v-model="saqValue">
            </el-input>

          </div>

        </el-card>

        <div style="margin-top: 20px">
          <el-button v-if="showPrevious" type="primary" icon="el-icon-back" @click="handPrevious()">
            上一题
          </el-button>

          <el-button v-if="showNext" type="warning" icon="el-icon-right" @click="handNext()">
            下一题
          </el-button>

          <el-dialog
            title="考试须知"
            :visible.sync="examNotice"
            width="40%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            center>
            <span><p>1、请在规定的时间内诚信考试，题目全部作答完成后，点击【交卷】按钮；</p>
            <p>2、考试过程中请勿切换屏幕，切屏超过3次后，将会自动交卷；</p>
            <p>3、请在全屏状态下进行考试，切换全屏/非全屏视为切屏操作；</p>
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="handleFullScreen()">我已知晓，开始答题</el-button>
            </span>
          </el-dialog>


        </div>

      </el-col>

    </el-row>
  </div>

</template>

<script>
import { paperDetail, quDetail, handExam, fillAnswer } from '@/api/paper/exam'
import { Loading } from 'element-ui'
import ExamTimer from '@/views/paper/exam/components/ExamTimer'
import { number } from 'yargs'
//import screenfull from "screenfull"

export default {
  name: 'ExamProcess',
  components: { ExamTimer },
  data() {
    return {
      screenCutting:number,//切屏次数
      examNotice:true,//考试提醒框
      // 全屏/不全屏
      isFullscreen: false,
      showPrevious: false,
      showNext: true,
      loading: false,
      handleText: '交卷',
      pageLoading: false,
      // 试卷ID
      paperId: '',
      // 当前答题卡
      cardItem: {},
      allItem: [],
      // 当前题目内容
      quData: {
        answerList: []
      },
      // 试卷信息
      paperData: {
        leftSeconds: 99999,
        radioList: [],
        multiList: [],
        judgeList: [],
        saqList:[]
      },
      // 单选选定值
      radioValue: '',
      // 多选选定值
      multiValue: [],
      //简答题答案
      saqValue:'',
      // 已答ID
      answeredIds: []
    }
  },
  created() {
    const id = this.$route.params.id
    if (typeof id !== 'undefined') {
      this.paperId = id
      this.fetchData(id)
    }

    //禁用浏览器刷新，全屏，后退前进等操作，屏蔽相关按键
    this.stopF5Refresh();

    //初始化切屏次数，从存储中读取
    this.screenCutting=parseInt(localStorage.getItem('screenCutting'));

    //全屏
    //this.handleFullScreen();

  },


  //检测切屏
  mounted() {
    var self=this;
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState == "hidden") {
        //切离该页面时执行
        // alert('您已于'+new Date().toLocaleString()+'离开页面，切屏'+self.screenCutting+'次，切屏超过3次后将强制交卷！');
        // self.$message({
        //   message: '您已于'+new Date().toLocaleString()+'离开页面，切屏'+self.screenCutting+'次，切屏超过3次后将强制交卷！',
        //   type: 'error'
        // })
        self.$alert('您已于'+new Date().toLocaleString()+'离开页面，切屏'+self.screenCutting+'次，切屏超过3次后将强制交卷！', '切屏提醒', {
          confirmButtonText: '我知道了',
          callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
          }
        });
        //切屏三次强制交卷
        if(self.screenCutting>3){
          self.doHandler();
        }
        self.screenCutting=self.screenCutting+1;
      } else if (document.visibilityState == "visible") {
        //切换到该页面时执行
        //alert('您已于'+new Date().toLocaleString()+'进入页面！切屏'+screenCutting+'次');
      }     
    });

    //检测刷新，刷新时将切屏次数保存至存储
    window.addEventListener('beforeunload',()=>{
      localStorage.setItem('screenCutting',self.screenCutting);
    });

    //检测窗口大小变化
    window.addEventListener('resize', this.resize);

  },


  methods: {

    //禁用浏览器刷新，全屏，后退前进等操作，屏蔽相关按键
    stopF5Refresh(){
      document.onkeydown=function(e){
        var evt=window.event||e;
        var code=evt.keyCode||evt.which;
        //屏蔽f1-f12
        if(code>111&&code<124){
          if(evt.preventDefault){
            evt.preventDefault();
          }else{
            evt.keyCode=0;
            evt.returnValue=false;
          }
        }
      };
      //禁止鼠标右键菜单
      document.oncontextmenu=function(e){
        return false;
      };
      //阻止所有的后退操作，包括按键、手势、键盘等
      history.pushState(null,null,window.location.href);
      window.addEventListener("popstate",function(){
        history.pushState(null,null,window.location.href);
      });
    },

    //浏览器全屏
    handleFullScreen(){
      var self=this;
      let element = document.documentElement;
      //if(!this.isFullscreen){
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      //}
      self.isFullscreen=true;
      self.examNotice=false;
    },

    //浏览器退出全屏
    exitFullScreen() {
      if (document.exitFullscreen) {
          document.exitFullscreen();
      } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
      }
      this.isFullscreen=false;
    },

    //检测窗口大小变化，判断是否全屏
    resize(){
      this.isFullscreen=document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      //this.isFullscreen=false;
      if(!this.isFullscreen){
        this.$alert('请在全屏模式下进行考试！您已切屏'+this.screenCutting+'次，切屏超过3次后将强制交卷！','全屏提醒', {
          confirmButtonText: '我知道了',
          showClose:false,
          callback: action => {
            this.handleFullScreen();
            //切屏三次强制交卷
            if(this.screenCutting>3){
              this.doHandler();
            }
            this.screenCutting =this.screenCutting+1;
          }
        });
      }
    },


    // 答题卡样式
    cardItemClass(answered, quId) {
      if (quId === this.cardItem.quId) {
        return 'warning'
      }

      if (answered) {
        return 'success'
      }

      if (!answered) {
        return 'info'
      }
    },

    /**
     * 统计有多少题没答的
     * @returns {number}
     */
    countNotAnswered() {
      let notAnswered = 0

      this.paperData.radioList.forEach(function(item) {
        if (!item.answered) {
          notAnswered += 1
        }
      })

      this.paperData.multiList.forEach(function(item) {
        if (!item.answered) {
          notAnswered += 1
        }
      })

      this.paperData.judgeList.forEach(function(item) {
        if (!item.answered) {
          notAnswered += 1
        }
      })

      this.paperData.saqList.forEach(function(item) {
        if (!item.answered) {
          notAnswered += 1
        }
      })

      return notAnswered
    },

    /**
     * 下一题
     */
    handNext() {
      const index = this.cardItem.sort + 1
      this.handSave(this.allItem[index])
    },

    /**
     * 上一题
     */
    handPrevious() {
      const index = this.cardItem.sort - 1
      this.handSave(this.allItem[index])
    },

    doHandler() {
      this.handleText = '正在交卷，请等待...'
      this.loading = true

      const params = { id: this.paperId }
      handExam(params).then(() => {
        // this.$message({
        //   message: '试卷提交成功，即将进入试卷详情！',
        //   type: 'success'
        // })
        // this.$router.push({ name: 'ShowExam', params: { id: this.paperId }})
        this.$message({
           message: '试卷提交成功！',
           type: 'success'
        })
        //交卷后关闭浏览器页签
        window.opener = null;
        window.open("about:blank", "_self");
        window.close();
      })
    },

    // 交卷操作
    handHandExam() {
      const that = this

      // 交卷保存答案
      this.handSave(this.cardItem, function() {
        const notAnswered = that.countNotAnswered()

        let msg = '确认要交卷吗？'

        if (notAnswered > 0) {
          msg = '您还有' + notAnswered + '题未作答，确认要交卷吗?'
        }

        that.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.doHandler()
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '交卷已取消，您可以继续作答！'
          })
        })
      })
    },

    // 保存答案
    handSave(item, callback) {
      //强制全屏状态下答题
      // if(!this.isFullscreen){
      //   this.$message({
      //     message: '请在全屏状态下答题！',
      //     type: 'success'
      //   })
      //   return;
      // }
      if (item.id === this.allItem[0].id) {
        this.showPrevious = false
      } else {
        this.showPrevious = true
      }

      // 最后一个索引
      const last = this.allItem.length - 1

      if (item.id === this.allItem[last].id) {
        this.showNext = false
      } else {
        this.showNext = true
      }

      const answers = this.multiValue
      if (this.radioValue !== '') {
        answers.push(this.radioValue)
      }


      //const params = { paperId: this.paperId, quId: this.cardItem.quId, answers: answers, answer: '' }
      const params = { paperId: this.paperId, quId: this.cardItem.quId, answers: answers, answer: this.saqValue }
      fillAnswer(params).then(() => {
        // 必须选择一个值
        if (answers.length > 0||this.saqValue!=='') {
          // 加入已答列表
          this.cardItem.answered = true
        }

        // 最后一个动作，交卷
        if (callback) {
          callback()
        }

        // 查找详情
        this.fetchQuData(item)
      })
    },

    // 试卷详情
    fetchQuData(item) {
      // 打开
      const loading = Loading.service({
        text: '拼命加载中',
        //background: 'rgba(0, 0, 0, 0.7)'
      })

      // 获得详情
      this.cardItem = item

      // 查找下个详情
      const params = { paperId: this.paperId, quId: item.quId }
      quDetail(params).then(response => {
        console.log(response)
        this.quData = response.data
        this.radioValue = ''
        this.multiValue = []
        this.saqValue=''

        // 填充该题目的答案
        this.quData.answerList.forEach((item) => {
          if ((this.quData.quType === 1 || this.quData.quType === 3) && item.checked) {
            this.radioValue = item.id
          }

          if (this.quData.quType === 2 && item.checked) {
            this.multiValue.push(item.id)
          }
        })
        //填充简答题答案
        if(this.quData.quType === 4 && this.quData.answer!==''){
          this.saqValue=this.quData.answer;
        }

        // 关闭详情
        loading.close()
      })
    },

    // 试卷详情
    fetchData(id) {
      const params = { id: id }
      paperDetail(params).then(response => {
        // 试卷内容
        this.paperData = response.data

        // 获得第一题内容
        if (this.paperData.radioList) {
          this.cardItem = this.paperData.radioList[0]
        } else if (this.paperData.multiList) {
          this.cardItem = this.paperData.multiList[0]
        } else if (this.paperData.judgeList) {
          this.cardItem = this.paperData.judgeList[0]
        } else if (this.paperData.saqList) {
          this.cardItem = this.paperData.saqList[0]
        }

        const that = this

        this.paperData.radioList.forEach(function(item) {
          that.allItem.push(item)
        })

        this.paperData.multiList.forEach(function(item) {
          that.allItem.push(item)
        })

        this.paperData.judgeList.forEach(function(item) {
          that.allItem.push(item)
        })

        this.paperData.saqList.forEach(function(item) {
          that.allItem.push(item)
        })

        // 当前选定
        this.fetchQuData(this.cardItem)
      })
    }

  }
}
</script>

<style scoped>

  .qu-content div{
    line-height: 30px;
  }

  .el-checkbox-group label,.el-radio-group label{
    width: 100%;
  }

  .card-title{
    background: #eee;
    line-height: 35px;
    text-align: center;
    font-size: 14px;
  }
  .card-line{
    padding-left: 10px
  }
  .card-line span {
    cursor: pointer;
    margin: 2px;
  }

  ::v-deep
  .el-radio, .el-checkbox{
    padding: 9px 20px 9px 10px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    margin-bottom: 10px;
  }

  .is-checked{
    border: #409eff 1px solid;
  }

  .el-radio img, .el-checkbox img{
    max-width: 200px;
    max-height: 200px;
    border: #dcdfe6 1px dotted;
  }

  ::v-deep
  .el-checkbox__inner {
    display: none;
  }

  ::v-deep
  .el-radio__inner{
    display: none;
  }

  ::v-deep
  .el-checkbox__label{
    line-height: 30px;
  }

  ::v-deep
  .el-radio__label{
    line-height: 30px;
  }

</style>

