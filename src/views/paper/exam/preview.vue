<template>
  <div class="app-container">

    <el-row :gutter="24">

      <el-col :span="24" style="margin-bottom: 20px">

        <el-alert
          title="点击`开始考试`后将自动进入考试，考试只能参与一次，请诚信考试，切屏超过三次后将自动交卷！"
          type="error"
          style="margin-bottom: 10px"
        />

        <el-card class="pre-exam">

          <div><strong>考试名称：</strong>{{ detailData.title }}</div>
          <div><strong>考试时长：</strong>{{ detailData.totalTime }}分钟</div>
          <div><strong>试卷总分：</strong>{{ detailData.totalScore }}分</div>
          <div><strong>及格分数：</strong>{{ detailData.qualifyScore }}分</div>
          <div><strong>考试描述：</strong>{{ detailData.content }}</div>
          <div><strong>开放类型：</strong> {{ detailData.openType | examOpenType }}</div>

        </el-card>

      </el-col>

      <el-col :span="24">

        <el-button :loading="loading" type="primary" icon="el-icon-caret-right" @click="handleCreate">
          开始考试
        </el-button>

        <el-button @click="handleBack">
          返回
        </el-button>

        <!-- <el-button @click="certificateTest">
          证书测试
        </el-button> -->

      </el-col>

    </el-row>
  </div>
</template>

<script>
import { fetchDetail } from '@/api/exam/exam'
import { createPaper } from '@/api/paper/exam'

export default {
  data() {
    return {
      detailData: {},
      postForm: {
        examId: '',
        password: ''
      },
      rules: {
        password: [
          { required: true, message: '考试密码不能为空！' }
        ]
      },

      loading: false
    }
  },

  created() {
    this.postForm.examId = this.$route.params.examId
    this.fetchData()
  },

  methods: {

    fetchData() {
      fetchDetail(this.postForm.examId).then(response => {
        this.detailData = response.data
      })
    },

    certificateTest(){
      const that = this
      that.$router.push({ name: 'Certificate'})
    },

    handleCreate() {
      const that = this
      this.loading = true

      createPaper(this.postForm).then(response => {
        console.log(response)

        if (response.code === 0) {
          //判断用户是否已经参与过考试
          if(response.data.id=='ERROR'){
            this.$message({
              message: '您已参加过该考试，无需再次参加！',
              type: 'error'
            })
            this.loading = false;
          }else{
            setTimeout(function() {
            this.loading = false
            that.dialogVisible = false
            //that.$router.push({ name: 'StartExam', params: { id: response.data.id }})

            let routeData = that.$router.resolve({
                name: 'StartExam',
                params: { id: response.data.id }
            })
            //初始化用户切屏次数
            localStorage.setItem('screenCutting',1);

            //window.open(routeData.href, '_blank')
//             window.open (routeData.href,'_blank',
// 'width='+(window.screen.availWidth)+',height='+(window.screen.availHeight)+
// ',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=no, status=no')
//             }, 1000)

            window.open (routeData.href,'_blank',
'width='+(window.screen.width)+',height='+(window.screen.height)+
',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=yes,location=no, status=no,alwaysRaised=yes')
            }, 1000)
            
            //this.loading = false;
          }    
        }
      }).catch(() => {
        this.loading = false
      })
    },

    handleBack() {
      this.$router.push({ name: 'ExamOnline' })
    }

  }
}
</script>

<style scoped>

  .pre-exam div {

    line-height: 42px;
    color: #555555;
  }

</style>

