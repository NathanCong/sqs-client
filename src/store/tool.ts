import { defineStore } from 'pinia'

export const useToolStore = defineStore('tool', {
  state: () => ({
    activePanel: '',
    previewType: 'text',
    previewData: '' as PreviewData
  }),
  getters: {
    advancedFormPanelVisible: (state) => state.activePanel === 'advancedForm',
    batchFormPanelVisible: (state) => state.activePanel === 'batchForm',
    noveltyFormPanelVisible: (state) => state.activePanel === 'noveltyForm',
    disclosureFormPanelVisible: (state) =>
      state.activePanel === 'disclosureForm',
    patentFormPanelVisible: (state) => state.activePanel === 'patentForm',
    previewPanelVisible: (state) => state.activePanel === 'preview'
  },
  actions: {
    openAdvancedFormPanel() {
      this.activePanel = 'advancedForm'
    },
    openBatchFormPanel() {
      this.activePanel = 'batchForm'
    },
    openNoveltyFormPanel() {
      this.activePanel = 'noveltyForm'
    },
    openDisclosureFormPanel() {
      this.activePanel = 'disclosureForm'
    },
    openPatentFormPanel() {
      this.activePanel = 'patentForm'
    },
    openPreviewPanel(type: string, data: PreviewData) {
      this.activePanel = 'preview'
      this.previewType = type
      this.previewData = data
    },
    updatePreviewData(data: PreviewData) {
      this.previewData = data
    },
    closeAllPanels() {
      this.activePanel = ''
      this.previewType = 'text'
      this.previewData = ''
    }
  }
})
