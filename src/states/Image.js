import Phaser from 'phaser'

function getWidthHeight (w, h, wOld, hOld) {
  if (w && h) {
    return { width: w, height: h }
  }

  if (w || h) {
    let r
    if (w) {
      r = w / wOld
      h = hOld * r
    } else {
      r = h / hOld
      w = wOld * r
    }
    return { width: w, height: h }
  }

  return { width: wOld, height: hOld }
}

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#FFFFFF'
  }

  preload () {}

  create () {
    const setting = this.game.currentTrial.trialSetting
    const { width, height } = getWidthHeight(parseInt(setting.width), parseInt(setting.height), this.cache.getImage(setting.image).width, this.cache.getImage(setting.image).height)

    let x = this.world.centerX
    switch (setting.alignH) {
      case 'left':
        x = width / 2
        break
      case 'right':
        x = this.world.width - Math.ceil(width / 2)
        break
    }

    let y = this.world.centerY
    switch (setting.alignV) {
      case 'top':
        y = height / 2
        break
      case 'bottom':
        y = this.world.height - Math.ceil(height / 2)
        break
    }

    const sprite = this.add.sprite(x, y, setting.image)
    sprite.width = width
    sprite.height = height
    sprite.anchor.setTo(0.5, 0.5)

    if (setting.fadeIn) {
      sprite.alpha = 0
      this.add.tween(sprite).to({ alpha: 1 }, parseInt(setting.fadeIn), Phaser.Easing.Linear.None, true, 0, 0, false)
    }
  }

  render () {
  }
}
