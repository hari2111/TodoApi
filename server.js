var express=require('express');
var app=express();
var PORT=process.env.PORT || 3000;
var todos = [{
	id:1,
	description:'GO sleep',
	completed:false
},{
	id:2,
	description:'get mobile',
	completed:false
}];

app.get('/',function (req,res) {
	res.send('TODO API');
});
app.get('/todos',function(req,res){
	res.json(todos);
});
app.get('/todos/:id', function(req,res){
	var todoId=parseInt(req.params.id,10);
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


app.listen(PORT,function(){
	console.log('Express listening on '+PORT+ '!');
});