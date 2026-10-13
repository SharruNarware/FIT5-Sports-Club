document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");

    if (!form) return;

    // =====================================================
    // FORM ELEMENTS
    // =====================================================
    const fullName = document.getElementById("fullName");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");


    // =====================================================
    // BUTTON ELEMENTS
    // =====================================================
    const submitBtn = document.getElementById("contactSubmitBtn");
    const submitText = document.getElementById("submitText");
    const submitIcon = document.getElementById("submitIcon");


    // =====================================================
    // MESSAGE COUNTER
    // =====================================================
    const messageCount = document.getElementById("messageCount");


    // =====================================================
    // CONTACT STATE CARDS
    // =====================================================
    const formCard = document.getElementById("contactFormCard");
    const successCard = document.getElementById("contactSuccessCard");
    const errorCard = document.getElementById("contactErrorCard");


    // =====================================================
    // OPTIONAL OLD SUCCESS ALERT
    // =====================================================
    const closeAlert = document.getElementById("closeAlert");
    const successMessage = document.getElementById("successMessage");


    /* =====================================================
       HELPERS
    ===================================================== */
    function setError(input, errorMessage) {

        const formGroup = input.closest(".form-group");
        const errorElement = formGroup.querySelector(".field-error");

        formGroup.classList.add("has-error");
        errorElement.textContent = errorMessage;
    }

    function clearError(input) {

        const formGroup = input.closest(".form-group");
        const errorElement = formGroup.querySelector(".field-error");

        formGroup.classList.remove("has-error");
        errorElement.textContent = "";
    }

    
    function clearAllErrors() {
        [ fullName, phone, email, subject, message ].forEach(clearError);
    }


    /* =====================================================
       VALIDATION
    ===================================================== */
    function validateName() {

        const value = fullName.value.trim();

        if (!value) {
            setError( fullName, "Please enter your full name." );
            return false;
        }

        if (value.length < 2) {
            setError( fullName, "Name must contain at least 2 characters." );
            return false;
        }

        clearError(fullName);
        return true;
    }


    function validatePhone() {

        const value = phone.value.trim();
        const phonePattern = /^[0-9+\-\s()]{7,20}$/;

        // Phone is optional
        if (!value) {
            clearError(phone);
            return true;
        }

        if (!phonePattern.test(value)) {
            setError( phone, "Please enter a valid phone number." );
            return false;
        }

        clearError(phone);
        return true;
    }


    function validateEmail() {

        const value = email.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value) {
            setError( email, "Please enter your email address." );
            return false;
        }

        if (!emailPattern.test(value)) {
            setError( email, "Please enter a valid email address." );
            return false;
        }

        clearError(email);
        return true;
    }


    function validateSubject() {

        const value = subject.value.trim();

        if (!value) {
            setError( subject, "Please enter a subject." );
            return false;
        }

        if (value.length < 2) {
            setError( subject, "Subject must contain at least 2 characters." );
            return false;
        }

        clearError(subject);
        return true;
    }


    function validateMessage() {

        const value = message.value.trim();

        if (!value) {
            setError( message, "Please enter your message." );
            return false;
        }

        if (value.length < 5) {
            setError( message, "Message must contain at least 5 characters." );
            return false;
        }

        clearError(message);
        return true;
    }


    /* =====================================================
       LIVE VALIDATION
    ===================================================== */
    fullName.addEventListener( "blur", validateName );

    phone.addEventListener( "blur", validatePhone );

    email.addEventListener( "blur", validateEmail );

    subject.addEventListener( "blur", validateSubject );

    message.addEventListener( "blur", validateMessage );


    /* =====================================================
       LIVE INPUT ERROR CLEARING
    ===================================================== */
    fullName.addEventListener( "input", () => {

         if (fullName.value.trim()) {
            clearError(fullName);
        }
    });
    

    phone.addEventListener( "input", () => {

        if (phone.value.trim()) {
            clearError(phone);
       }
    });
    

    email.addEventListener( "input", () => {

        if (email.value.trim()) {
            clearError(email);
        }
    });
   

    subject.addEventListener("input", () => {

        if (subject.value.trim()) {
            clearError(subject);
        }
    });


    message.addEventListener( "input", () => {

        if (message.value.trim()) {
            clearError(message);
        }

        if (messageCount) {
            messageCount.textContent = message.value.length;
        }
    });


    /* =====================================================
       FORM SUBMIT
       AJAX / FETCH
       NO PAGE RELOAD
    ===================================================== */
    form.addEventListener( "submit", async (event) => {

            event.preventDefault();
            clearAllErrors();

            const nameValid = validateName();
            const phoneValid = validatePhone();
            const emailValid = validateEmail();
            const subjectValid = validateSubject();
            const messageValid = validateMessage();

            const isValid =
                nameValid &&
                phoneValid &&
                emailValid &&
                subjectValid &&
                messageValid;


            if (!isValid) {    // STOP IF VALIDATION FAILED
                const firstError = form.querySelector(
                    ".has-error input, .has-error textarea"
                );

                if (firstError) {
                    firstError.focus();
                }

                return
            }


            // =============================================
            // DISABLE BUTTON
            // =============================================
            submitBtn.disabled = true;
            submitIcon.textContent = "⏳"
            submitText.textContent = "Sending...";

            try {
                const formData = new FormData(form);    // COLLECT FORM DATA
                const response = await fetch( form.action, {
                        method: "POST",
                        body: new URLSearchParams(formData)
                });
                

                // GET JSON RESPONSE
                const result = await response.json();
                console.log( "Server response:", result );

                // =====================================
                // SUCCESS MongoDB SAVE SUCCESSFUL
                // =====================================
                if ( response.ok && result.success ) {
                    console.log( "Contact saved successfully." );

                    form.reset();  // Clear form

                    if (messageCount) {   // Reset message counter
                        messageCount.textContent = "0";
                    }

                    if (errorCard) {  // Hide error
                        errorCard.hidden = true;
                    }

                    if (formCard) {  // Hide form
                        formCard.hidden = true;
                    }

                    if (successCard) {  // Show Thank You
                        successCard.hidden = false;
                    }


                    // =====================================
                    // AFTER 30 sec. SHOW FORM AGAIN
                    // =====================================
                    setTimeout( () => {
                        if (successCard) {
                            successCard.hidden = true;
                        }

                        if (formCard) {
                            formCard.hidden = false;
                        }

                        submitBtn.disabled = false;
                        submitIcon.textContent = "➤";
                        submitText.textContent = "Send Message";

                        clearAllErrors();

                    }, 30000  );

                    return;
                };


                // =========================================
                // SERVER ERROR MongoDB SAVE FAILED
                // =========================================
                console.error( "Contact submission failed:", result.message );

                if (formCard) {
                    formCard.hidden = true;
                }

                if (successCard) {
                    successCard.hidden = true;
                }

                if (errorCard) {
                    errorCard.hidden = false;
                }


                // =========================================
                // AFTER 30 sec.
                // SHOW FORM AGAIN
                // =========================================
                setTimeout( () => {
                        if (errorCard) {
                            errorCard.hidden = true;
                        }

                        if (formCard) {
                            formCard.hidden = false;
                        }

                        submitBtn.disabled = false;
                        submitIcon.textContent = "➤";
                        submitText.textContent = "Send Message"; 

                    }, 30000 
                );
            }


            // =============================================
            // NETWORK / UNKNOWN ERROR
            // =============================================
            catch (error) {
                console.error( "Contact form request failed:", error);

                if (formCard) {
                    formCard.hidden = true;
                }

                if (successCard) {
                    successCard.hidden = true;
                }

                if (errorCard) {
                    errorCard.hidden = false;
                }


                // =========================================
                // AFTER 30 sec.
                // SHOW FORM AGAIN
                // =========================================
                setTimeout( () => {

                        if (errorCard) {
                            errorCard.hidden = true;
                        }

                        if (formCard) {
                            formCard.hidden = false;
                        }

                        submitBtn.disabled = false;
                        submitIcon.textContent = "➤";
                        submitText.textContent = "Send Message";
                    },
                    30000
                );
            }
    });
    


    /* =====================================================
       OLD SUCCESS ALERT CLOSE
       Kept for safety if this element still exists
    ===================================================== */
    if ( closeAlert && successMessage ) {

        closeAlert.addEventListener( "click", () => {
           successMessage.remove();
        });  
    }

    /* =====================================================
       INITIAL MESSAGE COUNT
    ===================================================== */
    if (messageCount) {
        messageCount.textContent =  message.value.length;
    }
    
});




/* =========================================================
   FAQ ACCORDION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const faqItems = document.querySelectorAll(".contact-faq-item");

    if (!faqItems.length) return;


    faqItems.forEach((item) => {

        const question = item.querySelector(".contact-faq-question");

        if (!question) return;


        question.addEventListener("click", () => {

            const isAlreadyOpen = item.classList.contains("active");


            /* ---------------------------------------------
               CLOSE ALL FAQ ITEMS
            --------------------------------------------- */

            faqItems.forEach((faqItem) => {
                faqItem.classList.remove("active");
            });


            /* ---------------------------------------------
               OPEN CLICKED ITEM
               If it was already open, leave everything closed
            --------------------------------------------- */

            if (!isAlreadyOpen) {
                item.classList.add("active");
            }

        });

    });

});