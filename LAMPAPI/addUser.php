<?php
    // adds user to the Users table
    header('Access-Control-Allow-Origin: http://www.group21project.com', false);
    header("Access-Control-Allow-Headers: Content-Type");

    $inData = getRequestInfo();

    $firstname = $inData["firstName"];
    $lastname = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "group21", "4331", "COP4331");
    if ( $conn->connect )
    {
        returnWithError( $conn->connect_error );
    }
    else 
    {
        // checks to see if login/Username is available
        $sql = "SELECT ID,firstName,lastName FROM Users WHERE Login=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ( $row = $result->fetch_assoc() )
        {   
            returnWithError(true, "Username already exists");
        }
        else 
        {
            // insert into Users
            $sql = "INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssss", $firstname, $lastname, $login, $password);
            $stmt->execute();
            returnWithError(false, "");
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
	
	function returnWithError( $exists, $err )
	{
        $retValue = array("exists"=>$exists, "error"=>$err);
        $retValue = json_encode($retValue);
		sendResultInfoAsJson( $retValue );
	}
?>