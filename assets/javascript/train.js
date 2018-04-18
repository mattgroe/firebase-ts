$(document).ready(function(){
//Initialize Firebase
   
    var config = {
        apiKey: "AIzaSyD9U43iEPQmRl97nNLyZsKp_Zk_e-reTA4",
        authDomain: "train-schedule-106ab.firebaseapp.com",
        databaseURL: "https://train-schedule-106ab.firebaseio.com",
        projectId: "train-schedule-106ab",
        storageBucket: "",
        messagingSenderId: "813608720457"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
   

$("#submit").on("click", function(event){
    event.preventDefault();
    let name = $("#trainName").val().trim();
    let place = $("#destination").val().trim();
    let time = $("#trainTime").val().trim();
    let frequency = $("#frequency").val().trim();

    var userRef = database.ref().child("routes");

    userRef.push().set({
        train: name,
        destination: place,
        time: time,
        frequency: frequency,
       });
    });

    database.ref("routes").on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());
        //set information taken from firebase to newRow in table using JQuery
        let time = childSnapshot.val().time;
        let frequency = childSnapshot.val().frequency;
        
        let timeConverted = moment(time, "hh:mm").subtract(1, "years");
        let currentTime = moment();
        let timeDiff = moment().diff(moment(timeConverted), "minutes");
        let timeRemainder = timeDiff % frequency;

        let tMinTillTrain = frequency - timeRemainder

        let nextTrain = moment().add(tMinTillTrain, "minutes");
        let nextTrainSched = moment(nextTrain).format("hh:mm");
        
        //display new row and append coloumns
        let newRow = $("<tr>");
        let name = $("<td>").html(childSnapshot.val().train);
        let place = $("<td>").html(childSnapshot.val().destination);
        let frequencyDispl = $("<td>").html(childSnapshot.val().frequency);
        let nextTrainDispl = $("<td>").html(nextTrainSched);
        let minAway = $("<td>").html(tMinTillTrain);

        $(newRow)
            .append(name)
            .append(place)        
            .append(frequencyDispl)
            .append(nextTrainDispl)
            .append(tMinTillTrain)
        $(".table").append(newRow);
    })

});