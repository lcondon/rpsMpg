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


var gameStarted = false;
var hasPlayer1 = false;
var hasPlayer2 = false;
var playerNumber = 0;
var initialTurn = 1;
var turn = 1;
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
        if (hasPlayer1 === false && hasPlayer2 === false) {
            var playerD = database.ref('users/' + "p1");
            playerD.set({
                name: uName,
                choice: "",
                losses: 0,
                wins: 0
            });
            playerNumber = 1;
            $("#nameSubmit").remove();
            $("#welcomeMsg").text("Hi " + uName + "! You are Player 1");
            database.ref("gameRules/").update({
                turn: 1
            });
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
            database.ref("gameRules/").update({
                turn: 1
            });
        } else if (hasPlayer1 === false && hasPlayer2 === true) {
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
            database.ref("gameRules/").update({
                turn: 1
            });
        } else {
            playerNumber = 0;
        }
    }
})

database.ref().on("value", function (snapshot) {
    var playerCount = snapshot.child("users");
    if (playerCount.numChildren() === 0) {
        database.ref("gameRules/").update({
            gameStarted: false,
            turn: 0
        });
    } else if (playerCount.numChildren() === 1) {
        for (var key in playerCount.val()) {
            console.log(key);
            if (key == "p1") {
                $("#P1").text(snapshot.child("users").child("p1").child("name").val());
                hasPlayer1 = true;
            } else if (key == "p2") {
                hasPlayer2 = true;
                $("#P2").text(snapshot.child("users").child("p2").child("name").val());
            }
        }
        console.log(snapshot.child("users").child("p1").child("name").val());
    } else if (playerCount.numChildren() === 2) {
        $("#P1").text(snapshot.child("users").child("p1").child("name").val());
        $("#P2").text(snapshot.child("users").child("p2").child("name").val());
        hasPlayer1 = true;
        hasPlayer2 = true;
        $("#nameSubmit").remove();
        database.ref("gameRules/").update({
            gameStarted: true
        });
    }
})

// var ref = firebase.database().ref("users");
// ref.onDisconnect().remove();

var gameData = database.ref("/gameRules");
gameData.on("value", function (snapshot) {
    gameStarted = snapshot.child("gameStarted").val();
    if (gameStarted === true && playerNumber !== 0) {
        if (playerNumber === 1) {
            if (snapshot.child("turn").val() === 1) {
                $("#turnMsg").text("It's your turn!");
                $("#p1Card").append(p1b1).append(p1b2).append(p1b3);
            } else if (snapshot.child("turn").val() === 2) {
                $("#turnMsg").text("Waiting for Player 2 to choose");
            } else if (snapshot.child("turn").val() === 3) {

            }
        } else if (playerNumber === 2) {
            if (snapshot.child("turn").val() === 2) {
                $("#turnMsg").text("It's your turn!");
                $("#p2Card").append(p2b1).append(p2b2).append(p2b3);
            } else if (snapshot.child("turn").val() === 1) {

            } if (snapshot.child("turn").val() === 3) {

            }
        }
        turn = snapshot.child("turn").val();
    }

})

$(document).on("click", ".p1-choices", function () {
    var p1Choice = $(this).attr("data-choice");
    database.ref("/users/p1/choice").set(p1Choice);
    turn++;
    database.ref("/gameRules").update({
        turn: turn
    });
    $("#p1Card").empty();
    var choice = $("<h1>").text(p1Choice);
    $("#p1Card").append(choice);
});

$(document).on("click", ".p2-choices", function () {
    var p2Choice = $(this).attr("data-choice");
    database.ref("/users/p2/choice").set(p2Choice);
    turn++;
    database.ref("/gameRules").update({
        turn: turn
    });
    $("#p2Card").empty();
    var choice = $("<h1>").text(p2Choice);
    $("#p2Card").append(choice);
});