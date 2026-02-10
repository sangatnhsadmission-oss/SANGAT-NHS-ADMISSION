// Tab Switching Function
function switchTab(tabName) {
    // Remove active class from all tabs and sections
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    
    // Add active class to selected tab and section
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== ADMIN LOGIN POPUP FUNCTIONS =====

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'sangat2026';

// Open admin login popup
function openAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('show');
    document.getElementById('popupUsername').focus();
}

// Close admin login popup
function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('show');
    document.getElementById('adminLoginForm').reset();
    document.getElementById('popupLoginError').classList.remove('show');
}

// Toggle password visibility in popup
function togglePopupPassword() {
    const passwordInput = document.getElementById('popupPassword');
    const toggleBtn = document.querySelector('.admin-toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Handle admin login from popup
function handleAdminLoginPopup(event) {
    event.preventDefault();
    
    const username = document.getElementById('popupUsername').value.trim();
    const password = document.getElementById('popupPassword').value;
    const errorDiv = document.getElementById('popupLoginError');
    
    // Clear previous error
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
    
    // Verify credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Login successful! Set session and redirect
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        // Show success and redirect
        errorDiv.style.background = '#e6ffe6';
        errorDiv.style.color = '#1a4d2e';
        errorDiv.style.borderLeftColor = '#1a4d2e';
        errorDiv.textContent = '✅ Login successful! Redirecting to dashboard...';
        errorDiv.classList.add('show');
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        // Login failed
        errorDiv.textContent = '❌ Invalid username or password. Please try again.';
        errorDiv.classList.add('show');
        document.getElementById('popupPassword').value = '';
        document.getElementById('popupPassword').focus();
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('adminLoginModal');
    if (event.target === modal) {
        closeAdminLogin();
    }
}

// ===== END ADMIN LOGIN POPUP FUNCTIONS =====

// ===== IMPORTANT: CONFIGURE YOUR GOOGLE APPS SCRIPT URL HERE =====
// Replace this with your actual Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzWx_qovE0rOkSz4G1Lstugm3Nec6WURZrZcJwiAE32unVBl42_A_tIKjeBksNDkbnp/exec';
// Example: 'https://script.google.com/macros/s/AKfycby.../exec'
// ==================================================================

// Enrollment Form Submission Handler
async function handleSubmit(event) {
    event.preventDefault();
    
    // Check if backend is configured
    if (SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbzWx_qovE0rOkSz4G1Lstugm3Nec6WURZrZcJwiAE32unVBl42_A_tIKjeBksNDkbnp/exec') {
        alert('⚠️ Backend Not Configured!\n\nPlease set up Google Apps Script first.\n\nFollow the instructions in SETUP-GUIDE.md to configure the backend.');
        return;
    }
    
    const form = event.target;
    
    // Validate LRN length
    const lrn = form.lrn.value;
    if (lrn.length !== 12) {
        alert('❌ Invalid LRN\n\nLearner Reference Number must be exactly 12 digits.');
        form.lrn.focus();
        return;
    }
    
    // Validate general average
    const gradeLevel = form.gradeLevel.value;
    const average = parseFloat(form.generalAverage.value);
    const minRequired = (gradeLevel >= '7' && gradeLevel <= '10') ? 80 : 85;
    
    if (average < minRequired) {
        alert(`❌ DOES NOT MEET SCHOOL STANDARDS\n\nMinimum required average for Grade ${gradeLevel}: ${minRequired}%\nYour average: ${average}%\n\nYou cannot proceed with enrollment.`);
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Checking enrollment status...';
    submitBtn.disabled = true;
    
    try {
        // Check if student already enrolled (by LRN)
        const checkResponse = await fetch(SCRIPT_URL + '?action=checkDuplicate&lrn=' + lrn);
        const checkData = await checkResponse.json();
        
        if (checkData.exists) {
            alert('❌ ALREADY ENROLLED\n\nThis LRN is already registered in our system.\n\nYou cannot enroll again for School Year 2026-2027.\n\nIf this is an error, please contact the registrar.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
    } catch (error) {
        console.log('Could not check duplicate, proceeding...');
    }
    
    submitBtn.innerHTML = '⏳ Submitting enrollment...';
    
    // Get form data
    const formData = {
        lastName: form.lastName.value,
        firstName: form.firstName.value,
        middleName: form.middleName.value,
        birthDate: form.birthDate.value,
        age: form.age.value,
        gender: form.gender.value,
        address: form.address.value,
        contactNumber: form.contactNumber.value,
        email: form.email.value,
        lrn: form.lrn.value,
        generalAverage: form.generalAverage.value,
        gradeLevel: form.gradeLevel.value,
        track: form.track.value || 'N/A',
        schoolYear: form.schoolYear.value,
        lastSchool: form.lastSchool.value,
        fatherName: form.fatherName.value,
        fatherContact: form.fatherContact.value,
        fatherEmail: form.fatherEmail.value || '',
        fatherOccupation: form.fatherOccupation.value || '',
        motherName: form.motherName.value,
        motherContact: form.motherContact.value,
        motherEmail: form.motherEmail.value || '',
        motherOccupation: form.motherOccupation.value || '',
        guardianName: form.guardianName.value || '',
        guardianContact: form.guardianContact.value || '',
        guardianEmail: form.guardianEmail.value || '',
        guardianRelationship: form.guardianRelationship.value || '',
        submittedDate: new Date().toLocaleString(),
        timestamp: new Date().toISOString()
    };
    
    try {
        // Send to Google Sheets backend
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Show success message
        const fullName = `${formData.firstName} ${formData.lastName}`;
        const emailMsg = formData.email 
            ? `\n\n📧 A confirmation email with your INTERVIEW SCHEDULE has been sent to:\n${formData.email}` 
            : '';
        
        alert(`✅ ENROLLMENT SUCCESSFUL!\n\nCongratulations, ${fullName}!\n\nYour enrollment for Grade ${formData.gradeLevel}${formData.track !== 'N/A' ? ' - ' + formData.track : ''} has been accepted.\n\nGeneral Average: ${formData.average}%\nLRN: ${formData.lrn}${emailMsg}\n\nIMPORTANT: You cannot enroll again for SY 2026-2027.\n\nPlease check your email for interview details.\n\nSee you soon at Sangat National High School!`);
        
        // Reset form
        form.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    } catch (error) {
        console.error('Error submitting form:', error);
        
        alert(`❌ Submission Failed!\n\nUnable to submit your enrollment.\n\nPlease try again or contact:\n📞 (032) XXX-XXXX\n📧 registrar@sangatnhs.edu.ph`);
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Contact Form Submission Handler
async function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById('contactSubmitBtn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '⏳ Sending...';
    submitBtn.disabled = true;
    
    // Check if backend is configured
    if (SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbzWx_qovE0rOkSz4G1Lstugm3Nec6WURZrZcJwiAE32unVBl42_A_tIKjeBksNDkbnp/exec') {
        alert('⚠️ Backend Not Configured!\n\nContact form requires Google Apps Script setup.\n\nFor now, please email us directly at:\nregistrar@sangatnhs.edu.ph');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }
    
    // Get form data
    const formData = {
        action: 'contact',
        name: form.contactName.value,
        email: form.contactEmail.value,
        phone: form.contactPhone.value || '',
        subject: form.contactSubject.value,
        message: form.contactMessage.value,
        timestamp: new Date().toISOString(),
        submittedDate: new Date().toLocaleString()
    };
    
    try {
        // Send to backend
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Show success message
        alert(`✅ Message Sent Successfully!\n\nThank you, ${formData.name}!\n\nYour message has been sent to Sangat National High School.\n\nSubject: ${formData.subject}\n\nWe will get back to you as soon as possible at ${formData.email}.`);
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error sending contact message:', error);
        alert('❌ Failed to send message.\n\nPlease try again or contact us directly at:\n📞 (032) XXX-XXXX\n📧 registrar@sangatnhs.edu.ph');
    }
    
    // Restore button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

// Toggle SHS Track Selection based on Grade Level and validate average
function toggleTrackAndValidateAverage() {
    const gradeLevel = document.getElementById('gradeLevel').value;
    const trackSelection = document.getElementById('trackSelection');
    const trackSelect = document.getElementById('track');
    const averageInput = document.getElementById('generalAverage');
    const averageHint = document.getElementById('averageHint');
    
    // Show track selection for Grade 11 and 12 only
    if (gradeLevel === '11' || gradeLevel === '12') {
        trackSelection.style.display = 'block';
        trackSelect.required = true;
        averageHint.textContent = 'Minimum required: 85%';
        averageHint.style.color = '#f77f00';
        averageHint.style.fontWeight = 'bold';
    } else {
        trackSelection.style.display = 'none';
        trackSelect.required = false;
        trackSelect.value = ''; // Clear selection
        if (gradeLevel >= '7' && gradeLevel <= '10') {
            averageHint.textContent = 'Minimum required: 80%';
            averageHint.style.color = '#1a4d2e';
            averageHint.style.fontWeight = 'bold';
        } else {
            averageHint.textContent = 'Grade 7-10: 80% minimum | Grade 11-12: 85% minimum';
            averageHint.style.color = '#666';
            averageHint.style.fontWeight = 'normal';
        }
    }
    
    // Validate average if already entered
    if (averageInput.value) {
        validateAverage();
    }
}

// Calculate age from birth date
function calculateAge() {
    const birthDate = document.getElementById('birthDate').value;
    if (!birthDate) return;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    document.getElementById('age').value = age;
}

// Validate name input (letters only, no numbers)
function validateName(input) {
    // Remove any numbers or special characters except spaces and Ñ/ñ
    input.value = input.value.replace(/[^A-Za-zÑñ\s]/g, '');
    
    // Visual feedback
    if (input.value && /^[A-Za-zÑñ\s]+$/.test(input.value)) {
        input.style.borderColor = '#1a4d2e';
    } else if (input.value) {
        input.style.borderColor = '#dc3545';
    } else {
        input.style.borderColor = '';
    }
}

// Validate LRN input (only numbers, exactly 12 digits)
function validateLRN(input) {
    // Remove non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
    
    // Limit to 12 digits
    if (input.value.length > 12) {
        input.value = input.value.slice(0, 12);
    }
    
    // Visual feedback
    if (input.value.length === 12) {
        input.style.borderColor = '#1a4d2e';
        input.style.background = '#e6f7ed';
    } else {
        input.style.borderColor = '';
        input.style.background = '';
    }
}

// Validate general average based on grade level
function validateAverage() {
    const gradeLevel = document.getElementById('gradeLevel').value;
    const average = parseFloat(document.getElementById('generalAverage').value);
    const averageInput = document.getElementById('generalAverage');
    
    if (!gradeLevel || !average) return;
    
    let minRequired = 0;
    let gradeLevelText = '';
    
    // Set minimum based on grade level
    if (gradeLevel >= '7' && gradeLevel <= '10') {
        minRequired = 80;
        gradeLevelText = 'Junior High School (Grade 7-10)';
    } else if (gradeLevel === '11' || gradeLevel === '12') {
        minRequired = 85;
        gradeLevelText = 'Senior High School (Grade 11-12)';
    }
    
    // Validate
    if (average < minRequired) {
        averageInput.style.borderColor = '#dc3545';
        averageInput.style.background = '#ffe6e6';
        alert(`❌ DOES NOT MEET SCHOOL STANDARDS\n\nYour general average of ${average}% is below the required minimum.\n\n${gradeLevelText} requires a minimum average of ${minRequired}%.\n\nWe're sorry, but you cannot proceed with enrollment at this time. Please improve your grades and apply again next school year.`);
        averageInput.value = '';
        averageInput.focus();
        return false;
    } else {
        averageInput.style.borderColor = '#1a4d2e';
        averageInput.style.background = '#e6f7ed';
        return true;
    }
}

// Smooth Scroll for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});