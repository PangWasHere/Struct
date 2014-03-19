<?php
	require "config.php";
	
	$userID = session_manager::getVar("user_ID");
	$old = hash("md5", $_POST['old'] );
	$new = hash("md5", $_POST['new'] );
	db_manager::registerQuery("updatePass", "UPDATE user SET user_password = '$new' WHERE user_ID = $userID and user_password='$old'");
	$results =  db_manager::doQuery("updatePass");

	echo mysql_affected_rows();
?>