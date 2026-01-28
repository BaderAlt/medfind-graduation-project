// Function to get the value of a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Get the subscription status from the cookie
    const isSubscribed = getCookie('isSubscribed') === 'true';

    // Get the elements
    const paymentMethodDiv = document.querySelector(".Payment-Method");
    const accountInfoDiv = document.querySelector(".Account-Information");
    const goToPaymentButton = document.querySelector(".goTo-Payment");
    const backToAccountInfoButton = document.querySelector(".BackTo-Accountinfo");

    const cancelSubscriptionForm = document.querySelector("#cancelSubscriptionForm");
    const goToPaymentForm = document.querySelector("#go-to-payment");

    const changeEmailForm = document.querySelector("#changeEmailForm");
    const changePasswordForm = document.querySelector("#changePasswordForm");
    const paymentMethodForm = document.querySelector("#paymentMethod");

    const msgChangeEmail = document.createElement("p");
    const msgChangePassword = document.createElement("p");
    const msgPaymentMethod = document.createElement("p");

    // Add the message elements to the forms and set their color to red
    msgChangeEmail.style.color = "red";
    msgChangePassword.style.color = "red";
    msgPaymentMethod.style.color = "red";
    changeEmailForm.appendChild(msgChangeEmail);
    changePasswordForm.appendChild(msgChangePassword);
    paymentMethodForm.appendChild(msgPaymentMethod);

    // Initially hide the Payment Method section
    paymentMethodDiv.style.display = "none";
    accountInfoDiv.style.display = "block"; // Show the Account Information section by default

    // Show or hide forms based on subscription status
    if (isSubscribed) {
        cancelSubscriptionForm.style.display = "block";
        goToPaymentForm.style.display = "none";
    } else {
        cancelSubscriptionForm.style.display = "none";
        goToPaymentForm.style.display = "block";
    }

    // When the 'Go to Payment Method to Subscribe' button is clicked
    goToPaymentButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent the default form submission behavior
        paymentMethodDiv.style.display = "block";
        accountInfoDiv.style.display = "none"; // Hide the Account Information section
    });

    // When the 'Back to Account Information' button is clicked
    backToAccountInfoButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent the default form submission behavior
        paymentMethodDiv.style.display = "none";
        accountInfoDiv.style.display = "block"; // Show the Account Information section
    });

    // Validate Change Email form
    changeEmailForm.addEventListener('submit', e => {
        let messages = [];
        
        // Check if email is missing
        messages = isFilled("#email", messages, "Email is missing");

        // Validate email format
        messages = isEmailValid("#email", messages, "Email format is wrong");

        if (messages.length > 0) {
            msgChangeEmail.innerHTML = "Issues found [" + messages.length + "]: " + messages.join(", ") + ".";
            e.preventDefault(); // Prevent form submission if there are validation errors
        }
    });

    // Validate Change Password form
    changePasswordForm.addEventListener('submit', e => {
        let messages = [];

        // Validate current password
        messages = isFilled("#currentPassword", messages, "Current password is missing");

        // Validate new password
        messages = isFilled("#newPassword", messages, "New password is missing");
        messages = isPassValid("#newPassword", messages, "Password must be at least 8 edget, contain one capital letter, and one symbol");

        // Check if confirm password is missing
        messages = isFilled("#confirmPassword", messages, "Confirm New Password is missing");

        // Confirm password
        messages = passNotmatchConfirmPass("#confirmPassword", messages, "The password does not match");

        if (messages.length > 0) {
            msgChangePassword.innerHTML = "Issues found [" + messages.length + "]: " + messages.join(", ") + ".";
            e.preventDefault(); // Prevent form submission if there are validation errors
        }
    });

    // Validate Payment Method form
    paymentMethodForm.addEventListener('submit', e => {
        let messages = [];

        // Validate name on the card
        messages = isFilled("#cardName", messages, "Name on the card is missing");
        messages = isNameOnCardValid("#cardName", messages, "Name on the card must be in English, contain only letters, and be less than 50 characters");

        // Validate card number
        messages = isFilled("#cardNumber", messages, "Card number is missing");
        messages = isCardNumberValid("#cardNumber", messages, "Card number must be numeric, contain only digits, and be less than 30 digits");

        // Validate CVV
        messages = isFilled("#cvv", messages, "CVV is missing");
        messages = isCVVValid("#cvv", messages, "CVV must be numeric and exactly 3 digits");

        // Validate expiry date
        messages = isFilled("#expiryDate", messages, "Expiry date is missing");
        messages = isExpiryDateValid("#expiryDate", messages, "Expiry date must be in MM/YY format, and month should be between 01 and 12");

        if (messages.length > 0) {
            msgPaymentMethod.innerHTML = "Issues found [" + messages.length + "]: " + messages.join(", ") + ".";
            e.preventDefault(); // Prevent form submission if there are validation errors
        }
    });

    /* Utility Functions */

    // Check if a field is filled
    function isFilled(selector, messages, msg) {
        const element = document.querySelector(selector).value.trim();
        if (element.length < 1) {
            messages.push(msg);
        }
        return messages;
    }

    // Validate email format
    function isEmailValid(selector, messages, msg) {
        const element = document.querySelector(selector).value.trim();
        if (!element.match("[a-z0-9]+@[a-z]+\\.[a-z]{2,4}")) {
            messages.push(msg);
        }
        return messages;
    }

    // Validate password strength
    function isPassValid(selector, messages, msg) {
        const elementValue = document.querySelector(selector).value.trim();

        if (elementValue.length < 8) {
            messages.push("Password must be at least 8 edget.");
        }

        if (!/[A-Z]/.test(elementValue)) {
            messages.push("Password must contain at least one capital letter.");
        }

        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(elementValue)) {
            messages.push("Password must contain at least one symbol.");
        }

        return messages;
    }

    // Check if passwords match
    function passNotmatchConfirmPass(selector, messages, msg) {
        const element = document.querySelector(selector).value.trim();
        const newPassValue = document.querySelector("#newPassword").value.trim();

        if (element !== newPassValue) {
            messages.push(msg);
        }
        return messages;
    }

    // Validate Name on the Card
    function isNameOnCardValid(selector, messages, msg) {
        const element = document.querySelector(selector).value.trim();
        if (!/^[A-Za-z\s]{1,50}$/.test(element)) {
            messages.push(msg);
        }
        return messages;
    }

    // Validate Card Number
    function isCardNumberValid(selector, messages, msg) {
        const element = document.querySelector(selector).value.trim();
        if (!/^\d{1,30}$/.test(element)) {
            messages.push(msg);
        }
        return messages;
    }

    // Validate CVV
    function isCVVValid(selector, messages, msg) {
        const element = document.querySelector(selector).value.trim();
        if (!/^\d{3}$/.test(element)) {
            messages.push(msg);
        }
        return messages;
    }

    // Validate Expiry Date
    function isExpiryDateValid(selector, messages, msg) {
        const element = document.querySelector(selector).value.trim();
        
        // Regular expression to match MM/YY format
        const regex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
        const match = element.match(regex);

        if (!match) {
            messages.push(msg);
        } else {
            const today = new Date();
            const inputMonth = parseInt(match[1], 10);
            const inputYear = parseInt("20" + match[2], 10); // Assuming year is given as 'YY'
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth() + 1; // Months are 0-based

            if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
                messages.push("Expiry date cannot be in the past.");
            }
        }

        return messages;
    }
});
