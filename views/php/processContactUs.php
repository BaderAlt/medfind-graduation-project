<?php
$servername = "localhost";
$username = "root";
$password = "root"; 
$dbname = "pharmacyweb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Capture form data
$firstName = $_POST['fname'];
$lastName = $_POST['lname'];
$gender = $_POST['gender'];
$mobile = $_POST['mobile'];
$dateOfBirth = $_POST['dateOfBirth'];
$email = $_POST['email'];
$language = $_POST['language'];
$message = $_POST['message'];

// Prepare the SQL statement
$sql = "INSERT INTO contactus (firstName, lastName, gender, mobile, dateOfBirth, email, language, message) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssss", $firstName, $lastName, $gender, $mobile, $dateOfBirth, $email, $language, $message);

// Execute the query
if ($stmt->execute()) {
    // Display the thank you message
    echo "<h1>Thank you " . htmlspecialchars($firstName) . ", we got your message :)</h1>";
    echo "<p><a href='http://localhost:344/PROJECT-GRADUATION-2/views/Index.ejs'>Click here</a> to return to the Homepage.</p>";
} else {
    echo "Error: " . $stmt->error;
}

// Close the connection
$stmt->close();
$conn->close();
?>
