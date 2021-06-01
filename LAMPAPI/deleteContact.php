<?php
    // adds user to the Users table
    // header('Access-Control-Allow-Origin: http://www.group21project.com', false);
    // header("Access-Control-Allow-Headers: Content-Type");

    $inData = getRequestInfo();
    $id = $inData["id"];

    $conn = new mysqli("localhost", "group21", "4331", "COP4331");
    if ( $conn->connect )
    {
        returnWithError( $conn->connect_error );
    }
    else 
    {
        // Delete contact
        $sql = "DELETE FROM Contacts WHERE ID=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $id);
        $stmt->execute();
        returnWithError("");

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
        $retValue = array("error"=>$err);
        $retValue = json_encode($retValue);
		sendResultInfoAsJson( $retValue );
	}
