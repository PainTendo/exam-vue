<template>

    <data-table
      ref="pagingTable"
      :options="options"
      :list-query="listQuery"
    >
      <template slot="filter-content">
  
        <!-- <el-select v-model="listQuery.params.openType" class="filter-item" placeholder="开放类型" clearable>
          <el-option
            v-for="item in openTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
  
        <el-input v-model="listQuery.params.userRealName" placeholder="搜索姓名" style="width: 200px;" class="filter-item" />
  
        <el-input v-model="listQuery.params.orgName" placeholder="搜索组织" style="width: 200px;" class="filter-item" />
      </template>
  
      <template slot="data-columns">
  
        <el-table-column
          label="姓名"
          prop="userRealName"
          show-overflow-tooltip
        />

        <el-table-column
          label="证书编号"
          prop="certificateNumber"
          show-overflow-tooltip
        />
  
        <el-table-column
          label="证书名称"
          width="300px"
          align="left"
          show-overflow-tooltip
        >
  
          <template slot-scope="scope">
            <span v-if="scope.row.coursesGrade==='初级'">
              {{ scope.row.coursesName }} 
            </span>
            <span v-else>
              {{ scope.row.subjectName }}{{ scope.row.coursesGrade }}{{ scope.row.coursesName }} 
            </span>
          </template>
  
        </el-table-column>

        <el-table-column
          label="有效期"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.certificateStartTime.substr(0,10) }}～{{ scope.row.certificateEndTime.substr(0,10) }}
          </template>
  
        </el-table-column>

        <el-table-column
          label="组织名称"
          prop="orgName"
          show-overflow-tooltip
        />
  
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showCertificate(scope.row)">查看证书</el-button>
          </template>
  
        </el-table-column>
  
      </template>
  
    </data-table>
  
  </template>
  
  <script>
  import DataTable from '@/components/DataTable'
  
  export default {
    components: { DataTable },
    data() {
      return {
        openTypes: [
          {
            value: 1,
            label: '完全开放'
          },
          {
            value: 2,
            label: '定向考试'
          }
        ],
  
        listQuery: {
          current: 1,
          size: 10,
          params: {
          }
        },
  
        options: {
          // 可批量操作
          multi: false,
          // 列表请求URL
          listUrl: '/exam/api/certificate/allcertificate'
        }
      }
    },
    methods: {
  
      // 查看证书
      showCertificate(item) {
        this.$router.push({ name: 'CertificateShow', params: { 
          id:item.id,
          userName:item.userName,
          userRealName:item.userRealName,
          subjectName:item.subjectName,
          state:item.state,
          coursesCode:item.coursesCode, 
          coursesName:item.coursesName,
          coursesGrade:item.coursesGrade,
          certificateStartTime:item.certificateStartTime,
          certificateEndTime:item.certificateEndTime,
          certificateNumber:item.certificateNumber
        }})
      }
    }
  }
  </script>
  