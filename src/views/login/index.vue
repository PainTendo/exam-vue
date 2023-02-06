<template>

  <div>

    <div class="title-box">
      <div>用户登录</div>
    </div>

    <el-form ref="postForm" :model="postForm" :rules="loginRules">
      <el-form-item prop="username">
        <el-input
          v-model="postForm.username"
          style="width: 100%"
          placeholder="用户名"
          prefix-icon="el-icon-user"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="postForm.password"
          show-password
          style="width: 100%"
          placeholder="密码"
          type="password"
          prefix-icon="el-icon-lock"
        />
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" style="width: 100%" @click.native.prevent="accountLogin">登录</el-button>
      </el-form-item>

    </el-form>

    <div style="display: flex; align-items: center; justify-content: flex-end">
      <el-link type="primary" href="/#/register">立即注册</el-link>
    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      key:'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789',
      postForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'siteData'
    ])
  },

  methods: {

    loginBack() {
      // 其它跳到后台
      this.$router.push({ path: '/admin/dashboard' })

      setTimeout(function() {
        this.loading = false
      }, 1800)
    },

    encodeString(str){
      return btoa(encodeURIComponent(str)); 
    },


    /**
     * 随机生成索引
     * @param min 最小值
     * @param max 最大值
     * @param i 当前获取位置
     */
    randomIndex(min, max, i){
        let index = Math.floor(Math.random()*(max-min+1)+min),
            numStart = this.key.length - 10;
        //如果字符串第一位是数字，则递归重新获取
        if(i==0&&index>=numStart){
            index = this.randomIndex(min, max, i);
        }
        //返回最终索引值
        return index;
    },


    /**
     * 随机生成字符串
     * @param len 指定生成字符串长度
     */
    getRandomString(len){
        let min = 0, max = this.key.length-1, _str = '';
        //判断是否指定长度，否则默认长度为15
        len = len || 15;
        //循环生成字符串
        for(var i = 0, index; i < len; i++){
            index = this.randomIndex(min, max, i);
            _str += this.key[index];
        }
        return _str;
    },


    accountLogin() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postForm.password=this.encodeString(this.getRandomString(4)+this.postForm.password)
          //alert(this.postForm.password)
          this.$store.dispatch('user/login', this.postForm)
            .then(() => {
              this.loginBack()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
