let text = document.getElementById("text");
let updatebutton = document.getElementById("updatebutton");

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

// Post Data
function postProfile(name) {
  $.ajax({
    url: "/postProfile",
    type: "POST",
    data: {
      name: name
    },
    success: function (response) {
        if(response == "true"){
            success("Profile updated.", "Profile!");
            setTimeout(()=>{
                window.location.href = "/main";
            }, 2000);
        }
        if(response == "false"){
            success("Error in updating profile.", "Profile!");
            setTimeout(()=>{
                window.location.href = "/profile";
            }, 2000);
        }
    },
    error: function (response) {},
  });
}

updatebutton.onclick = () => {
    let textValue = text.value;
    if(textValue <= 0){
        error("Name must not be empty.", "Profile!");
        return;
    }else{
        postProfile(textValue);
    }
}
