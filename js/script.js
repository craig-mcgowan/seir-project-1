/*variable setup here. Will need containers for:
player1{name, score}
player2{name, score}

$scoreBoard = $('scoreBoard') scoreboard div contains divs for player names and player scores
$question
*/
$answerA = $(".answer-a")
console.log('$answerA:', $answerA)

/*functions/functionality
handleGetData (
    AJAX-pull in next question from source 
)
scoreUpdater(
    check chosen answer against correct answer
    correct? score += pointValue : score -= pointValue
)


*/

//build handleGetData function to pull in information
function handleGetData(event) {
    event.preventDefault
    //build AJAX function to pull in API data
    $.ajax({
        url: `https://cdn.contentful.com//spaces/a9aj5bcg0qv1/environments/master/entries?access_token=ySz5GlMWosH6hOorHoM5m1_luBoP3p-QC6w08NpnBAY&content_type=triviaq`
    }).then(
        function (data) {
            console.log = data
        }
    )
   
}


//render function ***HOISTED





