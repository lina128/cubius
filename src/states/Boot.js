import Phaser from 'phaser'
import * as mystates from '../states'
import { findNode } from '../utils/findNode'

export default class extends Phaser.State {
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

  buildExperiment (experiment) {
    if (!experiment) {
      return
    } else {
      const modules = new Set()
      const ts = []

      experiment.structure.map((t) => {
        let node = findNode(experiment.entities, t.id)
        modules.add(node.type)
        ts.push(
          {
            ...t,
            type: node.type,
            name: node.name,
            condition: node.condition,
            trialSetting: node.trialSetting
          }
        )
        for (let s in node.trialSetting) {
          if (node.trialSetting[s].substring(0, 4) === 'http') {
            this.game.assets.push(node.trialSetting[s])
          }
        }
      })
      this.game.trials = ts

      for (let m of modules) {
        this.state.add(m, mystates[m])
      }
    }
  }
}
