import 'pixi'
import 'p2'
import Phaser from 'phaser'
import BOOT from './states/Boot'
import PRELOAD from './states/Preload'
import BLANK from './states/Blank'
import END from './states/End'
import config from './config'

export default class Game extends Phaser.Game {
  constructor (experiment) {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.experiment = experiment
    this.result = []
    this.fixationDuration = null
    this.trials = null
    this.currentTrial = null
    this.assets = []
    this.timeout = null
    this.nextBtn = document.getElementById('next-btn')
    this.reminderArea = document.getElementById('reminder')
    this.responseArea = document.getElementById('response-area')
    this.surveyArea = document.getElementById('survey-area')
    this.waitResponse = this.waitResponse.bind(this)
    this.recordResponse = this.recordResponse.bind(this)
    this.processInputAutoTimedAdvance = this.processInputAutoTimedAdvance.bind(this)
    this.processInputKeyAdvance = this.processInputKeyAdvance.bind(this)
    this.processInputErrorFeedback = this.processInputErrorFeedback.bind(this)
    this.processInputNextButton = this.processInputNextButton.bind(this)
    this.processInputTextResponse = this.processInputTextResponse.bind(this)
    this.processInputSurveyResponse = this.processInputSurveyResponse.bind(this)
    this.next = this.next.bind(this)

    this.state.add('BOOT', BOOT)
    this.state.add('PRELOAD', PRELOAD)
    this.state.add('BLANK', BLANK)
    this.state.add('END', END)
    this.state.start('BOOT')
  }

  next () {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.input.keyboard.onDownCallback = null
    this.nextBtn.style.display = 'none'
    this.responseArea.style.display = 'none'
    this.responseArea.innerHTML = ''
    this.surveyArea.style.display = 'none'
    this.surveyArea.src = ''
    this.state.start('BLANK')
  }

  waitResponse (response) {
    if (this.currentTrial.setting.inputAutoTimedAdvance && this.currentTrial.setting.inputAutoTimedAdvance !== '0') {
      this.processInputAutoTimedAdvance(response)
    }
    if (this.currentTrial.setting.inputKeyAdvance && this.currentTrial.setting.inputKeyAdvance.length > 0) {
      this.processInputKeyAdvance(response)
    } else if (this.currentTrial.setting.inputErrorFeedbackKeyAdvance &&
              this.currentTrial.setting.inputErrorFeedbackKeyAdvance.length > 0 &&
              this.currentTrial.setting.inputErrorFeedbackErrorKey &&
              this.currentTrial.setting.inputErrorFeedbackErrorKey.length > 0) {
      this.processInputErrorFeedback(response)
    } else if (this.currentTrial.setting.inputNextButton) {
      this.processInputNextButton(response)
    } else if (this.currentTrial.setting.inputTextResponse) {
      this.processInputTextResponse(response)
    } else if (this.currentTrial.setting.inputSurveyResponse) {
      this.processInputSurveyResponse(response)
    }
  }

  recordResponse (response) {
    if (!response || typeof response !== 'object') {
      console.log(`Expect a response from this trial, found ${typeof response}. Please check your processing method.`)
      return
    }

    let arr = []
    for (let i in this.currentTrial.condition) {
      arr.push(this.currentTrial.condition[i].name)
    }
    this.result.push({
      id: this.currentTrial.id,
      order: this.result.length,
      module: this.currentTrial.name,
      screenshot: this.currentTrial.screenshot || '',
      note: this.currentTrial.note || '',
      condition: arr.join(','),
      ...response
    })
  }

  processInputAutoTimedAdvance (response) {
    let time = parseInt(this.currentTrial.setting.inputAutoTimedAdvance)
    this.timeout = setTimeout(() => {
      this.recordResponse({
        reactionTime: time,
        ...response
      })
      this.next()
    }, time)
  }

  processInputKeyAdvance (response) {
    let start = Date.now()
    this.input.keyboard.onDownCallback = (e) => {
      let keyCode = e.which || e.keyCode
      let pos = this.currentTrial.setting.inputKeyAdvance.indexOf(keyCode)
      if (pos > -1) {
        let end = Date.now()
        this.recordResponse({
          reactionTime: end - start,
          keyPress: keyCode.toString(),
          ...response
        })
        this.next()
      }
    }
  }

  processInputErrorFeedback (response) {
    let start = Date.now()
    let wrongKeys = []
    this.input.keyboard.onDownCallback = (e) => {
      let keyCode = e.which || e.keyCode
      let correct = this.currentTrial.setting.inputErrorFeedbackKeyAdvance.indexOf(keyCode)
      let wrong = this.currentTrial.setting.inputErrorFeedbackErrorKey.indexOf(keyCode)

      if (wrong > -1) {
        this.input.keyboard.onDownCallback = null
        let wrongMessage = this.add.text(this.world.centerX, this.world.centerY,
                                  this.currentTrial.setting.inputErrorFeedbackMessage)
        wrongMessage.anchor.setTo(0.5, 0.5)
        wrongMessage.font = 'Helvetica'
        wrongMessage.fontSize = '16pt'
        wrongMessage.fill = '#5b4bca'

        let tween = this.add.tween(wrongMessage).to({ alpha:1 }, 400, Phaser.Easing.Linear.None, true, 0, 0, true)
        let myGame = this
        tween.onComplete.add(function () {
          wrongMessage.destroy()
          if (myGame.currentTrial.setting.inputErrorFeedbackAllowCorrection) {
            wrongKeys.push(keyCode.toString())
            myGame.processInputErrorFeedback()
          } else {
            let end = Date.now()
            myGame.recordResponse({
              reactionTime: end - start,
              keyPress: '',
              wrongKeyPress: keyCode.toString(),
              ...response
            })
            myGame.next()
          }
        })
      } else if (correct > -1) {
        let end = Date.now()
        this.recordResponse({
          reactionTime: end - start,
          keyPress: keyCode.toString(),
          wrongKeyPress: wrongKeys.join(','),
          ...response
        })
        this.next()
      }
    }
  }

  processInputNextButton (response) {
    this.nextBtn.style.display = 'block'
    let myGame = this
    let start = Date.now()
    this.nextBtn.addEventListener('click', (e) => {
      let end = Date.now()
      myGame.recordResponse({
        reactionTime: end - start,
        ...response
      })
      myGame.next()
    }, { once: true })
  }

  processInputTextResponse (response) {
    this.responseArea.style.display = 'block'
    this.nextBtn.style.display = 'block'
    let myGame = this
    let start = Date.now()
    this.nextBtn.addEventListener('click', (e) => {
      let end = Date.now()
      myGame.recordResponse({
        reactionTime: end - start,
        textResponse: this.responseArea.innerHTML,
        ...response
      })
      myGame.next()
    }, { once: true })
  }

  processInputSurveyResponse (response) {
    this.surveyArea.src = this.currentTrial.setting.inputSurveyResponse
    this.surveyArea.style.display = 'block'
    this.nextBtn.style.display = 'block'
    let myGame = this
    let start = Date.now()
    this.nextBtn.addEventListener('click', (e) => {
      let end = Date.now()
      myGame.recordResponse({
        reactionTime: end - start,
        surveyResponse: this.surveyArea.src,
        ...response
      })
      myGame.next()
    }, { once: true })
  }
}
