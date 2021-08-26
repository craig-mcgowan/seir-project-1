/*variable setup here. Will need containers for:
$scoreBoard = $('scoreBoard') scoreboard div contains divs for player names and player scores
$question
*/
qNumArr= [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
let qData, answer, currentPlayer, playerAnswer, qNum
const player1 = {name: 'Player 1', score:0}
//player2{name, score}
//determine the current player
currentPlayer = player1

const $question = $('.question')
const $ansA = $('.answer-a')
const $ansB = $('.answer-b')
const $ansC = $('.answer-c')
const $ansD = $('.answer-d')
let entryID = `1S4S9qCYmYJFSkrSbZBU2t`

/*functions/functionality
handleGetData (
    AJAX-pull in next question from source 
)
scoreUpdater(
    check chosen answer against correct answer
    correct? score += pointValue : score -= pointValue
)


*/
//add event listener for when user clicks an answer
$('.start').on('click', handleGetData)
//build handleGetData function to pull in information
function handleGetData(event) {
    event.preventDefault

    //build AJAX function to pull in API data
    $.ajax({
        url:  `https://cdn.contentful.com//spaces/a9aj5bcg0qv1/environments/master/entries/?access_token=ySz5GlMWosH6hOorHoM5m1_luBoP3p-QC6w08NpnBAY&select=fields`
    }).then(
        function (data) {
            //console.log(data)
            qData = data
            qNum =questionGetter(qNumArr)
            render(qNum)
            console.log(qNumArr.length)
        }
    )
   //console.log(this.className.includes('-a'))
}
$('.answers').on('click', processAnswer)
function processAnswer(event) {
    playerAnswer = event.target.className
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
}

function questionGetter(arr) {
    return arr.splice(Math.floor(Math.random()*arr.length),1)
}




