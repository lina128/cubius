import Phaser from 'phaser'
import Papa from 'papa'

export default class END extends Phaser.State {
  constructor () {
    super()
    this.processResult = this.processResult.bind(this)
  }

  init () {
    this.stage.backgroundColor = '#FFFFFF'
  }

  preload () {}

  create () {
    let text = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Thank you for your participation!')
    text.font = 'Arial'
    text.fontSize = '15pt'
    text.fill = '#000000'
    text.anchor.set(0.5, 0.5)
    this.processResult()
  }

  render () {
  }

  processResult () {
    console.log(this.game.result)
    let json = JSON.stringify(this.game.result)
    let csv = Papa.unparse(json)
    console.log(csv)
  }
}
