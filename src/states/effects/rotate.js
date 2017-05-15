import Phaser from 'phaser'

export default function rotate (setting) {
  let sign = setting.clockwise ? 1 : -1
  this.add.tween(this.sprite).to(
    { angle: 360 * sign },
    parseInt(setting.duration),
    Phaser.Easing.Linear.None,
    true,
    0,
    parseInt(setting.repeat),
    false)
}
