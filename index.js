/**********

  This Pen uses no libraries except fonts and should
  work on all modern browsers

  The answers are stored in the `questions` array
  with the key `answer`.

  inspired by XavierCoulombeM
  https://dribbble.com/shots/2510592-Simple-register-form

 **********/

var questions = [
  { question: "Cateto (a)", pattern: /^[0-9]*$/ },
  { question: "Cateto (b)", pattern: /^[0-9]*$/ }
]

function getHipotenusa(a, b) {
  return Math.sqrt((a ** 2) + (b ** 2))
}

/*
  do something after the questions have been answered
*/
var onComplete = function () {

  function getMessage() {
    const message = []

    const a = questions[0].answer
    const b = questions[1].answer

    message.push('A² + B² = C²')
    message.push(`${a}² + ${b}² = C²`)
    message.push(`${a ** 2} + ${b ** 2} = C²`)
    message.push(`C = √${a ** 2 + b ** 2}`)
    message.push(`C = ${getHipotenusa(a, b).toFixed(2)}`)

    return message
  }

  const message = getMessage()

  var h1 = document.createElement('h1')
  for (const msg of message) {
    h1.appendChild(document.createTextNode(msg))
    h1.innerHTML += '<br />'
  }
  setTimeout(function () {
    register.parentElement.appendChild(h1)
    setTimeout(function () { h1.style.opacity = 1 }, 50)
  }, 1000)
}

  ; (function (questions, onComplete) {

    var tTime = 100 // transition transform time from #register in ms
    var wTime = 200 // transition width time from #register in ms

    // init
    // --------------
    if (questions.length == 0) return

    var position = 0

    putQuestion()

    forwardButton.addEventListener('click', validate)
    inputField.addEventListener('keyup', function (e) {
      transform(0, 0) // ie hack to redraw
      if (e.keyCode == 13) validate()
    })

    previousButton.addEventListener('click', function (e) {
      if (position === 0) return
      position -= 1
      hideCurrent(putQuestion)
    })


    // functions
    // --------------

    // load the next question
    function putQuestion() {
      inputLabel.innerHTML = questions[position].question
      inputField.type = questions[position].type || 'text'
      inputField.value = questions[position].answer || ''
      inputField.focus()

      // set the progress of the background
      progress.style.width = position * 100 / questions.length + '%'

      previousButton.className = position ? 'ion-android-arrow-back' : 'ion-person'

      showCurrent()

    }

    // when submitting the current question
    function validate() {

      var validateCore = function () {
        return inputField.value.match(questions[position].pattern || /.+/)
      }

      if (!questions[position].validate) questions[position].validate = validateCore

      // check if the pattern matches
      if (!questions[position].validate()) wrong(inputField.focus.bind(inputField))
      else ok(function () {

        // execute the custom end function or the default value set
        if (questions[position].done) questions[position].done()
        else questions[position].answer = inputField.value

        ++position

        // if there is a new question, hide current and load next
        if (questions[position]) hideCurrent(putQuestion)
        else hideCurrent(function () {
          // remove the box if there is no next question
          register.className = 'close'
          progress.style.width = '100%'

          onComplete()

        })

      })

    }


    // helper
    // --------------

    function hideCurrent(callback) {
      inputContainer.style.opacity = 0
      inputLabel.style.marginLeft = 0
      inputProgress.style.width = 0
      inputProgress.style.transition = 'none'
      inputContainer.style.border = null
      setTimeout(callback, wTime)
    }

    function showCurrent(callback) {
      inputContainer.style.opacity = 1
      inputProgress.style.transition = ''
      inputProgress.style.width = '100%'
      setTimeout(callback, wTime)
    }

    function transform(x, y) {
      register.style.transform = 'translate(' + x + 'px ,  ' + y + 'px)'
    }

    function ok(callback) {
      register.className = ''
      setTimeout(transform, tTime * 0, 0, 10)
      setTimeout(transform, tTime * 1, 0, 0)
      setTimeout(callback, tTime * 2)
    }

    function wrong(callback) {
      register.className = 'wrong'
      for (var i = 0; i < 6; i++) // shaking motion
        setTimeout(transform, tTime * i, (i % 2 * 2 - 1) * 20, 0)
      setTimeout(transform, tTime * 6, 0, 0)
      setTimeout(callback, tTime * 7)
    }

  }(questions, onComplete))