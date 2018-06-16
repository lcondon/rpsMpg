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

var who = "";

database.ref().set({
    users: {}
})


function insertChat(who, text) {
    if (who == "p1") {
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
            insertChat("p1", text);
            $("#userMessage").val('');
        }
    }
})

$("#subButton").on("click", function (event) {
    event.preventDefault();
    var text = $("#userMessage").val().trim();
    if (text !== "") {
        insertChat("p2", text);
        $("#userMessage").val('');
    }
})



var hasPlayer1 = false;
var hasPlayer2 = false;

$("#userButton").on("click", function (event) {
    event.preventDefault();
    var uName = $("#userName").val().trim();
    if (uName !== "") {
        if (hasPlayer1 === false) {
            var playerD = database.ref('users/' + "p1");
            playerD.set({
                name: uName,
                player: "p1",
                losses: 0,
                wins: 0
            });
            playerD.on("value", function (snapshot) {
                console.log(snapshot.val());
            });
            hasPlayer1 = true;
            firebase.auth().currentUser.updateProfile({
                displayName: "p1"
            });
        } else if (hasPlayer1 === true && hasPlayer2 === false) {
            var playerD = database.ref('users/' + "p2");
            playerD.set({
                name: uName,
                player: "p2",
                losses: 0,
                wins: 0
            });
            playerD.on("value", function (snapshot) {
                console.log(snapshot.val());
            });
            hasPlayer2 = true;
            firebase.auth().currentUser.updateProfile({
                displayName: "p2"
            });
        }
    }
})