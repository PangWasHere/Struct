<?php
	require "config.php";
	switch( $_POST['action'] ){
		case 'update':
			db_manager::registerQuery("saveConcept", 'UPDATE concepts SET concept_name="$name" WHERE concept_ID=$id');
			db_manager::doQuery("saveConcept",$_POST['name'],$_POST['id']);
			$results = 0;
			break;
		case 'add':
			db_manager::registerQuery("addConcept", 'INSERT into concepts VALUES (NULL,"$name")');
			$new_id = db_manager::doQuery("addConcept",$_POST['name']);
			$results = JSON_ENCODE( array("concept_ID" => $new_id, "concept_name" => $_POST['name']) );
			break;
		case 'get':
			db_manager::registerQuery("getConcepts", "SELECT * FROM concepts");
			$results =  db_manager::doQuery("getConcepts");
			$results = JSON_ENCODE($results) ;
			break;
		default:
			break;
	}


	print_r( $results );
?>