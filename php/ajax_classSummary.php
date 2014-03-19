<?php
	require "config.php";
	$query = 
	"SELECT class_id,   concepts.concept_name, puzzle_report.score, count(*) as count
	FROM puzzle_report
	LEFT JOIN player 
	ON player.user_ID = puzzle_report.player_ID
	LEFT JOIN puzzle_concept
	ON puzzle_concept.puzzle_ID = puzzle_report.puzzle_ID
	LEFT JOIN concepts
	ON concepts.concept_ID = puzzle_concept.concept_ID
	WHERE player.class_ID = $_POST[class_ID]
	GROUP BY puzzle_report.score, concepts.concept_ID
	ORDER BY concepts.concept_name ASC";
	


	
	db_manager::registerQuery("getCountResults",$query);
	$return = db_manager::doQuery("getCountResults");

		print_r( json_encode($return));
?>