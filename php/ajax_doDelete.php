<?php
	require "config.php";
	
	switch( $_POST['what'] ){
		case "classList":
			db_manager::registerQuery("delWhat",'DELETE from player WHERE id=$a');
			$results = db_manager::doQuery('delWhat',$_POST['id']);
			break;
		case "user":
			db_manager::registerQuery("delWhat",'DELETE from user WHERE user_ID=$a');
			$results = db_manager::doQuery('delWhat',$_POST['id']);
			break;
		case "class":
			db_manager::registerQuery('delWhat','DELETE from class WHERE class_ID=$a');
			$results = db_manager::doQuery('delWhat',$_POST['id']);
			break;
		case "concept":
			db_manager::registerQuery('delWhat','DELETE from concepts WHERE concept_ID=$a');
			$results = db_manager::doQuery('delWhat',$_POST['id']);
			break;
	}
?>