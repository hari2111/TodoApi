var express=require('express');
var bodyParser=require('body-parser');
var app=express();
var PORT=process.env.PORT || 3000;
var todoNextid=1;
var _ =require('underscore');
var db=require('./db.js');

app.use(bodyParser.json());

var todos = [];
app.get('/',function (req,res) {
	res.send('TODO API');
});
app.get('/todos',function(req,res){
	var queryParams=req.body;
	var filteredTodos=todos;
	if(queryParams.hasOwnProperty('completed') && queryParams.completed ==='true'){
		filteredTodos=_.where(filteredTodos,{completed:true});
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed==='false'){
		filteredTodos=_.where(filteredTodos,{completed:false});
	}
	res.json(filteredTodos);
});
app.get('/todos/:id', function(req,res){
	var todoId=parseInt(req.params.id,10);//converts string to number
	db.todo.findById(todoId).then(function(todo){
		if(!!todo){
		res.json(todo);//res.json(todo.toJSON) for wat reason
					}else{res.status(404).send()}
	},function(e){
		res.status(500).json(e);
	});
});
//POST
app.post('/todos',function(req,res){
	var body=_.pick(req.body,'description','completed');
	 //  if(!_.isBoolean(body.completed) || _.isString(body.description) || body.description===0) {
	
	db.todo.create(body).then(function(todo){
		res.json(todo);
	},function(e){
		res.status(400).json(e);
	});

		
});
//Delete
 app.delete('/todos/:id',function(req,res){
 	var todoId=parseInt(req.params.id,10);
	var matchedtodo=_.findWhere(todos,{id:todoId});
	if(!matchedtodo){
		return res.status(404).send('not found');
	}else{
	todos=_.without(todos,matchedtodo);
 	res.json(matchedtodo);
		}
});
//put
app.put('/todos/:id',function(req,res){
	var todoId=parseInt(req.params.id,10);
	var matchedtodo=_.findWhere(todos,{id:todoId});
	if(!matchedtodo){res.status(404).send('no id found');}
	var body=_.pick(req.body,'description','completed');
	var Attribute={};
	var m=body.completed
	console.log("value of m is :" +m);
	if(body.hasOwnProperty('completed')){
		Attribute.completed=body.completed;
		console.log('level 1 done :' + Attribute.completed);}
	else if(body.hasOwnProperty('completed')){
		console.log('value of boolean in put req :' +_.isBoolean(body.completed));
	 	return res.status(404).send('it is not a boolean');
 	}
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.length>0) {
	
		Attribute.description=body.description;
	}else if(body.hasOwnProperty('description')){
		return res.status(400).send('it is either a string or no length');
	}
			_.extend(matchedtodo,Attribute);
			res.json(matchedtodo);
});

db.sequelize.sync().then(function(){
app.listen(PORT,function(){
	console.log('Express listening on '+PORT+ '!');
});
});

