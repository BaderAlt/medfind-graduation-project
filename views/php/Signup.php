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
$email = $_POST['sgemail'];
$gender = $_POST['sggender'];
$password = $_POST['sgpass'];
$confirmPassword = $_POST['connpass'];

// Check if the password matches the confirm password
if ($password !== $confirmPassword) {
    echo "Passwords do not match!";
    exit();
}

// Check if the email already exists in the database
$sql_check = "SELECT * FROM signup WHERE email = '$email'";
$result = $conn->query($sql_check);

if ($result->num_rows > 0) {
    // Email already exists
    echo "<script>
            alert('The email you entered is already used.');
            window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/Login.ejs';
          </script>";
    exit();
} else {
    // Insert data into the table
    $sql_insert = "INSERT INTO signup (email, gender, password, confirmPassword) VALUES ('$email', '$gender', '$password', '$confirmPassword')";

    if ($conn->query($sql_insert) === TRUE) {
        // Set a cookie to store the user's email for 1 day
        setcookie("userEmail", $email, time() + (86400 * 1), "/"); // 86400 = 1 day
        
        // Set local storage flag and redirect to the homepage
        echo "<script>
                localStorage.setItem('homePageActive', 'true');
                window.location.href = 'http://localhost:344/PROJECT-GRADUATION-2/views/Index.ejs';
              </script>";
        exit();
    } else {
        echo "Error: " . $sql_insert . "<br>" . $conn->error;
    }
}

$conn->close();
?>
