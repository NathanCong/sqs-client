<template>
  <div class="expression-list-preview">
    <!-- 表达式列表 -->
    <CommonTable
      :show-header="false"
      :columns="tableColumns"
      :data-source="tableDataSource"
      :pagination="{ pageNum: 1, pageSize: 20, total }"
    >
      <!-- 单元格 - 表头 -->
      <template #thead-cell="{ title }">
        <span class="thead-cell">{{ title }}</span>
      </template>
      <!-- 单元格 - 主体 -->
      <template #tbody-cell="{ column, text, record }">
        <span class="tbody-cell">
          <!-- 表达式类型 -->
          <template v-if="column.key === 'expressionType'">
            {{
              EXPRESSION_TYPE_OPTIONS.find(
                (i: any) => String(i.value) === String(record.expressionType)
              )?.label
            }}
          </template>
          <!-- 操作 -->
          <template v-else-if="column.key === 'actions'">
            <span class="actions-wrapper">
              <a-button type="link" @click="onEdit(record)">编辑</a-button>
              <a-button type="link" @click="onDelete(record.expressionId)"
                >删除</a-button
              >
              <a-button type="link" @click="onViewResult(record)"
                >查看结果</a-button
              >
              <a-button type="link" @click="() => {}">重新执行</a-button>
            </span>
          </template>
          <!-- 其他 -->
          <template v-else>{{ text || '——' }}</template>
        </span>
      </template>
    </CommonTable>
    <!-- 表达式编辑 -->
    <ExpressionEdit @finish="getExpressionList" ref="expressionEditRef" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import CommonTable from '@/components/CommonTable.vue'
import { EXPRESSION_TYPE_OPTIONS } from '@/consts'
import ExpressionEdit from './ExpressionEdit.vue'
import { useSearchStore } from '@/store/search'
import { useUserStore } from '@/store/user'
import { useToolStore } from '@/store/tool'

// 定义属性
const props = defineProps<{ data: any }>()

const tableColumns = computed(() => props.data?.columns)

const tableDataSource = computed(() => props.data?.dataSource)

const total = computed(() => props.data?.total || 0)

const expressionEditRef = ref<InstanceType<typeof ExpressionEdit>>()

const userStore = useUserStore()
const searchStore = useSearchStore()
const toolStore = useToolStore()

async function getExpressionList() {
  const { userEmail = '' } = (await userStore.getUserInfo()) || {}
  const dataSource = await searchStore.getExpressionList({ userEmail })
  const prev = toolStore.previewData
  toolStore.updatePreviewData({
    ...(typeof prev === 'object' && prev !== null ? prev : {}),
    dataSource,
    total: dataSource.length
  })
}

function onEdit(record: any) {
  expressionEditRef.value?.open(record)
}

async function onDelete(expressionId: number) {
  try {
    await searchStore.deleteExpression({ expressionId })
    getExpressionList()
  } catch (error) {
    console.warn(error)
  }
}

function onViewResult(record: any) {
  const { expressionType, resultData } = record
  // 检索式
  if (String(expressionType) === '1') {
    try {
      toolStore.openPreviewPanel('patentList', JSON.parse(resultData))
    } catch (error) {
      console.warn(error)
    }
    return
  }
  // 分析式
  if (String(expressionType) === '2') {
    return
  }
}

onMounted(() => {
  getExpressionList()
})
</script>

<style lang="less" scoped>
.expression-list-preview {
  position: absolute;
  top: 16px;
  right: 16px;
  bottom: 16px;
  left: 16px;

  .thead-cell,
  .tbody-cell {
    display: flex;
    align-items: center;
    justify-content: center;

    .actions-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
