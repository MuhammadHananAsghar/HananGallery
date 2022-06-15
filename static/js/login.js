// Login Variables
let login = document.getElementById("loginButton");
let loginemail = document.getElementById("lemail");
let loginpassword = document.getElementById("lpassword");
let logincheck = document.getElementById("lcheckbox");

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
function postLogin(email, password, checkbox) {
  $.ajax({
    url: "/postlogin",
    type: "POST",
    data: {
      email: email,
      password: password,
      checkbox: checkbox,
    },
    success: function (response) {
        if(response === "true"){
            success("Login successful.", "Authentication!");
            setTimeout(()=>{
                window.location.href = "/main";
            }, 2000);
        }
        else{
            error(response, "Authentication!");
        }
    },
    error: function (response) {},
  });
}

// Login Main Function
login.onclick = () => {
  let emvalue = loginemail.value;
  const passvalue = loginpassword.value;
  const checkvalue = logincheck.checked;

  if (emvalue <= 0) {
    error("Email field will not be empty.", "Email Error!");
    return;
  } else {
    const tempMail = checkEmail(emvalue);
    if (tempMail) {
      if (passvalue.length <= 0) {
        error("Password field will not be empty.", "Password Error!");
        return;
      } else {
        emvalue = emvalue.split("@")[0].replaceAll(".", "")+"@"+emvalue.split("@")[1];
        emvalue = emvalue.replaceAll("+", "");
        postLogin(emvalue, passvalue, checkvalue);
      }
    }
  }
};
