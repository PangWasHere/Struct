<?php
	require "config.php";
	$query = "SELECT user.school_id, user.user_Lname, user.user_Fname, concepts.concept_name, puzzle_report.score
	FROM player
	LEFT JOIN puzzle_report
	ON puzzle_report.player_ID = player.user_ID
	LEFT JOIN puzzle_concept
	ON puzzle_concept.puzzle_ID = puzzle_report.puzzle_ID
	LEFT JOIN concepts
	ON concepts.concept_ID = puzzle_concept.concept_ID
	LEFT JOIN user 
	ON user.user_ID=puzzle_report.player_ID
	WHERE player.class_ID = $_POST[class_ID]
	AND puzzle_report.score = '$_POST[score]'
	ORDER BY user.user_Lname ASC";
	
	db_manager::registerQuery("getCountResultsSpecific",$query);
	$return = db_manager::doQuery("getCountResultsSpecific");

		print_r( json_encode($return));
?>