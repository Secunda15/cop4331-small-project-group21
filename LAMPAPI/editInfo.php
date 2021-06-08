<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = false;

	$conn = new mysqli("localhost", "group21", "4331", "COP4331");
	if ( $conn->connect ) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $sql = "SELECT * FROM Contacts WHERE ID=?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $inData["id"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		if ($row = $result->fetch_assoc())
		{
            $searchCount = true;
            $res = array("id"=>$row["ID"], "firstName"=>$row["FirstName"], "lastName"=>$row["LastName"], "email"=>$row["Email"], "phone"=>$row["Phone"], "userId"=>$row["UserID"]);
            $searchResults = json_encode($res);
		}
		
		if ( !$searchCount )
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
		sendResultInfoAsJson( $searchResults );
	}
