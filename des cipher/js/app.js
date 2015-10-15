jQuery(document).ready(function($) {


  //////////////////////// Initialization
  var baseRef = new Firebase("https://chatcripto.firebaseio.com");
  var messagesRef = baseRef.child("mensajes");
  var userId;

  //get/set the user from local storage
  if (localStorage.getItem('userId') === null) {
    userId = 'user' + parseInt(Math.random() * 1000, 10) + Date.now();
    localStorage.setItem('userId', userId);
  } else {
    userId = localStorage.getItem('userId');
  }
  $("#sysgenerateduserid").text(userId);

  var chatWindow = $("#chatWindow");
  var messageField = $("#mensaje");
  var messageList = $("#messageList");
  var nameField = $("#name");



  //////////////////////// end Initialization 


  //////////////////////// The key enters Management
  //listener for key enter in the keyboard
  messageField.on('keypress', function(e) {
    if (e.keyCode === 13) {
      var nameTmp;

      if (nameField.val() === '') {
        nameTmp = userId;
      } else {
        nameTmp = nameField.val();
      }

      //create the message
      var message = {
        name: nameTmp,
        message: encryptMessage(messageField.val(), "133457799BBCDFF1"),
        userId: userId
      };

      //push the message to the firebase model
      messagesRef.push(message);

      //clear the message field
      messageField.val('');
    }
  });

  //////////////////////// End enter key management


  //////////////////////// Management  message reception
  messagesRef.limitToLast(20).on('child_added', function(snapshot) {
    //GET DATA
    var data = snapshot.val();
    var name = data.name || "anonymous";
    var message = data.message;

    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
    var messageElement = $("<li>");
    var nameElement = $("<label></label>");
    nameElement.text(name);
    messageElement.html(decryptMessage(message,"133457799BBCDFF1") + " - " + message ).prepend(nameElement);

    //ADD MESSAGE
    messageList.append(messageElement)

    //SCROLL TO BOTTOM OF MESSAGE LIST
    chatWindow[0].scrollTop = chatWindow[0].scrollHeight;
  });
});

//////////////////////// end management message reception

  


//////////////////////// Firebase object for comunication
var firebaseManager = (function() {

  var firebaseRef,
    messagesRef,
    userId;

  return {
    init: function(context) {
      // Our endpoint
      firebaseRef = context;

      // Setup some references
      messagesRef = firebaseRef.child("mensajes");

      //gets the user ID
      userId = localStorage.getItem('userId');
    }
  };
  ////////////////////////end object 
})();