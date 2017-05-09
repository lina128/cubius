import Phaser from 'phaser'

export class Preload extends Phaser.State {
  constructor () {
    super()
    this.text = null
  }

  init () {
    this.stage.backgroundColor = '#FFFFFF'
    this.text = this.add.text(this.world.centerX, this.world.centerY, 'Loading complete 0%', { fill: '#3a3a08' })
    this.text.anchor.setTo(0.5, 0.5)
    this.text.font = 'Helvetica'
    this.text.fontSize = '12pt'
    this.text.fontWeight = 'normal'
    this.text.fill = '#5b4bca'
  }

  preload () {
    const loadingBar = this.add.sprite(this.world.centerX, this.world.centerY + 30, 'loaderBar')
    loadingBar.anchor.setTo(0.5, 0.5)
    this.load.setPreloadSprite(loadingBar)

    const assets = this.game.assets

    for (let i = 0; i < assets.length; i++) {
      // TODO: CHECK TYPE
      this.load.image(assets[i], assets[i])
      this.load.start()
    }
  }

  loadUpdate () {
    this.text.setText('Loading complete ' + this.load.progress + '%')
  }

  create () {
    this.game.next()
  }
}

export default Preload
