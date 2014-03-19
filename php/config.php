<?php
	require("class/db-manager.php");
	require("class/session-manager.php");
	
	if( $_SERVER["SERVER_NAME"] == "localhost" ){
		$settings = array( 
			"db_user" => "root",
			"db_pass" => "usbw",
			"db_name" => "thesis",
			"db_host" => "localhost"
			);
	} else{
		$settings = array( 
		"db_user" => "thesis",
		"db_pass" => "thesis",
		"db_name" => "thesis",
		"db_host" => "alcasseych.domaincommysql.com"
		);
	}

	db_manager::setCredentials( $settings);
	db_manager::connect();
	session_manager::start();
?>