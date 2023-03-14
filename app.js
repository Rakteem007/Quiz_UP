//jshint esversion:6
const express=require('express');
const bodyParser=require('body-parser');
const ejs =require('ejs');
const _=require('lodash');
const request=require('request');

var quiz=[];
var options=[];
var index=0;
var correctAnswer="";
var url="";

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));

app.get('/',function(req,res){

    url='https://the-trivia-api.com/api/questions?categories=general_knowledge,geography,history,science,sport_and_leisure&limit=10&difficulty=medium';
    res.render('home');
});

app.get('/quiz',function(req,res){

    quiz=[];
    index=0;
    options=[];

    

     request(url,(error,reponse,body)=>{

      const  data=JSON.parse(body);

      correctAnswer=data[0].correctAnswer;

      for(var i=0;i<data.length;i++){
        quiz.push(data[i]);
      }

      options.push(quiz[index].correctAnswer);
      for(var i=0;i<quiz[index].incorrectAnswers.length;i++){
         options.push(quiz[index].incorrectAnswers[i]);
      }
      options.sort();

      res.render('quiz',{quizQuestion : quiz[index], questionNumber : index+1,questionOptions : options });
      
     });
      
});

app.get('/quiz/:number',function(req,res) {

    options=[];

    correctAnswer=quiz[index].correctAnswer;
     options.push(quiz[index].correctAnswer);
      for(var i=0;i<quiz[index].incorrectAnswers.length;i++){
         options.push(quiz[index].incorrectAnswers[i]);
      }
      options.sort();

      console.log(req.params.number);

      res.render('quiz',{quizQuestion : quiz[req.params.number-1] , questionNumber :req.params.number  , questionOptions : options});
    
});

app.post('/quiz',function(req,res){

    const selectedOption = req.body.option;

    if(selectedOption === correctAnswer){
              index++;
        res.redirect('/success');
    }else{
        res.redirect('/failure')
    }
    
});

app.get('/success',function(req,res){

    res.render('success',{questionNumber : index});
});

app.get('/failure',function(req,res){

    res.render('failure',{questionNumber : index});
});

app.get('/about',function(req,res){

    res.render('about');
})

app.listen(3000,function(){
    console.log("Server is running at 3000");
});