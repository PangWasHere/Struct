/*
<div class="contentPane " id="menu" >
		<p class='menuItem contentPaneLink script_menuItem'>CLASS LIST</p>
		<p class='menuItem contentPaneLink script_menuItem'>LOGOUT</p>
	</div>
*/



$(document).ready(function(){


	var dashboard_vars={user_type:0};
	$.get( "php/ajax_getCurrent.php", {}, function(data){
				var current_user;
				try{
					current_user= $.parseJSON(data);
					dashboard_vars.user_type = current_user.user_type;
					switch( current_user.user_type ){
						case 'A':
							$.getScript("js/dashboard_manage_scripts.js");
							$("#mainpane").prepend("<p class='menuItem contentPaneLink script_menuItem script_contentPaneLink script_doManage'>MANAGE</p>");
							$("#mainpane").prepend("<p class='contentPanelDead'>User: "+current_user.user_name+"</p>");
						case 'T':
							break;
						case 'S':
						default:
							window.location = "main.html";
							break;
					}
				}catch( e){
					current_user = 0;
				}
				if( current_user ){
					$("body").animate({backgroundSize:"9%"},900);
				} else{
					window.location = "index.html";
					exit;
					
				}
				
				
				//Initialization Functions
				$("#mainpane").animate({ marginLeft:0, opacity:1}, 500, function(){
					$(this).removeClass("isClosed")
					$(this).addClass("isOpen")});
				var timeoutOffsetBase = 500;
				
				$(".contentPane .script_menuItem").each( function(){
					var timeoutOffset = timeoutOffsetBase * ( $(this).index() +1 );
					var elem = $(this);
					setTimeout( function(){
						elem.css({opacity:1});
					},timeoutOffset );
				});
				
				//Control Functions
				
					//Close and Open Panes
				var contentPanes = $(".contentPane");	
				var timeAnim;
				var temp = $(".contentPane").css("transition");
						temp = temp.split(" ");
						temp = temp[1].split("s");
						temp = temp[0];
						timeAnim = temp;
						
				$(".contentPane").on("mousedown",".script_contentPaneLink:not(#script_logout)", function(e){
		
					var index = $(this).parents(".contentPane").index();
					var nextDex  = index + 1;
					var pane = contentPanes.eq( nextDex );
					var lastIndex = contentPanes.length -1;
					
					if( $(this).hasClass("data_3pane") ){
						pane.addClass("data_3pane_target");
						pane.removeClass("data_2pane_target");
					} else if ($(this).hasClass("data_2pane") ) {
						pane.addClass("data_2pane_target");
						pane.removeClass("data_3pane_target");
					} else{
						pane.removeClass("data_3pane_target");
						pane.removeClass("data_2pane_target");
					}
					//getTimeAnim
					if( nextDex < lastIndex){
						var ctr = lastIndex;
						var min = nextDex;
						var trailingPane;
						
						while( ctr >= min ){
							trailingPane = contentPanes.eq(ctr)
							trailingPane.removeClass("isOpen");
							trailingPane.addClass("isClosed");
							trailingPane.stop().animate({marginLeft:"-4%",opacity:0});
							ctr--;

						}
						
						
						
					}
					
					if( pane.hasClass("isClosed") ){
						pane.removeClass("isClosed");
						pane.addClass("isOpen");
						pane.stop().animate({marginLeft:0,opacity:1});
					}
					pane.html("<p class='contentPaneTitle noClassRegistered'><img src='css/imgs/ajax-loader.gif'/></p>");

				});
				
				//
				
				
				
				
				
				$("#script_logout").click( function(){
					$.get("php/ajax_logout.php",{},function(){
						$("body").animate({opacity:0,backgroundSize:"0%"},450, function(){
							window.location="index.html";
						});
					});
				});
	});
});