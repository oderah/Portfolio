const PROFILE = require('../models').Profile
const SKILL = require('../models').Skill
const TITLE = require('../models').Title
const TECH = require('../models').Tech
const ABOUT = require('../models').About
const PROGRAM = require('../models').Program

async function getProfile (req, res) {
  try {
    const _profile = await PROFILE.findById(1)

    var profile = {}
    profile['titles'] = await _profile.getTitles()
    profile['skills'] = await _profile.getSkills()
    profile['techs'] = await _profile.getTeches()
    profile['abouts'] = await _profile.getAbouts()
    profile['programs'] = await _profile.getPrograms()

    res.send({
      profile: {..._profile.toJSON(), ...profile}
    })
  } catch (err) {
    res.status(404).send('Not found!')
  }
}
async function setProfile (req, res) {
  console.log(req.body)
  try {
    var profile = await PROFILE.findById(1)
    if (!profile) {
      profile = await PROFILE.create(req.body.profile)
    }
    if (req.body.profile) await profile.update(req.body.profile)
    if (req.body.skills) await setSkills(req.body.skills, profile)
    if (req.body.titles) await setTitles(req.body.titles, profile)
    if (req.body.programs) await setPrograms(req.body.programs, profile)
    if (req.body.techs) await setTechs(req.body.techs, profile)
    if (req.body.abouts) await setAbouts(req.body.abouts, profile)
    res.send({
      msg: true
    })
  } catch (err) {
    res.status(404).send(err.toJSON())
  }
}
async function setSkills (skills, profile) {
  await skills.forEach(async skill => {
    // var _skill = await SKILL.findOne({
    //   where: skill
    // })
    // if (!_skill) {
    //   _skill = await SKILL.create(skill)
    // }
    // await profile.addSkill(_skill.id)
    SKILL.findOrCreate({where: skill}).spread(async (_skill, meta) => {
      await profile.addSkill(_skill.id)
    })
  })
}

async function setTitles (titles, profile) {
  await titles.forEach(async title => {
    // var _title = await TITLE.findOne({
    //   where: title
    // })
    // if (!_title) {
    //   _title = await TITLE.create(title)
    // }
    // await profile.addTitle(_title.id)
    TITLE.findOrCreate({where: title}).spread(async (_title, meta) => {
      await profile.addTitle(_title.id)
    })
  })
}

async function setPrograms (programs, profile) {
  await programs.forEach(async program => {
    // var _program = await PROGRAM.findOne({
    //   where: program
    // })
    // if (!_program) {
    //   _program = await PROGRAM.create(program)
    // }
    // await profile.addProgram(_program.id)
    PROGRAM.findOrCreate({where: program}).spread(async (_program, meta) => {
      await profile.addProgram(_program.id)
    })
  })
}

async function setTechs (techs, profile) {
  await techs.forEach(async tech => {
    // var _tech = await TECH.findOne({
    //   where: tech
    // })
    // if (!_tech) {
    //   _tech = await TECH.create(tech)
    // }
    // await profile.addTech(_tech.id)
    TECH.findOrCreate({where: tech}).spread(async (_tech, meta) => {
      await profile.addTech(_tech.id)
    })
  })
}

async function setAbouts (abouts, profile) {
  await abouts.forEach(async about => {
    // var _about = await ABOUT.findOne({
    //   where: about
    // })
    // if (!_about) {
    //   _about = await ABOUT.create(about)
    // }
    // await profile.addAbout(_about.id)
    ABOUT.findOrCreate({where: about}).spread(async (_about, meta) => {
      await profile.addAbout(_about.id)
    })
  })
}

module.exports = {
  getProfile: getProfile,
  setProfile: setProfile
}
