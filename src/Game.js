import 'pixi'
import 'p2'
import Phaser from 'phaser'
import BOOT from './states/Boot'
import PRELOAD from './states/Preload'
import config from './config'

export default class Game extends Phaser.Game {
  constructor (experiment) {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.experiment = experiment
    this.trials = null
    this.currentTrial = null
    this.assets = []

    this.state.add('BOOT', BOOT)
    this.state.add('PRELOAD', PRELOAD)
    this.state.start('BOOT')
  }
}
