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

  const responseArea = root.appendChild(document.createElement('div'))
  responseArea.setAttribute('id', 'response-area')
  responseArea.setAttribute('contenteditable', true)

  const iFrame = root.appendChild(document.createElement('iframe'))
  iFrame.setAttribute('id', 'survey-area')
  iFrame.style.display = 'none'

  const nextBtn = root.appendChild(document.createElement('button'))
  nextBtn.setAttribute('id', 'next-btn')
  nextBtn.innerHTML = 'Next'

  function handleClick () {
    const experiment = JSON.parse(code.value)
    if (window.game) {
      window.game.destroy()
    }
    window.game = new Game(experiment)
    btn.blur()
  }
}

Main()
