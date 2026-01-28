<?php


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

// Retrieve data from the form
$email = $_POST['logemail'];
$password = $_POST['logpass'];

// Check if the user exists in the database
$sql = "SELECT * FROM signup WHERE email='$email' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Set a cookie to store the user's email for 1 day
    setcookie("userEmail", $email, time() + (86400 * 1), "/"); // 86400 = 1 day

    // User found, set local storage flag and redirect to the homepage
    echo "<script>
            localStorage.setItem('homePageActive', 'true');
            window.location.href = 'http://localhost:344/PROJECT-GRADUATION-2/views/Index.ejs';
          </script>";
    exit();
} else {
    // Display an alert box with the error message
    echo "<script>alert('Invalid email or password!'); window.location.href = 'http://localhost:344/PROJECT-GRADUATION-2/views/Login.ejs';</script>";
}

$conn->close();
?>
