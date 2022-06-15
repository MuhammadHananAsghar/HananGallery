// Register Variables
let register = document.getElementById("registerButton");
let registeremail = document.getElementById("remail");
let registerpassword = document.getElementById("rpassword");
let registerconfirmpassword = document.getElementById("rcpassword");

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
function postRegister(email, password) {
  $.ajax({
    url: "/postRegister",
    type: "POST",
    data: {
      email: email,
      password: password
    },
    success: function (response) {
        if(response === "true"){
            success("We have send you a verification email. Also check your spam!", "Authentication!");
            setTimeout(()=>{
                window.location.href = "/";
            }, 2000);
        }
        else{
            error(response, "Authentication!");
        }
    },
    error: function (response) {},
  });
}

// Register Main Function
register.onclick = () => {
  let remvalue = registeremail.value;
  const rpassvalue = registerpassword.value;
  const rconfirmpassvalue = registerconfirmpassword.value;

  if (remvalue <= 0) {
    error("Email field will not be empty.", "Email Error!");
    return;
  } else {
    const tempMail = checkEmail(remvalue);
    if (tempMail) {
      if (remvalue.split("@")[1] === "gmail.com") {
        if (rpassvalue.length <= 0) {
          error("Password field will not be empty.", "Password Error!");
          return;
        } else {
          if (rpassvalue.length < 8) {
            error(
              "Password must not be less than 8 characters.",
              "Password Error!"
            );
            return;
          } else {
            if (rpassvalue != rconfirmpassvalue) {
              error(
                "Password and confirm password must be same.",
                "Password Error!"
              );
              return;
            } else {
              remvalue = remvalue.split("@")[0].replaceAll(".", "")+"@"+remvalue.split("@")[1];
              remvalue = remvalue.replaceAll("+", "");
              postRegister(remvalue, rpassvalue);
            }
          }
        }
      } else {
        error("We only accept (gmail.com) emails.", "Email Validation Error!");
        return;
      }
    }
  }
};
