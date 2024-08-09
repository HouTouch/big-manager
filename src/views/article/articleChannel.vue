<script setup>
import { ref } from 'vue'
import { getArticleList, artDeleteChannelService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import channelEdit from './components/channelEdit.vue'
const channelList = ref([])
const loading = ref(false)
const dialogRef = ref()
const getChannelList = async () => {
  loading.value = true
  const res = await getArticleList()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

const onEditChannel = (row) => {
  dialogRef.value.open(row)
}
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDeleteChannelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getChannelList()
}
const onAddChannel = () => {
  dialogRef.value.open({})
}
const onsuccess = () => {
  getChannelList()
}
</script>

<template>
  <containerFn title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table style="width: 100%" :data="channelList" v-loading="loading">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <channelEdit ref="dialogRef" @onSuccess="onsuccess"></channelEdit>
  </containerFn>
</template>

<style lang="scss" scoped></style>
