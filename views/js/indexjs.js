document.addEventListener("DOMContentLoaded", function () {
    // Function to get the value of a cookie by name
    function getCookie(name) {
        let cookieArr = document.cookie.split(";");
        for (let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split("=");
            if (name === cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }

    // Get the user's email from the cookie
    const userEmail = getCookie("userEmail");

    // Get elements
    const userEmailElement = document.getElementById("userEmail");
    const logoutButton = document.getElementById("logoutButton");
    const loginLink = document.querySelector("a[href='http://localhost:344/PROJECT-GRADUATION-2/views/Login.ejs']");
    const homepageLink = document.querySelector("a[href='http://localhost:344/PROJECT-GRADUATION-2/views/Index.ejs']");
    const myAccountLink = document.querySelector("a[href='http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs']");
    const allNavLinks = document.querySelectorAll("header a");

    // Function to set the active class to the correct link
    function setActiveLink() {
        const currentPath = window.location.pathname.split("/").pop(); // Get the current file name from the URL
        allNavLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split("/").pop(); // Get the file name from the href attribute
            if (linkPath === currentPath) {
                link.classList.add('Active');
            } else {
                link.classList.remove('Active');
            }
        });
    }

    // Update the header based on user login status
    if (userEmail) {
        if (userEmailElement) {
            userEmailElement.innerHTML = `<span style="color: white;">Hi: </span><span style="color: goldenrod;">${userEmail}</span>`;
            logoutButton.style.display = "inline-block"; // Show the logout button

            // Replace the Login link with My Account link
            if (loginLink) {
                loginLink.innerHTML = "My Account";
                loginLink.setAttribute("href", "http://localhost:344/PROJECT-GRADUATION-2/views/MyAccount.ejs"); // Redirect to My Account page
            }
        }
    } else {
        if (logoutButton) {
            logoutButton.style.display = "none"; // Hide the logout button

            // Show the Login link in the header
            if (loginLink) {
                loginLink.innerHTML = "Login";
                loginLink.setAttribute("href", "http://localhost:344/PROJECT-GRADUATION-2/views/Login.ejs"); // Redirect back to the login page
            }
        }
    }

    // Add click event listener to the logout button to clear the cookies and redirect
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            // Clear the userEmail cookie
            document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // Clear the isSubscribed cookie
            document.cookie = "isSubscribed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // Clear the cancelSubscription cookie if it exists
            document.cookie = "cancelSubscription=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // Set flag in local storage and redirect to the homepage
            localStorage.setItem('homePageActive', 'true');
            window.location.href = "/PROJECT-GRADUATION-2/views/Index.ejs"; // Redirect to index.html after logging out
        });
    }

    // Check if we need to apply the active class to the homepage link
    if (localStorage.getItem('homePageActive')) {
        homepageLink.classList.add('Active'); // Apply Active class to homepage link
        localStorage.removeItem('homePageActive'); // Remove the flag
    }

    // Apply the active class when the DOM is loaded
    setActiveLink(); // Apply Active class on initial load

    // Apply the active class to the homepage link if redirected there
    if (window.location.pathname === "/PROJECT-GRADUATION-2/views/Index.ejs" || window.location.pathname === "/") {
        homepageLink.classList.add('Active');
    }
});
