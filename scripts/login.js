var username = document.getElementById("email");
var password = document.getElementById("password");
var loginBtnNode = document.getElementById("loginBtn");

loginBtnNode.addEventListener("click" , function(){
     if(username.value && password.value){
       var request = new XMLHttpRequest();
       request.open("post" , "/login");
       request.setRequestHeader("Content-type" , "application/json");
       request.send(JSON.stringify({
         username : username.value,
         password : password.value
       }));

       request.addEventListener("load" , function(){
         if(request.status === 200){
           window.location.href = "/";
         }else{
           alert("Invalid Credentials!");
         }
       })

       username.value = "";
       password.value = "";

     }else{
       alert("Enter Valid Credentials");
     }
})