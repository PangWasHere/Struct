<?php
	require "config.php";
	if( !isset($_POST['page']) ) $_POST['page'] = 0;
	switch( $_POST['action'] ){
		case 'getTeachers':
			db_manager::registerQuery("getStudents", "SELECT * FROM user WHERE user_type='A' OR user_type='T' ORDER BY user_Lname ASC");
			$results =  db_manager::doQuery("getStudents");
			break;
		case 'addTeacher':
			db_manager::registerQuery("addTeacher",
				'INSERT into user VALUES(NULL,"$a","$b","$c","$d","$p","$e","T",NULL)'
				);
			$results = db_manager::doQuery("addTeacher",$_POST['school_id'],$_POST['fname'],$_POST['mname'],$_POST['lname'],md5($_POST['school_id']),$_POST['status']);
		
			break;
		case 'addStudent':
			db_manager::registerQuery("addStudent",
				'INSERT into user VALUES(NULL,"$a","$b","$c","$d","$p","$e","S",NULL)'
				);
			$results = db_manager::doQuery("addStudent",$_POST['school_id'],$_POST['fname'],$_POST['mname'],$_POST['lname'],md5($_POST['school_id']),$_POST['status']);
		
			break;
		case 'setStudents': //Save student
			db_manager::registerQuery("setStudent", 
					'UPDATE user SET 
					school_id="$a", user_Fname="$b", user_Mname="$c",
					user_Lname="$d", user_status="$e" WHERE user_ID=$id');
			db_manager::doQuery("setStudent",$_POST['school_id'], $_POST['fname'],$_POST['mname'],$_POST['lname'],$_POST['status'],$_POST['id']);
			$results = 0;
			break;
		case 'getStudents':	//Get all classes
			db_manager::registerQuery("getStudents", "SELECT * FROM user WHERE user_type='S' ORDER BY user_Lname ASC");
			$results =  db_manager::doQuery("getStudents");
			break;
		case 'getTeacher':
		default:	//Getonly teacher's classes
			db_manager::registerQuery("getClasses", "SELECT * FROM class WHERE class_adviser = $teacherID ORDER BY class_subj_code ASC");
			$results =  db_manager::doQuery("getClasses");
			break;
	}
	

	$json = JSON_ENCODE($results);
	print_r($json );
?>