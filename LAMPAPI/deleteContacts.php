<?php
    $inData = getRequestInfo();
    $id = $inData["id"];

    $conn = new mysqli("localhost", "group21", "4331", "COP4331");
    if ($conn -> connect)
    {
        returnWithError($conn->connect_error);
    }
    else 
    {
        // Delete the specified contact
        $sql = "DELETE FROM Contacts WHERE ID = ?";
		
		// Determine if operation was successful
		// If it wasn't successful...
		if ($result = $conn->query($sql) != TRUE)
		{
			returnWithError(true, "Contact could not be deleted");
		}
		
		// If it was successful...
		else
		{
			returnWithError(false, "");
		}
		
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
	
	function returnWithError( $exists, $err )
	{
        $retValue = array("exists"=>$exists, "error"=>$err);
        $retValue = json_encode($retValue);
		sendResultInfoAsJson( $retValue );
	}
