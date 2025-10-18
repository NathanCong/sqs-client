import { defineStore } from 'pinia'

export const useToolStore = defineStore('tool', {
  state: () => ({
    activePanel: ''
  }),
  getters: {
    tddFormPanelVisible: (state) => state.activePanel === 'tddForm',
    patentFormPanelVisible: (state) => state.activePanel === 'patentForm',
    previewPanelVisible: (state) => state.activePanel === 'preview'
  },
  actions: {
    openTDDFormPanel() {
      this.activePanel = 'tddForm'
    },
    openPatentFormPanel() {
      this.activePanel = 'patentForm'
    },
    openPreviewPanel() {
      this.activePanel = 'preview'
    },
    closeAllPanels() {
      this.activePanel = ''
    }
  }
})
