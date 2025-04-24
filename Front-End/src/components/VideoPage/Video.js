document.addEventListener("DOMContentLoaded", function () {
  // Select elements to animate
  const elementsToAnimate = document.querySelectorAll('.video-page-container, .video-title, .video-description, .ingredients-container, .instructions-container, .recipe-video');

  // Options for the IntersectionObserver
  const options = {
    root: null, // Use the viewport as the root
    threshold: 0.5 // Trigger when 50% of the element is in view
  };

  // Callback function for IntersectionObserver
  const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add class to trigger animation
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // Stop observing once the element has been animated
      }
    });
  };

  // Create an IntersectionObserver
  const observer = new IntersectionObserver(handleIntersection, options);

  // Start observing each element
  elementsToAnimate.forEach(element => {
    observer.observe(element);
  });
});
