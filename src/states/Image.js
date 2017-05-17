import Phaser from 'phaser'
import * as handle from './effects'

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

export default class Image extends Phaser.State {
  constructor () {
    super()
    this.sprite = null
  }

  init () {
    this.stage.backgroundColor = '#FFFFFF'
  }

  preload () {}

  create () {
    const setting = this.game.currentTrial.setting
    const { width, height } =
          getWidthHeight(
            parseInt(setting.width),
            parseInt(setting.height),
            this.cache.getImage(setting.image).width,
            this.cache.getImage(setting.image).height)

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

    this.sprite = this.add.sprite(x, y, setting.image)
    this.sprite.width = width
    this.sprite.height = height
    this.sprite.anchor.setTo(0.5, 0.5)

    if (setting.effect.type) {
      handle[setting.effect.type].call(this, setting.effect.setting)
    }
    this.game.waitResponse()
  }

  render () {}

  shutdown () {
    this.sprite = null
  }
}
