<?php
	require "config.php";
	
	$return = array();
	$user_ID = isset($_POST["user_ID"]) ? $_POST["user_ID"] : session_manager::getVar("user_ID");
	db_manager::registerQuery("getStudents", 
		"SELECT 
			school_id,user_Lname,user_status,user_Fname,user_Mname,midterm_grade,final_grade,image_path
		FROM user
		LEFT JOIN player
		ON user.user_ID = player.user_ID
		LEFT JOIN class_list
		ON class_list.player_ID=user.user_ID
		WHERE player.user_ID = $user_ID 
		");
	$result = db_manager::doQuery("getStudents");
	$return['profile'] =  $result[0];
	
	$query = "SELECT puzzle_report.puzzle_ID as puzzle_ID, score, last_played_on, puzzle_name FROM puzzle_report LEFT JOIN puzzle on puzzle.puzzle_ID=puzzle_report.puzzle_ID WHERE player_ID = $user_ID";
	db_manager::registerQuery("getPuzzleReport", $query);
	$results =  db_manager::doQuery("getPuzzleReport");
	foreach( $results as &$result ){
		$filepath = "log/$user_ID"."_$result[puzzle_ID].txt";
		$filepath_new = "../" . $filepath;
		if( file_exists($filepath_new) ){
			$fp = @fopen($filepath_new,"r");
			$ctr = 0;
			while (($buffer = fgets($fp, 4096)) !== false) {
					$ctr++;
			}
			fclose( $fp);
			$result["attempts"] = $ctr;
			$result["link"] = $filepath;
		} else{
			$result["score"] = "-";
			$result["attempts"] = "-";
			$result["link"] = "#";
			$result["last_played_on"] = "-";
		}
	}

	$return['puzzle_report'] = $results;

	print_r( JSON_ENCODE($return) );
?>