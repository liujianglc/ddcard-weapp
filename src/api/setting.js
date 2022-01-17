import service from "../utils/request"

const api = {
  general: '/settings',
}

export const getGeneralSettings = () => service({
  url: api.general,
  method: 'get'
})
