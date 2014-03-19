<html>
<head>
	<link rel='stylesheet' href='css/jquery-ui.min.css' />
	<script src="js/jquery.min.js"></script>
	<?php
		require "php/config.php";
	?>
</head>
<body>
	<?php 
	if($_GET['add_to']=="user"): 
		db_manager::registerQuery("getClasses", "SELECT class_subj_code, class_schedule, class_ID FROM class ORDER BY class_subj_code ASC");
		$classes =  db_manager::doQuery("getClasses");
	?>
	<form method='post' id="registerStudent" action="php/register_user.php">
		<p>
			<input type="text" name='school_id' placeholder="id number"/>
			<input type="text" name='user_Fname'  placeholder="first name"/>
			<input type="text" name='user_Mname'  placeholder="middle name"/>
			<input type="text" name='user_Lname'  placeholder="last name"/>
			<select multiple name='class_ID' placeholder='subject code'>
				<?php
					foreach( $classes as $class ){
						echo "<option value='class_ID'>$class[class_subj_code] $class[class_schedule]</option>";
					}
				?>
			</select>
		</p>
		<input type="submit"  class='submit'/>
	</form>
	
	
	
	<?php 
	endif; if($_GET['add_to']=="class"): 
		db_manager::registerQuery("getAdvisers", "SELECT user_Fname, user_Lname, user_ID FROM user WHERE user_type='T' ");
		$advisers =  db_manager::doQuery("getAdvisers");
	?>
	<form method='post' id="registerClass" action="php/register_class.php">
		<p>
			<input type="text" name='class_subj_code' placeholder='subject code'/>
			<select name='class_adviser'>
				<?php
					foreach( $advisers as $adviser ){
						echo "<option value='user_ID'>$adviser[user_Lname], $adviser[user_Fname]</option>";
					}
				?>
			</select>
			<input type="text" name='class_schedule' placeholder='class schedule'/>
			<input type="text" name='school_year' placeholder='school year'/>
			<input type="text" name='semester' placeholder='semester'/>
		</p>
		<input type="submit" class='submit' />
	</form>
	<?php endif;  ?>
	
	<script >
		var forms = $("form");
	
		forms.on("click","p:last-of-type", function(){
			$(this).parent().find('.submit').before( $(this).clone() );
		});
		
	</script>
	
	<style>
		
		input, select{
			border:solid thin black;
			padding:0.5em;
			vertical-align:top;
		}
	
	</style>
</body>
</html>