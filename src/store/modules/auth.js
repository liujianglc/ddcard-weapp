import Taro from "@tarojs/taro"
import * as types from "../mutation-types"
import { login, logout, me } from "../../api/auth"
import { wxuuid } from "../../utils/util";

console.log(wxuuid())
// state
export const state = {
  token: Taro.getStorageSync('token') || "",
  userInfo: Taro.getStorageSync('userInfo') || {},
  userId: Taro.getStorageSync('userId') || wxuuid()
}

// getters
export const getters = {
  token: state => state.token,
  userInfo: state => state.userInfo,
}

// mutations
export const mutations = {
  [types.SET_TOKEN]: (state, token) => {
    Taro.setStorageSync('token', token)
    state.token = token
  },
  [types.SET_USERINFO]: (state, info) => {
    Taro.setStorageSync('userInfo', info)
    state.userInfo = info
  },
  [types.SET_USERID]: (state, id) => {
    Taro.setStorageSync('userId', id)
    state.userId = id;
  }
}

// actions
export const actions = {
  // 登录
  login({ commit }, params) {
    return new Promise((resolve, reject) => {
      login(params)
        .then(res => {
          commit("SET_TOKEN", res.data.openId)
          commit('SET_USERINFO', params.userInfo)
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      me()
        .then(res => {
          commit("SET_USERINFO", res.data)
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  refreshToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },

  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(res => {
          commit("SET_TOKEN", "")
          commit("SET_USERINFO", {})
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  clear({ commit }) {
    commit("SET_TOKEN", "")
    commit("SET_USERINFO", {})
  }
}
