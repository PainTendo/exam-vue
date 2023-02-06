<template>
  <div>

    <div class="title-box">
      <div>用户注册</div>
    </div>

    <div style="height:240px;overflow:auto;">
    <el-form ref="postForm" :model="postForm" :rules="loginRules">

      <el-form-item prop="userName">
        <el-input
          v-model="postForm.userName"
          style="width: 100%"
          placeholder="用户名"
          prefix-icon="el-icon-mobile"
        />
      </el-form-item>

      <el-form-item prop="mobile">
        <el-input
          v-model="postForm.mobile"
          style="width: 100%"
          placeholder="手机号"
          prefix-icon="el-icon-phone"
        />
      </el-form-item>

      <el-form-item prop="realName">
        <el-input
          v-model="postForm.realName"
          style="width: 100%"
          placeholder="姓名"
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

      <!-- <el-form-item prop="idCard">
        <el-input
          v-model="postForm.idCard"
          style="width: 100%"
          placeholder="身份证"
          prefix-icon="el-icon-postcard"
        />
      </el-form-item> -->

      <el-form-item prop="email">
        <el-input
          v-model="postForm.email"
          style="width: 100%"
          placeholder="邮箱"
          prefix-icon="el-icon-message"
        />
      </el-form-item>

      <!-- <el-form-item prop="org">
        <el-input
          v-model="postForm.org"
          style="width: 100%"
          placeholder="公司"
          prefix-icon="el-icon-monitor"
        />
      </el-form-item> -->

      <el-form-item prop="org">
        <el-select v-model="postForm.org" filterable clearable placeholder="请选择组织" style="width: 100%">
          <el-option
            v-for="item in orgList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" style="width: 100%" @click.native.prevent="handleReg">注册</el-button>
      </el-form-item>

    </el-form>

    <div style="display: flex; align-items: center; justify-content: flex-end">
      <el-link type="primary" href="/#/login">已有账号</el-link>
    </div>
    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { getAllOrganization } from '@/api/organization/organization'

export default {
  data() {
    return {
      postForm: {
        mobile: '',
        password: '',
        idCard:'',
        email:'',
        org:'',
      },
      loginRules: {
        password: [{ required: true, trigger: 'blur', message: '登录密码不能为空！' },{ min: 8, max: 32, message: '长度在8到32个字符之间！', trigger: ['blur', 'change'] }],
        userName: [{ required: true, trigger: 'blur', message: '用户名不能为空！' },{ min: 4, max: 16, message: '长度在4到16个字符之间！', trigger: ['blur', 'change'] }],
        mobile: [{ required: true, trigger: 'blur', message: '手机号不能为空！' },{ type : "string" , message: '请输入正确的手机号码！', pattern : /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ }],
        // idCard: [{ required: true, trigger: 'blur', message: '身份证号不能为空！' }],
        email: [{ required: true, trigger: 'blur', message: '邮箱不能为空！' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        org: [{ required: true, trigger: 'blur', message: '组织不能为空！' }],
        realName: [{ required: true, trigger: 'blur', message: '姓名不能为空！' },{ min: 2, max: 4, message: '长度在2到4个字符之间！', trigger: ['blur', 'change'] }],
        //captchaValue: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      },
      orgList:[],
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'siteData'
    ])
  },

  mounted(){
    getAllOrganization()
            .then(response => {
              this.orgList=response.data;
            })
            .catch(() => {
              this.$message.error('未获取到组织！');
            })
  },

  methods: {

    handleReg() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          //alert(JSON.stringify(this.postForm));
          this.$store.dispatch('user/reg', this.postForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/admin/dashboard' })
              this.loading = false
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


