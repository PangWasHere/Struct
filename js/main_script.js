
//Globals
var world_xml;	
var world_div;
$(window).load(function(){
	var GLOBAL = {};
	var bldgCounter = 0;
	var bldgPrefix = "bldgId";
	//GET LOGIN FIRST
	$.get( "php/ajax_getCurrent.php", {}, function(data){
				var current_user;
				try{
					current_user= $.parseJSON(data);
					
				}catch( e){
					current_user = 0;
				}
				console.log (current_user);
				if( current_user ){
					var user_append = $("<span></span");
					//var points_append = $("<span style='margin-right:1em;'></span");
					user_append.text( current_user.user_name );
					//points_append.text( current_user.points + "pts");
					$("#userMenu").prepend( user_append );
					//$("#userMenu").prepend( points_append );
					
				} else{
					window.location = "index.html";
					exit;
					
				}
	
				//ACTIVATE BUTTONS
				var animation_offset = 300;
				$(".worldMenuBtn").each( function(){
					var elem = $( this );
					setTimeout( function(){
						elem.animate({ 
								opacity:1,
								marginLeft:0
								}, 450);
					}, animation_offset * elem.index() );
				});
	
				//BUILD WORLD
				$.get( "xml/world.xml",{},function(data){
					//REMOVE LOADING
					$("#loadingMsg").remove();
					world_xml = data;
					world_div = $("#world");
					//add and instantiate buildings
					$(world_xml).children().children().each( function(){
						var bldg_node = $(this);
						var new_id =  bldgPrefix + bldgCounter;
						var label_elem = $("<label class='worldBubbles script_worldBubbles'></label>");
							label_elem.addClass( "mask_" + bldg_node.attr("bubbleType") );
							label_elem.attr({ 
										id: new_id
									});
							label_elem.css({
										left: ( bldg_node.attr('bubbleX') ? bldg_node.attr('bubbleX') : 0 ),
										top:  ( bldg_node.attr('bubbleY') ? bldg_node.attr('bubbleY') : 0 ),
										background: ( bldg_node.attr('bubbleColor') )
									});
							label_elem.text( bldg_node.attr('name') );
							
						var bldg_elem = $("<img class='worldBldgs script_worldBldgs'/>");
							bldg_elem.attr({
										target: "#" + new_id,
										src: bldg_node.attr("src"),
									});
							bldg_elem.css({
										left: ( bldg_node.attr('x') ? bldg_node.attr('x') : 0 ),
										top: ( bldg_node.attr('y') ? bldg_node.attr('y') : 0 )
									});
									
						
						var bannerSrc = bldg_node.attr("bannerSrc");
							if( bannerSrc ){
								var preloader = new Image();
								preloader.src=bannerSrc;
							}
							
							
											
						bldgCounter++;
						bldg_elem.data("xml_node", bldg_node);
						world_div.append(label_elem);
						world_div.append(bldg_elem);
					});
				
					//BUBBLE INITIAL INSTANTIAON
					$("#world").animate({opacity:1}, 500, function(){
						$(".script_worldBubbles").each( function(){
							var me= $(this);
							var delayTime = me.index() * 75;
								me.delay(delayTime).animate({opacity:1,top:"-=15px"},{
									duration:300,
									done: function(){
										$(this).delay(1).animate({top:"+=20px"},200);
									},
								});
						});
					});
					
					//INITIALIZE WORLD MENU
					var new_xml = $("<option></option");
					var option = $("<option name='Exam1'></option");
					new_xml.attr('bannerSrc');
					new_xml.append(option );
					
					$("#worldMenuExam").data("xml_node",new_xml)
					
					//Bind enter and leave functions for bubbles
					$(".script_worldBldgs").each( function(){
						var target_bubble = $( $(this).attr( "target" ) );
						var parentElem = $(this);
						if( target_bubble.length ){
							target_bubble.bind("mouseenter", function(){
								parentElem.trigger("mouseenter");
							});
							
							target_bubble.bind("mouseout", function(){
								parentElem.trigger("mouseout");
							});
						}
					});
					
					//Build and Open Option Panes
					var optionPane = $("#optionPane");
					var optionPaneBanner = $("#optionPane #optionPaneBanner");
					var optionPaneSelection = $("#optionPane #optionPaneSelection");
					var currentBldg;
					var currentPane = -1;
					
					var historyCtr = -1;
					var history = new Array();
					$(".script_worldBldgs").click( function(){
						var timeOffset = 300;
						var bannerOffset = 500;
						var elem = currentBldg = $(this);
						var optionPane_index= elem.index();
						if( optionPane.hasClass('isClosed') ){
							//Open the pane
							optionPane.animate({right:"2%" });
							optionPane.removeClass("isClosed");
							optionPane.addClass("isOpen");
						}else{
							//Close the pane
							if( currentPane == optionPane_index ){
							currentPane = -1;
							optionPane.addClass("isClosed");
							optionPane.removeClass("isOpen");
							optionPane.animate({ right: "-36%" });
							}
						}
						
						if( optionPane.hasClass('isOpen') ){
							var elemXML = elem.data("xml_node");
								historyCtr++;
								history[ historyCtr ] = elemXML;
							currentPane = optionPane_index;
							var bannerSrc =  elemXML.attr("bannerSrc");
								if( !bannerSrc ) bannerSrc = "css/imgs/bldg-nobanner.jpg";
							optionPaneBanner.css({
								"background-image" : ( 'url("' + bannerSrc + '")' ),
								backgroundPosition: 'bottom left',
								backgroundSize: '100% 100%',
								opacity:0
								});
								
							setTimeout( function(){
									optionPaneBanner.animate({opacity:1},bannerOffset);
							}, timeOffset * 1 );
							
							
							optionPaneSelection.html("");
							elemXML.children().each( function(){
								var append_elem = $('<p class="optionPaneOption"></p>');
									append_elem.text( $(this).attr("name") );
									append_elem.css({opacity:0});
									append_elem.data("xml_node", $(this));
								optionPaneSelection.append( append_elem);
								
								setTimeout( function(){
									append_elem.animate({opacity:1},500);
								}, timeOffset * $(this).index()  + bannerOffset);
							});
						}
						
					});
					
					
					
					
					
					
					
					//Build and click optionPane options
					optionPane.on("click",'.optionPaneOption', function(){
						var timeOffset = 300;
						var bannerOffset = 500;
						var elem = $(this);
						if( elem.hasClass('isGoBack') ){
							historyCtr--;
							var elemXML = history[ historyCtr ];
						} else{
							historyCtr++;
							var elemXML = elem.data("xml_node");
							history[ historyCtr ] = elemXML;
						}
						
						var lastDex = -1;
						
						if( elemXML.children().length ){
							var bannerSrc =  elemXML.attr("bannerSrc");
								if( !bannerSrc ) bannerSrc = "css/imgs/bldg-nobanner.png";
							optionPaneBanner.css({
									"background-image" : ( 'url("' + bannerSrc + '")' ),
									backgroundPosition: 'bottom left',
									backgroundSize: '100% 100%',
									opacity:0
									});
									
								setTimeout( function(){
										optionPaneBanner.animate({opacity:1},bannerOffset);
								}, timeOffset * 1 );
								
								optionPaneSelection.html("");
								elemXML.children().each( function(){
									var append_elem = $('<p class="optionPaneOption"></p>');
										append_elem.text( $(this).attr("name") );
										append_elem.css({opacity:0});
										append_elem.data("xml_node", $(this));
									optionPaneSelection.append( append_elem);
									
									lastDex = $(this).index();
									setTimeout( function(){
										append_elem.animate({opacity:1},500);
									}, timeOffset * lastDex  + bannerOffset);
								});
								
								if( historyCtr > 0 ){
									var logout_elem = $('<p class="optionPaneOption isGoBack">Go Back</p>');
									logout_elem.css({opacity:0});
									logout_elem.data("xml_node",$(this) );
									optionPaneSelection.append( logout_elem  );
									logout_elem.delay(timeOffset * (lastDex+1)  + bannerOffset).animate({opacity:1},500);
								}
							//is a leaf
						} else{
							var type = elemXML.attr("activityType");
							var config;
							switch( type ){
								case "swf":
									config ={ 
										src:elemXML.attr("src"),
										type: "swf"
										};
									break;
								case "iframe":
									config ={ 
										src:elemXML.attr("src"),
										type: "iframe"
										};
								default:
									return 0; //no type
							}
							sub_activity_switch(1,config);
						}
					});
							//OPTION PANE CLOSE FUNCTION
							$("#optionPane #optionPaneClose").click( function(){
								currentBldg.click();
							});
					
					
					//BIND ANIMATION EVENTS TO BUBBLES AND BUILDINGS
					$(".script_worldBldgs").mouseenter( function(){
						var target_bubble = $( $(this).attr( "target" ) );
						var pixel_offset = 10;
						if( target_bubble.length ){
								target_bubble.addClass("isFocused");
								target_bubble.css({marginTop:pixel_offset});
						}
					});
					
					//BIND ANIMATION EVENTS TO BUBBLES AND BUILDINGS
					$(".script_worldBldgs").mouseout( function(){
						var target_bubble = $( $(this).attr( "target" ) );
						
						if( target_bubble.length ){
								target_bubble.removeClass("isFocused");
								target_bubble.css({marginTop:0});
						}
					});
					
				
				
					//BIND ACTIONS TO LEAF NODES
					//ACTIVITY SWITCHING
					GLOBAL.activity = 0;
					function sub_activity_switch(id){
						var config = arguments.length > 1 ? arguments[1] : 0;
						if( GLOBAL.activity != id ){
						var transitionSpeed = 800;
						var paneLocation;
						var appendString;
							//SETUP PAGE BEFORE ANIMATION
							if( config){
								switch( config.type ){
									case "swf":
										appendString 
											="<object  height='90%' width='90%' data='"+ config.src + "' "
											+ "allowScriptAccess='always' style='margin-left:5%'"
											+ "></object>";
										break;
									case "iframe":
										break;
								}
							}
								
								$('#activityModule').html( appendString );
							//ANIMATE
							GLOBAL.activity = id;
							$(".activity").animate({
								marginLeft: (-100 * id) + "%"
							},transitionSpeed);
							
							if( id == 1 ){
								paneLocation = "102%";
							} else{
								paneLocation = "2%";
								
							}
							
							$("#optionPane").animate({
								right: paneLocation
							},transitionSpeed);
							
							$("#activityModule").fadeToggle();
						}
					}
					
					$("#subActivityReturnBtn").click(function(){
						sub_activity_switch( 0 );
					});

					
					
					$(".script_logout").click( function(){
						
						$.get("php/ajax_logout.php",{},function(){
							$("body").animate({opacity:0},450, function(){
								window.location="index.html";
							});
						});
					});
					
					$("#btn_settings").click (function(){
						$("#settings_bubbles").slideToggle();
					});
					
					$(".script_changePass").click ( function(){
						$('#changePasswordForm').slideToggle();
					});
					
					$(".script_viewStatistics").mouseover ( function(){
						if( $('#script_viewStatisticsTarget').css("display") == "none" )
							$('#script_viewStatisticsTarget').html("<img src='css/imgs/ajax-loader.gif'/>");
					});
					
					$(".script_viewStatistics").click ( function(){
						$('#script_viewStatisticsTarget').slideToggle();
						var link = "php/ajax_getStudentProfile.php";
						var postData = {};
						
						$.post( link, postData, function(m){
							try{
								var data = $.parseJSON(m);
								var statsStr = "";
								
								data.puzzle_report.forEach(function(report){
									statsStr += 
										"<tr><td>"+report.puzzle_name+"</td>" +
										"<td>"+report.score+"</td>"+
										"<td><a href='"+report.link +"'>log</a></td></tr>"
										;
								});
								$('#script_viewStatisticsTarget').html(
										"<table style='font-size:0.8em'>" +
										statsStr +
										"</table>"
									);
							}catch(e){
								console.log(e);
							}
						});
					});
					
					
					
					//Forms
						$("#changePasswordForm").submit( function(e){
							e.preventDefault();
							var form = $(this);
							var confirmElemA = $("#confirmPassA");
							var confirmElemB = $("#confirmPassB");
							if( confirmElemA.val() == confirmElemB.val() ){
								confirmElemA.removeClass('wrong_value');
								confirmElemB.removeClass('wrong_value');
									$.post( "php/ajax_ChangePass.php", $(this).serialize(), function(m){
										if( parseInt(m) ){
											$("#oldPassword").removeClass("wrong_value");
											form[0].reset();
											$(".script_changePass").click();
										}else{
											$("#oldPassword").addClass("wrong_value");
										}
									});
							} else{
								confirmElemA.addClass('wrong_value');
								confirmElemB.addClass('wrong_value');
							}
						});
				
				},"xml");
	});	//GET CURRENT USER SCRIPT
	

});