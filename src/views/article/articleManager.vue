<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import channelSelect from './components/channelSelect.vue'
import { artGetListService, artDeleteService } from '@/api/articleManager.js'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/articleEdit.vue'
import { ElMessageBox } from 'element-plus'
const loading = ref(false)
//获取数据
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
const total = ref()
const articleList = ref([])

const getArticleListFn = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleListFn()

const handleSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleListFn()
}
const handleCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleListFn()
}
const background = ref(false)
const onSerach = () => {
  getArticleListFn()
}
const onReset = () => {
  params.value = {
    pagenum: 1,
    pagesize: 5,
    cate_id: '',
    state: ''
  }
  getArticleListFn()
}

// 抽屉里面的form表单
const drawer = ref(true)
const onAddArticle = () => {
  drawer.value.open({})
}
const onEditArticle = (row) => {
  drawer.value.open(row)
}
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDeleteService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleListFn()
}
const onsuccess = (type) => {
  if (type === 'add') {
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleListFn()
}
</script>

<template>
  <containerFn title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：" style="width: 30%">
        <!-- v-model :modelValue 和 update:modelValue 的简写 -->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：" style="width: 30%">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSerach">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 内容展示 -->
    <el-table :data="articleList" style="width: 100%" v-loading="loading">
      <el-table-column label="文章标题">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"> </el-table-column>
      <el-table-column label="发表时间">
        <template #default="{ row }"> {{ formatTime(row.pub_date) }} </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"> </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 从右向左展开的抽屉 -->
    <ArticleEdit ref="drawer" @success="onsuccess"></ArticleEdit>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </containerFn>
</template>

<style scoped></style>
