import Api from '@/services/Api'
import axios from 'axios'

export default {
  getProfile () {
    return Api().get('about')
  },
  setProfile (profile) {
    return Api().post('about', profile)
  },
  setProfilePic (base64) {
    return Api().post('about/pic', {base64})
  },
  getProfilePic () {
    return Api().get('about/pic')
  },
  addProject (formdata) {
    return Api().post('portfolio', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getProjects (toGet) {
    return Api().get(`portfolio?toGet=${toGet}`)
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
    return Api().post(`portfolio/edit/${id}`, data)
  },
  getSignedRequest (fileName, fileType) {
    return Api().get(`sign-s3?fileName=${fileName}&fileType=${fileType}`)
  },
  uploadFileToBucket (file, signedRequest, url) {
    return new Promise((resolve, reject) => {
      axios.put(signedRequest, file).then(res => {
        console.log(res)
        resolve(url)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }
}
