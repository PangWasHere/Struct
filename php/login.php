<?php
	require "config.php";
	
	
	db_manager::registerQuery("getUserCredentials", 'SELECT * FROM user WHERE school_id = "$username" AND user_password = "$password"');
	$result =  db_manager::doQuery("getUserCredentials", $_POST["username"], hash("md5",$_POST["password"]) );
	if( count($result) ){
	$result = $result[0];
	session_manager::setVar("user_ID",$result["user_ID"]);
	session_manager::setVar("user_type",$result["user_type"]);
	session_manager::setVar("user_name", "$result[user_Fname] $result[user_Lname]");
		echo json_encode($result);
	} else{
		echo 0;
	}
?>
