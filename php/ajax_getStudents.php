<?php
	require "config.php";
	
	$classID = $_POST["classID"];
	db_manager::registerQuery("getStudents", 
		"SELECT user.user_LNAME, user.user_FNAME, user.user_ID
		FROM player
		LEFT JOIN class_list
		ON class_list.player_ID=player.id
		LEFT JOIN user
		ON player.user_ID=user.user_ID
		WHERE player.class_ID = $classID 
		ORDER BY user.user_LNAME ASC");
	$results =  db_manager::doQuery("getStudents");

	print_r( JSON_ENCODE($results) );
?>