import { defineStore } from 'pinia'

export const useToolStore = defineStore('tool', {
  state: () => ({
    activePanel: '',
    previewType: 'text',
    previewData: '' as any
  }),
  getters: {
    batchFormPanelVisible: (state) => state.activePanel === 'batchForm',
    noveltyFormPanelVisible: (state) => state.activePanel === 'noveltyForm',
    disclosureFormPanelVisible: (state) =>
      state.activePanel === 'disclosureForm',
    patentFormPanelVisible: (state) => state.activePanel === 'patentForm',
    previewPanelVisible: (state) => state.activePanel === 'preview'
  },
  actions: {
    // 打开批量检索 - 表单
    openBatchFormPanel() {
      this.activePanel = 'batchForm'
    },
    // 打开查新检索 - 表单
    openNoveltyFormPanel() {
      this.activePanel = 'noveltyForm'
    },
    // 打开交底书撰写 - 表单
    openDisclosureFormPanel() {
      this.activePanel = 'disclosureForm'
    },
    // 打开专利撰写 - 表单
    openPatentFormPanel() {
      this.activePanel = 'patentForm'
    },
    // 打开结果预览
    openPreviewPanel(type: string, data: any) {
      this.activePanel = 'preview'
      this.previewType = type
      this.previewData = data
    },
    // 更新结果预览数据
    updatePreviewData(data: any) {
      this.previewData = data
    },
    // 关闭工具面板
    closeToolPanel() {
      this.activePanel = ''
      this.previewType = 'text'
      this.previewData = ''
    }
  }
})
