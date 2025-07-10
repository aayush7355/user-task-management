document.getElementById('userForm').addEventListener('submit', function(e) {
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        e.preventDefault();
        alert('Please enter a valid email address');
        return;
    }
    
    // Mobile validation (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
        e.preventDefault();
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
});