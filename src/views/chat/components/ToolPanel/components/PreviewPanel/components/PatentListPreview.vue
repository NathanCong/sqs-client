<template>
  <div class="patent-list-preview">
    <!-- 列选择器 -->
    <section class="columns-selector">
      <a-checkbox-group
        v-model:value="selectedColumns"
        :options="checkboxOptions"
      />
    </section>
    <!-- 专利列表 -->
    <section class="patent-list">
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
            <!-- 操作 -->
            <template v-if="column.key === 'actions'">
              <a-button type="link" @click="onDetail(record)">
                查看详情
              </a-button>
            </template>
            <!-- 其他 -->
            <template v-else>{{ text || '——' }}</template>
          </span>
        </template>
      </CommonTable>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import CommonTable from '@/components/CommonTable.vue'

// 定义属性
const props = defineProps<{ data: any }>()

// 定义数据
const selectedColumns = ref<string[]>(
  props.data?.columns.map((i: any) => i.key)
)

// 定义计算属性
const checkboxOptions = computed(() => {
  if (typeof props.data === 'object') {
    return props.data?.columns.map((i: any) => ({
      label: i.title,
      value: i.key
    }))
  }
  return []
})

const tableColumns = computed(() =>
  props.data?.columns.filter((i: any) => selectedColumns.value.includes(i.key))
)

const tableDataSource = computed(() => props.data?.dataSource)

const total = computed(() => props.data?.total || 0)

const emit = defineEmits(['detail'])

function onDetail(record: any) {
  emit('detail', record)
}
</script>

<style lang="less" scoped>
.patent-list-preview {
  position: absolute;
  top: 16px;
  right: 16px;
  bottom: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;

  .columns-selector {
    margin-bottom: 16px;
  }

  .patent-list {
    flex: 1;
  }

  .thead-cell,
  .tbody-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
