<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "group21", "4331", "COP4331");
	if ( $conn->connect ) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $sql = "SELECT * FROM Contacts WHERE (firstName like ? or lastname like ?) and UserID=? ORDER BY FirstName ASC, LastName ASC";
		$stmt = $conn->prepare($sql);
		$search = "%" . $inData["search"] . "%";
		$stmt->bind_param("sss", $search, $search, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
            
            $res = array("id"=>$row["ID"], "firstName"=>$row["FirstName"], "lastName"=>$row["LastName"], "email"=>$row["Email"], "phone"=>$row["Phone"], "userId"=>$row["UserID"]);
            $searchResults .= json_encode($res);
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>