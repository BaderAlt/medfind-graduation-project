/* Call id From (Login form) */
const form1 = document.querySelector("#myform1");
const msg1 = document.querySelector("#msg1");

/* Call id From (SignUp form) */
const form2 = document.querySelector("#myform2");
const msg2 = document.querySelector("#msg2");

/* Default Display For All Two Forms */
form1.style.display = "block";  
form2.style.display = "none";  

/* Messages Display After Click Submit On (Login Form) */
form1.addEventListener('submit', e => {

   /*Type Of Messages On (Login Form) */
   let messagesForm1 = [];

    /* Messages For Login Form */
    messagesForm1 = isFilledLog("#logemail", messagesForm1, "Email is missing");
    messagesForm1 = isEmailLog("#logemail", messagesForm1, "Email format is wrong");
    messagesForm1 = isFilledLog("#logpass", messagesForm1, "Password is missing");
    messagesForm1 = isPassLog("#logpass", messagesForm1, "Password must be at least 8 characters");

    /* Content Of Error Messages On (Login Form) */
    if (messagesForm1.length > 0) {
      msg1.innerHTML = "Issues found [" + messagesForm1.length + "]: " + messagesForm1.join(", ") + ".";
      e.preventDefault();
    }
});

/* Messages Display After Click Submit On (Signup Form) */
form2.addEventListener('submit', e => {

   /*Type Of Messages On (Signup Form) */
   let messagesForm2 = [];

    /* Messages For Signup Form */
    messagesForm2 = isFilledSg("#sgemail", messagesForm2, "Email is missing");
    messagesForm2 = isEmailSg("#sgemail", messagesForm2, "Email format is wrong");
    messagesForm2 = isFilledSg("#sgpass", messagesForm2, "Password is missing");
    messagesForm2 = isPassSg("#sgpass", messagesForm2);
    messagesForm2 = passNotmatchConfirmPass("#connpass", messagesForm2, "The Passwords does not match");

    /* Content Of Error Messages On (Signup Form) */
    if (messagesForm2.length > 0) {
      msg2.innerHTML = "Issues found [" + messagesForm2.length + "]: " + messagesForm2.join(", ") + ".";
      e.preventDefault();
    }
});





/* Functions For (Login Form) */

/* If There Are Any Missing Inputs On (Login Form) */   
function isFilledLog(selector, messagesForm1, msg1) {
    const element = document.querySelector(selector).value.trim();
    if (element.length < 1) {
        messagesForm1.push(msg1);
    }
    return messagesForm1;
}

/* Must Write Email Format On (Login Form) */
function isEmailLog(selector, messagesForm1, msg1) {
    const element = document.querySelector(selector).value.trim();
    if (!element.match("[a-z0-9]+@[a-z]+\.[a-z]{2,4}")) {
       messagesForm1.push(msg1);
    }
    return messagesForm1;
}

/* Password Must Be At Least 8 Characters On (Login Form) */
function isPassLog(selector, messagesForm1, msg1) {
    const element = document.querySelector(selector).value.trim();
    if (element.length < 8) {
        messagesForm1.push(msg1);
    }
    return messagesForm1;
}











/* Functions For (Signup Form) */

/* If There Are Any Missing Inputs On (Signup Form) */   
function isFilledSg(selector, messagesForm2, msg2) {
    const element = document.querySelector(selector).value.trim();
    if (element.length < 1) {
        messagesForm2.push(msg2);
    }
    return messagesForm2;
}

/* Must Write Email Format On (Signup Form) */
function isEmailSg(selector, messagesForm2, msg2) {
    const element = document.querySelector(selector).value.trim();
    if (!element.match("[a-z0-9]+@[a-z]+\.[a-z]{2,4}")) {
       messagesForm2.push(msg2);
    }
    return messagesForm2;
}

/* Password Must Be At Least 8 Characters, Contain One Capital Letter, and One Symbol (Signup Form) */
function isPassSg(selector, messagesForm2) {
    const elementValue = document.querySelector(selector).value.trim();

    // Check length condition
    if (elementValue.length < 8) {
        messagesForm2.push("Password must be at least 8 characters long.");
    }

    // Check for at least one capital letter
    if (!/[A-Z]/.test(elementValue)) {
        messagesForm2.push("Password must contain at least one capital letter.");
    }

    // Check for at least one symbol
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(elementValue)) {
        messagesForm2.push("Password must contain at least one symbol.");
    }

    return messagesForm2;
}

/* Check If The Confirm Password Matches (Signup Form) */
function passNotmatchConfirmPass(selector, messagesForm2, msg2) {
    const element = document.querySelector(selector).value.trim();
    const sgpassValue = document.querySelector("#sgpass").value.trim();

    if (element !== sgpassValue) {
        messagesForm2.push(msg2);
    }
    return messagesForm2;
}

/* Display The Login Form And Hide The Signup Form */
function displaylogform() {
    form1.style.display = "block";
    form2.style.display = "none";
}

/* Display The Signup Form And Hide The Login Form */
function displaysgform() {
    form1.style.display = "none";
    form2.style.display = "block";
}

/* Event Listeners For The (Do Not Have Account? And Already Have Account?) Links */
document.querySelectorAll("a")[4].addEventListener("click", displaysgform);
document.querySelectorAll("a")[5].addEventListener("click", displaylogform);
