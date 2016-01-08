<?

$func = $_POST["func"];

if ($func == "check_email") {

  mysql_connect(localhost,$username,$pw);
  @mysql_select_db($database) or die( "Unable to select database");

  $temp_em = $_POST["temp_em"];
  $query="SELECT * FROM surveyLlamaUsers WHERE email = '$temp_em'";
  $result=mysql_query($query);
  $num=mysql_numrows($result);
  mysql_close();
  if ($num == '') {
    $checkEm = "new";
  } else {
    $checkEm = "exists";
  }

  $data = array('checkEm'=> $checkEm);

  echo json_encode($data);

}


if ($func == "check_user") {

  mysql_connect(localhost,$username,$pw);
  @mysql_select_db($database) or die( "Unable to select database");

  $temp_em = $_POST["temp_em"];
  $temp_pw = $_POST["temp_pw"];

  $query="SELECT * FROM surveyLlamaUsers WHERE email = '$temp_em' AND password = '$temp_pw'";
  $result=mysql_query($query);
  $num=mysql_numrows($result);
  mysql_close();
  if ($num == '') {$loginErr = true;} else {$loginErr = false;}
  $activeUserNum = mysql_result($result,0,"userNum");
  $data = array('loginErr'=> $loginErr,'activeUserNum'=> $activeUserNum);

  echo json_encode($data);

}


if ($func == "add_user") {

  mysql_connect(localhost,$username,$pw);
  @mysql_select_db($database) or die( "Unable to select database");

  $query = "SELECT MAX(userNum) FROM surveyLlamaUsers";
  $result = mysql_query($query);
  $activeUserNum = mysql_result($result,0) + 1;

  $temp_em = $_POST["temp_em"];
  $temp_pw = $_POST["temp_pw"];

  $query = "INSERT INTO surveyLlamaUsers VALUES (
    '$activeUserNum',
    '$temp_em',
    '$temp_pw')";
  mysql_query($query);
  mysql_close();
  $data = array('activeUserNum'=> $activeUserNum);

  echo json_encode($data);

}


if ($func == "download_surveys") {

  mysql_connect(localhost,$username,$pw);
  @mysql_select_db($database) or die( "Unable to select database");

  $query1="SELECT * FROM surveyLlamaSurveys ORDER BY surveyNum";
  $result1=mysql_query($query1);

  $query2="SELECT * FROM surveyLlamaQuestions ORDER BY surveyNum";
  $result2=mysql_query($query2);

  $query3="SELECT * FROM surveyLlamaAnswers ORDER BY surveyNum, qNum, aNum";
  $result3=mysql_query($query3);

  mysql_close();

  $surveys = array();
  $questions = array();
  $answers = array();

  while(($row1 =  mysql_fetch_assoc($result1))) {
    $surveys[] = array('surveyNum'=> $row1['surveyNum'], 'surveyTitle'=> $row1['surveyTitle'], 'userNum'=> $row1['userNum']);
  }

  while(($row2 =  mysql_fetch_assoc($result2))) {
    $questions[] = array('surveyNum'=> $row2['surveyNum'], 'qNum'=> $row2['qNum'], 'qText'=> $row2['qText']);
  }

  while(($row3 =  mysql_fetch_assoc($result3))) {
    $answers[] = array('surveyNum'=> $row3['surveyNum'], 'qNum'=> $row3['qNum'], 'aNum'=> $row3['aNum'], 'aText'=> $row3['aText'], 'votes'=> $row3['votes']);
  }

  $data = array($surveys, $questions, $answers);

  echo json_encode($data);

}


if ($func == "update_votes") {

  $surveyNumUpdate = $_POST["surveyNumUpdate"];
  $qNumUpdate = $_POST["qNumUpdate"];
  $aNumUpdate = $_POST["aNumUpdate"];
  mysql_connect(localhost,$username,$pw);
  @mysql_select_db($database) or die( "Unable to select database");
  $query="UPDATE surveyLlamaAnswers SET votes = votes + 1 WHERE surveyNum = $surveyNumUpdate AND qNum = $qNumUpdate AND aNum = $aNumUpdate";
  mysql_query($query);
  mysql_close();
  $data = array('activeUserNum'=> $activeUserNum);

  echo json_encode($data);

}


if ($func == "delete_survey") {

  $activeSurveyNum = $_POST["activeSurveyNum"];

  mysql_connect(localhost,$username,$pw);
  @mysql_select_db($database) or die( "Unable to select database");

  $query1="DELETE FROM surveyLlamaSurveys WHERE surveyNum = $activeSurveyNum";
  mysql_query($query1);

  $query2="DELETE FROM surveyLlamaQuestions WHERE surveyNum = $activeSurveyNum";
  mysql_query($query2);

  $query3="DELETE FROM surveyLlamaAnswers WHERE surveyNum = $activeSurveyNum";
  mysql_query($query3);

  mysql_close();
  $data = array('activeUserNum'=> $activeUserNum);

  echo json_encode($data);

}


if ($func == "add_survey") {

  $surveysTemp = $_POST["surveysTemp"];
  $questionsTemp = $_POST["questionsTemp"];
  $answersTemp = $_POST["answersTemp"];

  mysql_connect(localhost,$username,$pw);
  @mysql_select_db($database) or die( "Unable to select database");

  foreach($surveysTemp as $item) {
    $query1 = "INSERT INTO surveyLlamaSurveys VALUES (
      '$item[surveyNum]',
      '$item[surveyTitle]',
      '$item[userNum]')";
    mysql_query($query1);
  }

  foreach($questionsTemp as $item2) {
    $query2 = "INSERT INTO surveyLlamaQuestions VALUES (
      '$item2[surveyNum]',
      '$item2[qNum]',
      '$item2[qText]')";
    mysql_query($query2);
  }

  foreach($answersTemp as $item3) {
    $query3 = "INSERT INTO surveyLlamaAnswers VALUES (
      '$item3[surveyNum]',
      '$item3[qNum]',
      '$item3[aNum]',
      '$item3[aText]',
      '$item3[votes]')";
    mysql_query($query3);
  }

  mysql_close();
  $data = array('activeUserNum'=> $activeUserNum);

  echo json_encode($data);

}

exit;

?>
