import Api from '@/services/Api'

export default {
  getProfile () {
    return Api().get('about')
  },
  setProfile (profile) {
    return Api().post('about', profile)
  },
  addProject (formdata) {
    return Api().post('portfolio', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    // return Api().post('portfolio', formdata)
  },
  getProjects () {
    return Api().get('portfolio')
  },
  getProject (id) {
    return Api().get(`portfolio/${id}`)
  },
  loadImage (id) {
    return Api().get(`image?id=${id}`)
  },
  deleteProject (id) {
    return Api().post(`portfolio/${id}`)
  },
  getAllTechs () {
    return Api().get('techs')
  },
  editProject (id, data) {
    return Api().post(`portfolio/edit/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
