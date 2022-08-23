const db = require("./database");
const userModel = require("./database/models/users");
const todoModel = require("./database/models/todos");

const express = require('express')
const fs = require('fs')
const app = express()
var session = require('express-session')
const port = process.env.PORT || 3000;

db.start();

app.use(express.static("todo"));
app.use(express.static("scripts"));
app.use(express.static("css"));
app.use(express.json());


app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true
}))


app.get('/', (req, res) => {

	if(req.session.isLoggedIn){
		res.sendFile(__dirname + "/todo/todo.html");
	}else{
		res.redirect("/login.html");
	}

})

app.get("/currentUserDetails" , function(req,res){
	res.end(JSON.stringify(req.session.loggedInUser));
})

app.post("/login" , function(req,res){

	var username = req.body.username;
	var password = req.body.password;

	loginUser(username , password , function(user){
		if(user){
				req.session.isLoggedIn = true;
				req.session.loggedInUser = user;
				res.status(200);
				res.end("Login Success");
			}else{
				res.status(404);
				res.end("Login Failed");
			}
	})
})

function loginUser(username , password , callback){

	userModel.findOne({username : username , password : password}).then(function(user){
		callback(user);
	})
}

app.post("/postSignupData" , function(req,res){
	var user = {
		name : req.body.name,
		username : req.body.username,
		password : req.body.password,
	}

	signUpUser(user , function(){
		res.status(200);
		res.end("Sign Up Successful");
	})

})

function signUpUser(user , callback){
	userModel.create(user , function(err){
		callback();
	})
}

app.post("/logout" , function(req,res){
	req.session.destroy();
	res.redirect("/");
})

app.post("/save" , function(req , res){

	var todo = {
		todo : req.body.todo,
		userID : req.session.loggedInUser._id
	}

	saveToDatabase(todo , function(){
		res.end();
	})

})

function saveToDatabase(todo , callback){
	todoModel.create(todo , function(err){
		callback();
	})
}

app.get("/getTodo" , function(req,res){

	getTodos(req.session.loggedInUser._id , function(todos){
		res.end(JSON.stringify(todos));
	})

})

function getTodos(userID , callback){
	todoModel.find({userID : userID}).then(function(todos){
		callback(todos);
	})
}

app.post("/deleteTodo" , function(req,res){
	var todo = {
		text : req.body.text,
		userID : req.session.loggedInUser._id
	}

	deleteTodo(todo , function(){
		res.end();
	})

})

function deleteTodo(todo , callback){

	todoModel.deleteOne({todo : todo.text , userID : todo.userID} , function(err){
		callback();
	})

}

app.post("/editTodo" , function(req,res){

	var todo = {
		userID : req.session.loggedInUser._id,
		todo : req.body.text,
		newValue : req.body.value
	}

	editTodo(todo , function(){
		res.end();
	})

})

function editTodo(todo , callback){

	todoModel.updateOne({todo : todo.todo , userID : todo.userID} , {$set : {todo : todo.newValue}}).then(function(){
		callback();
	})

}

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
