document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;
  
    // Simple validation (if needed)
    if (name && email && feedback) {
      // Show a custom alert when the form is submitted
      alert(`Thank you, ${name}, for your feedback!`);
 
      // Very Important
       // Redirect to index.html after the alert
         window.location.href = 'index.html';
      
      // Optionally clear the form fields after submission
      document.getElementById('feedbackForm').reset();
    } else {
      alert('Please fill out all fields before submitting.');
    }
  });
  