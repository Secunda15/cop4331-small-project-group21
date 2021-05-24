<?php
    // adds user to the Users table
    
    $inData = getRequestInfo();

    $firstname = $inData["firstname"];
    $lastname = $inData["lastname"];
    $login = $inData["login"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "group21", "4331", "COP4331");
    if ($conn->connect)
    {
        returnWithError( $conn->connect_error );
    }
    else 
    {
        # insert into Users
        $sql = "INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $firstname, $lastname, $login, $password);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>