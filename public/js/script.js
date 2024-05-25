// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  // for eye of the password
  const password = document.querySelector("#password");
  const icon = document.querySelector("#togglePassword");
  icon.addEventListener("click", function () {
    if (password.type === "password") {
      password.type = "text";
      icon.classList.add("fa-eye");
      icon.classList.remove("fa-eye-slash"); // Assuming you have a class for an eye with a slash through it
    } else {
      password.type = "password";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  });