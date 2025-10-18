import { defineStore } from 'pinia'

export const useToolStore = defineStore('tool', {
  state: () => ({
    activePanel: ''
  }),
  getters: {
    tddFormPanelVisible: (state) => state.activePanel === 'tddForm',
    tpFormPanelVisible: (state) => state.activePanel === 'tpForm',
    previewPanelVisible: (state) => state.activePanel === 'preview'
  },
  actions: {
    openTDDFormPanel() {
      this.activePanel = 'tddForm'
    },
    openTPFormPanel() {
      this.activePanel = 'tpForm'
    },
    openPreviewPanel() {
      this.activePanel = 'preview'
    },
    closeAllPanels() {
      this.activePanel = ''
    }
  }
})
