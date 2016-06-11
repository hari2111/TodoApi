var express=require('express');
var bodyParser=require('body-parser');
var app=express();
var PORT=process.env.PORT || 3000;
var todoNextid=1;

app.use(bodyParser.json());

var todos = [];

app.get('/',function (req,res) {
	res.send('TODO API');
});
app.get('/todos',function(req,res){
	res.json(todos);
});
app.get('/todos/:id', function(req,res){
	var todoId=parseInt(req.params.id,10);//converts string to number
	var matchedtodo;

	todos.forEach(function(todo){
		if(todoId===todo.id){
			matchedtodo=todo;
		}
	});
	if(matchedtodo){
		res.json(matchedtodo);
	}else {
		res.status(404).send();
	}
});
//POST
app.post('/todos',function(req,res){
	var body=req.body;
	body.id=todoNextid++;
	todos.push(body);
	res.json(body);
});

app.listen(PORT,function(){
	console.log('Express listening on '+PORT+ '!');
});