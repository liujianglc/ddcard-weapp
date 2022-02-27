import Taro from "@tarojs/taro"
import { getLessonList, getCourseList,changeGrade } from "../../api/lesson"

// state
export const state = {
  grades: ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"],
  courseId: Taro.getStorageSync('courseId') || '1',
  gradeId: Taro.getStorageSync('gradeId') || '5',
  sectionId: Taro.getStorageSync('sectionId') || '1',
  courseType: Taro.getStorageSync('courseType') || '1',
  lessons: []
}

// getters
export const getters = {
  courseName: state => state.courseId == 1 ? '语文' : '英语',
  gradeName: state => state.grades[state.gradeId - 1] || '',
  sectionName: state => state.sectionId == 1 ? '上册' : '下册',
  courseTypeName: state => state.courseType == 1 ? '人教版' : '冀教版'
}

// mutations
export const mutations = {
  'SET_LESSONS': (state, data) => {
    state.lessons = data
  },
  'SET_GRADE_ID': (state, data) => {
    if (data) {
      state.gradeId = data;
      Taro.setStorageSync('gradeId', state.gradeId)
    }
  },
  'SET_COURSE_ID': (state, data) => {
    if (data) {
      state.courseId = data;
      Taro.setStorageSync('courseId', state.courseId)
    }
  },
  'SET_COURSE_TYPE': (state, data) => {
    if (data) {
      state.courseType = data;
      Taro.setStorageSync('courseType', state.courseType)
    }
  },
  'SET_SECTION_ID': (state, data) => {
    if (data) {
      state.sectionId = data;
      Taro.setStorageSync('sectionId', state.sectionId)
    }
  },
  'RESET_LESSSONS': (state) => {
    state.lessons = state.lessons.map(it => {
      it.display=false
      return it
    })
  }
}

// actions
export const actions = {
  // 登录
  getLessonList({ commit }, data) {
    return new Promise((resolve, reject) => {
      getLessonList(state.gradeId, state.courseId, state.sectionId)
        .then(res => {
          commit("SET_LESSONS", res.data.map(it => {
            it.display = false
            return it
          }))
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
