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
var tMinutes;
var tName;

// Current Time
var displayTimeNow = setInterval(function () {
  var currentTime = moment();
  if(currentTime.isAfter(displayTimeNow)){
    $('#time').html(currentTime.format("ddd, MMMM Do YYYY HH:mm:ss"))
    $('#', tName).html(tMinutes);
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
  // Store everything into a variable.
  tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  // Calculate the minutes until arrival using hardcore math
  // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
  // and find the modulus between the difference and the frequency.
  var differenceTimes = moment().diff(moment(tFirstTrain, "kk:mm"), "minutes");
  var tRemainder = moment().diff(moment(tFirstTrain, "kk:mm"), "minutes") % tFrequency;
  tMinutes = tFrequency - tRemainder;

  // To calculate the arrival time, add the tMinutes to the currrent time
  var tArrival = moment().add(tMinutes, "minutes").format("HH:mm")
  $('<tr>').append(
    $('<th>').html(tName),
    $('<th>').html(tDestination),
    $('<th>').html(tFrequency),
    $('<th>').html(tArrival),
    $('<th>').html(tMinutes).attr('id', tName)
  ).appendTo('#train-data');

});
