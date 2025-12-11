// === Generate a hardcoded valid code for testing ===
const validCodes = 'EXDEL012JI23HUA';

// === Validate user form ===
function validateForm(name, email, phone) {
  let isValid = true;

  document.getElementById('fullNameError').textContent = '';
  document.getElementById('emailError').textContent = '';
  document.getElementById('phoneError').textContent = '';

  if (name.length < 2) {
    document.getElementById('fullNameError').textContent = 'Name must be at least 2 characters';
    isValid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('emailError').textContent = 'Invalid email format';
    isValid = false;
  }
  if (!/^\+?\d{10,}$/.test(phone)) {
    document.getElementById('phoneError').textContent = 'Invalid phone number (minimum 10 digits)';
    isValid = false;
  }

  return isValid;
}

// === DOM Loaded ===
document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('userForm');

  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect all form values
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const size = document.getElementById('packageSize').value.trim();
      const weight = document.getElementById('packageWeight').value.trim();
      const type = document.getElementById('packageType').value.trim();
      const senderName = document.getElementById('senderName').value.trim();
      const senderEmail = document.getElementById('senderEmail').value.trim();
      const shipmentMode = document.getElementById('shipmentMode').value.trim();





      // Validate required fields
      if (!validateForm(name, email, phone)) return;

      // Disable submit and show loader
      document.getElementById('submitBtn').disabled = true;
      document.getElementById('loader').style.display = 'block';

      // Determine login code based on name
      let loginCode = validCodes;
      if (name.toLowerCase().includes('christopher')) {
        loginCode = 'EXDEL012JI23HUA';
      } else if (name.toLowerCase().includes('john')) {
        loginCode = 'AEW123SDF23JNH45';
      }

      const expiryTime = Date.now() + (4320 * 60 * 1000); // 3 days (4320 mins)
      
      const userData = {
        name,
        email,
        phone,
        size,
        weight,
        type,
        senderName,
        senderEmail,
        shipmentMode,
        loginCode,
        expiryTime
      };

      // Save to localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('loginCode', loginCode);




      // Show login code
      document.getElementById('loginCode').textContent = loginCode;
      document.getElementById('codeDisplay').style.display = 'block';
      userForm.style.display = 'none';

      // Countdown and redirect
      let countdown = 10;
      document.getElementById('countdown').textContent = countdown;
      const timer = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = countdown;
        if (countdown <= 0) {
          clearInterval(timer);
          window.location.href = 'profile.html'; // Redirect page
        }
      }, 1000);



      
    // Handle code verification
    if (codeForm) {
        codeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredCode = document.getElementById('codeInput').value.trim().toUpperCase();
            const userData = JSON.parse(localStorage.getItem('userData'));

            document.getElementById('verifyBtn').disabled = true;
            document.getElementById('loader').style.display = 'block';

            setTimeout(() => {
                if (userData && userData.loginCode === enteredCode) {
                    window.location.href = 'login.html';
                } else {
                    document.getElementById('codeError').textContent = 'Invalid code. Please try again.';
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('verifyBtn').disabled = false;
                }
            }, 1000);
        });
    }

      // Copy to clipboard
      document.getElementById('copyCodeBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(loginCode).then(() => {
          alert('Code copied to clipboard!');
        });
      });
    });
  }
});
