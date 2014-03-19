<?php
	require "config.php";
	
	switch( $_POST['action'] ){
		case "get":
			db_manager::registerQuery('getAll','SELECT * from user WHERE user_type = "A" OR user_type = "T"');
			$results = db_manager::doQuery('getAll');
			break;
	}
	
	print_r( JSON_ENCODE( $results ) );
?>