// Reset Password Variables
let reset = document.getElementById("resetButton");
let reset_email = document.getElementById("resetemail");

// Toast Functions
function error(text, reason) {
  toastr.error(text, reason);
  setTimeout(() => {
    toastr.remove();
  }, 2000);
}
function success(text, reason) {
  toastr.success(text, reason);
  setTimeout(() => {
    toastr.remove();
  }, 2000);
}
// Validate Email
function checkEmail(email) {
  var filter =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!filter.test(email)) {
    error("Please provide a valid email address.", "Email Validation Error!");
    email.focus;
    return false;
  }
  return true;
}

// Post Data
function postReset(email) {
  $.ajax({
    url: "/resetPass",
    type: "POST",
    data: {
      email: email
    },
    success: function (response) {
        if(response === "true"){
            success("Password reset successful.", "Password Reset!");
            setTimeout(()=>{
                window.location.href = "/resetNotification";
            }, 2000);
        }
        else{
            error(response, "Password Reset!");
        }
    },
    error: function (response) {},
  });
}

reset.onclick = function(){
    let reset_email_value = reset_email.value;
    if (reset_email_value <= 0) {
    error("Email field will not be empty.", "Email Error!");
    return;
  } else {
    reset_email_value = reset_email_value.split("@")[0].replaceAll(".", "")+"@"+reset_email_value.split("@")[1];
    reset_email_value = reset_email_value.replaceAll("+", "");
    postReset(reset_email_value);
  }
}