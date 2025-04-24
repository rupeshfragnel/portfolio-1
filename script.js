// Animate sections on scroll
document.addEventListener('DOMContentLoaded', function() {
  // Add smooth animations
  const sections = document.querySelectorAll('section');
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
  });
  
  // Portfolio item hover effects
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});

// Form validation functions with improved UX
function validateName(name) {
  return name.trim().length >= 2;
}

function validateMobile(mobile) {
  // Enhanced validation for phone numbers (allows different formats)
  const mobilePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return mobilePattern.test(mobile);
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validateMessage(message) {
  return message.trim().length >= 10;
}

// Handle form submission with improved UX
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the default form submission
  
  const formResponse = document.getElementById("formResponse");
  formResponse.className = "";
  formResponse.style.display = "none";
  
  // Get values from the form fields
  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  
  // Validate form inputs with improved feedback
  let isValid = true;
  let errorMessage = "";
  
  if (!validateName(name)) {
    isValid = false;
    errorMessage = "Please enter a valid name (at least 2 characters).";
    document.getElementById("name").focus();
  } else if (!validateMobile(mobile)) {
    isValid = false;
    errorMessage = "Please enter a valid mobile number.";
    document.getElementById("mobile").focus();
  } else if (!validateEmail(email)) {
    isValid = false;
    errorMessage = "Please enter a valid email address.";
    document.getElementById("email").focus();
  } else if (!validateMessage(message)) {
    isValid = false;
    errorMessage = "Please enter a message (at least 10 characters).";
    document.getElementById("message").focus();
  }
  
  if (!isValid) {
    formResponse.textContent = errorMessage;
    formResponse.className = "error-message";
    formResponse.style.display = "block";
    
    // Auto-hide error message after 5 seconds
    setTimeout(() => {
      formResponse.style.opacity = "0";
      setTimeout(() => {
        formResponse.style.display = "none";
        formResponse.style.opacity = "1";
      }, 600);
    }, 5000);
    
    return;
  }
  
  try {
    // Show loading state with improved button animation
    const submitButton = document.querySelector('.submit-btn');
    const originalButtonText = submitButton.textContent;
    submitButton.innerHTML = '<span class="spinner"></span> Submitting...';
    submitButton.disabled = true;
    submitButton.style.opacity = "0.8";
    
    // Define Supabase API endpoint and header
    const SUPABASE_URL = "https://bxinzqjkcnwbwclrvclv.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4aW56cWprY253YndjbHJ2Y2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0ODAyOTcsImV4cCI6MjA2MTA1NjI5N30.2ZGNYitDjBTRiz_V9c_F85jr1DEuBABdjqerYTYTDig";
    
    // Use plain fetch API instead of Supabase client to avoid RLS issues
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name,
        mobile,
        email,
        message
      })
    });
    
    // Reset button state
    submitButton.innerHTML = originalButtonText;
    submitButton.disabled = false;
    submitButton.style.opacity = "1";
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unknown error occurred');
    }
    
    // Show success message with animation
    formResponse.textContent = "Thank you for reaching out! Your message has been sent successfully. I'll get back to you soon.";
    formResponse.className = "success-message";
    formResponse.style.display = "block";
    formResponse.style.animation = "fadeIn 0.5s ease-out forwards";
    
    // Clear the form after successful submission
    document.getElementById("contactForm").reset();
    
    // Auto-hide success message after 8 seconds
    setTimeout(() => {
      formResponse.style.opacity = "0";
      setTimeout(() => {
        formResponse.style.display = "none";
        formResponse.style.opacity = "1";
      }, 600);
    }, 8000);
    
  } catch (err) {
    console.error("Error submitting form:", err);
    formResponse.textContent = "An error occurred. Please try again later. " + (err.message || '');
    formResponse.className = "error-message";
    formResponse.style.display = "block";
  }
});

// Improved real-time input validation with visual cues
const inputs = document.querySelectorAll("#contactForm input, #contactForm textarea");

inputs.forEach(input => {
  // Create validation indicator element
  const indicator = document.createElement("span");
  indicator.className = "validation-indicator";
  indicator.style.position = "absolute";
  indicator.style.right = "10px";  
  indicator.style.top = "40px";
  indicator.style.fontSize = "20px";
  indicator.style.opacity = "0";
  indicator.style.transition = "opacity 0.3s ease";
  
  input.parentNode.style.position = "relative";
  input.parentNode.appendChild(indicator);
  
  input.addEventListener("blur", function() {
    let isValid = false;
    
    if (this.id === "name") {
      isValid = validateName(this.value);
    } else if (this.id === "mobile") {
      isValid = validateMobile(this.value);
    } else if (this.id === "email") {
      isValid = validateEmail(this.value);
    } else if (this.id === "message") {
      isValid = validateMessage(this.value);
    }
    
    if (this.value) {
      if (isValid) {
        this.style.borderColor = "#4caf50";
        indicator.innerHTML = "✓";
        indicator.style.color = "#4caf50";
      } else {
        this.style.borderColor = "#f44336";
        indicator.innerHTML = "×";
        indicator.style.color = "#f44336";
      }
      indicator.style.opacity = "1";
    } else {
      this.style.borderColor = "";
      indicator.style.opacity = "0";
    }
  });
  
  input.addEventListener("focus", function() {
    this.style.borderColor = "#4caf50";
  });
});

// Add CSS for form spinner
const style = document.createElement('style');
style.textContent = `
  .spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);