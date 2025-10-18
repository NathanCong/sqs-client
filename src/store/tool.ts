import { defineStore } from 'pinia'

type ActivePanel = 'tddForm' | 'preview' | null

export const useToolStore = defineStore('tool', {
  state: () => ({
    activePanel: null as ActivePanel
  }),
  getters: {
    tddFormPanelVisible: (state) => state.activePanel === 'tddForm',
    previewPanelVisible: (state) => state.activePanel === 'preview'
  },
  actions: {
    openTddFormPanel() {
      this.activePanel = 'tddForm'
    },
    openPreviewPanel() {
      this.activePanel = 'preview'
    },
    closeAllPanels() {
      this.activePanel = null
    }
  }
})
