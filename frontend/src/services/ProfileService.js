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
  }
}
