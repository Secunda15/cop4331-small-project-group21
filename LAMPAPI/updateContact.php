<?php
// adds user to the Users table
// header('Access-Control-Allow-Origin: http://www.group21project.com', false);
// header("Access-Control-Allow-Headers: Content-Type");

$inData = getRequestInfo();

$id = $inData["id"];
$firstname = $inData["firstName"];
$lastname = $inData["lastName"];
$email = $inData["email"];
$phone = $inData["phone"];
$userid = $inData["userId"];


$conn = new mysqli("localhost", "group21", "4331", "COP4331");
if ($conn->connect) {
    returnWithError($conn->connect_error);
} else {
    // Delete contact
    $sql = "UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=? WHERE ID=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $firstname, $lastname, $email, $phone, $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) 
    {
        returnWithError("");
    }
    else 
    {
        returnWithError("Could not update contact");
    }
    

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = array("error" => $err);
    $retValue = json_encode($retValue);
    sendResultInfoAsJson($retValue);
}
