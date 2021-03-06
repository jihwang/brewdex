// uploads an image given a file and a path
function uploadImage(file, path){
  path.put(file).then(function(snapshot) {
    console.log('Uploaded a blob or file!');
    downloadProfilePic();
  }).catch(function(error) {
    alert(error.message);
  });
}

// Inserts an image from firebase
function downloadImage(id, path){
  path.getDownloadURL().then(function(url) {
    // `url` is the download URL for 'images/stars.jpg'

    // Or inserted into an <img> element:
    var img = $(id)[0];
    console.log(id);
    img.src = url;
    console.log(url);
  }).catch(function(error) {
    // Handle any errors
  });
}


// uploads an image from firebase
function uploadProfilePic() {
  // Get a reference to the storage service, which is used to create references in your storage bucket
  var storage = firebase.storage();

  // Create a storage reference from our storage service
  var profilePicsRef = storage.ref().child('profilePics');
  var uid = firebase.auth().currentUser.uid;
  var userRef = profilePicsRef.child(uid);
  var file = $("#profileUpload")[0].files[0];
  console.log(file);
  uploadImage(file, userRef);
}

// downloads an image from firebase
function downloadProfilePic() {
  // Get a reference to the storage service, which is used to create references in your storage bucket
  var storage = firebase.storage();

  // Create a storage reference from our storage service
  var profilePicsRef = storage.ref().child('profilePics');
  var uid = firebase.auth().currentUser.uid;
  var userRef = profilePicsRef.child(uid);
  downloadImage('#profilePic', userRef)
}

function updateBio(){
  var uid = firebase.auth().currentUser.uid;
  text = $("#bioText").val();
  if(text == null || text.length < 1) {
    alert("Enter a bio first");
    return;
  }
  firebase.database().ref('userBio/').child(uid).set({
    bio: text
  });
  displayBio(text);
}


// Gets user bio from firebase
function readBio() {
  var uid = firebase.auth().currentUser.uid;
  var userRef = firebase.database().ref('/userBio/').child(uid);
  return userRef.once('value').then(function(snapshot) {
    if(snapshot.val()) {
      displayBio(snapshot.val().bio);
    } else {
      displayBio("Add a bio here!");
    }
  });
}

// Deletes bio from fire base and current DOM
function deleteBio() {
  var uid = firebase.auth().currentUser.uid;
  var userRef = firebase.database().ref('/userBio/').child(uid);
  userRef.remove()
  .then(function() {
    displayBio("Add a bio!");
    alert("Successfully updated bio!")
    console.log("Remove succeeded.");
  })
  .catch(function(error) {
    console.log("Remove failed: " + error.message);
  });
}

// Displays a bio onto the DOM
function displayBio(text) {
  console.log(text);
  $("#bioText").val(text);
}

// Gets the current user's credentials
function getCredentials(password) {
  const user = firebase.auth().currentUser;
  return credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password
  );
}

// Validates two passwords
function validatePassword(password, password2) {
  if(password.length < 5) {
    $("#registerPassword").animate({border: '2px red'}, "fast");
    return "Password must be greater than 5 characters\n";
  }
  if(password != password2) {
    $("#registerPassword2").animate({border: '2px red'}, "fast");
    return "Passwords do not match\n";
  }
  return "";
}

// Validates an email
function validateEmail(email) {
  var re = /\S+@\S+/
  //re.test(email)
  if(true) {
    return "";
  } else {
    return "Enter a valid email";
  }
}

// Updates a name to firebase
function updateName() {
  var text = prompt("Enter a new name", "ex: John Doe");
  if(text == null || text.length > 0) {
    user = firebase.auth().currentUser
    user.updateProfile({
        displayName: text
    }).then(function() {
        alert("Username sucessfully changed to: " + user.displayName);
        $("#name").html(user.displayName);
        firebase.database().ref('displayName/').child(user.uid).set({
          displayName: user.displayName
        });
    }, function(error) {
      alert(error.message)
    });
  } else {
    alert("User name not changed");
  }
}

// Updates email and/or password to firebase
function updateInfo() {
  // Get the input from user
  const password = $("#newPassword").val();
  const password2 = $("#newPassword2").val();
  const email = $("#newEmail").val();
  const currentPassword = $("#currentPassword").val();

  // validate input
  var error = validatePassword(currentPassword, currentPassword);
  if(error != "") {
    alert(error);
    return;
  }

  const credential = getCredentials(currentPassword);

  // check if user entered input
  if(password.length > 0) {
    error = validatePassword(password, password2);
  }
  if(email.length > 0) {
    error += validateEmail(email);
  }
  // return if any errors so far
  if(error != "") {
      alert(error);
      return;
  }

  // reauth to firebase to update info
  firebase.auth().currentUser.reauthenticate(credential)
    .then(function() { console.log(password);
      // update password user entered one
      if(password.length > 0) {
        firebase.auth().currentUser.updatePassword(password).then(function() {
          // re-signin
          firebase.auth().signInWithEmailAndPassword(firebase.auth().currentUser.email, password).catch(function(error) {
            console.log(error);
            alert(error);
          });
          alert("Changed Password!");
        }).catch(function(error) {
          console.log(error);
          alert(error);
        });
      }
    }).then(function() {
      // updat email if user entered one
      if(email.length > 0) {
        firebase.auth().currentUser.updateEmail(email);
        alert("Changed Email!");
        $("email").text(user.email);
      }
    })
    .catch(function(error) {
      console.log(error);
      alert(error);
  });
}
