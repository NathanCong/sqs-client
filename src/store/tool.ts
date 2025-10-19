import { defineStore } from 'pinia'

export const useToolStore = defineStore('tool', {
  state: () => ({
    activePanel: '',
    previewType: 'text',
    previewData: '' as PreviewData
  }),
  getters: {
    noveltyFormPanelVisible: (state) => state.activePanel === 'noveltyForm',
    disclosureFormPanelVisible: (state) =>
      state.activePanel === 'disclosureForm',
    patentFormPanelVisible: (state) => state.activePanel === 'patentForm',
    previewPanelVisible: (state) => state.activePanel === 'preview'
  },
  actions: {
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
