<?php
	require "config.php";
	$userID = session_manager::getVar("user_ID");
	$puzzleID = $_POST["puzzle_ID"];
	$query= "SELECT meta,score FROM puzzle_report WHERE player_ID = $userID AND puzzle_ID = $puzzleID";
	db_manager::registerQuery("getPuzzleReportMeta", $query);
	$results =  db_manager::doQuery("getPuzzleReportMeta");		
	if( count($results) ){
		$meta = $results[0]['meta'];
		$score = $results[0]['score'];
			echo "
				<?xml version='1.0' encoding='utf-8' ?>
					<meta>
						<score>$score</score>
						$meta
					</meta>
			";
		}
	else
		echo "<?xml version='1.0' encoding='utf-8' ?><meta></meta>";
?>