let upload = document.getElementById("upload");
let uploadimage = document.getElementById("uploadimage");
let imgInp = document.getElementById("imgInp");
let uploadIcon = document.getElementById("uploadIcon");
let previewImg = document.getElementById("previewImg");
let overlay = document.getElementById("overlay");
let hidepopup = document.getElementById("hidepopup");
let popup = document.getElementById("popup");
var image;

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

// Image Validation
function isValidPhoto(fileName) {
  var allowed_extensions = new Array("jpg", "png", "jpeg");
  var file_extension = fileName.split(".").pop().toLowerCase();

  for (var i = 0; i <= allowed_extensions.length; i++) {
    if (allowed_extensions[i] == file_extension) {
      return true; // valid file extension
    }
  }

  return false;
}

upload.onclick = () => {
  popup.className = "popupshow";
};
hidepopup.onclick = () => {
  popup.className = "popup";
};
imgInp.addEventListener("change", function () {
  changeImage(this);
});
uploadimage.onclick = () => {
  imgInp.click();
};

function changeImage(input) {
  var reader;

  if (input.files && input.files[0]) {
    const name = input.files[0].name;
    let valid = isValidPhoto(name);
    if (valid) {
      uploadIcon.style.display = "none";
      reader = new FileReader();

      reader.onload = function (e) {
        image = e.target.result;
        previewImg.setAttribute("src", e.target.result);
        previewImg.style.display = "block";
        // console.log(e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    } else {
        error("We only accept .jpg, .png and .jpeg images.", "Image Related!");
        return;
    }
  }
}

previewImg.onclick = () => {
  previewImg.style.display = "none";
  uploadIcon.style.display = "flex";
  image = null;
};

// Post Data
function postImage(image) {
  Loader.open();
  popup.className = "popup";
  $.ajax({
    url: "/postImage",
    type: "POST",
    data: {
      image: image
    },
    success: function (response) {
        if(response === "true"){
            success("Image Uploaded Successful", "Image Upload!");
            Loader.close();
            setTimeout(() => {
                window.location.href = "/main";
            }, 2000);
            return;
        }else{
            alert(response);
            error("Error in the server. Try Again.", "Image Upload!")
            return;
        }
    },
    error: function (response) {},
  });
}

// Upload Methods
let pbutton = document.getElementById("pbutton");
pbutton.addEventListener('click', () => {
    if(image == null){
        error("Select image first.", "Image Related!");
        return;
    }
    postImage(image);
});

//Search
document.getElementById("search").addEventListener("input", filterImages);

function filterImages(){
    const search = document.getElementById("search");
    const filter = search.value.toLowerCase();
    const images = document.querySelectorAll(".gallery-item");

    images.forEach((item) => {
        let text = item.getAttribute("author").toLowerCase();
        if(text.includes(filter)){
            item.style.display = '';
        }else{
            item.style.display = "none";
        }
    });
}