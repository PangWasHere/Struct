
$(document).ready( function(){
	var contentPanes = $(".contentPane");	
	//NOTE: you must be logged in to do these script successfully.
	// These ajax scripts are dependant on SESSIONS.
	$('#mainpane').on('click','.script_getClass',function(){
		var index = $(this).parents(".contentPane").index();
		var pane = contentPanes.eq( index + 1 );
		
		var link = "php/ajax_doClass.php";	
		var string_paneTitle =  "<p class='contentPaneTitle'>Class List</p>";
		$.post( link,{}, function(m){
			data = $.parseJSON(m);
			if( data.length ){
				var paneContent = string_paneTitle;
				data.forEach( function(datum){
					paneContent += 
						"<p class='contentPaneLink script_contentPaneLink script_getStudents' id='" +
						datum.class_ID +
						"' >" +
						datum.class_subj_code + 
						"<br/>" +
						datum.class_schedule +
						"</p>";
				});
				setTimeout( function(){
					pane.html( paneContent );

				},300);
			} else{
				pane.html( string_paneTitle + "<p class='contentPanelDead'>No students are registered under this account</p>" );
			}
		});
	});
	
	contentPanes.on("click",".script_getStudents",function(){
		var index = $(this).parents(".contentPane").index();
		var pane = contentPanes.eq( index + 1 );

		var link = "php/ajax_getStudents.php";	
		var string_paneTitle =  "<p class='contentPaneTitle'>Students List</p>";
		var postData = {
			"classID" : $(this).attr("id")
		};
		
		$.post( link,postData, function(m){

			data = $.parseJSON(m);
			if( data.length ){
				var paneContent = string_paneTitle;
				paneContent+= "<p class='contentPaneLink script_contentPaneLink script_getStudentsSummary' id='"+postData.classID+"'>Summary</p>"
				data.forEach( function(datum){
					paneContent += 
						"<p class='contentPaneLink script_contentPaneLink script_getStudentProfile data_2pane' id='" +
						datum.user_ID +
						"' >" +
						datum.user_LNAME + 
						", " +
						datum.user_FNAME +
						"</p>";
				});
				setTimeout( function(){
					pane.html( paneContent );

				},300);
			} else{
				pane.html( string_paneTitle + "<p class='contentPanelDead'>No students are registered in this class</p>" );
			}
		});
	});
				
	contentPanes.on("click",".script_getStudentProfile",function(){
		var index = $(this).parents(".contentPane").index();
		var pane = contentPanes.eq( index + 1 );
	
		var link = "php/ajax_getStudentProfile.php";	
		var string_paneTitle =  "<p class='contentPaneTitle'>Student Profile</p>";
		var postData = {
			"user_ID" : $(this).attr("id")
		};
		
		$.post( link,postData, function(m){
			console.log(m);
			try{
				data = $.parseJSON(m);
				userData = data.profile;
				puzzle_report = data.puzzle_report;
				
				puzzle_report_str = "<table cellspacing='0'><tr><td>Game Name</td><td>Score</td><td>Attempts</td><td>Last Played</td><td></td></tr>";
				puzzle_report.forEach( function(elem){
					puzzle_report_str += "<tr>";
					puzzle_report_str += "<td>" + elem.puzzle_name + "</td>";
					puzzle_report_str += "<td>" + elem.score + "</td>";
					puzzle_report_str += "<td>" + elem.attempts + "</td>";
					puzzle_report_str += "<td>" + elem.last_played_on + "</td>";
					if( elem.link == "#" )
						puzzle_report_str += "<td>-</td>";
					else
						puzzle_report_str += "<td><a href='" + elem.link + "' target='_blank'>Log</a></td>";
					puzzle_report_str += "</tr>";
				});
				puzzle_report_str += "</table>";
				
				
				pane.html(
					string_paneTitle +
					"<p class='contentPanelDead majorContent'><b>Id:</b> "+userData.school_id+"</p>" +
					"<p class='contentPanelDead majorContent'><b>Name:</b> "+userData.user_Lname+", " + userData.user_Fname +" "+userData.user_Mname+"</p>" +
					"<p class='contentPanelDead majorContent'><b>Status:</b> "+userData.user_status+"</p>" +
					"<p class='contentPanelDead majorContent'><b>Midterm Grade:</b> "+userData.midterm_grade+"</p>" +
					"<p class='contentPanelDead majorContent'><b>Final Grade:</b> "+userData.final_grade+"</p>" +
					"<img src='" + userData.image_path + "' class='student_img' /><hr/><br/><br/>"+
					
					"<div class='scrollDiv'>" + puzzle_report_str + "</div>"
				);
				
			}catch( err){
				pane.html( string_paneTitle + "<p class='contentPanelDead'>Could not retrieve any data on this student</p>" );
			}
		});
	});
				
	//script_getStudentsSummary
	contentPanes.on("click",".script_getStudentsSummary",function(){
		var index = $(this).parents(".contentPane").index();
		var pane = contentPanes.eq( index + 1 );
	
		var link = "php/ajax_classSummary.php";	
		var string_paneTitle =  "<p class='contentPaneTitle'>Class Summary</p>";
		var postData = {
			"class_ID" : $(this).attr("id")
		};
		
		$.post( link,postData, function(m){
			console.log( m);
			var resultTable =  "<table cellspacing='0'><tr><td>Concept</td><td>Score</td><td>Count</td></tr>";
			try{
				data = $.parseJSON(m);

				var prevConcept = 0;
				data.forEach( function(result) {
					resultTable += "<tr>";
					if( prevConcept != result.concept_name ){
						prevConcept = result.concept_name ;
						if( result.concept_name == null){
							result.concept_name = "unevaluated";
							result.score = "n/a";
						}
						resultTable += "<td>" + result.concept_name + "</td>";
					}else{
						resultTable += "<td>&nbsp;</td>";
					}
					resultTable += ( "<td class='script_get_score' style='cursor:pointer' id='"+result.class_id+"'>" + result.score + "</td>" );
					resultTable += ( "<td>" + result.count + "</td>" );
					resultTable += "</tr>";
				});
				resultTable += "</table>";
				pane.html(
					string_paneTitle + "<div class='scrollDiv' style='height:80%'>" + resultTable + "</div>"
					
				);
				
				
			}catch( err){
				console.log( err  );
				pane.html( string_paneTitle + "<p class='contentPanelDead'>Could not retrieve any data on this student</p>" );
			}
		});
	});
	
	contentPanes.on("click",".script_get_score",function(){
		var content = $("#popupcontent");
		$("#popupmodule").fadeIn();
		
		var postData = {
			score : $(this).text(),
			class_ID : $(this).attr("id")
		}
		$.post("php/ajax_classSummarySpecific.php",postData,function(m){
			try{
				var data = $.parseJSON (m );
				var str="<table>";
				
				data.forEach( function( row){
					str+= "<tr><td>" + row.school_id + "</td>" +
					"<td>" + row.user_Lname + ", " + row.user_Fname + "</td>" +
					"<td>" + row.concept_name + "</td>" +
					"<td>" + row.score + "</td></tr>";
				});
				
				str+="</table>";
				content.html( str );
			}catch(e){
				console.log("Error :" + e );
			}
		});
	});
	
	$("#popupclose").click( function(){
		$("#popupmodule").fadeOut();
	});
});
