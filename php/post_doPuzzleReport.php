<?php
	require "config.php";
	$userID = session_manager::getVar("user_ID") ? session_manager::getVar("user_ID"):$_POST['user_ID'] ;
	$puzzleID = $_POST["puzzle_ID"];
	$score = $_POST["score"];
	
	if( isset($_POST['meta']))
		$meta =  $_POST['meta'];
	else
		$meta = null;

	$getQ = mysql_query(" SELECT * FROM puzzle_report WHERE puzzle_ID = $puzzleID AND player_ID = $userID" );
	$result = mysql_fetch_assoc( $getQ );
	if( $result ){
		$query= "UPDATE puzzle_report SET score='$score', last_played_on=NOW(), meta=\"$meta\" WHERE player_ID = $userID AND puzzle_ID = $puzzleID	";
	} else{
		$query= "INSERT INTO puzzle_report VALUES($puzzleID,$userID,NOW(),'$score',\"$meta\")";
	}

	$temp = $query;
	$results =  mysql_query($query);
	
	date_default_timezone_set('Asia/Taipei');
	$strToSave = DATE('Y-m-d') . " $score".PHP_EOL ;
	@mkdir("../log/",0777,true);
	$fp = fopen("../log/$userID"."_$puzzleID.txt",'a');
	fwrite($fp, $strToSave);
	fclose($fp);
	
?>