import Phaser from 'phaser'
import { shuffle } from '../utils'
import * as myStates from './'

const MEDIA = ['jpg', 'jpeg', 'png', 'gif']

function checkMediaType (url) {
  if (typeof url !== 'string') {
    return false
  }

  let idx = url.lastIndexOf('.')

  if (idx < 0) {
    return false
  }

  let type = url.substring(idx + 1)

  if (MEDIA.indexOf(type) > -1) {
    return true
  }

  return false
}

export default class BOOT extends Phaser.State {
  constructor () {
    super()
    this.myModules = new Set()
  }

  init () {
    this.stage.backgroundColor = '#FFFFFF'
    this.text = this.add.text(this.world.centerX, this.world.centerY, 'Loading ...', { fill: '#3a3a08' })
    this.text.anchor.setTo(0.5, 0.5)
    this.text.font = 'Helvetica'
    this.text.fontSize = '12pt'
    this.text.fontWeight = 'normal'
    this.text.fill = '#5b4bca'
  }

  preload () {
    this.load.image('loaderBar', '/loader-bar.png')
    this.buildExperiment(this.game.experiment)
  }

  create () {
    this.state.start('PRELOAD')
  }

  buildTrial (trial) {
    for (let s in trial.setting) {
      if (typeof trial.setting[s] === 'string') {
        if (checkMediaType(trial.setting[s])) {
          this.game.assets.push(trial.setting[s])
        }
      } else if (Array.isArray(trial.setting[s])) {
        for (let i = 0; i < trial.setting[s].length; i++) {
          if (checkMediaType(trial.setting[s][i])) {
            this.game.assets.push(trial.setting[s])
          }
        }
      }
    }
    this.myModules.add(trial.type)
    return trial
  }

  buildBlock (blockStructure, experimentEntity) {
    let toProcess = [...blockStructure.children]

    let first, last
    if (experimentEntity[blockStructure.id].setting.lockFirst === true) {
      first = toProcess[0]
      toProcess = toProcess.slice(1)
    }
    if (experimentEntity[blockStructure.id].setting.lockLast === true) {
      last = toProcess[toProcess.length - 1]
      toProcess = toProcess.slice(0, toProcess.length - 1)
    }

    toProcess = this.concatArr(toProcess, parseInt(experimentEntity[blockStructure.id].setting.repeat) + 1)

    if (experimentEntity[blockStructure.id].setting.shuffle === true) {
      shuffle(toProcess)
    }

    let trials = []
    if (first) {
      trials.push(this.buildTrial(experimentEntity[first.id]))
    }
    for (let i = 0; i < toProcess.length; i++) {
      trials.push(this.buildTrial(experimentEntity[toProcess[i].id]))
    }
    if (last) {
      trials.push(this.buildTrial(experimentEntity[last.id]))
    }

    return trials
  }

  buildRun (runStructure, experimentEntity) {
    let toProcess = [...runStructure.children]

    if (experimentEntity[runStructure.id].setting.shuffle === true) {
      shuffle(toProcess)
    }

    if (experimentEntity[runStructure.id].setting.abtesting === true) {
      toProcess = [toProcess[Math.floor(Math.random() * toProcess.length)]]
    }

    let trials = []
    for (let i = 0; i < toProcess.length; i++) {
      trials.push(...this.buildBlock(toProcess[i], experimentEntity))
    }

    return trials
  }

  buildExperiment (experiment) {
    if (!experiment) {
      return
    } else {
      const trials = []

      for (let i = 0; i < experiment.structure.length; i++) {
        if (experiment.structure[i].level === 'trial') {
          trials.push(this.buildTrial(experiment.entity[experiment.structure[i].id]))
        } else if (experiment.structure[i].level === 'block') {
          trials.push(...this.buildBlock(experiment.structure[i], experiment.entity))
        } else if (experiment.structure[i].level === 'run') {
          trials.push(...this.buildRun(experiment.structure[i], experiment.entity))
        }
      }

      this.game.trials = trials
      this.game.fixationDuration = parseInt(experiment.fixationDuration)

      for (let m of this.myModules) {
        this.state.add(m, myStates[m])
      }
    }
  }

  concatArr (arr, n) {
    if (!n || n <= 0) {
      return []
    }

    if (n === 1) {
      return arr
    }

    let tmp = this.concatArr(arr, Math.floor(n / 2))

    return (n % 2 === 0) ? tmp.concat(tmp) : arr.concat(tmp.concat(tmp))
  }
}
