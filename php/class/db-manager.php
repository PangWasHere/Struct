<?php
	/*
		Class: db_manager
		A static class that manages db connections and some security processes.
	*/
	CLASS db_manager{
		private static $db_user;
		private static $db_pass;
		private static $db_name;
		private static $db_host;
		private static $is_connected = false;
		private static $query_cache = array();			//cache for queries
		private static $query_argNum_cache = array();	//cache for number of arguments per query
		private static $num_rows_cache = array();		//cache for total number of rows found for paged queries
		private static $connection = null;
		private static $defaultMysqlLimit = 30;
		
		/*
			Function: setCredentials
			Sets the db user, password, host and name for the connection.
			
			Parameters:
				$settings - Accepts an assoc array with the ff indexes: db_user, db_pass, db_name and db_host
		*/
		static function setCredentials( $settings ){
			self::$db_user = $settings["db_user"];
			self::$db_pass = $settings["db_pass"];
			self::$db_name = $settings["db_name"];
			self::$db_host = $settings["db_host"];
		}
		
		/*
			Function: connect
			Creates a connection to to the server using the set credentials.
			
			Returns:
			*mysql connection* when there is already a succesful connection but a connect is called again
			*true* when there is a succesful connection and the database was selected succesfully.
			*false* when there is a succesful connection but the database could not be selected.
			*exception* when you cannot connect to the database.
			
			See Also:
				<close>
		*/
		static function connect(){
			if( self::$connection ){
				return self::$connection;
			} else{
				self::$connection = mysql_connect(self::$db_host,self::$db_user,self::$db_pass);
				if( self::$connection ){
					if( mysql_select_db(self::$db_name) ) return true;
					else return false;
				} else{
					throw new Exception('Could not connect to database.');
				}
			}
		}
		
		/*
			Function: close
			Closes the connection previously connected.
			
			See Also:
				<connect>
		*/
		static function close(){
			unset( self::$connection );
			mysql_close();
		}
		
		/*
			Function: registerQuery
			Registers a query to be run as a process.
			
			Parameters:
				$handle - The handle of the query to be supplied later when actually performing the query.
				$query - The query to be performed. Supply a non-parsed php statement that can be replaced
				by variables. This query can then be called by doQuery as a procedure. Always use single quotes
				when supplying this to make sure the statement won't be parsed.
			
			Example:
				- registerQuery( 'procedure_A', 'SELECT * FROM $table WHERE id="$myid"; ' );
				- registerQuery( 'procedure_B', 'INSERT into table_B VALUES( null, $id, "$name", now() ); ' );
				
			Warning:
				$query has to be NON-PARSED. That means if the original statement was "hello $myvariable". PHP
				won't replace the $myvariable part. *PHP has the ability to replace variables in strings*. So
				be careful when doing this.
				
				
			See Also:
				<doQuery>
		*/
		static function registerQuery( $query_id, $query_string ){
			self::$query_cache[$query_id] = $query_string;
			
			//Count number of arguments then store in arguments cache
			$count_me = null;	
			preg_match_all("/[$][-a-zA-Z0-9_]*/",$query_string,$count_me );
			$count_temp = count( $count_me[0] ); 
			self::$query_argNum_cache[$query_id] = $count_temp;
			
			//If it is a select statement, create a new query from it with an sql append
			if( preg_match( "/[Ss][Ee][Ll][Ee][Cc][Tt]/", $query_string) && !preg_match( "/[Ll][iI][mM][iI][Tt]/", $query_string) ){
				$new_id = "PQ_$query_id";
				$str_tmp = substr( $query_string, 6 );
				$str_tmp = "SELECT SQL_CALC_FOUND_ROWS " . $str_tmp;

				self::$query_argNum_cache[$new_id] = $count_temp + 2; //+2 for the limit variables
				self::$query_cache[$new_id] = $str_tmp.' LIMIT $mysql_offset, $mysql_limit';
			}
		}
		
		/*
			Function: doQuery
			Performs a registered query like a procedure. These contain
			some security measures already.
			
			The doQuery throws an exception upon argument mismatch.
			
			Return:
				An ASSOC array if the query is a SELECT statement.
				A number of affected rows on UPDATE and DELETE.
				A number which is the id of an AUTO incremented INSERT.
			
			Parameters:
				$handle - Handle of the query to be called.
				$args - The data to replace the PHP variables placed in the query.
				Can be an assoc array or the data itself.
				
				[, $args...] - More data to replace the PHP variables, if the previous
				$args was not an assoc array. In the case of it not being an assoc array,
				the data replaces the variable in the query in the order it was supplied ( see example 2).
				
			Example:
				_Assoc Array as an argument_
				- doQuery( "procedure_A", array( '$table'=>"table_A", '$myid'=>25 ) ); 
				_Infinitive arguments_
				- doQuery( "procedure_B", 25, "Albert Einstein" );
				
			See Also:
				<registerQuery>, <doPaginatedQuery>
		*/
		static function doQuery( $query_id  ){
			$haveArgs = func_num_args()-1;
			if( $haveArgs ){
				$data = func_get_arg( 1 );
			}
			if( !self::$connection ){
				throw new Exception("Attempting to do query when there is no connection.");
			}
			$patterns = array();
			$replacements = array();
			$string = self::$query_cache[ $query_id ];


			if( $haveArgs ){
				$ctr = 0;

				//Determine if assoc array usage or basic
				if( is_array( $data ) ){
					//Check for arguments mismatch

					if( self::$query_argNum_cache[ $query_id ] != count( $data) ){
						throw new Exception("Argument mismatch for query");
					}
					
					foreach( $data as $index=>$datum ){
						$patterns[ $ctr ] = "/\\$index/";
						$replacements[ $ctr ] = mysql_real_escape_string("$datum");
						$ctr++;
						
					}
				} else{
					
				
					preg_match_all("/[$][-a-zA-Z0-9_]*/",$string,$patterns );
					$old_patt = $patterns[0];
					$infinitive_args = func_get_args();
					$max = count( $infinitive_args ) - 1;
					//Check for arguments mismatch
					if( self::$query_argNum_cache[ $query_id ] != $max ){
						throw new Exception("Argument mismatch for query");
					}
			
					while( $ctr < $max ){
						$patterns[ $ctr ] = "/\\".$old_patt[ $ctr ]."/";
						$replacements[ $ctr ] = mysql_real_escape_string($infinitive_args[ $ctr + 1 ]); 
						$ctr++;
					}
					
				}

				//Sort keys
				ksort($patterns);
				ksort($replacements);		

				$safe_query = preg_replace($patterns, $replacements, $string);
			} else {
				$safe_query= $string;
			}
			self::connect();

			$resource = mysql_query( $safe_query );
			//Succesful query
			if( $resource ){
				//IF SELECT
				if( preg_match( "/^(SELECT|select)/", $string )  ){
					$return_assoc = array();
					while( $return_assoc[] = mysql_fetch_assoc( $resource) );
					return array_filter($return_assoc);
				} else if( preg_match( "/^(INSERT|insert)/", $string ) !== FALSE ){
					return mysql_insert_id();
				} else{
					return mysql_affected_rows();
				}
			} else{
				//Error in query
				throw new Exception( mysql_error() );
			}	
			
		}
		/*
			Function: setDefaultLimit
			This sets the standard number of records to be pulled out during a paginated query.
		*/
		
		static function setDefaultLimit( $limit ){
			self::$defaultMysqlLimit = $limit;
		}
		
		
		/*
			Function: doPaginatedQuery
			This calls a registered query but attempts to call a paginated version of it.
			The number of records retrieved is by default 30 and can be changed via
			setDefaultLimit.
			
			Returns:
				The same thing as the doQuery.
			
			Parameters:
				$page_offset - Is the page offset. 0 is the first page. Other numbers will retrieve the (Offset * Limit)th record.
				$handle - Handle of the query to be called.
				$args - The data to replace the PHP variables placed in the query.
				Can be an assoc array or the data itself.
				
				[, $args...] - More data to replace the PHP variables, if the previous
				$args was not an assoc array. In the case of it not being an assoc array,
				the data replaces the variable in the query in the order it was supplied ( see example 2).
				
			Example:
				_Assoc Array as an argument_
				Retrieve records 0th - 29th
				- doQuery( 0,"select_A", array( '$table'=>"table_A", '$myid'=>25 ) ); 
				_Infinitive arguments_
				Retrieve records 90th - 119th
				- doQuery( 3,"select_B", "Albert Einstein" ); 
				
			See Also:
				<doQuery>, <setDefaultLimit>, <getMaxPages>
				
		*/
		static function doPaginatedQuery($mysql_offset,$query_id){
			$new_qid = "PQ_$query_id";

			if( isset( self::$query_cache[$new_qid] ) ){
				
				$args = array( "$new_qid" );
				$haveArgs = func_num_args() > 2;
				if( $haveArgs ){
					$data = func_get_arg( 2 );
				} else{
					$data =null;
				}
				
				if( is_array( $data ) ){
				$temp = $data;
				$temp['$mysql_offset']= $mysql_offset * self::$defaultMysqlLimit;
				$temp['$mysql_limit']= self::$defaultMysqlLimit;
				$args[] = $temp;
				} else{
					$temp = func_get_args();
					$mysql_offset = array_shift( $temp );
					array_shift( $temp );
					$temp[] = $mysql_offset * self::$defaultMysqlLimit;
					$temp[] = self::$defaultMysqlLimit;
					$args = array_merge($args, $temp);
				}
	
				$return_var = call_user_func_array( "self::doQuery", $args );
				$foundRowsTemp = mysql_fetch_assoc( mysql_query("SELECT FOUND_ROWS();") );
				self::$num_rows_cache[$query_id] = $foundRowsTemp["FOUND_ROWS()"]/ self::$defaultMysqlLimit;
				return $return_var;
			} else{
				throw new Exception("Registered query is not a eligible for this function.");
			}
		}
		
		/* 
			Function: getMaxPages
			Returns the number of pages left of a paginated query with respect to the set limit.
			
			Parameters:
				$query_id - id of the query whose max is retrieved.
				
			Warning:
				For efficiency, the paginated query must have been executed before you can call
				getMaxPages.
			
			See Also:
				<doPaginatedQuery>
		*/
			static function getMaxPages($query_id){
				return self::$num_rows_cache[$query_id];
			}
		
		/*
			Function: getQuery
			This returns the original query registered.
			
			Parameters:
				$query_id - id of the query to be retrieved.
				
			See Also:
				<getMaxPages>
		*/
		static function getQuery( $query_id ){
			return self::$query_cache[ $query_id];
		}
		
	
		
	}

	
	
?>