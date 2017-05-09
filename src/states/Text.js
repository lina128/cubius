import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#FFFFFF'
  }

  preload () {}

  create () {
    const setting = this.game.currentTrial.setting
    let text = this.add.text(10, 10, setting.content)
    text.font = setting.font
    text.fontSize = setting.fontSize + 'pt'
    text.fontWeight = setting.fontWeight
    text.fill = setting.fontColor
    this.game.waitResponse()
  }

  render () {
  }
}
