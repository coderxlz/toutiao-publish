<template>
  <div class="art_con">
    <!-- 查询表单卡片 -->
    <el-card class="box-card query">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="text item">
        <el-form
          :model="query"
          ref="ruleForm"
          class="demo-ruleForm"
          hide-required-asterisk
        >
          <!-- 状态 -->
          <el-form-item label="状态" prop="status">
            <!-- 在radio-button中，v-model与label一一对应，v-model的值等于哪个label，哪个radio就会被选中 -->
            <el-radio-group v-model="query.status">
              <el-radio :label="null">全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
              <el-radio label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 频道 -->
          <el-form-item label="频道" prop="channel">
            <el-select v-model="query.channel" placeholder="请选择频道">
              <el-option
                v-for="(item, index) in channels"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 时间选择器 -->
          <el-form-item label="日期" required prop="date">
            <div class="block">
              <el-date-picker
                v-model="query.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="queryClick"
              :loading="queryLoading"
              >查询</el-button
            >
            <!-- 表单form组件自带resetFields方法，
            可以重置表单中属性为默认值，
            但需要给el-form-item绑定prop属性指定绑定属性名称 -->
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到{{ totalCount }}条结果</span>
      </div>
      <div class="text item">
        <!-- ---------------表格部分--------------------- -->
        <!-- 
        使用prop属性data给表格绑定数据数组，内部会自动帮我们遍历生成一行行表格
        我们需要做的就是讲table-column的prop属性与数据中的属性名称对应起来-->
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          v-loading="tableLoading"
        >
          <el-table-column label="封面" width="180">
            <!-- 自定义表格单元格样式 -->
            <!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据 -->
            <template slot-scope="scope">
              <img
                v-if="
                  scope.row.cover.images && scope.row.cover.images.length !== 0
                "
                :src="scope.row.cover.images && scope.row.cover.images[0]"
                alt=""
              />
              <img v-else src="./img/default.jpg" alt="" />
            </template>
          </el-table-column>
          <el-table-column label="标题" width="180">
            <template slot-scope="scope">
              <div class="title" :title="scope.row.title">
                {{ scope.row.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag
                size="small"
                plain
                :type="
                  articleStatus[scope.row.status] &&
                  articleStatus[scope.row.status].type
                "
              >
                {{
                  articleStatus[scope.row.status] &&
                  articleStatus[scope.row.status].text
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布时间"> </el-table-column>

          <el-table-column prop="operate" label="操作">
            <!-- 自定义表格中单元格 -->
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.$index, scope.row)"
              />
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleDelete(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          @current-change="pageChange"
          :page-size="pageSize"
          :disabled="tableLoading"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getArtData, getChannels, deleteArt } from "@/network/art_con.js";
import { dateFormat } from "@/utils/timeformat.js";
import JSONbig from 'json-bigint'

export default {
  name: "ArticleControl",
  created() {
    // 初始化页面时，默认请求第一页数据
    this.getTableData();
    // 请求频道列表数据
    this.loadChannels();
  },
  data() {
    return {
      // 查询表单数据
      query: {
        status: null,
        channel: null,
        date: null,
      },
      // 表格数据
      tableData: [
        {
          cover: "封面",
          title: "标题",
          status: "状态",
          pubdate: "发布时间",
        },
      ],
      // 文章状态，不同索引值分别对应不同的状态
      articleStatus: [
        { text: "草稿", type: "info" },
        { text: "待审核", type: "" },
        { text: "审核通过", type: "success" },
        { text: "审核失败", type: "warning" },
        { text: "已删除", type: "danger" },
      ],
      // 频道列表
      channels: [],
      // 请求数据页数
      page: 1,
      // 数据总条数
      totalCount: 0,
      // 每页请求的数据大小
      pageSize: 20,
      // 查询按钮是否处于加载状态
      queryLoading: false,
      // 表格是否处于加载状态
      tableLoading: true,
    };
  },
  methods: {
    // 提交查询表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 编辑文章
    handleEdit(index, row) {
      // 在文章发布页面进行文章的编辑，将文章id发送到文章编辑页面
      this.$router.push({
        name: 'art_pub',
        query: {
          art_id: row.id
        }
      })
    },

    // 删除文章
    handleDelete(index, row) {
      console.log(JSONbig.stringify(row.id))

      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async function () {
          try {
            const msg = await deleteArt(JSONbig.stringify(row.id));
            console.log(row.id, msg);
            this.$message({
            type: "success",
            message: "删除成功!",
          });
          // 删除成功之后自动刷新当前页面数据
          this.getTableData()
          } catch (e) {
            if (e && e.response && e.response.status) {
              console.log(e.response.status)
              switch (e.response.status) {
                case 400:
                  this.$message({
                    type: "warning",
                    message: "指定文章有误！"
                  });break
                case 401:
                  this.$message({
                    type: "warning",
                    message: "用户验证失败！"
                  });break
                case 507:
                  this.$message({
                    type: "warning",
                    message: "服务器或数据库异常!"
                  });break
              }
            }
          }
        })
        .catch(() => {});
    },

    // 获取文章数据
    async getTableData() {
      console.log("当前请求页数", this.page);
      this.tableLoading = true;
      const { data } = await getArtData({
        status: this.query.status,
        channel_id: this.query.channel,
        begin_pubdate: dateFormat(this.query.date && this.query.date[0]),
        end_pubdate: dateFormat(this.query.date && this.query.date[1]),
        page: this.page,
        per_page: this.pageSize,
      });

      // 存储数据总条数
      this.totalCount = data.data.total_count;
      const getData = data.data.results;
      this.tableData = getData;
      this.queryLoading = false;
      this.tableLoading = false;
      console.log(getData);
    },

    // 获取频道数据
    async loadChannels() {
      const { data } = await getChannels();
      const getData = data.data;
      this.channels = getData.channels;
    },

    // 点击查询按钮
    queryClick() {
      this.queryLoading = true;
      this.getTableData();
    },

    // 页码发生改变
    pageChange(current_page) {
      this.page = current_page;
    },
  },

  watch: {
    // 当页面发生改变时，请求数据
    page() {
      this.getTableData();
    },
  },

};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.el-pagination {
  margin-top: 20px;
}

.query {
  margin-bottom: 30px;
}

.el-table__row img {
  width: 50px;
  height: 50px;
}

.el-table /deep/ .cell /deep/ .title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>