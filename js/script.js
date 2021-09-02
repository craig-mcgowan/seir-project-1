/******************************
 * Variables
 *****************************/

qIDArr= [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
let qData, answer , currentPlayer, playerAnswer, qID, currentQ = 1, playerCounter= 1
let questionSet = 'triviaQuestions'
const player1 = { name: 'Player 1', score: 0 }
const player2 = {name: 'Player 2', score:0}
const $progress = $('.progress-bar')
const $scoreBoard = $('.scoreboard')
const $gameContent = $('.game-content')
const $newQBtn = $('.new-question')
const $qHeader = $('.question-header')
const $startButton = $('.start')
const $question = $('.question')
const $ansA = $('#answer-a')
const $ansB = $('#answer-b')
const $ansC = $('#answer-c')
const $ansD = $('#answer-d')
const $message = $('.message')
const $muteButton = $('#mute')
const audioTracks = {
    letsPlayAudio: "./audio/background-music/lets-play.mp3",
    questionAudio: "./audio/background-music/100-1000-music.mp3",
    mainTheme: "./audio/background-music/main-theme.mp3",
    correctAudio: "./audio/correct-answer/correct-answer.mp3",
    wrongAnswer: ["./audio/wrong-answer/boing.mp3", "./audio/wrong-answer/buzzer.mp3", "./audio/wrong-answer/stinky.mp3"]
}
const $backgroundMusic = $('audio#background-music')
const $soundEffects = $('audio#sound-effects')

/******************************
 * Functions
 *****************************/
/******************************
 * AUDIO
 *****************************/

$muteButton.click(toggleAudio)
//changes the icon for the mute button
function toggleAudio() {
    $('.mute').toggle();
    $('.unmute').toggle();
    console.log($('.mute').css('display'))
    volumeChecker($backgroundMusic)
}
//based on the icon being shown, turns the volume on or off
function volumeChecker($audioSource) {
    if ($('.mute').css('display')=== 'none') {
        $audioSource.prop('volume', 0)
    } else {
        $audioSource.prop('volume', 0.05)
    }
}
//plays a sound effect when a button is pressed
function playSoundEffect(soundEffect) {
    volumeChecker($soundEffects)
    $soundEffects.attr('src', soundEffect)
    $soundEffects[0].play()
}
//plays the background music
function playBackgroundMusic(backgroundMusic) {
    volumeChecker($backgroundMusic)
    $backgroundMusic.attr('src', backgroundMusic)
    $backgroundMusic[0].play()
}


/**************************************************
 * SUBMIT BUTTON/NAME HANDLER
 ************************************************/

//When player submits their name, assign it to the player object
$('form').submit(nameHandler)
function nameHandler(event) {
    event.preventDefault()
    p1Name = $("input[id ='p1-name']").val()
    p2Name = $("input[id ='p2-name']").val()
    if (!p1Name || !p2Name) {
        //makes sure both players have entered their names
        alert("C'mon, give me both your names")
    } else if (p1Name.length > 10 || p2Name.length > 10) {
        //for formatting purposes don't want names to be too long
        alert("Your name is too long! How about a nickname?")  
    } else  {
        player1.name = p1Name
        player2.name = p2Name
        //checks if the player entered a secret code
        if (p1Name.toLowerCase() === 'uuddlrlrba' || p2Name.toLowerCase() === 'uuddlrlrba') {
            player1.name = "Easter"
            player2.name = "Egg"
        } else if(p1Name.toLowerCase() === 'stupid' || p2Name.toLowerCase() === 'questions'){
        //changes the variable containing the question set used in the AJAX request
            questionSet = 'triviaq'
        }   
        //update the score-board with the player's name
        $('.player1-name').text(player1.name)
        $('.player2-name').text(player2.name)
        //Unhide the scoreboard and hide the input
        $startButton.fadeIn()
        $scoreBoard.fadeTo(100,100)
        $('form').fadeToggle(100)
        playBackgroundMusic(audioTracks.mainTheme)
        $('.game-instructions').fadeTo(100,100)

    }
}

/*****************************
 * BOOTUP
 ****************************/

//When user starts the game, pull in questions & set up the screen
$startButton.on('click', bootUp);
function bootUp() {
    handleGetData()
    //Unhide the question #, question and answer, delete start button
    $qHeader.fadeToggle(200)
    $gameContent.fadeToggle(200)
    $newQBtn.toggle(200)
    $startButton.remove()
    $('.game-instructions').remove()
    //pauseAudio($backgroundMusic)
    playBackgroundMusic(audioTracks.questionAudio)
    playSoundEffect(audioTracks.letsPlayAudio)
    
}
//pulls questions from the API and stores them in the qData object
function handleGetData() {
    $.ajax({
        url:  `https://cdn.contentful.com//spaces/a9aj5bcg0qv1/environments/master/entries/?access_token=ySz5GlMWosH6hOorHoM5m1_luBoP3p-QC6w08NpnBAY&select=fields&content_type=${questionSet}`
    }).then(
        function (data) {
            //console.log(data)
            qData = data
            //set the first question
            setQuestion()
        }
    )
}

/*****************************
 * Next Question Event Handler
 * Set Question
 * Render
 ****************************/

//loads the new questions when the button is clicked
$newQBtn.on('click', setQuestion)


function setQuestion() {
    
    $message.text("")//clears the answer feedback
    setPlayer()//changes to the next player

    //update the question header with the question number and player name.
    $qHeader.text(`Question #${currentQ}: ${currentPlayer.name} you're up!`)
    
    $progress //Update the progress bar.
        .text(`${currentQ}/20`)
        .attr('aria-valuenow', currentQ)
        .width(`${currentQ / 20 * 100}%`)
    currentQ++ //update the question number
    playerCounter++ //update the player counter (odds are p1 evens are p2)
    questionGetter() //pulls in a random question from qData

    //re-enables the answer buttons and resets their styling
    $(".ans").prop("disabled", false).removeClass().addClass('btn btn-info ans');

    render(qID) //assigns the questions & answers to the relevant html elements

    if (qIDArr.length) {   //if there are more questions, disable the new question button
        $newQBtn.prop('disabled', true)
    } 
}

function render(num) {
    $question.text(qData.items[num].fields.question)
    $ansA.text(qData.items[num].fields.a)
    $ansB.text(qData.items[num].fields.b)
    $ansC.text(qData.items[num].fields.c)
    $ansD.text(qData.items[num].fields.d)
    answer = `answer-${qData.items[num].fields.answer}`

}
/*************************************
 *  Answer Event Listener
 *  Check Answer Function
 ************************************/

//When the player clicks an answer:
//run the check answer function and disable the buttons
$('.answers').on('click', processAnswer)
function processAnswer(event) {

    //if the player clicks the answer div but not a specific answer don't do anything
    if (event.target.className === 'answers') {

    } else {
        playerAnswer = event.target
        $(".ans").prop("disabled", true);
        checkAnswer()
    }
}
//check the answer clicked against the correct answer
function checkAnswer() {
    console.log(playerAnswer)
    if (playerAnswer.id === answer || answer === 'answer-any') {
        plus1() //adds 1 to the current player's score
        $message.text('You got it, wow!').css('color', 'black') //give text answer feedback
        playerAnswer.setAttribute('class', 'btn btn-success ans') //change the button to green
        playSoundEffect(audioTracks.correctAudio)
    } else {
        $message.text('No, sorry that is way off!').css('color', 'red') //give text answer feedback
        playerAnswer.setAttribute('class', 'btn btn-danger ans') //change the button color to red

        //play a random sound effect from the wrong answer sound library
        playSoundEffect(audioTracks.wrongAnswer[Math.floor(Math.random()*audioTracks.wrongAnswer.length)])
    }
    if (qIDArr.length) {
        $newQBtn.prop('disabled', false) //re-enable the new question button
    } else {
        $newQBtn  //if the game is over change the button to indicate it
            .text('The game is over!')
            .removeClass('btn-primary start')
            .addClass('btn-danger')
            .prop('disabled', true)
    }
}



//picks a random question from the qData object and removes it from the object
function questionGetter() {
    //gets random question to pass into render function and 
    //removes it from the question array
    qID = qIDArr.splice(Math.floor(Math.random() * qIDArr.length), 1)

}

//determine's the current player (odds are player 1 and evens are player 2)
function setPlayer() {
    if (playerCounter % 2) {
        currentPlayer = player1
    } else {
        currentPlayer = player2
    }
}

//add one to the current player's score
function plus1() {
    if (currentPlayer === player1) {
        //pops up a red plus one to show the player's score increased
        $('.p1Plus').fadeTo(200, 1).delay(200).fadeTo(200, 0)
    } else {
        //pops up a red plus one to show the player's score increased
        $('.p2Plus').fadeTo(200, 1).delay(200).fadeTo(200, 0)
    }
    currentPlayer.score++
    $('.player1-score').text(player1.score)
    $('.player2-score').text(player2.score)
}