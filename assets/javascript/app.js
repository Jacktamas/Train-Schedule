
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAwvKHTkC5EzSTtk9b1XEJfS4nm6-VkFTY",
  authDomain: "train-schedule-aa007.firebaseapp.com",
  databaseURL: "https://train-schedule-aa007.firebaseio.com",
  projectId: "train-schedule-aa007",
  storageBucket: "train-schedule-aa007.appspot.com",
  messagingSenderId: "986152023067"
};

firebase.initializeApp(config);



//Set our variables
var database = firebase.database();
var name = '';
var destination = '';
var firstTrain;
var frequency;

// Current Time
var displayTimeNow = setInterval(function () {
  var currentTime = moment();
  if(currentTime.isAfter(displayTimeNow)){
    $('#time').html(currentTime.format("ddd, MMMM Do YYYY HH:mm:ss"));
  }
} ,1000);
//Add Train event handler
$('#add-train').on('click', function(){
  event.preventDefault();
  name = $('#train-name').val().trim();
  destination = $('#train-destination').val().trim();
  firstTrain = $('#first-train-time').val().trim();
  frequency = $('#train-frequency').val().trim();

  var train = {
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  }
  database.ref(name).set(train);
  $('#train-name, #train-destination, #train-frequency, #first-train-time').val('');
  return false;
});

database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val())
  // Store everything into a variable.
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  // Calculate the minutes until arrival using hardcore math
  // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
  // and find the modulus between the difference and the frequency.
  var differenceTimes = moment().diff(moment(tFirstTrain, "kk:mm"), "minutes");
  console.log('differenceTimes-->>', differenceTimes)
  var tRemainder = moment().diff(moment(tFirstTrain, "kk:mm"), "minutes") % tFrequency;
  console.log('tRemainder', tRemainder)
  var tMinutes = tFrequency - tRemainder;
  console.log('tMinutes-->', tMinutes)


  // To calculate the arrival time, add the tMinutes to the currrent time
  var tArrival = moment().add(tMinutes, "minutes").format("HH:mm")
  console.log('arrival', tArrival)

  $('<tr>').append(
    $('<th>').html(tName),
    $('<th>').html(tDestination),
    $('<th>').html(tFrequency),
    $('<th>').html(tArrival),
    $('<th>').html(tMinutes).addClass(tName)
  ).appendTo('#train-data');


  var  minutesAway = setInterval(function () {
    var min = moment(tMinutes);
    if(min.isAfter(minutesAway)){
      $('.'+tName).html(min.format("mm"));
    }
  } ,1000);



});


/*
// 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {

console.log(childSnapshot.val());

// Store everything into a variable.
var tName = childSnapshot.val().name;
var tDestination = childSnapshot.val().destination;
var tFrequency = childSnapshot.val().frequency;
var tFirstTrain = childSnapshot.val().firstTrain;

// Calculate the minutes until arrival using hardcore math
// To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
// and find the modulus between the difference and the frequency.
var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
var tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency;
var tMinutes = tFrequency - tRemainder;

// To calculate the arrival time, add the tMinutes to the currrent time
var tArrival = moment().add(tMinutes, "m").format("hh:mm A");

console.log(tMinutes);
console.log(tArrival);
console.log(moment().format("hh:mm A"));
console.log(tArrival);
console.log(moment().format("X"));

// Add each train's data into the table
$("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>"
+ tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
});
*/
