import Phaser from 'phaser'

export default function flip (setting) {
  this.add.tween(this.sprite.scale).to(
    { x: -this.sprite.scale.x },
    parseInt(setting.duration),
    Phaser.Easing.Linear.None,
    true,
    0,
    parseInt(setting.repeat),
    true)
}
