import Game from './Game'

function Main () {
  const root = document.getElementById('root')

  const code = root.appendChild(document.createElement('textarea'))
  code.setAttribute('id', 'code')

  const btn = root.appendChild(document.createElement('button'))
  btn.setAttribute('id', 'submit')
  btn.addEventListener('click', handleClick)
  btn.innerHTML = 'Submit'

  const content = root.appendChild(document.createElement('div'))
  content.setAttribute('id', 'content')

  function handleClick () {
    const experiment = JSON.parse(code.value)
    window.game = new Game(experiment)
  }
}

Main()
