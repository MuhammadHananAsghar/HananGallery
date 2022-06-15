let upload = document.getElementById("upload");
let uploadimage = document.getElementById("uploadimage");
let imgInp = document.getElementById("imgInp");
let uploadIcon = document.getElementById("uploadIcon");
let previewImg = document.getElementById("previewImg");
let overlay = document.getElementById("overlay");
let hidepopup = document.getElementById("hidepopup");
let popup = document.getElementById("popup");
var image;

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
  //   overlay.style.display = "block";
  popup.className = "popupshow";
};
hidepopup.onclick = () => {
  //   overlay.style.display = "none";
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
      alert("We only accept .jpg, .png and .jpeg images.");
    }
  }
}

previewImg.onclick = () => {
  previewImg.style.display = "none";
  uploadIcon.style.display = "flex";
};


// Upload Methods
let pbutton = document.getElementById("pbutton");
pbutton.addEventListener('click', () => {
    if(image == null){
        alert("Select Image First");
        return;
    }
    console.log(image);
});