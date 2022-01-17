

import service from "../utils/request"
import { sprintf } from "../utils/util"
// import { apiURL } from './index.js'


const api = {
  create: '/exam/create/%s',
  detail: '/exam/%s',
  update: '/exam/update_time/%d',
}

export const createExam = (id, params) => service({
  url: sprintf(api.create, id),
  method: 'post',
  data: {
    words: params
  }
})

export const getExamDetail = exam_id => service({
  url: sprintf(api.detail, exam_id),
  method: 'get',
})

export const updateExam = (exam_id, field) => service({
  url: sprintf(api.update, exam_id),
  method: 'post',
  data: { field: field },
})

