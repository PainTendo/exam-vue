<template>
  <div class="errPage-container" id="cert">
    <!-- <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back">
      返回
    </el-button> -->
    <!-- <el-button @click="downloadCertificate">
      下载证书
    </el-button> -->
    <div>
        <el-row>
            <div>
              <a href="" id="download" download="">证书下载</a>
              <div id="myCanvasDiv">
                <canvas id="myCanvas" className="myCanvas" width="1148" height="812"></canvas>
              </div>
             </div>
        </el-row>
      </div>
    <el-row>    
        <!-- <img :src="certificatePNG" width="877" height="620"> -->
        <!-- <canvas id="myCanvas" className="myCanvas" width="1148" height="812"> -->
        <!-- <canvas id="myCanvas" className="myCanvas" width="1148" height="812"></canvas> -->
    </el-row>
  </div>
</template>

<script>
import certificatePNG from '@/assets/certificate/certificate.png'
import canvas from 'canvas'

export default {
  name: 'CertificateShow',
  data() {
    return {
      certificatePNG:certificatePNG,
    }
  },
  mounted(){
      this.drawCertificate();

  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    },

    downloadCertificate(){
      document.getElementById('download').click();
    },

    drawCertificate(){
      //接收页面传值
      var certificateInfo=this.$route.params;
      
      const title='数字化底座系列'+certificateInfo.coursesGrade+'认证';
      const name=certificateInfo.userRealName;
      const certificateNumber = certificateInfo.certificateNumber;
      const grantDate = certificateInfo.certificateStartTime.substr(0,10).replace(/-/g,'/');
      const expirationDate = certificateInfo.certificateEndTime.substr(0,10).replace(/-/g,'/');
      var subject;
      if(certificateInfo.coursesGrade=='初级'){
        subject=certificateInfo.coursesName;
      }else{
        subject=certificateInfo.subjectName+certificateInfo.coursesGrade+certificateInfo.coursesName;
      }
      //const divDom = findDOMNode(this);
      //const divDom = document.getElementById('cert');
      //const myCanvas = divDom.querySelector('.myCanvas');
      const myCanvas = document.getElementById('myCanvas');

      const ctx = myCanvas.getContext("2d");

      // Set display size (css pixels).
      myCanvas.style.width = "877px";
      myCanvas.style.height = "620px";

      // Set actual size in memory (scaled to account for extra pixel density).
      //放大倍数
      const scale = 2.4; // <--- Change to 1 on retina screens to see blurry canvas.

      myCanvas.width = parseInt(877 * scale);
      myCanvas.height = parseInt(620 * scale);

      // Normalize coordinate system to use css pixels.
      // 将所有绘制内容放大像素比倍
      ctx.scale(scale, scale);

      const cW = myCanvas.offsetWidth;    // 获取元素宽

      const img = new Image();
      img.src = certificatePNG;
      let imgW = '';
      let imgH = '';

      //图片资源加载时异步的。必须保证图片资源加载完成后才行
      img.onload = () => {
          imgW = img.width;
          imgH = img.height;
          ctx.drawImage(img, 0, 0, cW, imgH * cW / imgW);
          //绘制字体
          ctx.font = '40px 楷体';
          ctx.fillStyle = "black";
          ctx.textBaseline = "top";
          ctx.textAlign = "center";
          ctx.fillText(title, 438, 100);

          ctx.font = '35px 楷体';
          ctx.fillText(name, 440, 210);

          if(subject.length>12) {
              ctx.font = '18px 楷体';
          }else if(subject.length>8){
              ctx.font = '20px 楷体';
          }else{
              ctx.font = '30px 楷体';
          }
          ctx.fillText(subject, 470, 280);

          ctx.textAlign = "left";
          ctx.font = '16px 宋体';

          ctx.fillText(certificateNumber, 220, 551);
          ctx.font = '16px 宋体';
          ctx.fillText(grantDate + '-' + expirationDate, 545, 548);


          myCanvas.toBlob && myCanvas.toBlob(function(blob) {
              var url = URL.createObjectURL(blob);
              document.getElementById('download').setAttribute('href',url)
              //下载文件名称
              document.getElementById('download').setAttribute('download',name+"_"+subject+"证书.png")
        })
      }
    }
}
}
</script>

<style lang="scss" scoped>
  .errPage-container {
    width: 800px;
    max-width: 100%;
    margin: 100px auto;
    .pan-back-btn {
      background: #008489;
      color: #fff;
      border: none!important;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
