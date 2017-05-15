import Phaser from 'phaser'

export default function blink (setting) {
  this.sprite.alpha = 0
  this.add.tween(this.sprite).to(
    { alpha: 1 },
    parseInt(setting.duration),
    Phaser.Easing.Linear.None,
    true,
    0,
    parseInt(setting.repeat),
    true)
}
