$(document).ready( function(){
	var src_click;
	var contentPanes = $(".contentPane");	
	$('#mainpane').on('click','.script_doManage', function(){
		var index = $(this).parents(".contentPane").index();
		var pane = contentPanes.eq( index + 1 );
		pane.html(
			"<p class='contentPaneTitle'>Manage List</p>" +
			"<p class='contentPaneLink script_contentPaneLink data_3pane script_doStudents'>Students</p>" +
			"<p class='contentPaneLink script_contentPaneLink data_3pane script_doTeachers'>Teachers</p>" +
			"<p class='contentPaneLink script_contentPaneLink data_1pane script_doClassList'>Class List</p>" +
			"<p class='contentPaneLink script_contentPaneLink data_3pane script_doClasses'>Class</p>" +
			"<p class='contentPaneLink script_contentPaneLink data_3pane script_doConcepts'>Concepts</p>" 
			);
	});

	$(".contentPane").on("click",".script_doConcepts", function(){
	var index = $(this).parents(".contentPane").index();
	var pane = contentPanes.eq( index + 1 );

	var link = "php/ajax_doConcepts.php";	
	var string_paneTitle =  "<p class='contentPaneTitle'>Manage Concepts</p>";
	var postData = {
		"action" : "get"	
	};

			$.post( link,postData, function(m){
				concept_str = "<table cellspacing='0'><tr><td>Concept Name</td><td>Action</td></tr>";
				try{
					data = $.parseJSON(m);
					concepts = data;
					
					concepts.forEach( function(elem){
						concept_str += "<tr>";
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.concept_ID+"'>" + elem.concept_name + "</td>" );
						concept_str += ( "<td><u href='php/ajax_doConcepts.php' data-what='concept'  class='script_conceptEdit'  style='margin-right:1.3em; cursor:pointer'>Edit</u>" );
						concept_str += ( "<u class='script_conceptDelete' data-what='concept' style='cursor:pointer' data-id='"+elem.concept_ID+"'>Delete</u></td>" );
						concept_str += "</tr>";
					});
				} catch( e ){
				}
				concepts += "</table>";
			
				pane.html(
					string_paneTitle +
					"<p class='contentPanelDead majorContent'>"+
					"<button class='contentPaneBtn'>&nbsp;</button>" +
					"<span id='script_unveilNewConceptTarget' class='unveilNewConceptTarget' >" +
					"<input class='input_newConcept' placeholder='Concept Name' style='padding:0.4em; border:0;'/></span>"+
					"<button class='contentPaneBtn sliderBtn script_unveilNewConcept'>NEW</button></p>" +
					"<div class='scrollDiv' style='height:80%'>" + concept_str + "</div>"
					);
			});

	});
	
	$(".contentPane").on("click",".script_doClasses", function(){
	var index = $(this).parents(".contentPane").index();
	var pane = contentPanes.eq( index + 1 );

	var link = "php/ajax_doClass.php";	
	var string_paneTitle =  "<p class='contentPaneTitle'>Manage Classes</p>";
	var postData = {
		"action" : "all"	
	};
				
			$.post( link,postData, function(m){
				concept_str = "<table cellspacing='0'><tr><td>Class Code</td><td>Schedule</td><td>Teacher</td><td>SY</td><td>Sem</td><td>Actions</td></tr>";
				try{
					data = $.parseJSON(m);
					concepts = data;
					
					concepts.forEach( function(elem){
						concept_str += "<tr>";
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.class_ID+"'>" + elem.class_subj_code + "</td>" );
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.class_ID+"'>" + elem.class_schedule + "</td>" );
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.class_ID+"'><select disabled='disabled' class='target_classTeacher' data-teacherID='"+elem.class_adviser+"'></select></td>" );
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.class_ID+"'>" + elem.school_year + "</td>" );
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.class_ID+"'>" + elem.semester + "</td>" );
						concept_str += ( "<td><u href='php/ajax_doClass.php' data-what='class' class='script_conceptEdit'  style='margin-right:1.3em; cursor:pointer'>Edit</u>" );
						concept_str += ( "<u  class='script_conceptDelete' data-what='class' style='cursor:pointer' data-id='"+elem.class_ID+"'>Delete</u></td>" );
						concept_str += "</tr>";
					});
				} catch( e ){
				}
				concepts += "</table>";
			
				pane.html(
					string_paneTitle +
					"<p class='contentPanelDead majorContent'>"+
					"<button class='contentPaneBtn'>&nbsp;</button>" +
					"<span id='script_unveilClassTarget' class='unveilNewClassTarget' style='max-height:2em; vertical-align:top' >" +
					"<input class='input_newClass' placeholder='Class Code' style='padding:0.4em; margin-right:1%; border:0; width:16%;'/>"+
					"<input class='input_newClass' placeholder='Class Sched' style='padding:0.4em; margin-right:1%; border:0; width:26%;'/>"+
					"<select class='input_newClass script_getTeachers' style='padding:0.4em; margin-right:1%; border:0; width:25%;'></select>"+
					"<input class='input_newClass' placeholder='School Year' style='padding:0.4em; margin-right:1%; border:0; width:14%;'/>"+
					"<input class='input_newClass' placeholder='Semester' style='padding:0.4em; border:0; width:13%;'/>"+
					"</span>"+
					"<button class='contentPaneBtn sliderBtn script_unveilNewClass'>NEW</button></p>" +
					"<div class='scrollDiv' style='height:80%'>" + concept_str + "</div>"
					);
					
				var select = $("select.input_newClass");
				if( !select.children().length ){
					$.post("php/ajax_doStaff.php", {action:"get"}, function(m){
						select.append ( $("<option value='NULL'>No Assigned</option>") );
						try{
							var staff =  $.parseJSON(m);
							staff.forEach( function(data){
								var new_opt = $("<option></option>");
								new_opt.val( data.user_ID);
								new_opt.html( data.user_Lname + ", " + data.user_Fname );
								select.append( new_opt );
							});
							
							$(".target_classTeacher").each( function(){
								var elem = $(this);
								elem.html( select.html() );
								elem.find("[value='" + elem.attr("data-teacherID") + "']").attr("selected","selected");
							});
						}catch(e){
							console.log(m);
						}
					});
				}
			});

	});



	$(".contentPane").on("click",".script_unveilNewConcept", function(){
		$(this).removeClass("script_unveilNewConcept");
		$(this).addClass("script_veilNewConcept");
		$("#script_unveilNewConceptTarget").stop().animate({width:"157px"});
	});

	$(".contentPane").on("click",".script_veilNewConcept", function(){
		var name_val = $(".input_newConcept").val() ;
		if( name_val){
			var link = "php/ajax_doConcepts.php";	
			var postData = {
				"action" : "add",
				"name":name_val
			};

			$.post( link,postData, function(m){
				$(".script_doConcepts").click();
			});
		
		} else{
			$(this).addClass("script_unveilNewConcept");
			$(this).removeClass("script_veilNewConcept");
			$("#script_unveilNewConceptTarget").stop().animate({width:0});
		}
	});
	
	//For Classes
	$(".contentPane").on("click",".script_unveilNewClass", function(){
		$(this).removeClass("script_unveilNewClass");
		$(this).addClass("script_veilNewClass");
		$("#script_unveilClassTarget").stop().animate({width:"80%"});
	});
	
	$(".contentPane").on("click",".script_veilNewClass", function(){
		var name_val = $(".input_newClass").eq(0).val() ;
		if( name_val){
			var temp = $(".input_newClass");
			var link = "php/ajax_doClass.php";	
			var postData = {
				"action" : "add",
				"code":temp.eq(0).val(),
				"sched":temp.eq(1).val(),
				"teacher_ID":temp.eq(2).val(),
				"sy":temp.eq(3).val(),
				"sem":temp.eq(4).val()
			};
			$.post( link,postData, function(m){
				$(".script_doClasses").click();
			});
		
		} else{
			$(this).addClass("script_unveilNewClass");
			$(this).removeClass("script_veilNewClass");
			$("#script_unveilClassTarget").stop().animate({width:0});
		}
	});
	
	
	$(".contentPane").on("click",".script_conceptEdit", function(){
		var elem = $(this);
		if( elem.hasClass("conceptIsEditing") ){
			elem.text("Wait");
			elem.removeClass("conceptIsEditing");
			var temp = $(this).parents("tr")
				.find(".target_conceptEdit");
				temp.attr("contenteditable","false");
				
				temp.find("select").attr("disabled","disabled");
				
			
			var link = $(this).attr("href");
			var postData;

			switch( $(this).attr("data-what") ){
				case "student":
					postData = {
						"action" : "setStudents",
						"id":temp.attr("data-id"),
						"school_id":temp.eq(0).html(),
						"lname":temp.eq(1).html(),
						"fname":temp.eq(2).html(),
						"mname":temp.eq(3).html(),
						"status":temp.eq(4).html()
					};
					break;
				case "class":
					postData = {
						"action" : "update",
						"id":temp.attr("data-id"),
						"code":temp.eq(0).html(),
						"sched":temp.eq(1).html(),
						"teacherID":temp.eq(2).find("select").val(),
						"sy":temp.eq(3).html(),
						"sem":temp.eq(4).html()
					};
					break;
				case "concept":
					postData = {
						"action" : "update",
						"name":temp.html(),
						"id":temp.attr("data-id")
					};
					break;
			}
			

			$.post( link,postData, function(m){
				console.log("Message from " +link+ "\n" +m);
				elem.text("Edit");
			});
				
		}else{
			elem.addClass("conceptIsEditing");
			elem.text("Save");
			var inputs = $(this).parents("tr");
			var temp = inputs.find(".target_conceptEdit");
				temp.attr("contenteditable","true");
				temp.eq(0).focus();
				
				inputs.find("[disabled]").removeAttr("disabled");
		}
	});
	
	$(".contentPane").on("click",".script_conceptDelete", function(){
		if( confirm("Are you sure you want to delete this?") ){
			var postData = {
					id : $(this).attr("data-id"),
					what:$(this).attr("data-what")
				};
			$.post("php/ajax_doDelete.php",postData, function(m){
				switch( postData.what ){
					case "classList":
						src_click.click();
						break
					case "student":
						$(".script_doStudents").click();
						break;
					case "class":
						$(".script_doClasses").click();
						break;
					case "concept":
						$(".script_doConcepts").click();
						break;
				}
				
			});
			
		}
	});
	
	
	
	$(".contentPane").on("click",".script_doStudents", function(){
	var index = $(this).parents(".contentPane").index();
	var pane = contentPanes.eq( index + 1 );

	var link = "php/ajax_doUsers.php";	
	var string_paneTitle =  "<p class='contentPaneTitle'>Manage Students</p>";
	var postData = {
		"action" : "getStudents",
		"page": 0
	};
				
			$.post( link,postData, function(m){
				concept_str = "<table cellspacing='0'><tr><td>School Id</td><td>Lname</td><td>Fname</td><td>Mname</td><td>Status</td><td>Actions</td></tr>";
				try{
					data = $.parseJSON(m);
					concepts = data;
					concepts.forEach( function(elem){
						concept_str += "<tr>";
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.user_ID+"'>" + elem.school_id + "</td>" );
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.user_ID+"'>" + elem.user_Lname + "</td>" );
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.user_ID+"'>" + elem.user_Fname + "</td>" );
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.user_ID+"'>" + elem.user_Mname + "</td>" );
						concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.user_ID+"'>" + elem.user_status + "</td>" );
						concept_str += ( "<td><u href='php/ajax_doUsers.php' data-what='student' class='script_conceptEdit'  style='margin-right:1.3em; cursor:pointer'>Edit</u>" );
						concept_str += ( "<u  class='script_conceptDelete' data-what='user' style='cursor:pointer' data-id='"+elem.user_ID+"'>Delete</u></td>" );
						concept_str += "</tr>";
					});
				} catch( e ){
				}
				concepts += "</table>";
			
				pane.html(
					string_paneTitle +
					"<p class='contentPanelDead majorContent'>"+
					"<button class='contentPaneBtn'>&nbsp;</button>" +
					"<span id='script_unveilStudentTarget' class='unveilNewStudentTarget' style='max-height:2em; vertical-align:top' >" +
					"<input class='input_newClass' placeholder='School Id' style='padding:0.4em; margin-right:1%; border:0; width:15%;'/>"+
					"<input class='input_newClass' placeholder='Last Name' style='padding:0.4em; margin-right:1%; border:0; width:20%;'/>, "+
					"<input class='input_newClass' placeholder='First Name' style='padding:0.4em; margin-right:1%; border:0; width:19%;'/>"+
					"<input class='input_newClass' placeholder='Middle Name' style='padding:0.4em; margin-right:1%; border:0; width:19%;'/>"+
					"<input class='input_newClass' placeholder='Status' style='padding:0.4em; border:0; width:20%;'/>"+
					"</span>"+
					"<button class='contentPaneBtn sliderBtn script_unveilNewStudent'>NEW</button></p>" +
					"<div class='scrollDiv' style='height:80%'>" + concept_str + "</div>"
					);
					
				var select = $("select.input_newClass");
				if( !select.children().length ){
					$.post("php/ajax_doStaff.php", {action:"get"}, function(m){
						select.append ( $("<option value='NULL'>No Assigned</option>") );
						try{
							var staff =  $.parseJSON(m);
							staff.forEach( function(data){
								var new_opt = $("<option></option>");
								new_opt.val( data.user_ID);
								new_opt.html( data.user_Lname + ", " + data.user_Fname );
								select.append( new_opt );
							});
							
							$(".target_classTeacher").each( function(){
								var elem = $(this);
								elem.html( select.html() );
								elem.find("[value='" + elem.attr("data-teacherID") + "']").attr("selected","selected");
							});
						}catch(e){
							console.log(m);
						}
					});
				}
			});

	});

	$(".contentPane").on("click",".script_unveilNewStudent", function(){
		$(this).removeClass("script_unveilNewStudent");
		$(this).addClass("script_veilNewStudent");
		$("#script_unveilStudentTarget").stop().animate({width:"80%"});
	});
	
	$(".contentPane").on("click",".script_veilNewStudent", function(){
		var name_val = $(".input_newClass").eq(0).val() ;
		var elem=$(this);
		if( name_val){
			var temp = $(".input_newClass");
			var link = "php/ajax_doUsers.php";	
			var postData = {
				"action" : elem.hasClass('script_isTeacher')? "addTeacher" :"addStudent",
				"school_id":temp.eq(0).val(),
				"lname":temp.eq(1).val(),
				"fname":temp.eq(2).val(),
				"mname":temp.eq(3).val(),
				"status":temp.eq(4).val()
			};
					
					
			$.post( link,postData, function(m){
				if( elem.hasClass('script_isTeacher') )
					$(".script_doTeachers").click()
				else
					$(".script_doStudents").click();
			});
		
		} else{
			$(this).addClass("script_unveilNewStudent");
			$(this).removeClass("script_veilNewStudent");
			$("#script_unveilStudentTarget").stop().animate({width:0});
		}

	});
	
	
				//Do Teachers
				$(".contentPane").on("click",".script_doTeachers", function(){
					
				var index = $(this).parents(".contentPane").index();
				var pane = contentPanes.eq( index + 1 );

				var link = "php/ajax_doUsers.php";	
				var string_paneTitle =  "<p class='contentPaneTitle'>Manage Teachers</p>";
				var postData = {
					"action" : "getTeachers"
				};
							
						$.post( link,postData, function(m){
							concept_str = "<table cellspacing='0'><tr><td>School Id</td><td>Lname</td><td>Fname</td><td>Mname</td><td>Status</td><td>Actions</td></tr>";
							try{
								data = $.parseJSON(m);
								concepts = data;
								
								concepts.forEach( function(elem){
									concept_str += "<tr>";
									concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.user_ID+"'>" + elem.school_id + "</td>" );
									concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.user_ID+"'>" + elem.user_Lname + "</td>" );
									concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.user_ID+"'>" + elem.user_Fname + "</td>" );
									concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.user_ID+"'>" + elem.user_Mname + "</td>" );
									concept_str += ( "<td class='target_conceptEdit' data-id='"+elem.user_ID+"'>" + elem.user_status + "</td>" );
									concept_str += ( "<td><u href='php/ajax_doUsers.php' data-what='student' class='script_conceptEdit'  style='margin-right:1.3em; cursor:pointer'>Edit</u>" );
									concept_str += ( "<u  class='script_conceptDelete' data-what='user' style='cursor:pointer' data-id='"+elem.user_ID+"'>Delete</u></td>" );
									concept_str += "</tr>";
								});
							} catch( e ){
							}
							concepts += "</table>";
						
							pane.html(
								string_paneTitle +
								"<p class='contentPanelDead majorContent'>"+
								"<button class='contentPaneBtn'>&nbsp;</button>" +
								"<span id='script_unveilStudentTarget' class='unveilNewStudentTarget' style='max-height:2em; vertical-align:top' >" +
								"<input class='input_newClass' placeholder='School Id' style='padding:0.4em; margin-right:1%; border:0; width:15%;'/>"+
								"<input class='input_newClass' placeholder='Last Name' style='padding:0.4em; margin-right:1%; border:0; width:20%;'/>, "+
								"<input class='input_newClass' placeholder='First Name' style='padding:0.4em; margin-right:1%; border:0; width:19%;'/>"+
								"<input class='input_newClass' placeholder='Middle Name' style='padding:0.4em; margin-right:1%; border:0; width:19%;'/>"+
								"<input class='input_newClass' placeholder='Status' style='padding:0.4em; border:0; width:20%;'/>"+
								"</span>"+
								"<button class='contentPaneBtn sliderBtn script_unveilNewStudent script_isTeacher'>NEW</button></p>" +
								"<div class='scrollDiv' style='height:80%'>" + concept_str + "</div>"
								);
								
							var select = $("select.input_newClass");
							if( !select.children().length ){
								$.post("php/ajax_doStaff.php", {action:"get"}, function(m){
									select.append ( $("<option value='NULL'>No Assigned</option>") );
									try{
										var staff =  $.parseJSON(m);
										staff.forEach( function(data){
											var new_opt = $("<option></option>");
											new_opt.val( data.user_ID);
											new_opt.html( data.user_Lname + ", " + data.user_Fname );
											select.append( new_opt );
										});
										
										$(".target_classTeacher").each( function(){
											var elem = $(this);
											elem.html( select.html() );
											elem.find("[value='" + elem.attr("data-teacherID") + "']").attr("selected","selected");
										});
									}catch(e){
										console.log(m);
									}
								});
							}
						});

				});
				
				
				
				
				
				
	$(".contentPane").on("click",".script_doClassList", function(){
	var index = $(this).parents(".contentPane").index();
	var pane = contentPanes.eq( index + 1 );

	var link = "php/ajax_doClass.php";	
	var string_paneTitle =  "<p class='contentPaneTitle'>Manage Classes</p>";
	var postData = {
		"action" : "all"	
	};
				
			$.post( link,postData, function(m){
				var string_paneTitle =  "<p class='contentPaneTitle'>Class List</p>";
				try{
					data = $.parseJSON(m);
					paneContent = "";
					data.forEach( function(datum){
						paneContent += "<p class='contentPaneLink script_contentPaneLink script_manageClass' id='" +
								datum.class_ID +
								"' >" +
								datum.class_subj_code + 
								"<br/>" +
								datum.class_schedule +
								"</p>";
					});
					pane.html( string_paneTitle + paneContent );
				} catch( e ){
					pane.html( string_paneTitle + "<p class='contentPanelDead'>No students are registered under this account</p>" );
				}
			});
	});
	
	$(".contentPane").on("click",".script_manageClass", function(){
			var index = $(this).parents(".contentPane").index();
			var pane = contentPanes.eq( index + 1 );
			
			var link = "php/ajax_doClassList.php";	
			var string_paneTitle =  "<p class='contentPaneTitle' id='classList_id' data-id="+$(this).attr("id")+">Manage Class List</p>";
			var postData = {
				"action" : "getClassList",
				"id": $(this).attr("id"),
			};
			src_click = $(this);
			
			$.post( link, postData, function(m){
				var new_str = 
					"<button class='contentPaneBtn'>&nbsp;</button>" +
					"<span id='script_unveilClassRegistreeTarget' class='unveilNewClassRegistree' >" +
					"<input class='input_newClass' placeholder='Student ID' style='padding:0.4em; border:0;'/></span>"+
					"<button class='contentPaneBtn sliderBtn script_unveilNewClassRegistree'>NEW</button></p>";
				classListStr = string_paneTitle + new_str +"<div class='scrollDiv' style='height:80%'><table cellspacing='0'><tr><td>School ID</td><td>Name</td><td>Actions</td></tr>";
				try{
					var data =$.parseJSON(m);
					
					data.forEach( function(elem){
						classListStr += "<tr>";
						classListStr += ( "<td class='target_classListEdit' data-id='"+elem.id+"'>" + elem.school_id + "</td>" );
						classListStr += ( "<td class='target_classListEdit' data-id='"+elem.id+"'>" + elem.user_Lname + ", " + elem.user_Fname + "</td>" );
				
						classListStr += ( "<td><u  class='script_conceptDelete' data-what='classList' style='cursor:pointer' data-id='"+elem.id+"'>Delete</u></td>" );
						classListStr += "</tr>";
					});
				}catch(e){
				}
				classListStr += "</table><div>";
				pane.html(classListStr);
			});
	});
	
	//For Class Lists
	$(".contentPane").on("click",".script_unveilNewClassRegistree", function(){
		$(this).removeClass("script_unveilNewClassRegistree");
		$(this).addClass("script_veilNewClassRegistree");
		$("#script_unveilClassRegistreeTarget").stop().animate({width:"32%"});
	});
	
	$(".contentPane").on("click",".script_veilNewClassRegistree", function(){
		var name_val = $(".input_newClass").eq(0).val() ;
		if( name_val){
			var temp = $(".input_newClass");
			var link = "php/ajax_doClassList.php";	
			var postData = {
				"action" : "add",
				"id": $("#classList_id").attr("data-id"),
				"stud_id":temp.eq(0).val(),
			};
			$.post( link,postData, function(m){
				src_click.click();
			});
		
		} else{
			$(this).addClass("script_unveilNewClass");
			$(this).removeClass("script_veilNewClass");
			$("#script_unveilClassRegistreeTarget").stop().animate({width:0});
		}
	});
});