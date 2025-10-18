import { defineStore } from 'pinia'

export const useToolStore = defineStore('tool', {
  state: () => ({
    activePanel: ''
  }),
  getters: {
    disclosureFormPanelVisible: (state) =>
      state.activePanel === 'disclosureForm',
    patentFormPanelVisible: (state) => state.activePanel === 'patentForm',
    previewPanelVisible: (state) => state.activePanel === 'preview'
  },
  actions: {
    openDisclosureFormPanel() {
      this.activePanel = 'disclosureForm'
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
