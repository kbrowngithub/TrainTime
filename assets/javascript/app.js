//
// Setup our Firebase stuff
//
var config = {
    apiKey: "AIzaSyAXUDMJgHyNTxEtaMl6qMc84UcbycK1jRo",
    authDomain: "testproject-1c481.firebaseapp.com",
    databaseURL: "https://testproject-1c481.firebaseio.com",
    projectId: "testproject-1c481",
    storageBucket: "testproject-1c481.appspot.com",
    messagingSenderId: "831470778727",
    appId: "1:831470778727:web:514569acc68b4714a697c2"
};

firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
// var database = ...
var database = firebase.database();

// Initial Values - these just get us started initially
var name = "Train Name";
var destination = "Somewhere";
var frequency = 0;
var nextArrival;
var minutesAway;
var firstTrain;

// At the page load and subsequent value changes, get a snapshot of the stored data.
// Listens for a new DB child
database.ref("/train").on("child_added", function (snapshot) {
    // Populate table fields
    var sv = snapshot.val();
    console.log("sv = " + JSON.stringify(sv));

    // Console.loging the last user's data
    console.log("database.ref(\"/train\").on(\"child_added\":");
    console.log("sv.name = " + sv.name);
    console.log("sv.destination = " + sv.destination);
    console.log("sv.frequency = " + sv.frequency);
    console.log("sv.nextArrival = " + sv.nextArrival);
    console.log("sv.minutesAway = " + sv.minutesAway);
    console.log("sv.firstTrain = " + sv.firstTrain);

    // Change the HTML to reflect
    var newRow = $("<tr>").append(
        $("<td>").text(sv.name),
        $("<td>").text(sv.destination),
        $("<td>").text(sv.frequency),
        $("<td>").text(sv.nextArrival),
        $("<td>").text(sv.minutesAway)
    );

    // Append the new row to the table
    $("#trainTable > tbody").append(newRow);

}, function (errorObj) {
    console.log("Error code: " + errorObj.code);
});

// database.ref("/train").orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
//     // Change the HTML to reflect
//     var sv = snapshot.val();
//     console.log(sv.name);
//     console.log(sv.destination);
//     console.log(sv.firstTrain);
//     console.log(sv.frequency);


//     var newRow = $("<tr>").append(
//         $("<td>").text(sv.name),
//         $("<td>").text(sv.destination),
//         $("<td>").text(sv.firstTrain),
//         $("<td>").text(sv.frequency)
//     );

//     // Append the new row to the table
//     $("#trainTable > tbody").append(newRow);
// });

// Capture Submit Button Click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    console.log("KB1");
    // Grabbed values from text boxes
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    firstTrain = $("#firstTrain-input").val().trim();

    var firstTrainToTime = moment(firstTrain, "hh:mm").format("HH:mm");
    console.log("firstTrainToTime = " + firstTrainToTime);

    frequency = parseInt(frequency);
    console.log("frequency = " + frequency);

    // Subtacting one year ensures we don't run into a future time
    firstTrain = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log("firstTrain = " + firstTrain);

    // Get the current time
    var now = moment();
    console.log("now = " + now);

    // Calculate minutes since the first train time
    var timeSinceFirstTrain = now.diff(moment(firstTrain), "minutes");
    console.log("timeSinceFirstTrain = " + timeSinceFirstTrain);

    // Calculate the time since last train
    var minutesSinceLastTrain = timeSinceFirstTrain % frequency;
    console.log("minutesSinceLastTrain = " + minutesSinceLastTrain);

    // Subtract time-since-last-train from the frequency to get minutes away
    minutesAway = frequency - minutesSinceLastTrain;
    console.log("minutesAway = " + minutesAway);

    // Format next arrival
    nextArrivalMins = moment().add(minutesAway, "minutes");
    nextArrival = moment(nextArrivalMins).format("HH:mm");
    console.log("ARRIVAL TIME: " + nextArrival);

    // Log values
    console.log("$(\"#add-train\").on(\"click\":");
    console.log("name = " + name);
    console.log("destination = " + destination);
    console.log("frequency = " + frequency);
    console.log("nextArrival = " + nextArrival);
    console.log("minutesAway = " + minutesAway);
    console.log("firstTrain = " + firstTrain);

    // Push the data to Firebase
    database.ref("/train").push({
        name: name,
        destination: destination,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        firstTrain: firstTrainToTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Display success message
    alert("Train added.");

    // Clear out input fields
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-input").val("");
    $("#frequency-input").val("");
});
