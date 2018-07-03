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
  await PROJECT.destroy({where: {}, truncate: true})
  await DESCRIPTION.destroy({where: {}, truncate: true})
  await IMAGEPATH.destroy({where: {}, truncate: true})

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
      await project.imagePaths.forEach(path => {
        // create imagePaths
        IMAGEPATH.create(path).then(async (_imagePath) => {
          _project.addImagePath(_imagePath.id)
        })
      })
      await profile.addProject(_project.id)
    })
  })
}

module.exports = {
  getProfile: getProfile,
  setProfile: setProfile
}
