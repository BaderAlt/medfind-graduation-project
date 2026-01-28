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




// Retrieve the user's email from the cookie
if (!isset($_COOKIE['userEmail'])) {
    die("User not logged in.");
}
$userEmail = $_COOKIE['userEmail'];




// Check if the user is already subscribed
$sql_check_subscription = "SELECT * FROM Subscription WHERE email = '$userEmail'";
$result_subscription = $conn->query($sql_check_subscription);

$isSubscribed = $result_subscription->num_rows > 0 ? 'true' : 'false';




// Set the subscription status in a cookie
setcookie("isSubscribed", $isSubscribed, time() + (86400 * 1), "/"); // 86400 = 1 day




// Determine which action the user is performing
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Update email
    if (isset($_POST['newEmail'])) {
        $newEmail = $_POST['newEmail'];





        // Check if the new email already exists in the database
        $sql_check = "SELECT * FROM signup WHERE email = '$newEmail'";
        $result = $conn->query($sql_check);





        if ($result->num_rows > 0) {
            // Email already exists, display an alert and prevent update
            echo "<script>
                    alert('The email you entered is already used.');
                    window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                  </script>";
            exit();
        } else {
            // Update the user's email in the database
            $sql = "UPDATE signup SET email='$newEmail' WHERE email='$userEmail'";

            if ($conn->query($sql) === TRUE) {
                // Update the cookie to the new email
                setcookie("userEmail", $newEmail, time() + (86400 * 1), "/"); // 86400 = 1 day
                echo "<script>
                        alert('Email updated successfully.');
                        window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                      </script>";
            } else {
                echo "<script>
                        alert('Error updating email: " . $conn->error . "');
                        window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                      </script>";
            }
        }
    }




    // Update password
    if (isset($_POST['currentPassword']) && isset($_POST['newPassword']) && isset($_POST['confirmPassword'])) {
        $currentPassword = $_POST['currentPassword'];
        $newPassword = $_POST['newPassword'];
        $confirmPassword = $_POST['confirmPassword'];

        // Check if the current password matches the one in the database
        $sql = "SELECT * FROM signup WHERE email='$userEmail' AND password='$currentPassword'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Check if the new password matches the confirm password
            if ($newPassword === $confirmPassword) {
                // Update the user's password in the database
                $sql = "UPDATE signup SET password='$newPassword', confirmPassword='$confirmPassword' WHERE email='$userEmail'";

                if ($conn->query($sql) === TRUE) {
                    echo "<script>
                            alert('Password updated successfully.');
                            window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                          </script>";
                } else {
                    echo "<script>
                            alert('Error updating password: " . $conn->error . "');
                            window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                          </script>";
                }
            } else {
                echo "<script>
                        alert('New passwords do not match.');
                        window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                      </script>";
            }
        } else {
            echo "<script>
                    alert('Current password is incorrect.');
                    window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                  </script>";
        }
    }




    // Update gender
    if (isset($_POST['newGender'])) {
        $newGender = $_POST['newGender'];

        // Update the user's gender in the database
        $sql = "UPDATE signup SET gender='$newGender' WHERE email='$userEmail'";

        if ($conn->query($sql) === TRUE) {
            echo "<script>
                    alert('Gender updated successfully.');
                    window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                  </script>";
        } else {
            echo "<script>
                    alert('Error updating gender: " . $conn->error . "');
                    window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                  </script>";
        }
    }





    // Handle subscription form submission
    if (isset($_POST['cardName']) && isset($_POST['cardNumber']) && isset($_POST['cvv']) && isset($_POST['expiryDate'])) {
        $cardName = $_POST['cardName'];
        $cardNumber = $_POST['cardNumber'];
        $cvv = $_POST['cvv'];
        $expiryDate = $_POST['expiryDate'];



        // Convert the expiryDate from MM/YY to YYYY-MM-01 format
        $expiryDateParts = explode('/', $expiryDate);
        $expiryMonth = $expiryDateParts[0];
        $expiryYear = '20' . $expiryDateParts[1]; // Assuming the year is in YY format
        $formattedExpiryDate = $expiryYear . '-' . $expiryMonth . '-01'; // Format as YYYY-MM-01



        // Insert the subscription data into the Subscription table
        $sql = "INSERT INTO Subscription (email, cardName, cardNum, cvv, expiryDate) VALUES ('$userEmail', '$cardName', '$cardNumber', '$cvv', '$formattedExpiryDate')";

        if ($conn->query($sql) === TRUE) {
            // Update the subscription status in the cookie
            setcookie("isSubscribed", 'true', time() + (86400 * 1), "/"); // 86400 = 1 day
            echo "<script>
                    alert('Subscription details added successfully.');
                    window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                  </script>";
        } else {
            echo "<script>
                    alert('Error adding subscription details: " . $conn->error . "');
                    window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                  </script>";
        }
    }

    // Handle subscription cancellation
    if (isset($_POST['cancelSubscription'])) {
        // Delete the subscription record from the Subscription table based on the user's email
        $sql = "DELETE FROM Subscription WHERE email='$userEmail'";

        if ($conn->query($sql) === TRUE) {
            // Update the subscription status in the cookie
            setcookie("isSubscribed", 'false', time() + (86400 * 1), "/"); // 86400 = 1 day
            echo "<script>
                    alert('Subscription cancelled successfully.');
                    window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                  </script>";
        } else {
            echo "<script>
                    alert('Error cancelling subscription: " . $conn->error . "');
                    window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                  </script>";
        }
    }

    // Delete account
    if (isset($_POST['deleteAccount'])) {
        // Delete the user's account from the database
        $sql = "DELETE FROM signup WHERE email='$userEmail'";

        if ($conn->query($sql) === TRUE) {
            // Clear the cookie and session
            setcookie("userEmail", "", time() - 3600, "/"); // Expire the cookie
            setcookie("isSubscribed", "", time() - 3600, "/"); // Expire the subscription cookie
            session_destroy();

            echo "<script>
                    alert('Account deleted successfully.');
                    window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/Index.ejs';
                  </script>";
            exit();
        } else {
            echo "<script>
                    alert('Error deleting account: " . $conn->error . "');
                    window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
                  </script>";
        }
    }
}

// Close the connection
$conn->close();

// Redirect back to MyAccount.html
echo "<script>
        window.location.href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs';
      </script>";
?>
