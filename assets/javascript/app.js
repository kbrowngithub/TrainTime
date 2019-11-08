// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the trains database.
// 4. Create a way to calculate the next arrival and minutes away values. Using frequency, current time, and first train time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Minutes away


// Assume the following situations.

// (TEST 1)
// First Train of the Day is 3:00 AM
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first): currentTime + (3minutes - (currentTime mod 3minutes))
// It would be 3:18 -- 2 minutes away

// (TEST 2)
// First Train of the Day is 3:00 AM
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)  currentTime + (3minutes - (currentTime mod 3minutes))
// It would be 3:21 -- 5 minutes away


// ==========================================================

// Solved Mathematically
// Test case 1:
// 16 - 00 = 16
// 16 % 3 = 1 (Modulus is the remainder)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically
// Test case 2:
// 16 - 00 = 16
// 16 % 7 = 2 (Modulus is the remainder)
// 7 - 2 = 5 minutes away
// 5 + 3:16 = 3:21

// Assumptions
var tFrequency = 3;

// Time is 3:30 AM
var firstTime = "03:30";

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFrequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

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

    firstTrain = moment(firstTrain, "hh:mm");
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
    nextArrival = moment(nextArrival).format("hh:mm");
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
