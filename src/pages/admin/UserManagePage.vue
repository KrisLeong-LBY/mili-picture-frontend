<template>
  <div id="userManagePage">
    <div class="searchBar">
      <a-form layout="inline" :model="queryParams" @finish="onSearch">
        <a-form-item label="账号">
          <a-input v-model:value="queryParams.userAccount" placeholder="输入账号">

          </a-input>
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="queryParams.userName" placeholder="输入用户名">

          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            搜索
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table :columns="columns" :data-source="userList" :pagination="pagination" @change="onTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="120" />
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <span>
            <a-tag color="green" v-if="record.userRole === 'admin'">
              管理员
            </a-tag>
            <a-tag color="blue" v-else>
              普通用户
            </a-tag>
          </span>
        </template>
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dateFormat(record.createTime) }}
        </template>
        <template v-else-if="column.dataIndex === 'updateTime'">
          {{ dateFormat(record.updateTime) }}
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a-button type="primary" size="small" ghost style="margin-right: 8px;">编辑</a-button>
            <a-button danger size="small" @click="onDelete(record.id)">删除</a-button>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import httpRequest from '@/service';
import { computed, onMounted, reactive, ref } from 'vue';
import dateFormat from '@/utils/dateFormat'
import { message } from 'ant-design-vue';

const columns = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },

  {
    title: '操作',
    key: 'action',
  },
];

const userList = ref([]);
const total = ref(0)

const queryParams = reactive({
  current: 1,  //当前页码
  pageSize: 10,
  userAccount: '',
  userName: ''
})

const pagination = computed(() => {
  return {
    current: queryParams.current ?? 1,
    pageSize: queryParams.pageSize ?? 10,
    total: total.value, //指定这个属性 页数才会根据指定的total总数显示
    showSizeChanger: true,
    showTotal: () => `共 ${total.value} 条`

  }
})



const onSearch = () => {
  queryParams.current = 1
  getUserList()
}

const onDelete = async (id: string) => {
  if (!id) return
  try {
    const res = await httpRequest.post('/user/delete', { id })
    if (res) {
      message.success('删除成功')
      getUserList()
    }

  } catch (error) {
    message.error('删除失败')
  }
}

const getUserList = async () => {
  try {
    const res: any = await httpRequest.post('/user/list/page/vo', {
      ...queryParams
    })

    userList.value = res.records
    total.value = Number(res.total)
  } catch (error) {
    console.log(error);

  }

}

const onTableChange = (page: any) => {
  queryParams.current = page.current
  queryParams.pageSize = page.pageSize
  getUserList()
}

onMounted(() => {
  getUserList()
})
</script>
<style scoped>
.searchBar {
  margin-bottom: 20px;
}
</style>
