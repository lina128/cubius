import Phaser from 'phaser'

export default class extends Phaser.State {
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
  }

  render () {
  }
}
