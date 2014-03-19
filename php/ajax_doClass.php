<?php
	require "config.php";
	
	$teacherID = session_manager::getVar("user_ID");
	if( !isset($_POST['action'] )) $_POST['action']  = 'getTeacher';
	switch( $_POST['action'] ){
		case 'add':
			
			db_manager::registerQuery("insertClass",
				'INSERT into class VALUES(NULL,"$a","$b","$c","$d","$e")'
				);
			$results = db_manager::doQuery("insertClass",$_POST['code'],$_POST['teacher_ID'],$_POST['sched'],$_POST['sy'],$_POST['sem']);
		
				break;
		case 'update':
			db_manager::registerQuery("saveClass", 
					'UPDATE class SET 
					class_adviser=$x, class_subj_code="$a", class_schedule="$b",
					school_year="$c", semester="$d" WHERE class_ID=$id');
			db_manager::doQuery("saveClass",$_POST['teacherID'], $_POST['code'],$_POST['sched'],$_POST['sy'],$_POST['sem'],$_POST['id']);
			$results = 0;
			break;
		case 'all':	//Get all classes
			db_manager::registerQuery("getClasses", "SELECT * FROM class ORDER BY class_subj_code ASC");
			$results =  db_manager::doQuery("getClasses");
		break;

		case 'getTeacher':
		default:	//Getonly teacher's classes
			db_manager::registerQuery("getClasses", "SELECT * FROM class WHERE class_adviser = $teacherID ORDER BY class_subj_code ASC");
			$results =  db_manager::doQuery("getClasses");
			break;
	}
	


	print_r( JSON_ENCODE($results) );
?>