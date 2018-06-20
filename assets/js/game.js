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

$("#subButton").on("click", function (event) {
    event.preventDefault();
    var text = $("#userMessage").val().trim();
    if (text !== "") {
        $("#userMessage").val('');
        database.ref("chats/").push({
            player: name + ": ",
            chat: text,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    }
})

var chatBox = database.ref("chats/");
chatBox.on("child_added", function (snapshot) {
    console.log(snapshot.val());
    var chat = $("<p>").html(snapshot.val().player + snapshot.val().chat + "<br>")
    $("#msgC").append(chat);
})


var gameStarted = false;
var hasPlayer1 = false;
var hasPlayer2 = false;
var playerNumber = 0;
var initialTurn = 1;
var turn;
var player1Choice;
var player2Choice;
var p1Name;
var p2Name;
var name;
var p1Wins = 0;
var p2Wins = 0;

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
            name = uName;
            playerNumber = 1;
            $("#nameSubmit").remove();
            $("#welcomeMsg").text("Hi " + uName + "! You are Player 1");
        } else if (hasPlayer1 === true && hasPlayer2 === false) {
            var playerD = database.ref('users/' + "p2");
            playerD.set({
                name: uName,
                choice: "",
                losses: 0,
                wins: 0
            });
            name = uName;
            playerNumber = 2;
            $("#nameSubmit").remove();
            $("#welcomeMsg").text("Hi " + uName + "! You are Player 2");
        } else if (hasPlayer1 === false && hasPlayer2 === true) {
            var playerD = database.ref('users/' + "p1");
            playerD.set({
                name: uName,
                choice: "",
                losses: 0,
                wins: 0
            });
            console.log();
            name = uName;
            playerNumber = 1;
            $("#nameSubmit").remove();
            $("#welcomeMsg").text("Hi " + uName + "! You are Player 1");
        } else {
            playerNumber = 0;
        }
    }
})

var userData = database.ref("users");
userData.on("value", function (snapshot) {
    var playerCount = snapshot.numChildren();
    console.log(snapshot.numChildren());
    if (playerCount === 0) {
        database.ref("gameRules/").update({
            gameStarted: false
        });
    } else if (playerCount === 1) {
        for (var key in snapshot.val()) {
            console.log(key);
            if (key == "p1") {
                $("#P1").text(snapshot.child("p1").child("name").val());
                hasPlayer1 = true;
            } else if (key == "p2") {
                hasPlayer2 = true;
                $("#P2").text(snapshot.child("p2").child("name").val());
            }
        }
        console.log(snapshot.child("p1").child("name").val());
    } else if (playerCount === 2) {
        $("#P1").text(snapshot.child("p1").child("name").val());
        $("#P2").text(snapshot.child("p2").child("name").val());
        hasPlayer1 = true;
        hasPlayer2 = true;
        p1Name = snapshot.child("p1").child("name").val();
        p2Name = snapshot.child("p2").child("name").val();
        $("#nameSubmit").remove();
        database.ref("gameRules/").update({
            gameStarted: true
        });
    }
})

database.ref("chats").onDisconnect().remove();

var ref = database.ref("users");
ref.onDisconnect().remove();

var ref1 = database.ref("gameRules");
ref1.onDisconnect().update({
    gameStarted: false,
    turn: 0
})

var gameStart = database.ref("/gameRules/gameStarted");
gameStart.on("value", function (snapshot) {
    gameStarted = snapshot.val();
    if (gameStarted == true) {
        database.ref("gameRules/").update({
            turn: 1
        });
    }
})


var gameData = database.ref("/gameRules/turn");
gameData.on("value", function (snapshot) {
    turn = snapshot.val();
    console.log(snapshot.val())
    if (gameStarted === true && playerNumber !== 0) {
        if (playerNumber === 1) {
            if (snapshot.val() === 1) {
                $("#p1Card").empty();
                $("#p2Card").empty();
                $("#results").empty();
                $("#turnMsg").text("It's your turn!");
                $("#p1Card").append(p1b1).append(p1b2).append(p1b3);
            } else if (snapshot.val() === 2) {
                $("#turnMsg").text("Waiting for Player 2 to choose");
            } else if (snapshot.val() === 3) {
                setTimeout(reset, 5000)
            }
        } else if (playerNumber === 2) {
            if (snapshot.val() === 2) {
                $("#turnMsg").text("It's your turn!");
                $("#p2Card").append(p2b1).append(p2b2).append(p2b3);
            } else if (snapshot.val() === 1) {
                $("#p1Card").empty();
                $("#p2Card").empty();
                $("#results").empty();
            } else if (snapshot.val() === 3) {
                setTimeout(reset, 5000)
            }
        }
    }

})

function reset() {

    database.ref("/gameRules").update({
        turn: 1
    });
}

database.ref("users/p1/choice").on("value", function (snapshot) {
    console.log(snapshot.val());
    player1Choice = snapshot.val();
})

database.ref("users/p2/choice").on("value", function (snapshot) {
    console.log(snapshot.val());
    player2Choice = snapshot.val();
    $("#turnMsg").empty();

    if (player2Choice === "Rock") {
        if (player1Choice === "Rock") {
            var result = $("<h1>").text("It's a tie!");
            $("#results").append(result);
        } else if (player1Choice === "Paper") {
            var result = $("<h1>").text(p1Name + " wins!");
            $("#results").append(result);
            p1Wins++;
        } else if (player1Choice === "Scissors") {
            var result = $("<h1>").text(p2Name + " wins!");
            $("#results").append(result);
            p2Wins++;
        }
        if (playerNumber === 1) {
            database.ref("users/p1").update({
                wins: p1Wins,
                losses: p2Wins
            })
            $("#p1Wins").text(p1Wins);
            $("#p1Losses").text(p2Wins);
            $("#p2Wins").text(p2Wins);
            $("#p2Losses").text(p1Wins);
            $("#p2Card").append($("<h1>").text(player2Choice));
        } else if (playerNumber === 2) {
            database.ref("users/p2").update({
                wins: p2Wins,
                losses: p1Wins
            })
            $("#p1Wins").text(p1Wins);
            $("#p1Losses").text(p2Wins);
            $("#p2Wins").text(p2Wins);
            $("#p2Losses").text(p1Wins);
            $("#p1Card").append($("<h1>").text(player1Choice));
        }
    } else if (player2Choice === "Paper") {
        if (player1Choice === "Rock") {
            var result = $("<h1>").text(p2Name + " wins!");
            $("#results").append(result);
            p2Wins++;
        } else if (player1Choice === "Paper") {
            var result = $("<h1>").text("It's a tie!");
            $("#results").append(result);
        } else if (player1Choice === "Scissors") {
            var result = $("<h1>").text(p1Name + " wins!");
            $("#results").append(result);
            p1Wins++;
        }
        if (playerNumber === 1) {
            database.ref("users/p1").update({
                wins: p1Wins,
                losses: p2Wins
            })
            $("#p1Wins").text(p1Wins);
            $("#p1Losses").text(p2Wins);
            $("#p2Wins").text(p2Wins);
            $("#p2Losses").text(p1Wins);
            $("#p2Card").append($("<h1>").text(player2Choice));
        } else if (playerNumber === 2) {
            database.ref("users/p2").update({
                wins: p2Wins,
                losses: p1Wins
            })
            $("#p1Wins").text(p1Wins);
            $("#p1Losses").text(p2Wins);
            $("#p2Wins").text(p2Wins);
            $("#p2Losses").text(p1Wins);
            $("#p1Card").append($("<h1>").text(player1Choice));
        }
    } else if (player2Choice === "Scissors") {
        if (player1Choice === "Rock") {
            var result = $("<h1>").text(p1Name + " wins!");
            $("#results").append(result);
            p1Wins++;
        } else if (player1Choice === "Paper") {
            var result = $("<h1>").text(p2Name + " wins!");
            $("#results").append(result);
            p2Wins++;
        } else if (player1Choice === "Scissors") {
            var result = $("<h1>").text("It's a tie!");
            $("#results").append(result);
        }
        if (playerNumber === 1) {
            database.ref("users/p1").update({
                wins: p1Wins,
                losses: p2Wins
            })
            $("#p1Wins").text(p1Wins);
            $("#p1Losses").text(p2Wins);
            $("#p2Wins").text(p2Wins);
            $("#p2Losses").text(p1Wins);
            $("#p2Card").append($("<h1>").text(player2Choice));
        } else if (playerNumber === 2) {
            database.ref("users/p2").update({
                wins: p2Wins,
                losses: p1Wins
            })
            $("#p1Wins").text(p1Wins);
            $("#p1Losses").text(p2Wins);
            $("#p2Wins").text(p2Wins);
            $("#p2Losses").text(p1Wins);
            $("#p1Card").append($("<h1>").text(player1Choice));
        }
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
    database.ref("/users/p2/choice").set("");
    database.ref("/users/p2/choice").set(p2Choice);
    turn++;
    database.ref("/gameRules").update({
        turn: turn
    });
    $("#p2Card").empty();
    var choice = $("<h1>").text(p2Choice);
    $("#p2Card").append(choice);
});

