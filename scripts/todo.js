var inputBox = document.getElementById("text");
var todoList = document.getElementById("todoContainer");
var logoutBtn = document.getElementById("logoutBtn");
var heading = document.getElementById("heading");

setHeading();

getData();

function setHeading(){
  var request = new XMLHttpRequest();
  request.open("get" , "/currentUserDetails");
  request.send();

  request.addEventListener("load" , function(){
    var data = JSON.parse(request.responseText);
    heading.innerText = `Hello ${data.name}`;
  })

}

function getData(){
  var request = new XMLHttpRequest();
  request.open("get" , "/getTodo");
  request.send();
  var serverData;

  request.addEventListener("load" , function(){
    serverData = JSON.parse( request.responseText);

    serverData.forEach(function(ob){
      createTodo(ob);
    })

  })

}

logoutBtn.addEventListener("click", function(){
  var request = new XMLHttpRequest();
  request.open("post" , "/logout");
  request.setRequestHeader("content-type" , "application/json");
  request.send();

  request.addEventListener("load" , function(){
    console.log("Logged out successfully");
  });

  window.open("/" , "_self");

});


inputBox.addEventListener("keyup" , eventHandler);

function eventHandler(event){
    var key = event.key;
    var value = inputBox.value;

    if(key === "Enter" && value !== " "){

        event.preventDefault();
        postData(value);
        inputBox.value = "";

    }

}

function postData(enteredValue){

  var request = new XMLHttpRequest();
  request.open("post" , "/save");
  request.setRequestHeader("Content-type" , "application/json");

  var todoObject = {
    todo : enteredValue
  };

  request.send(JSON.stringify(todoObject));

  request.addEventListener("load" , function(){
    createTodo(todoObject);
  })

}

function createTodo(todoObject){

  var todoContainer = document.createElement("div");
  todoContainer.setAttribute("class" , "todo");

  var taskName = document.createElement("p");
  taskName.innerHTML = todoObject.todo;

  var deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";

  deleteButton.addEventListener("click" , function(){
    var todoName = todoObject.todo;
    var subParent = deleteButton.parentElement;
    var parent = subParent.parentElement;

    parent.removeChild(subParent);
    deleteFromServer(todoName);

  })

  var editButton = document.createElement("button");
  editButton.innerText = "Edit";

  editButton.addEventListener("click" , function(){

    var newValue = prompt("Enter New Value : ");
    taskName.innerHTML = newValue;

    editInServer(todoObject.todo , newValue);

  })

  todoContainer.appendChild(taskName);
  todoContainer.appendChild(deleteButton);
  todoContainer.appendChild(editButton);

  todoList.appendChild(todoContainer);

}

function deleteFromServer(todoName){

  var request = new XMLHttpRequest();
  request.open("post" , "/deleteTodo");
  request.setRequestHeader("Content-type" , "application/json");
  request.send(JSON.stringify({text : todoName}));

  request.addEventListener("load" , function(){
    console.log("Delete Request Sent");
  });


}

function editInServer(todoName , newValue){

  var request = new XMLHttpRequest();
  request.open("post" , "/editTodo");
  request.setRequestHeader("Content-type" , "application/json");
  request.send(JSON.stringify({
    text : todoName,
    value : newValue
  }));

  request.addEventListener("load" , function(){
    console.log("Edit Request Sent");
  });


}
