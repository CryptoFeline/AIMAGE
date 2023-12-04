window.addEventListener('load', function () {
    const preloader = document.querySelector('.preloader');
    const statusText = preloader.querySelector('.preloader__status-text');
    const statusBar = preloader.querySelector('.preloader__status-bar');

    let totalImages = document.images.length;
    let loadedImages = 0;

    Array.from(document.images).forEach(img => {
      if (img.complete) {
        incrementLoadedImages();
      } else {
        img.addEventListener('load', incrementLoadedImages);
        img.addEventListener('error', incrementLoadedImages); // in case an image fails to load
      }
    });

    function incrementLoadedImages() {
      loadedImages++;
      updatePreloader();
      if (loadedImages === totalImages) {
        completeLoading();
      }
    }

    function updatePreloader() {
      let loadedPercentage = Math.round((loadedImages / totalImages) * 100);
      statusText.textContent = `LOADING: ${loadedPercentage} %`;
      statusBar.style.width = `${loadedPercentage}%`;
    }

    function completeLoading() {
      preloader.style.display = 'none';
      document.body.style.overflow = 'auto'; // This re-enables scrolling
    }
    // Initialize with 0%
    updatePreloader();
  });