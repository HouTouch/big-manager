<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import channelSelect from './channelSelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  addArticleService,
  artGetDetailService,
  artEditService
} from '@/api/articleManager'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'
const visibleDrawer = ref(false)
const defaltModel = ref({
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: ''
})
const editorRef = ref()
const formalModel = ref({ ...defaltModel.value })
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    const res = await artGetDetailService(row.id)
    formalModel.value = res.data.data
    //图片单独处理
    imgUrl.value = baseURL + formalModel.value.cover_img
    //提交后台需要的是file对象格式
    //需要将网络图片地址=>转换成file对象，存储起来,便于提交
    formalModel.value.cover_img = await imageUrlToFile(
      imgUrl.value,
      formalModel.value.cover_img
    )
  } else {
    formalModel.value = { ...defaltModel.value }
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}

defineExpose({
  open
})

//图片上传
const imgUrl = ref('')
const onSelectFile = (uploadfile) => {
  imgUrl.value = URL.createObjectURL(uploadfile.raw)
  formalModel.value.cover_img = uploadfile.raw
}
//提交
const emit = defineEmits(['success'])
const onsubmit = async (state) => {
  //存储发布状态
  formalModel.value.state = state
  //因为当前接口时 formData 格式，所以需要转换
  //将普通对象 =>转换成=> formData对象
  const fd = new FormData()
  for (let key in formalModel.value) {
    fd.append(key, formalModel.value[key])
  }

  //发请求
  if (formalModel.value.id) {
    //编辑
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    //新增
    await addArticleService(fd)
    ElMessage.success('新增成功')
    visibleDrawer.value = false
    emit('success', 'add')
  }
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}
</script>

<template>
  <!-- 抽屉 -->
  <el-drawer
    v-model="visibleDrawer"
    :title="formalModel.id ? '编辑文章' : '新增文章'"
    direction="rtl"
    size="50%"
  >
    <el-form :model="formalModel">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formalModel.title"
          placeholder="请输入标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="文章类别" prop="content">
        <channel-select
          v-model="formalModel.cate_id"
          style="width: 100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            theme="snow"
            ref="editorRef"
            v-model:content="formalModel.content"
            contentType="html"
          >
          </quill-editor>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onsubmit('已发布')">发布</el-button>
        <el-button type="info" @click="onsubmit('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
