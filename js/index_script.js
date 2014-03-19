$(document).ready( function(){

	var login_form = $("#login_form");
	$("#login_btn").mousedown( function(e){
		login_form.css({display:"block"}).animate({opacity:1},300);
		e.stopPropagation();
		$(".script_autofocus").focus();
	});
	
	$.post("php/getSession.php",{},function(e){
		$("body").append( e);
	});
	
	$("#login_form").mousedown( function(e){
		e.stopPropagation();
	});
	
	$("body").mousedown( function(){
		if( login_form.css("display") != "none" ){
			$("#login_form").animate({opacity:0},300, function(){
				$(this).css({display:"none"});
			});
		}
	});
	
	$(".ajax_login").submit( function(e){
		e.preventDefault();
		var link = $(this).attr("action");
		var data = $(this).serialize();
		$.post(link, data, function(m){
			var user = $.parseJSON(m);
			
			if( user ){
				$("body").css({opacity:0,background:"rgb(255,255,255)"});
				var transferWindow = setTimeout(function(){
	
					switch( user.user_type.toUpperCase() ){
						case 'A':
						case 'T':
							window.location = "dashboard.html";
							break;
						case 'S':
						default:
							window.location = "main.html";
							break;
					}
				},1000);
			} else { 
				$("#login_form").find("[name=username],[name=password]").css({"box-shadow":"0px 0px 0px 2pt red"});
			}
		});
	});
});