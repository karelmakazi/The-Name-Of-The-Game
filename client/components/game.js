import Phaser from 'phaser'
import { createMapArray, test } from './mapfunctions'

// document.addEventListener('keydown', e => detectKeyStroke())

export default {
  type: Phaser.AUTO,
  width: 960,
  height: 960,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

// var game = new Phaser.Game(config)
var map = null
map = createMapArray()
console.log(map)

var actors = [
  {
    team: 1,
    units: [
      {
        name: 'warrior2H',
        sprite: 'warrior',
        idx: 160

      },
      {
        name: 'warrior2',
        sprite: 'warrior',
        idx: 180
      },
      {
        name: 'warrior3',
        sprite: 'warrior',
        idx: 200
      }
    ]
  },
  {
    team: 2,
    units: [
      {
        name: 'enemy1',
        sprite: 'enemywarrior',
        idx: 179
      },
      {
        name: 'enemy2',
        sprite: 'enemywarrior',
        idx: 199
      },
      {
        name: 'enemy3',
        sprite: 'enemywarrior',
        idx: 219
      }
    ]
  }
]

// var game = new Phaser.Game(config)
var player
var cursor
var cursor
var cursors
var keyZ
var keyX

function preload () {
  this.load.image('warrior', '/assets/images/warrior.png')
  this.load.image('enemywarrior', '/assets/images/enemywarrior.png')
  this.load.image('gcursor', '/assets/images/green-cursor.png')
  this.load.image('bcursor', '/assets/images/blue-cursor.png')
  this.load.image('rcursor', '/assets/images/red-cursor.png')
  this.load.image('testmap2', '/assets/images/testmap2.png')
}

function create () {
  this.input.keyboard.on('keydown-Z', checkTile, this)
  this.input.keyboard.on('keydown-X', changeCursorColor, this)
  this.add.image(480, 480, 'testmap2')
  cursors = this.input.keyboard.createCursorKeys()
  keyZ = this.input.keyboard.addKey('Z')
  keyX = this.input.keyboard.addKey('X')

  actors.forEach(team => {
    team.units.forEach(actor => {
      let coords = getCoordsFromIndex(actor.idx)
      actor.x = coords[0]
      actor.y = coords[1]
      actor = this.physics.add.image(actor.x, actor.y, actor.sprite).setOrigin(0, 0)
    })
  })

  player = this.physics.add.image(0, 0, 'gcursor').setOrigin(0, 0)
  player.setCollideWorldBounds(true)
  player.setData('notMoving', true)
  player.setData('idx', 0)
  player.setData('sprite', 'gcursor')
}

function getCoordsFromIndex (idx) {
  var x = (idx % 20) * 48
  var y = (Math.floor(idx / 20)) * 48
  return [x, y]
}

function setfixedMovement (val, axis) {
  if (axis === 'x') {
    player.x += val
  } else if (axis === 'y') {
    player.y += val
  }

  player.setPosition(player.x, player.y)
  player.setData('notMoving', false)
  setTimeout(() => {
    player.setData('notMoving', true)
  }, 100)
  setCursorIndex()
}

function setCursorIndex () {
  // console.log('x: ', player.x, 'y:', player.y)
  player.setData('idx', ((player.x / 48) + ((player.y / 48) * 20)))
}

function update () {
  if (player.getData('notMoving')) {
    if (cursors.left.isDown) {
      setfixedMovement(-48, 'x')
    } else if (cursors.right.isDown) {
      setfixedMovement(48, 'x')
    } else if (cursors.up.isDown) {
      setfixedMovement(-48, 'y')
    } else if (cursors.down.isDown) {
      setfixedMovement(48, 'y')
    }
  }
}

function checkTile () {
  let idx = player.getData('idx')
  let coords = getCoordsFromIndex(idx)
  console.log('index:', idx, 'coords:', coords)
  let found = false
  actors.forEach(team => {
    team.units.forEach(actor => {
      let currentIdx = player.getData('idx')
      if (actor.idx === currentIdx) {
        found = true
      }
    })
  })
  if (found) {
    console.log('tile contains a unit')
  } else {
    console.log('tile does not contain a unit')
  }
}

function changeCursorColor () {
  let sprite
  if (player.getData('sprite') === 'gcursor') {
    sprite = 'bcursor'
  } else if (player.getData('sprite') === 'bcursor') {
    sprite = 'gcursor'
  }
  let idx = player.getData('idx')
  let coords = getCoordsFromIndex(idx)
  player.destroy()
  player = this.physics.add.image(coords[0], coords[1], sprite).setOrigin(0, 0)
  player.setCollideWorldBounds(true)
  player.setData('notMoving', true)
  player.setData('idx', idx)
  player.setData('sprite', sprite)
  setCursorIndex()
  // cursor = this.physics.add.image(96, 96, 'bcursor').setOrigin(0, 0)
}