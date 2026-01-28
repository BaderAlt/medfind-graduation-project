<?php
// Start the session to access the cookie
session_start();

// Connect to the database
$servername = "localhost";
$username = "root"; 
$password = "root"; 
$dbname = "pharmacyweb"; 

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Initialize subscription status
$isSubscribed = 'false';

// Retrieve the user's email from the cookie
if (isset($_COOKIE['userEmail'])) {
    $userEmail = $_COOKIE['userEmail'];

    // Check if the user is subscribed
    $sql_check_subscription = "SELECT * FROM Subscription WHERE email = '$userEmail'";
    $result_subscription = $conn->query($sql_check_subscription);

    if ($result_subscription->num_rows > 0) {
        $isSubscribed = 'true';
    }
}

// Set the subscription status in a cookie
setcookie("isSubscribed", $isSubscribed, time() + (86400 * 1), "/"); // 86400 = 1 day

// Close the connection
$conn->close();
?>
