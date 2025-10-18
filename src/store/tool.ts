import { defineStore } from 'pinia'

export const useToolStore = defineStore('tool', {
  state: () => ({
    activePanel: ''
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
    openPreviewPanel() {
      this.activePanel = 'preview'
    },
    closeAllPanels() {
      this.activePanel = ''
    }
  }
})
