<?php
	/*
		Class: session_manager
		A static class that manages sessions and cookies.
	*/
	CLASS session_manager{
		private static $init_var_map;
		private static $isStartedIndex = "isStarted";
		private static $is_init_index = "session_manager_data";
		
		
		/*
			Function: start
			Sets the db user, password, host and name for the connection.
			This must be called at the top of every page.
			
			It is in this section the init vars are mapped and initialized.
			
			Parameters:
				none
			
			Example:
				- session_manager::start();
			
			See also:
				<setInitVars>
		*/
		static function start(){		
			//Check if var is empty to determine if it has been initialized
			if( !isset($_SESSION[self::$is_init_index] ) ){
				@session_start();
				
				if( self::$init_var_map && !isset( $_SESSION[self::$is_init_index][self::$isStartedIndex]) ){
					$temp_array = array();
					foreach( self::$init_var_map as $key=>$val ){
							$temp_array[ $key ] = $val;
					}
					$_SESSION[ self::$is_init_index ] = $temp_array;
					$_SESSION[self::$is_init_index][self::$isStartedIndex] = true;
				}
				
				
			} else{
				
			}
			
		}
		
		static function stop(){
			session_destroy();
		}
		
		/*
			Function: setInitVars
			Sets the default value of session variables. When start() is called,
			and it is the user's first visit of the website, then the map set by
			this function is applied as a default.
			
			
			
			Parameters:
				$map - Accepts an associative array as an argument. 
				The keys become the variable names,	and the value is the default value.
			
			Example:
				- setInitVars( "authentication" => "guest", "visitorNumber" => $visitorNumber );
			
		*/
		static function setInitVars( $map ){
			self::$init_var_map = $map;
		}
		
		
		/*
			Function: setVar
			Saves a variable to be spanned accross multiple pages.
			
			Parameters:
				$varname - Name of the variable to save into
				$arg - Data to save
				
			Return:
			Returns the content before it was replaced if any. If it is empty returns
			a NULL.
		*/
		static function setVar( $varname, $arg ){
			if( isset( $_SESSION[ self::$is_init_index ][ $varname ] ) ){
				$original_val = $_SESSION[ self::$is_init_index ][ $varname ];
			} else{
				$original_val = NULL;
			}
			$_SESSION[ self::$is_init_index ][ $varname ] = $arg;
			return $original_val;
		}
		
		/*
			Function: getVar
			Retrieves a variable that was set by  setVar
			
			Parameters:
				$varname - Name of the variable to retrieve.
		*/
		static function getVar( $varname ){
			return $_SESSION[ self::$is_init_index ][ $varname ];
		}
		
		/*
			Function: unsetVar
			Unsets a session variable set by setVar
			
			Parameters:
				$varname - Name of the variable to retrieve.
		*/
		static function unsetVar( $varname){
			unset( $_SESSION[ self::$is_init_index ][ $varname] );
		}

	
		
		
	}

	
	
?>