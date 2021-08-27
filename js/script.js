/*variable setup here. Will need containers for:
$scoreBoard = $('scoreBoard') scoreboard div contains divs for player names and player scores
$question
*/

qIDArr= [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
let qData, answer, currentPlayer, playerAnswer, qID
const player1 = {name: 'Player 1', score:0}
const player2 = {name: 'Player 2', score:0}

//player2{name, score}
//determine the current player
currentPlayer = player1
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


    /*functions/functionality
    handleGetData (
        AJAX-pull in next question from source 
    )
    scoreUpdater(
        check chosen answer against correct answer
        correct? score += pointValue : score -= pointValue
    )
    */

$('form').submit(nameHandler)
function nameHandler(event) {
    event.preventDefault()
    p1Name = $("input[id ='p1-name']").val()
    p2Name = $("input[id ='p2-name']").val()
    if (p1Name && p2Name) {
        console.log('hello')
        player1.name = p1Name
        player2.name = p2Name
        console.log('player1:', player1)
        $('.player1-name').text(player1.name)
        $('.player2-name').text(player2.name)
        $scoreBoard.fadeToggle(100)
        $('form').fadeToggle(100)
    } else {
        alert("C'mon, give me both your names")
    }
}



//add event listener for when user clicks an answer
$startButton.on('click', bootUp)
function bootUp() {
    handleGetData()
    $qHeader.fadeToggle(100)
    $gameContent.fadeToggle(100)
    $startButton.remove()
    $('.getter').fadeToggle(100)
    $newQBtn.toggle()
}
$newQBtn.on('click', setQuestion)

//build handleGetData function to pull in information
function handleGetData() {
    //build AJAX function to pull in API data
    $.ajax({
        url:  `https://cdn.contentful.com//spaces/a9aj5bcg0qv1/environments/master/entries/?access_token=ySz5GlMWosH6hOorHoM5m1_luBoP3p-QC6w08NpnBAY&select=fields`
    }).then(
        function (data) {
            //console.log(data)
            qData = data
            setQuestion()
        }
    )
   //console.log(this.className.includes('-a'))
}
$('.answers').on('click', processAnswer)
function processAnswer(event) {
    playerAnswer = event.target.id
    checkAnswer()
    console.log('playerAnswer:', playerAnswer)

}

//render function ***HOISTED
function render(num) {
    $question.text(qData.items[num].fields.question)
    $ansA.text(qData.items[num].fields.a)
    $ansB.text(qData.items[num].fields.b)
    $ansC.text(qData.items[num].fields.c)
    $ansD.text(qData.items[num].fields.d)
    answer = `answer-${qData.items[num].fields.answer}`

}
//check the answer clicked against the correct answer
function checkAnswer() {
    console.log("player answer: ",playerAnswer,"correct answer: ", answer)
    if (playerAnswer === answer) {
        console.log('correct! point for player 1')
        player1.score += 1
        $('.player1-score').text(player1.score)
    } else {
        console.group('incorrect!')
    }
    $newQBtn.fadeToggle()
}

function questionGetter() {
    qID = qIDArr.splice(Math.floor(Math.random()*qIDArr.length),1)
}
function setQuestion() {
    questionGetter()
    console.log('qID:', qID)
    console.log('qIDArr.length:', qIDArr.length)
    render(qID)
    console.log(qIDArr.length)
    if (qIDArr.length) {
        $newQBtn.fadeToggle(100)
    } else {
        $newQBtn
            .text('The game is over!')
            .removeClass('btn-primary start')
            .addClass('btn-danger')

    }
}
