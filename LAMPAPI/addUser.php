<?php
    // adds user to the Users table

    $inData = getRequestInfo();

    $firstname = $inData["firstname"];
    $lastname = $inData["lastname"];
    $login = $inData["login"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "group21", "4331", "COP4331");
    if ( $conn->connect )
    {
        returnWithError( $conn->connect_error );
    }
    else 
    {
        $sql = "SELECT ID,firstName,lastName FROM Users WHERE firstname=? AND lastname=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $firstname,$lastname);
        $stmt->execute();
        $result = $stmt->get_result();

        if ( $row = $result->fetch_assoc() )
        {
            returnWithError("User already exists");
        }
        else 
        {
            // insert into Users
            $sql = "INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssss", $firstname, $lastname, $login, $password);
            $stmt->execute();
            returnWithError("");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>