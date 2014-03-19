<?php
	require "config.php";
	switch($_POST["action"]){
		case "add":
			db_manager::registerQuery("getStudent", "SELECT user_ID from user WHERE school_id = '$_POST[stud_id]'");
			$fk = db_manager::doQuery("getStudent");
			print_r($fk);
			$fk = $fk[0]['user_ID'];
		
			db_manager::registerQuery("addStudent",
				'INSERT into player VALUES(NULL,$a,$b)');
			db_manager::doQuery("addStudent", $fk,$_POST['id']);
		case "getClassList":
			db_manager::registerQuery("getStudents", 
				"SELECT * FROM player LEFT JOIN user ON player.user_ID=user.user_ID WHERE class_ID=$_POST[id] ORDER BY user_Lname ASC");
			$results =  db_manager::doQuery("getStudents");
			break;
	}
	
	print_r( JSON_ENCODE( $results) );
?>