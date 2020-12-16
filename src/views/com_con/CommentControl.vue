<template>
  <div class="com_con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表格主体部分 -->
      <el-table
        class="table"
        :data="tableData" 
        style="width: 100%"
        :loading="tableLoading"
      >
        <el-table-column
          prop="title" 
          label="标题" 
        ></el-table-column>
        <el-table-column 
          prop="total_comment_count" 
          label="总评论数" 
        ></el-table-column>
        <el-table-column 
          prop="fans_comment_count" 
          label="粉丝评论数">
        </el-table-column>
        <el-table-column 
          prop="comment_status" 
          label="评论状态" 
        >
        <template slot-scope="scope">
          {{ scope.row.comment_status? '正常':'关闭' }}
        </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="statusChange(scope.row)"
              :disabled="switchDisabled"
            >
          </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 完整功能分页器 -->
      <!-- page-size属性表明分页器的每页展示数据个数，支持.sync修饰符，可以实现数据双向绑定
      current_page属性表示当前页数，同样也支持.sync修饰符，这样在手动输入页码跳转以及手动选择每页展示
      数据个数时data中数据会随之改变 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_count">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArtData,chagneComStatus } from '@/network/art_con.js'
import JSONbig from 'json-bigint'

export default {
  name: "CommentControl",
  created() {
    // 组件初始化，请求表格数据
    this.getTableData()
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 当前页评论列表
      com_list: [],
      // 评论总数
      total_count: 0,
      // 当前页码数
      page: 1,
      // 每页数据的数量
      per_page: 10,
      // 表格是否处于加载状态
      tableLoading: false,
      // 状态管理开关禁用状态
      switchDisabled: false
    }
  },
  methods: {
    handleSizeChange() {
      this.getTableData()
    },
    // 页码改变重新请求评论数据
    handleCurrentChange() {
      this.getTableData()
    },
    // 评论状态开关
    async statusChange(col) {
      try {
        this.switchDisabled = true
        const id = JSONbig.stringify(col.id)
        console.log('文章id',id)
        const data = await chagneComStatus(id,col.comment_status)
        console.log(data)
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      } catch (e) {}
      finally{
        this.switchDisabled = false
      }
    },
    // 请求表格数据
    async getTableData() {
      try {
        this.tableLoading = true
        const { data } = await getArtData({
          page: this.page,
          per_page: this.per_page,
          response_type: 'comment'
        })
        const getData = data.data
        this.total_count = getData.total_count
        this.tableData = getData.results
        console.log('列表数据',this.tableData)
      } catch (e) {}
      finally{
        this.tableLoading = false
      }
    }
  }
};
</script>

<style scoped>
.table /deep/ .el-table__body-wrapper /deep/ .el-table__body /deep/ .cell{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.el-pagination{
  margin-top: 20px;
}
</style>