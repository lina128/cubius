import Phaser from 'phaser'
import { shuffle } from '../utils'

export default class Mot extends Phaser.State {
  constructor () {
    super()
    this.sprites = null
    this.targets = []
    this.stop = false
    this.velocity = 60
    this.count = 0
    this.tracked = 0
    this.freeze = this.freeze.bind(this)
    this.revealTarget = this.revealTarget.bind(this)
  }

  init () {
    this.stage.backgroundColor = '#FFFFFF'
  }

  preload () {}

  create () {
    this.generateSprites()
    setTimeout(this.freeze, parseInt(this.game.currentTrial.setting.duration))
  }

  render () {
  }

  update () {
    if (this.stop && this.velocity > 0) {
      this.velocity = 0
      this.sprites.forEach(this.freezeSprite)
    } else {
      if (this.game.currentTrial.setting.interactMode === 'collide') {
        this.physics.arcade.collide(this.sprites)
      }
    }
  }

  shutdown () {
    this.sprites = null
    this.targets = []
    this.stop = false
    this.velocity = 60
    this.count = 0
    this.tracked = 0
  }

  generateSprites () {
    let w = this.cache.getImage(this.game.currentTrial.setting.image).width
    let h = this.cache.getImage(this.game.currentTrial.setting.image).height

    let colCount = Math.floor(this.game.world.width / w)
    let rowCount = Math.floor(this.game.world.height / h)
    let size = colCount * rowCount

    let objectCount = parseInt(this.game.currentTrial.setting.targetCount) +
         parseInt(this.game.currentTrial.setting.nonTargetCount)

    if (size < objectCount) {
      this.sprites = null
      return
    }

    this.count = parseInt(this.game.currentTrial.setting.targetCount)

    let colWidth = this.game.world.width / colCount
    let rowHeight = this.game.world.height / rowCount

    let marginWidth = Math.round((colWidth - w) / 2)
    let marginHeight = Math.round((rowHeight - h) / 2)

    let arr = []
    for (let i = 0; i < size; i++) {
      arr.push(i)
    }
    shuffle(arr)

    this.sprites = this.add.physicsGroup(Phaser.Physics.ARCADE)
    for (let i = 0; i < objectCount; i++) {
      let row = Math.floor(arr[i] / colCount)
      let col = arr[i] % colCount
      let x = colWidth * col + marginWidth + w / 2
      let y = rowHeight * row + marginHeight + h / 2
      let sprite = this.sprites.create(x, y, this.game.currentTrial.setting.image)
      sprite.anchor.setTo(0.5)
      sprite.body.velocity.set(parseInt(this.game.currentTrial.setting.velocity))
      sprite.body.collideWorldBounds = true
      sprite.body.bounce.setTo(1)
      sprite.body.allowGravity = false
      if (i < this.count) {
        this.targets.push(sprite)
        sprite.alpha = 1.0
        this.add.tween(sprite).to(
          { alpha: 0.2 },
          300,
          Phaser.Easing.Linear.None,
          true,
          0,
          3,
          true)
      }
    }

    this.velocity = parseInt(this.game.currentTrial.setting.velocity)
  }

  freeze () {
    this.stop = true
    let start = Date.now()
    this.sprites.forEach(sprite => {
      sprite.inputEnabled = true
      sprite.input.useHandCursor = true
      sprite.events.onInputDown.add(() => {
        sprite.tint = 0x999999
        this.count--
        if (this.targets.indexOf(sprite) > -1) {
          this.tracked++
        }
        if (this.count <= 0) {
          let end = Date.now()
          this.revealTarget()
          this.game.waitResponse({
            reactionTime: end - start,
            tracked: this.tracked
          })
        }
      })
    })
  }

  freezeSprite (sprite) {
    sprite.body.velocity.set(0, 0)
  }

  revealTarget () {
    let graphics = this.game.add.graphics(0, 0)
    graphics.lineStyle(2, 0x0000FF, 1)
    this.targets.forEach(target => {
      graphics.drawRect(
        target.world.x - target.width / 2,
        target.world.y - target.height / 2,
        target.width,
        target.height)
    })
  }
}
