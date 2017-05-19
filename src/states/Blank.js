import Phaser from 'phaser'

export default class Text extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#FFFFFF'
    this.next = this.next.bind(this)
  }

  preload () {}

  create () {
    setTimeout(this.next, this.game.fixationDuration)
  }

  next () {
    if (this.game.trials.length > 0) {
      this.game.currentTrial = this.game.trials.shift()
      this.game.reminderArea.innerHTML = this.game.currentTrial.setting.reminder || ''
      this.state.start(this.game.currentTrial.type)
    } else {
      this.state.start('END')
    }
  }

  render () {
  }
}
