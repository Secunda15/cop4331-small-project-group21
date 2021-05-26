<?php
    // adds user to the Users table

    $inData = getRequestInfo();

    $firstname = $inData["firstName"];
    $lastname = $inData["lastName"];
    $email = $inData["email"];
    $phone = $inData["phone"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "group21", "4331", "COP4331");
    if ( $conn->connect )
    {
        returnWithError( $conn->connect_error );
    }
    else 
    {
        // insert into Users
        $sql = "INSERT INTO Contacts (FirstName, LastName, Email, Phone, UserID) VALUES(?,?,?,?,?)";
        $stmt = $conn->prepare( $sql );
        $stmt->bind_param("sssss", $firstname, $lastname, $email, $phone, $userId);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError( "" );
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
?>