const PROFILE = require('../models').Profile
const SKILL = require('../models').Skill
const SOCIAL = require('../models').Social
const TITLE = require('../models').Title
const TECH = require('../models').Tech
const ABOUT = require('../models').About
const PROGRAM = require('../models').Program
const PROJECT = require('../models').Project
const IMAGEPATH = require('../models').ImagePath
const DESCRIPTION = require('../models').Description
const PROJECTTECHS = require('../models').ProjectTechs
var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var forEachAsync = require('forEachAsync').forEachAsync
// const {sequelize} = require('../models')

async function getProfile (req, res) {
  try {
    const _profile = await PROFILE.findById(1)

    var profile = {}
    profile['titles'] = await _profile.getTitles()
    profile['skills'] = await _profile.getSkills()
    profile['socials'] = await _profile.getSocials()
    profile['techs'] = await _profile.getTeches()
    profile['abouts'] = await _profile.getAbouts()
    profile['programs'] = await _profile.getPrograms()
    profile['descriptions'] = []
    profile['imagePaths'] = []

    var dump = [] // temp veriable for projects

    _profile.getProjects().then(projects => {
      Promise.all(projects.map(project => {
        return new Promise((resolve, reject) => {
          PROJECT.findById(project.id).then(_project => {
            _project.getDescriptions().then(descriptions => {
              profile.descriptions.push(descriptions)

              _project.getImagePaths().then(imagePaths => {
                profile.imagePaths.push(imagePaths)
                dump.push(project)
                return resolve(true)
              })
            })
          })
        })
      })).then(() => {
        profile['projects'] = dump
        res.send({
          profile: {..._profile.toJSON(), ...profile}
        })
      })
    })
  } catch (err) {
    console.log(err)
    res.status(404).send('Not found!')
  }
}

async function setProfile (req, res) {
  console.log(req.body.projects)
  try {
    var profile = await PROFILE.findById(1)
    if (!profile) {
      profile = await PROFILE.create(req.body.profile)
    }
    if (req.body.profile) await profile.update(req.body.profile)
    if (req.body.skills) await setSkills(req.body.skills, profile)
    if (req.body.socials) await setSocials(req.body.socials, profile)
    if (req.body.titles) await setTitles(req.body.titles, profile)
    if (req.body.programs) await setPrograms(req.body.programs, profile)
    if (req.body.techs) await setTechs(req.body.techs, profile)
    if (req.body.abouts) await setAbouts(req.body.abouts, profile)
    if (req.body.projects) await setProjects(req.body.projects, profile)

    res.send({
      msg: true
    })
  } catch (err) {
    res.status(404).send(err.toJSON())
  }
}

async function setSkills (skills, profile) {
  await SKILL.destroy({where: {}, truncate: true})
  await skills.forEach(async skill => {
    SKILL.findOrCreate({where: skill}).spread(async (_skill, meta) => {
      await profile.addSkill(_skill.id)
    })
  })
}

async function setTitles (titles, profile) {
  await TITLE.destroy({where: {}, truncate: true})
  await titles.forEach(async title => {
    TITLE.findOrCreate({where: title}).spread(async (_title, meta) => {
      await profile.addTitle(_title.id)
    })
  })
}

async function setPrograms (programs, profile) {
  await PROGRAM.destroy({where: {}, truncate: true})
  await programs.forEach(async program => {
    PROGRAM.findOrCreate({where: program}).spread(async (_program, meta) => {
      await profile.addProgram(_program.id)
    })
  })
}

async function setTechs (techs, profile) {
  await TECH.destroy({where: {}, truncate: true})
  await techs.forEach(async tech => {
    TECH.findOrCreate({where: tech}).spread(async (_tech, meta) => {
      await profile.addTech(_tech.id)
    })
  })
}

async function setAbouts (abouts, profile) {
  await ABOUT.destroy({where: {}, truncate: true})
  await abouts.forEach(async about => {
    ABOUT.findOrCreate({where: about}).spread(async (_about, meta) => {
      await profile.addAbout(_about.id)
    })
  })
}

async function setSocials (socials, profile) {
  await SOCIAL.destroy({where: {}, truncate: true})
  await socials.forEach(async social => {
    SOCIAL.findOrCreate({where: social}).spread(async (_social, meta) => {
      await profile.addSocial(_social.id)
    })
  })
}

async function setProjects (projects, profile) {
  console.log('setprojects', projects)
  // await IMAGEPATH.destroy({where: {}, truncate: true})
  // await DESCRIPTION.destroy({where: {}, truncate: true})
  // await PROJECT.destroy({where: {}, truncate: true})

  // create project
  await projects.forEach(async project => {
    PROJECT.findOrCreate({
      where: {
        title: project.title,
        _link: project._link,
        tag: project.tag,
        release_date: project.release_date
      }
    }).spread(async (_project, meta) => {
      // create descriptions
      await project.descriptions.forEach(description => {
        DESCRIPTION.findOrCreate({where: description}).spread(async (_description) => {
          _project.addDescription(_description.id)
        })
      })
      // await project.imagePaths.forEach(path => {
      //   // create imagePaths
      //   IMAGEPATH.create(path).then(async (_imagePath) => {
      //     _project.addImagePath(_imagePath.id)
      //   })
      // })
      if (project.photos) {
        // await project.photos.forEach(photo => {
        //   console.log('photo => ', photo)
        //   upload.single('test')(null, null, function (err) {
        //     if (err) {
        //       console.log(err)
        //     }
        //   })
        // })
        console.log('photos => ', project.photos.name)
      } else console.log('phot0s => null')
      console.log('ghghp => ', profile)
      await profile.addProject(_project.id)
    })
  })
}

// this method processes the techss
function processTechs (newTechs, callback, project, profile, oldTechs) {
  PROJECTTECHS.destroy({
    where: {
      ProjectId: (project) ? project.id : null
    }
  }).then(() => {
    newTechs = newTechs.trim()
    if (newTechs.length > 0) {
      var techs = newTechs.split(',')
      var processed = []

      console.log('starting...')

      techs.forEach(tech => {
        tech = tech.trim() // remove extra spaces

        if (tech.length > 0) { // if not blank
          // create tech if it doesn't exist
          TECH.findOrCreate({
            where: {
              tech: tech
            }
          }).spread(async (t, created) => {
            await profile.addTech(t.id)
            processed.push(t)

            if (processed.length === techs.length) {
              let array = [...oldTechs, ...processed] // merge oldTechs and newTechs
              console.log('done')
              callback(array) // call back
            }
          })
        }
      })
    } else {
      console.log('done')
      callback(oldTechs)
    }
  }).catch(err => {
    console.log(err)
  })
}

async function addProject (req, res) {
  console.log('addproj', req.body, req.files)
  var profile = await PROFILE.findById(1)

  // call back function
  var callback = (techs) => {
    // create project
    PROJECT.create({
      title: req.body.title,
      _link: req.body._link,
      repo: req.body.repo,
      tag: req.body.tag,
      release_date: req.body.releaseDate
    }).then(async (project) => {
      // add descriptions
      JSON.parse(req.body.descriptions).forEach(description => {
        DESCRIPTION.create({
          description: description
        }).then(async (desc) => {
          await project.addDescription(desc.id)
        }).catch(err => {
          res.send({err: err})
        })
      })
      // add pictures
      req.files.forEach(file => {
        IMAGEPATH.create({
          imagePath: file.originalname
        }).then(async (path) => {
          await project.addImagePath(path.id)
        }).catch(err => {
          res.send({err: err})
        })
      })
      // add technologies
      techs.forEach(tech => {
        PROJECTTECHS.findOrCreate({
          where: {
            ProjectId: project.id,
            TechId: tech.id
          }
        }).spread((ptech, created) => {
          console.log('ptech', ptech)
        })
      })

      await profile.addProject(project.id) // add project to profile

      res.send({id: project.id})
    }).catch(err => {
      res.send({err: err})
    })
  }

  processTechs(req.body.newTechs, callback, null, profile, JSON.parse(req.body.techs))
  // await req.files.forEach(file => {
  //   var name = IMAGEPATH.create({
  //     imagePath: file.originalname
  //   })
  //
  //   project.addImagePath(name.id)
  // })
}

async function getProjects (req, res) {
  console.log('getting projects...', req.query.recents)
  // var profile = await PROFILE.findById(1)

  // profile.getProjects().then(projects => {
  //   console.log('getting =>')
  //
  //   res.send({
  //     projects: projects
  //   })
  // })

  PROJECT.findAll({
    where: {
      ProfileId: 1
    },
    include: [DESCRIPTION, IMAGEPATH]
  }).then(projects => {
    if (req.query.toGet === 'recents') {
      var ordered = _.orderBy(projects, ['release_date', 'title'], ['desc', 'asc'])
      var recents = _.chunk(ordered, 6)[0]

      res.send({
        projects: recents
      })
    } else {
      res.send({
        projects: projects
      })
    }
  })
}

// get project with given id
async function getProject (req, res) {
  console.log(`getting project ${req.params.id}...`)

  PROJECT.findAll({
    where: {
      ProfileId: 1,
      id: req.params.id
    },
    include: [DESCRIPTION, IMAGEPATH, TECH]
  }).then(projects => {
    res.send({
      project: projects[0]
    })
  })
}

function loadImage (req, res) {
  res.setHeader('content-type', 'image/jpeg')
  let id = parseInt(req.query.id)

  getImage(id, function (img) {
    console.log('sending res...')
    // res.send({
    //   id: id,
    //   image: img
    // })

    res.json(img)
    res.end()
  })
}

function getImage (id, cb) {
  var image = []

  console.log('loading image...', id)
  IMAGEPATH.findAll({
    where: {
      id: id
    }
  }).then(paths => {
    let name = paths[0].imagePath

    var imagePath = path.join(__dirname, '../../pictures')
    // var image = ''
    fs.readdir(imagePath, function (err, data) {
      if (err) {
        console.log('image loading error!', err)
      }

      forEachAsync(data, function (next, file) {
        let filename = file.split('##')[1]
        imagePath = path.join(__dirname, '../../pictures', file)
        console.log('imagePath', imagePath)
        fs.readFile(imagePath, async function (err2, data2) {
          if (err2) {
            console.log('image loading error!', err2)
          }

          // data2 = Buffer.from(data2).toString('base64')

          if (filename === name) {
            image = data2
          }
          next()
        })
      }).then(function () {
        cb(image)
      })
    })
  }).catch(err => {
    console.log('ERR', err)
  })
}

// this function deletes given project
function deleteProject (req, res) {
  console.log('params.id', req.params.id)
  DESCRIPTION.destroy({
    where: {
      ProjectId: req.params.id
    }
  }).then(() => {
    IMAGEPATH.destroy({
      where: {
        ProjectId: req.params.id
      }
    }).then(() => {
      PROJECT.destroy({
        where: {
          id: req.params.id
        }
      }).then(() => {
        res.send(true)
      }).catch(err => {
        console.log(err)
        res.send(false)
      })
    }).catch(err => {
      console.log(err)
      res.send(false)
    })
  }).catch(err => {
    console.log(err)
    res.send(false)
  })
}

// this function returns all techs
function getAllTechs (req, res) {
  TECH.findAll({
    where: {
      ProfileId: 1
    }
  }).then(techs => {
    res.send({
      techs: techs
    })
  }).catch(err => {
    console.log(err)
    res.send(false)
  })
}

// this function gets the technologies referenced by TechId in techs
function resolveTechs (techs, res) {
  var technologies = []

  // callback function
  var callback = (t) => {
    console.log('CALLBACK', t)
    technologies.push(t)

    if (technologies.length === techs.length) {
      res.send({
        techs: technologies
      })
    }
  }

  // find techs
  var call = (callback) => {
    techs.forEach(projTech => {
      console.log('PROJTECH', projTech.TechId)
      TECH.find({
        where: {
          id: projTech.TechId
        }
      }).then(tech => {
        callback(tech) // call back
      })
    })
  }

  call(callback)
}

// this function returns all techs used in a project
function getProjectTechs (req, res) {
  // var techss = []
  PROJECTTECHS.findAll({
    where: {
      ProjectId: req.params.id
    }
  }).then(techs => {
    resolveTechs(techs, res)
    // res.send(techs)
  }).catch(err => {
    console.log(err)
    res.send(false)
  })
}

// this function handles image edits for a specified project
function handleImageEdit (imagesToDelete, newImages, project, callback) {
  console.log('handling image edit')
  var addNewImages = () => {
    if (newImages.length > 0) {
      console.log('adding new images')
      // add new images
      let count = 0
      newImages.forEach(file => {
        console.log(file)
        IMAGEPATH.create({
          imagePath: file.originalname
        }).then(async (path) => {
          await project.addImagePath(path.id)
          count++
          console.log(count)
          // call back if last image
          if (count === newImages.length) {
            callback()
          }
        }).catch(err => {
          console.log(err)
        })
      })
    } else {
      callback()
    }
  }

  if (imagesToDelete.length > 0) {
    // delete imagesToDelete
    imagesToDelete.forEach(id => {
      IMAGEPATH.destroy({
        where: {
          id: id
        }
      }).then(() => {
        addNewImages()
      }).catch(err => {
        console.log(err)
      })
    })
  } else {
    addNewImages()
  }
}

// this function handles description edits for a specified project
function handleDescriptionEdit (description, project, callback) {
  // remove old descriptions
  DESCRIPTION.destroy({
    where: {
      ProjectId: project.id
    }
  }).then(() => {
    // add new descriptions
    let count = 0
    let newDescriptions = JSON.parse(description)

    newDescriptions.forEach(desc => {
      DESCRIPTION.create({
        description: desc
      }).then(async (desc) => {
        await project.addDescription(desc.id)
        count++
        if (count === newDescriptions.length) {
          callback()
        }
      }).catch(err => {
        console.log(err)
      })
    })
  })
}

// this function edits a project
async function editProject (req, res) {
  console.log('editProject', req.params.id, req.body, req.files)
  var profile = await PROFILE.findById(1)

  PROJECT.find({
    where: {
      id: req.params.id
    }
  }).then(project => {
    // call back for processTechs
    var processTechsCallback = (techs) => {
      // add technologies
      let count = 0
      techs.forEach(tech => {
        PROJECTTECHS.findOrCreate({
          where: {
            ProjectId: project.id,
            TechId: tech.id
          }
        }).spread((ptech, created) => {
          count++

          if (count === techs.length) {
            // call back for handleImageEdit
            var handleDescriptionEditCallback = () => {
              console.log('call back from handleDescriptionEdit')
              // call back for handleDescriptionEdit
              var handleImageEditCallback = () => {
                console.log('call back from handleImageEdit')
                project.update({
                  title: req.body.title,
                  _link: req.body._link,
                  repo: req.body.repo,
                  tag: req.body.tag,
                  release_date: req.body.release_date
                }).then(() => {
                  res.send(true)
                }).catch(err => {
                  console.log(err)
                  res.send(false)
                })
              }

              handleImageEdit(JSON.parse(req.body.imagesToDelete), req.files, project, handleImageEditCallback) // handle images
            }

            handleDescriptionEdit(req.body.descriptions, project, handleDescriptionEditCallback) // handle descriptions
          }
        })
      })
    }

    processTechs(req.body.newTechs, processTechsCallback, project, profile, JSON.parse(req.body.techs)) // process techs
  })
}

module.exports = {
  getProfile: getProfile,
  setProfile: setProfile,
  addProject: addProject,
  getProjects: getProjects,
  getProject: getProject,
  loadImage: loadImage,
  deleteProject: deleteProject,
  getAllTechs: getAllTechs,
  getProjectTechs: getProjectTechs,
  editProject: editProject
}
