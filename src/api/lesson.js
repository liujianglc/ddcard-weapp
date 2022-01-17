



import service from "../utils/request"
import { sprintf } from "../utils/util"
// import { apiURL } from './index.js'


const api = {
  list: '/lesson/list/%s/%s/%s',
  courseList: '/course/list',
  changeGrade: '/user/change_user_grade'
}

export const getLessonList = (gradeId, courseId, sectionId) => service({
  url: sprintf(api.list, gradeId, courseId, sectionId),
  method: 'get',
})

export const getCourseList = () => service({
  url: api.courseList,
  method: 'get',
})


export const changeGrade = (userId, gradeId) => service({
  url: api.changeGrade,
  method: 'post',
  data:  { userId: userId, gradeId }
})
