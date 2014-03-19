<?php
	require("config.php");
	session_manager::start();
	$return = array(
		"user_ID" => session_manager::getVar("user_ID"),
		"user_type"=>session_manager::getVar("user_type"),
		"user_name"=>session_manager::getVar("user_name")
		);
	
	/*
	db_manager::registerQuery("getScores", "SELECT score FROM puzzle_report WHERE player_ID=$return[user_ID]");
	$scores = db_manager::doQuery("getScores");
	$points = 0;
	foreach( $scores as $score ){
		$points += $score['score'];
	}
	$return["points"] = $points;
	*/
	$encoded = json_encode($return);
	print_r( $encoded );
?>