function insertChat(text) {
    if (playerNumber === 1) {
        var msg = $("<p>").text(text).addClass("text-left");
        $("#msgC").append(msg);
    } else {
        var msg = $("<p>").text(text).addClass("text-right");
        $("#msgC").append(msg);
    }
}

$('form').on('keypress', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        var text = $("#userMessage").val().trim();
        if (text !== "") {
            insertChat(text);
            $("#userMessage").val('');
        }
    }
})

$("#subButton").on("click", function (event) {
    event.preventDefault();
    var text = $("#userMessage").val().trim();
    if (text !== "") {
        insertChat(text);
        $("#userMessage").val('');
    }
})

var config = {
    apiKey: "AIzaSyArvQ-y5nA4aN9qziTlrdCMPjAneaBp5Pg",
    authDomain: "rockpaperscissor95.firebaseapp.com",
    databaseURL: "https://rockpaperscissor95.firebaseio.com",
    projectId: "rockpaperscissor95",
    storageBucket: "rockpaperscissor95.appspot.com",
    messagingSenderId: "765347041098"
};
firebase.initializeApp(config);

var database = firebase.database();

database.ref().set({
    users: {},
    gameRules: {
        turn: 0,
        gameStarted: false
    }
})


var gameStarted = false;
var hasPlayer1 = false;
var hasPlayer2 = false;
var playerNumber = 0;
var initialTurn = 1;
var turn;
var firstPlayerChoice;
var secondPlayerChoice;

var p1b1 = $("<button>").addClass("p1-choices mx-auto btn btn-outline-info").attr("data-choice", "Rock").text("Rock");
var p1b2 = $("<button>").addClass("p1-choices mx-auto btn btn-outline-info").attr("data-choice", "Paper").text("Paper");
var p1b3 = $("<button>").addClass("p1-choices mx-auto btn btn-outline-info").attr("data-choice", "Scissors").text("Scissors");

var p2b1 = $("<button>").addClass("p2-choices mx-auto btn btn-outline-info").attr("data-choice", "Rock").text("Rock");
var p2b2 = $("<button>").addClass("p2-choices mx-auto btn btn-outline-info").attr("data-choice", "Paper").text("Paper");
var p2b3 = $("<button>").addClass("p2-choices mx-auto btn btn-outline-info").attr("data-choice", "Scissors").text("Scissors");

$("#userButton").on("click", function (event) {
    event.preventDefault();
    var uName = $("#userName").val().trim();
    if (uName !== "") {
        if (hasPlayer1 === false) {
            var playerD = database.ref('users/' + "p1");
            playerD.set({
                name: uName,
                choice: "",
                losses: 0,
                wins: 0
            });
            console.log();
            playerNumber = 1;
            $("#nameSubmit").remove();
            $("#welcomeMsg").text("Hi " + uName + "! You are Player 1");

            // database.ref("users/p1").update({
            //     choice: "rock"
            // })
        } else if (hasPlayer1 === true && hasPlayer2 === false) {
            var playerD = database.ref('users/' + "p2");
            playerD.set({
                name: uName,
                choice: "",
                losses: 0,
                wins: 0
            });
            playerNumber = 2;
            $("#nameSubmit").remove();
            $("#welcomeMsg").text("Hi " + uName + "! You are Player 2");
        }
    }
})

database.ref().on("value", function (snapshot) {
    var playerCount = snapshot.child("users");
    console.log(playerCount.numChildren());
    if (playerCount.numChildren() == 1) {
        console.log(snapshot.child("users").child("p1").child("name").val());
        $("#P1").text(snapshot.child("users").child("p1").child("name").val());
        hasPlayer1 = true;
    } else if (playerCount.numChildren() == 2) {
        if (gameStarted === false) {
            $("#P2").text(snapshot.child("users").child("p2").child("name").val());
            hasPlayer2 = true;
            gameStarted = true;
            database.ref("gameRules/").update({
                gameStarted: true,
                turn: 1
            });
        }
    }
})



var gameData = database.ref("/gameRules/turn");
gameData.on("value", function (snapshot) {
    if (gameStarted === true && playerNumber !== 0) {
        if (playerNumber === 1) {
            if (snapshot.val() === 1) {
                $("#turnMsg").text("It's your turn!");
                $("#p1Card").append(p1b1).append(p1b2).append(p1b3);
            } else if (snapshot.val() === 2) {
                $("#turnMsg").text("Waiting for Player 2 to choose");
            } else if (snapshot.val() === 3) { 

            }
        } else if (playerNumber === 2) {
            if (snapshot.val() === 2) {
                $("#turnMsg").text("It's your turn!");
                $("#p2Card").append(p2b1).append(p2b2).append(p2b3);
            } else if (snapshot.val() === 1) {
               
            } if (snapshot.val() === 3) { 

            }
        }
        
        turn = snapshot.val();
        
    }

})

database.ref("/users/p2/choice").on("value", function(snapshot) {

})

$(document).on("click", ".p1-choices", function (event) {
    var p1Choice = $(this).attr("data-choice");
    database.ref("/users/p1/choice").set(p1Choice);
    turn++;
    database.ref("/gameRules/turn").set(turn);
    $(".p1-choices").remove();
    var choice = $("<h1>").text(p1Choice);
    $("#p1Card").append(choice);
});

$(document).on("click", ".p2-choices", function (event) {
    var p2Choice = $(this).attr("data-choice");
    database.ref("/users/p2/choice").set(p2Choice);
    turn++;
    database.ref("/gameRules/turn").set(turn);
    $(".p2-choices").remove();
    var choice = $("<h1>").text(p2Choice);
    $("#p2Card").append(choice);
});