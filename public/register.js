var socket = io.connect('http://localhost:3000');


// prompts the user to specify a user name
function message() {
  var person = prompt("Please enter your name");
  var name = person;
  if (person == null || person == "") {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      name += possible.charAt(Math.floor(Math.random() * possible.length));
  }  

  return name;
}

var name = message();


// ask the server to register that user
// will just take ownership if already registered
socket.emit('register_request', name);


// redirect to /<name>
socket.on('register_response', (res) => {
  window.location = "/" + name;
});

