function writeReview(){firebase.auth().onAuthStateChanged(function(a){if(a){var b=a.uid;a.displayName;url=window.location.href,currentLocation=url.split("/").pop(),currLocation=currentLocation.split(".")[0];var d=$("#review").val(),f={uid:b,review:d,location:currLocation},g=firebase.database().ref("reviews/").child("reviews").push().key,h={};h["/"+currLocation+"/"+g]=f,h["/user-reviews/"+b+"/"+g]=f,firebase.database().ref().update(h);var i=document.getElementById("textForm");i.reset()}else console.log("User is not verified - writeReview()")})}function updateReview(){firebase.auth().onAuthStateChanged(function(a){if(a){var b=a.uid;a.displayName;url=window.location.href,currentLocation=url.split("/").pop(),currLocation=currentLocation.split(".")[0];var d=$("#dropdown option:selected").text(),e=$("#dropdown option:selected").attr("id"),f=prompt("Would you like to update your review?",d),g=firebase.database().ref(currLocation+"/").child(e);g.update({review:f});var h=firebase.database().ref("user-reviews/").child(b).child(e);h.update({review:f}),location.reload()}else console.log("User is not verified - writeReview()")})}function displayReview(){firebase.auth().onAuthStateChanged(function(a){if(a){var b=a.displayName;url=window.location.href,currentLocation=url.split("/").pop(),currLocation=currentLocation.split(".")[0];var c=firebase.database().ref(currLocation);c.limitToLast(1).once("child_added",function(a){var c=document.querySelector("#reviewRow"),d=c.content.querySelectorAll("td");d[0].textContent=b,d[1].textContent=a.val().review;var e=document.querySelector("tbody"),f=document.importNode(c.content,!0);e.appendChild(f);var g=document.querySelector("#deleteRow"),f=g.content.cloneNode(!0),h=f.querySelectorAll("option");h[0].id+=a.val().uid,h[0].innerHTML=a.val().review,g.parentNode.appendChild(f)})}})}function deleteReview(){firebase.auth().onAuthStateChanged(function(a){if(a){var b=a.uid;a.displayName;url=window.location.href,currentLocation=url.split("/").pop(),currLocation=currentLocation.split(".")[0];var d=$("#dropdown option:selected").attr("id"),e=firebase.database().ref(currLocation+"/").child(d),f=firebase.database().ref("user-reviews/").child(b).child(d);e.remove(),f.remove(),location.reload()}else console.log("User is not verified - deleteReview()")})}