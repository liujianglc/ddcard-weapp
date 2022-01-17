import * as types from "../mutation-types"
import { getGeneralSettings } from "../../api/setting"

// state
export const state = {
  vipShow: true,
  tipNote: {},
  picker: [],
}

// getters
export const getters = {
  vipShow: state => state.vipShow,

}

// mutations
export const mutations = {
  [types.SET_VIPSHOWSTATUS]: (state, vipShow) => {
    state.vipShow = vipShow
  },
  'SET_TIP_NOTE': (state, tipNote) => {
    state.tipNote = tipNote
  },
  'SET_PICKER': (state, picker) => {
    state.picker = picker
  }
 }

// actions
export const actions = {
  getGeneralSettings({ commit }) {
    return new Promise((resolve, reject) => {
      getGeneralSettings()
        .then(res => {
          // commit("SET_VIPSHOWSTATUS", res.data.vip_show == 1)
          commit("SET_PICKER", res.data.picker)
          commit('SET_TIP_NOTE', res.data.note)

          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
