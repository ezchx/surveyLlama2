$(document).ready(function() {

  $("#home").show();
  $("#update").hide();
  $("#surveyHome").hide();
  $("#questions").hide();
  $("#login").hide();
  $("#sign_up_but").html("Sign Up");
  $("#login_but").html("Login");
  $("#survey_but").html("Surveys");
  showFooter();
  
  var activeUserNum = '';
  var surveys = [];
  var questions = [];
  var answers = [];
  var surveysTemp = [];
  var questionsTemp = [];
  var answersTemp = [];




  var users = [
    { userNum: 1, email: "cash@ez-checks.com", password: "codecamp1" },
    { userNum: 2, email: "tom@gmail.com", password: "dogman1" },
    { userNum: 3, email: "mary@yahoo.com", password: "marymary1" }
  ];




  function downloadSurveys() {

    // var surveys = [];
    // var questions = [];
    // var answers = [];

    $.ajax({
      url: 'surveyLlama.php',
      type: 'POST',
      dataType: 'json',
      data: ({ func: "download_surveys" }),
      success: function(data){
        surveys = data[0];
        questions = data[1];
        answers = data[2];
        if (activeUserNum > 0) {survey_home(activeUserNum);}
      //$("#debug1").html(JSON.stringify(questions));
      }
    });

  }

  downloadSurveys();


  $("#home_but").on("click", function(){
    $("#home").show();
    $("#update").hide();
    $("#surveyHome").hide();
    $("#questions").hide();
    $("#login").hide();
  });
  
  $("#survey_but").on("click", function(){
    $("#home").hide();
    $("#surveyHome").show();
    $("#questions").hide();
    var aUN2 = $('#aUN2').val();
    if (aUN2 > 0) {survey_home(aUN2);} else {survey_home();}
  });  

  $("#questions_but").on("click", function(){
    $("#home").hide();
    $("#surveyHome").hide();
    $("#questions").show();
    $("#login").hide();
  });

  $("#sign_up_but").on("click", function(){
    $("#home").hide();
    $("#surveyHome").hide();
    $("#questions").hide();
    $("#login").show();
    $("#em_err").html("");
    $("#pw_err").html("");
    $("#title").html("Sign Up");
  });
  
  $("#login_but").on("click", function(){
    $("#home").hide();
    $("#surveyHome").hide();
    $("#questions").hide();
    $("#login").show();
    $("#em_err").html("");
    $("#pw_err").html("");
    $("#sign_up_but").html("Sign Up");
    $("#login_but").html("Login");    
    $("#title").html("Login");
    $("#survey_but").html("Surveys");
  });
  
  var checkEm = '';
  var checkPw = '';
 
  $('#login_form').submit(function() {
    if ($('#title').html() === "Sign Up") {

      var em = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var temp_em = $('#email').val();
      var good_em = em.test(temp_em);
      if (!good_em) {$("#em_err").html("Please enter a valid email");}

      var pw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}$/;
      var temp_pw = $('#password').val();
      var good_pw = pw.test(temp_pw);
      if (!good_pw) {$("#pw_err").html("6-10 characters with at least 1 number");}

      $.ajax({
        url: 'surveyLlama.php',
        type: 'POST',
        dataType: 'json',
        data: ({func: "check_email", temp_em: temp_em }),
        success: function(data){
          if (data.checkEm === "exists") {$("#em_err").html("Email already exists");}
          if (good_em && data.checkEm === "new") {$("#em_err").html("");}
          if (good_pw) {$("#pw_err").html("");}
          if (good_em && data.checkEm === "new" && good_pw) {add_user(temp_em, temp_pw);}
        }
      });

    }
    if ($('#title').html() === "Login") {
      var temp_em = $('#email').val();
      var temp_pw = $('#password').val();

      $.ajax({
        url: 'surveyLlama.php',
        type: 'POST',
        dataType: 'json',
        data: ({func: "check_user", temp_em: temp_em, temp_pw: temp_pw }),
        success: function(data){
          if (data.loginErr) {
            $("#em_err").html("Login error");
          } else {
            $("#em_err").html("");
            var html2 = 'Surveys<input type="hidden" id="aUN2" value="' + data.activeUserNum + '">';
            $('#survey_but').html(html2);
            survey_home(data.activeUserNum);
          }
        }
      });
    }
    return false;
  });

  
  function add_user(temp_em, temp_pw) {

    $.ajax({
      url: 'surveyLlama.php',
      type: 'POST',
      dataType: 'json',
      data: ({func: "add_user", temp_em: temp_em, temp_pw: temp_pw }),
      success: function(data){
        var html2 = 'Surveys<input type="hidden" id="aUN2" value="' + data.activeUserNum + '">';
        $('#survey_but').html(html2);
        survey_home(Number(data.activeUserNum));
      }
    });

  }
  

  function chartIt(chartLabels, chartData, j) {
    //$('#debug').html(JSON.stringify(answers));
    for (var jj = 1; jj <= j; jj++) {
      var ctx = $("#myChart" + jj).get(0).getContext("2d");
      var data = {
        labels: chartLabels[jj-1],
        datasets: [
        {
            data: chartData[jj-1]
        }
        ]
      };
      var MyNewChart = new Chart(ctx).Bar(data);
    }
  }


  function survey_home(activeUserNum) {
    $(document).off("click", "#submit");
    downloadSurveys();
//$("#debug1").html(activeUserNum);
    $("#home").hide();
    $("#surveyHome").show();
    $("#survey_search").html("");
    $("#questions").hide();
    $("#login").hide();
    $("#update").hide();
    //$("#debug").html(activeUserNum);
    if (activeUserNum > 0) {
      $("#sign_up_but").html("");
      $("#login_but").html("Logout");
    }
   //$('#debug3').html("hi" + JSON.stringify(answers));
    var j = 0;
    var html = "";
    for (var i = 0; i < surveys.length; i++) {
      if ((activeUserNum > 0 && surveys[i].userNum === activeUserNum) || activeUserNum === undefined) {
        j += 1;
        html += '<div class="row">';
        html += '  <div class="col-md-4 titles col-md-offset-3">';
        html += '    <div class="col-md-2 col-md-offset-1"></div>';
        html += '    <div>' + surveys[i].surveyTitle + '</div>';
        html += '  </div>';
        html += '  <div class="col-md-4">';
        html += '    <button type="button" id="survIndex' + i + '" class="btn btn-success btn-sm">View</button>';
        if (activeUserNum > 0) {
          html += '    <button type="button" id="editSurvIndex' + i + '" class="btn btn-warning btn-sm">Edit</button>';
        }
        html += '  </div>';
        html += '</div>';

      }
    }
    
    if (activeUserNum != undefined) {
      html += '<div class="row">';
      html += '  <div class="col-md-12 bottom_head3">';
      html += '    <button type="button" id="addSurvey" class="btn btn-success btn-sm">Add Survey</button>';
      html += '    <input type="hidden" id="activeUserNum" value ="' + activeUserNum + '">';    
      html += '  </div>';
      html += '</div>';
    }

    
    $(document).on("click", "#submit", function() {
      for (var i = 0; i < answers.length; i++) {
        if ($('#a' + i).prop("checked")) {
          var surveyNumUpdate = answers[i].surveyNum;
          var qNumUpdate = answers[i].qNum;
          var aNumUpdate = answers[i].aNum;
          $.ajax({
            url: 'surveyLlama.php',
            type: 'POST',
            dataType: 'json',
            data: ({func: "update_votes", surveyNumUpdate: surveyNumUpdate, qNumUpdate: qNumUpdate, aNumUpdate: aNumUpdate }),
            success: function(data){
              //$("#debug2").html("hi");
              downloadSurveys(activeUserNum);
            }
          });
        }
      }
 
      //$('#debug3').html(JSON.stringify(answers));
      $(document).off("click", "#submit");
      survey_home(activeUserNum);
      //downloadSurveys(activeUserNum);
    });
        
    $("#survey_search").html(html);
    
      for (var k = 0; k < surveys.length; k++) {
        function clickHandler(num) {

          $("#survIndex" + k).click (
            function() {
              questions_home(num);
            }
          )

          $("#editSurvIndex" + k).click (
            function() {
              var activeSurveyNum = surveys[num].surveyNum;
              surveyEditPrep(activeSurveyNum);
              addEditSurvey(activeUserNum,activeSurveyNum);
            }
          )

        }
        clickHandler(k);
      }
    //showFooter();
  }
  
  function questions_home(surveyIndex) {
    $("#surveyHome").hide();
    $("#questions").show();
    $("#questions_search").html("");

    var html = "";
    var chartLabels = [];
    var chartData = [];
    var j = 0;
    var surveyTitle = surveys[surveyIndex].surveyTitle;
    var activeSurveyNum = surveys[surveyIndex].surveyNum;
    
    html += '    <div class="row">';
    html += '      <div class="col-md-9 col-md-offset-3">';
    html += '        <div class="col-md-1"></div>';    
    html += '        <div class="survey_title">' + surveyTitle + '</div>';
    html += '      </div>';
    html += '    </div>';
    
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].surveyNum === activeSurveyNum) {
        var activeQuestionNum = questions[i].qNum;
        var chartLabelsTemp = [];
        var chartDataTemp = [];
        j += 1;
        html += '        <div class="row">';
        html += '          <div class="col-md-9 col-md-offset-3">';
        html += '            <div class="col-md-1"></div>';
        html += '            <div>' + j + '. ' + questions[i].qText + '</div>';
        html += '          </div>';
        html += '        </div>';
        
        html += '        <div class="row">';        
        html += '          <div class="col-md-4 col-md-offset-3">';
        html += '            <ul>';
        for (var k = 0; k < answers.length; k++) {
          if (answers[k].surveyNum === activeSurveyNum && answers[k].qNum === activeQuestionNum) {
            html += '<li><input type="radio" name="ques' + i + '" id="a' + k + '">&nbsp;' + answers[k].aText + '</li>';
            chartLabelsTemp.push(answers[k].aText.substring(0,8));
            chartDataTemp.push(answers[k].votes);
          }
        }
        html += '            </ul>';
        html += '          </div>';
        html += '          <div class="col-md-3 col-md-offset-0">';
        html += '            <canvas id="myChart' + j + '" width="150" height="150"</canvas>';  
        html += '          </div>';
        html += '        </div>';
        chartLabels.push(chartLabelsTemp);
        chartData.push(chartDataTemp);
      }
    }
    
    html += '        <div class="row">';
    html += '          <div class="col-md-12 bottom_head">';
    html += '            <button type="button" id="submit" class="btn btn-success btn-sm">Submit</button>';
    html += '          </div>';
    html += '        </div>';
    $("#questions_search").html(html);
    chartIt(chartLabels, chartData, j);
    showFooter();
  }
  
  function showFooter() {
    var html = '';
    html += '<div class="container footer">';
    html += '  <div class="row">';
    html += '    <p>2016 EZChx</p>';
    html += '  </div>';
    html += '</div>';
    $('#showFooter').html(html);
  }

//******************************************THIS IS THE ADD/EDIT CODE***********************************

  var surveysTemp = [];
  var questionsTemp = [];
  var answersTemp = [];    

  $(document).on("click", "#addSurvey", function() {
  
    // set variables
    activeUserNum = $('#activeUserNum').val();
      
    // get new max survey number
    var surveyNumVals = surveys.map(function(obj) { return obj.surveyNum; });
    var activeSurveyNum = Math.max.apply(null, surveyNumVals) + 1;
    
    // initialize temp arrays
    surveysTemp = [{ surveyNum: activeSurveyNum, surveyTitle: "", userNum: activeUserNum }];
    questionsTemp = [{ surveyNum: activeSurveyNum, qNum: 1, qText: "" }];
    answersTemp = [{ surveyNum: activeSurveyNum, qNum: 1, aNum: 1, aText: "", votes: 0 },
                  { surveyNum: activeSurveyNum, qNum: 1, aNum: 2, aText: "", votes: 0 }];
    
    addEditSurvey();

  });
  
  
  //$(document).on("click", "#editSurvey", function() {
  function surveyEditPrep(activeSurveyNum) {
    
    // set variables
    surveysTemp = [];
    questionsTemp = [];
    answersTemp = [];   
    //activeSurveyNum = Number($('#activeSurveyNum').val());

    // populate temp arrays
    for (var i = 0; i < surveys.length; i++) {
      if (surveys[i].surveyNum === activeSurveyNum) {
        surveysTemp.push({ surveyNum: surveys[i].surveyNum, surveyTitle: surveys[i].surveyTitle, userNum: surveys[i].userNum });
      }
    }
    
    for (var j = 0; j < questions.length; j++) {
      if (questions[j].surveyNum === activeSurveyNum) {
        questionsTemp.push({ surveyNum: activeSurveyNum, qNum: questions[j].qNum, qText: questions[j].qText });
      }
    }
   
    for (var k = 0; k < answers.length; k++) {
      if (answers[k].surveyNum === activeSurveyNum) {
        answersTemp.push({ surveyNum: activeSurveyNum, qNum: answers[k].qNum, aNum: answers[k].aNum, aText: answers[k].aText, votes: answers[k].votes });
      }
    }
  }
  
  
  function showTitle(html) {
    html += '    <div class="row">';
    html += '      <div class="col-md-9 titles col-md-offset-1">';
    html += '        <div class="col-md-2 col-md-offset-3"><p>Survey Title</p></div>';
    html += '        <div class="col-md-6"><input type="text" id="surveyTitle" name="surveyTitle" value="' + surveysTemp[0].surveyTitle + '"></div>';
    html += '      </div>';
    html += '    </div>';
    return html;
  }
  
  function showQuestion(html,i) {
    html += '    <div class="row qTopMargin">';
    html += '      <div class="col-md-9 titles col-md-offset-1">';
    html += '        <div class="col-md-2 col-md-offset-3"><p>Question #' + (i + 1) + '</p></div>';
    html += '        <div class="col-md-6"><input type="text" id="q' + i + '" value="' + questionsTemp[i].qText + '">&nbsp;<button type="submit" id="delQuestion' + i +'" class="btn btn-danger btn-sm">Delete</button></div>';
    html += '      </div>';
    html += '    </div>';
    return html;
  }
  
  function showAnswer(html,aNum,j) {
    html += '    <div class="row">';
    html += '      <div class="col-md-9 titles col-md-offset-1">';
    html += '        <div class="col-md-2 col-md-offset-3"><p>Answer #' + aNum + '</p></div>';
    html += '        <div class="col-md-6"><input type="text" id="a' + j + '" value="' + answersTemp[j].aText + '">&nbsp;<button type="submit" id="delAnswer' + j +'" class="btn btn-danger btn-sm">Delete</button></div>';
    html += '      </div>';
    html += '    </div>';
    return html;
  }
  
  function showAddAnswer(html,i) {
    html += '        <div class="row">';
    html += '          <div class="col-md-12 bottom_head2">';
    html += '            <button type="submit" id="addAnswer' + i + '" class="btn btn-success btn-sm">Add Answer</button>';
    html += '          </div>';
    html += '        </div>';    
    return html;
  }
  
  function showAddQuestion(html) {
    html += '        <div class="row">';
    html += '          <div class="col-md-12 bottom_head2">';
    html += '            <button type="submit" id="addQuestion" class="btn btn-success btn-sm">Add Question</button>';
    html += '          </div>';
    html += '        </div>';
    return html;
  }
  
  function showSaveAndDelete(html) {
    html += '    <div class="row">';
    html += '      <div class="col-md-12 bottom_head2">';
    html += '        <button type="submit" id="deleteSurvey" class="btn btn-danger btn-sm">Delete Survey</button>';
    html += '        <button type="submit" id="saveSurvey" class="btn btn-success btn-sm">Save Survey</button>';
    html += '      </div>';
    html += '    </div>';     
    return html;
  }  
  
  function addAnswer() {
    for (var ii = 0; ii < questionsTemp.length; ii++) {
      function addAnswerClickHandler(ii) {
        $(document).on("click", ("#addAnswer" + ii), function() {
          var surveyNum = questionsTemp[ii].surveyNum;
          var qNum = questionsTemp[ii].qNum;
          // get new aNum
          var aCount = 1;
          for (var x = 0; x < answersTemp.length; x++) {
            if (answersTemp[x].surveyNum === surveyNum && answersTemp[x].qNum === qNum) {aCount += 1;}
          }
          // add new answer to temp array
          answersTemp.push({ surveyNum: surveyNum, qNum: qNum, aNum: aCount, aText: "", votes: 0 });

          addEditSurvey();
        });
      }
      $(document).off("click", "#addAnswer" + ii);
      addAnswerClickHandler(ii);
    }    
  }
  
  $(document).on("click", "#addQuestion", function() {
    var surveyNum = surveysTemp[0].surveyNum;
    // get new max question number
    if (questionsTemp.length > 0) {
      var qNumVals = questionsTemp.map(function(obj) { return obj.qNum; });
      var qNum = Math.max.apply(null, qNumVals) + 1;
    } else {
      qNum = 1;
    }
    // add to questions array
    questionsTemp.push({ surveyNum: surveyNum, qNum: qNum, qText: "" });
    addEditSurvey();
  });
  
  function delAnswer() {
    for (var jj = 0; jj < answersTemp.length; jj++) {
      function delAnswerClickHandler(jj) {
        $(document).on("click", ("#delAnswer" + jj), function() {
          // delete answer from temp array
          answersTemp.splice(jj, 1);
          addEditSurvey();
        });
      }
      $(document).off("click", "#delAnswer" + jj);
      delAnswerClickHandler(jj);
    }    
  }
  
  function delQuestion() {
    for (var ii = 0; ii < questionsTemp.length; ii++) {
      function delQuestionClickHandler(ii) {
        $(document).on("click", ("#delQuestion" + ii), function() {
          // delete question from temp question array
          var qNum = questionsTemp[ii].qNum;
          questionsTemp.splice(ii, 1);
          // delete answers from temp answers array
          for (var iii = (answersTemp.length - 1); iii >= 0; iii--) {
            if (answersTemp[iii].qNum === qNum) {
              answersTemp.splice(iii,1);
            }
          }
          //$('#debug').html(answersTemp.length);
          addEditSurvey();
        });
      }
      $(document).off("click", "#delQuestion" + ii);
      delQuestionClickHandler(ii);
    }    
  }
  
  function updateTempQuestion() {  
    for (var i = 0; i < questionsTemp.length; i++) {
      function updateQuestionHandler(i) {
        $(document).on("blur", ("#q" + i), function() {
          // update question
          questionsTemp[i].qText = $("#q" + i).val();
        });
      }
      $(document).off("blur", "#q" + i);
      updateQuestionHandler(i);
    }
  }
  
  function updateTempAnswer() {  
    for (var j = 0; j < answersTemp.length; j++) {
      function updateAnswerHandler(j) {
        $(document).on("blur", ("#a" + j), function() {
          // update answer
          answersTemp[j].aText = $("#a" + j).val();
//$("#debug1").html(answersTemp[j].aText);
        });
      }
      $(document).off("blur", "#a" + j);
      updateAnswerHandler(j);
    }
  }  

  $(document).on("click", "#saveSurvey", function() {
    activeUserNum = surveysTemp[0].userNum;
    activeSurveyNum = surveysTemp[0].surveyNum;

//$("#debug1").html("dodo");
    $.ajax({
      url: 'surveyLlama.php',
      type: 'POST',
      dataType: 'json',
      data: ({func: "delete_survey", activeSurveyNum: activeSurveyNum }),
      success: function(data){

        $.ajax({
          url: 'surveyLlama.php',
          type: 'POST',
          dataType: 'json',
          data: ({func: "add_survey", surveysTemp: surveysTemp, questionsTemp: questionsTemp, answersTemp: answersTemp }),
          success: function(data){
            surveysTemp = [];
            questionsTemp = [];
            answersTemp = [];
//$("#debug1").html(activeUserNum);
            downloadSurveys(activeUserNum);
            //survey_home(activeUserNum);
          }
        });

      }
    });

  });
  
  
  $(document).on("click", "#deleteSurvey", function() {
    activeUserNum = surveysTemp[0].userNum;
    activeSurveyNum = surveysTemp[0].surveyNum;

    $.ajax({
      url: 'surveyLlama.php',
      type: 'POST',
      dataType: 'json',
      data: ({func: "delete_survey", activeSurveyNum: activeSurveyNum }),
      success: function(data){
        surveysTemp = [];
        questionsTemp = [];
        answersTemp = [];
        downloadSurveys();
        survey_home(activeUserNum);
        //$("#debug2").html("hi");
      }
    });

    //$('#debug1').html(JSON.stringify(surveys));
    //$('#debug2').html(JSON.stringify(questions));      
    //$('#debug3').html(JSON.stringify(answers));    

    //$('#debug1').html(JSON.stringify(surveysTemp));
    //$('#debug2').html(JSON.stringify(questionsTemp));      
    //$('#debug3').html(JSON.stringify(answersTemp));
    

  });


  
  // update survey temp array on blur
  $(document).on("blur", "#surveyTitle", function() {
    surveysTemp[0].surveyTitle = $('#surveyTitle').val();
  });

  
  function addEditSurvey() {
    
    $("#surveyHome").hide();
    $("#update").show();
    
    //$('#debug1').html(JSON.stringify(surveysTemp));
    //$('#debug2').html(JSON.stringify(questionsTemp));
    //$('#debug3').html(JSON.stringify(answersTemp));
    html = '';

    // show title
    html = showTitle(html);

    // show questions and answers
    for (var i = 0; i < questionsTemp.length; i++) {
      // show question
      var qNum = questionsTemp[i].qNum;
      html = showQuestion(html,i);
      //show answers
      var aNum = 0;
      for (var j = 0; j < answersTemp.length; j++) {
        if (answersTemp[j].qNum === qNum) {
          aNum += 1;
          html = showAnswer(html,aNum,j);
        }
      }
      // show add answer
      html = showAddAnswer(html,i);
    }
    
    // show add question
    html = showAddQuestion(html);
    
    // show save and delete
    html = showSaveAndDelete(html);
    
    // add answer
    addAnswer();
    
    // delete answer
    delAnswer();    
    
    // delete question
    delQuestion();
    
    // update temp question
    updateTempQuestion();
    
    // update temp answer
    updateTempAnswer();   

    $("#updateHtml").html(html);
  }



});
