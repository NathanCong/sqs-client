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
              <a-button type="link" @click="onDelete(record.expressionId)">
                删除
              </a-button>
              <a-button
                type="link"
                :disabled="
                  String(record.expressionType) !== EXPRESSION_TYPE_MAP.SEARCH
                "
                @click="onViewResult(record)"
              >
                查看结果
              </a-button>
              <a-button type="link" @click="onReexecute(record)">
                重新执行
              </a-button>
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
import {
  EXPRESSION_TYPE_MAP,
  EXPRESSION_TYPE_OPTIONS,
  PARENT_PREVIEW_TABLE_COLUMNS
} from '@/consts'
import ExpressionEdit from './ExpressionEdit.vue'
import { useSearchStore } from '@/store/search'
import { useUserStore } from '@/store/user'
import { useToolStore } from '@/store/tool'
import { useChatStore } from '@/store/chat'

// 定义属性
const props = defineProps<{ data: any }>()

const tableColumns = computed(() => props.data?.columns)

const tableDataSource = ref<any[]>([])

const total = computed(() => props.data?.total || 0)

const expressionEditRef = ref<InstanceType<typeof ExpressionEdit>>()

const userStore = useUserStore()
const searchStore = useSearchStore()

async function getExpressionList() {
  const { userEmail = '' } = (await userStore.getUserInfo()) || {}
  const dataSource = await searchStore.getExpressionList({ userEmail })
  tableDataSource.value = dataSource
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

const toolStore = useToolStore()

function onViewResult(record: any) {
  const { expressionType, resultData } = record
  // 检索式
  if (String(expressionType) === EXPRESSION_TYPE_MAP.SEARCH) {
    try {
      toolStore.openPreviewPanel('patentList', {
        columns: PARENT_PREVIEW_TABLE_COLUMNS as ColumnItem[],
        dataSource: JSON.parse(resultData),
        total: JSON.parse(resultData).length
      })
    } catch (error) {
      console.warn(error)
    }
    return
  }
}

const chatStore = useChatStore()

function onReexecute(record: any) {
  const { expressionType, expressionText } = record
  // 检索式
  if (String(expressionType) === EXPRESSION_TYPE_MAP.SEARCH) {
    chatStore.setPendingExecParams({
      userCommand: `使用这个检索式：${expressionText} 帮我重新检索一下`
    })
  }
  // 分析式
  if (String(expressionType) === EXPRESSION_TYPE_MAP.ANALYSIS) {
    chatStore.setPendingExecParams({
      userCommand: `使用这个分析式：${expressionText} 帮我重新分析一下`
    })
  }
  toolStore.closeToolPanel()
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
