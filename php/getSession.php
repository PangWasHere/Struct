<?php
	require("class/session-manager.php");
	session_manager::start();
	session_manager::setInitVars( array("user_ID" => -1, "user_type" => -1, "user_name" => -1) );
?>