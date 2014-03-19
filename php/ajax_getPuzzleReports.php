<?php
	require "config.php";
	$userID = $_POST["user_ID"];
	
	$results =  db_manager::doQuery("getPuzzleReport");
	print_r(
		json_encode( $results ) 
		);
?>