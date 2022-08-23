var nameNode = document.getElementById("name");
var emailNode = document.getElementById("email");
var passwordNode = document.getElementById("password");
var signupBtnNode = document.getElementById("signUpBtn");

signupBtnNode.addEventListener("click" , function(){
  if(emailNode.value != "" && passwordNode.value != "" && nameNode.value != ""){

    var name = nameNode.value;
    var email = emailNode.value;
    var password = passwordNode.value;

    var request = new XMLHttpRequest();
    request.open("post" , "/postSignupData");
    request.setRequestHeader("Content-type" , "application/json");

    request.send(JSON.stringify({
      name : name,
      username : email,
      password : password,
    }))

    request.addEventListener("load" , function(){

      if(request.responseText == "yes"){
        alert("User already exists! Please use a different email!");
      }else{
        window.open("/login.html","_self")
      }

    })

  }else{
    alert("Enter Valid Credentials");
  }
})
