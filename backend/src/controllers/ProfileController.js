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
var fs = require('fs')
var path = require('path')
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
  // await TECH.destroy({where: {}, truncate: true})
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

async function addProject (req, res) {
  console.log('addproj', req.body, req.files)
  var profile = await PROFILE.findById(1)
  PROJECT.create({
    title: req.body.title,
    _link: req.body._link,
    tag: req.body.tag,
    release_date: req.body.releaseDate
  }).then(async (project) => {
    JSON.parse(req.body.descriptions).forEach(description => {
      DESCRIPTION.create({
        description: description
      }).then(async (desc) => {
        await project.addDescription(desc.id)
      }).catch(err => {
        res.send({err: err})
      })
    })

    req.files.forEach(file => {
      IMAGEPATH.create({
        imagePath: file.originalname
      }).then(async (path) => {
        await project.addImagePath(path.id)
      }).catch(err => {
        res.send({err: err})
      })
    })

    await profile.addProject(project.id)
    res.send({id: project.id})
  }).catch(err => {
    res.send({err: err})
  })
  // await req.files.forEach(file => {
  //   var name = IMAGEPATH.create({
  //     imagePath: file.originalname
  //   })
  //
  //   project.addImagePath(name.id)
  // })
}

async function getProjects (req, res) {
  console.log('getting projects...')
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
    res.send({
      projects: projects
    })
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

module.exports = {
  getProfile: getProfile,
  setProfile: setProfile,
  addProject: addProject,
  getProjects: getProjects,
  getProject: getProject,
  loadImage: loadImage
}
