document.addEventListener("DOMContentLoaded", function () {
  const carouselElementMobile = document.getElementById(
    "listingImageCarouselMobile"
  );
  const paginationElementMobile = document.querySelector(
    ".mobile-and-tablet-view-elements .image-pagination-airbnb"
  );

  if (carouselElementMobile && paginationElementMobile) {
    carouselElementMobile.addEventListener("slid.bs.carousel", function () {
      const activeItem = carouselElementMobile.querySelector(
        ".carousel-item.active"
      );
      const index = Array.from(
        carouselElementMobile.querySelectorAll(".carousel-item")
      ).indexOf(activeItem);
      const total =
        carouselElementMobile.querySelectorAll(".carousel-item").length;
      paginationElementMobile.textContent = `${index + 1}/${total}`;
    });
  }

  // JS for desktop carousel pagination (targets the #listingImageCarouselDesktop ID)
  const carouselElementDesktop = document.getElementById(
    "listingImageCarouselDesktop"
  );
  const paginationElementDesktop = document.querySelector(
    ".desktop-view-elements .image-pagination-airbnb"
  );

  if (carouselElementDesktop && paginationElementDesktop) {
    carouselElementDesktop.addEventListener("slid.bs.carousel", function () {
      const activeItem = carouselElementDesktop.querySelector(
        ".carousel-item.active"
      );
      const index = Array.from(
        carouselElementDesktop.querySelectorAll(".carousel-item")
      ).indexOf(activeItem);
      const total =
        carouselElementDesktop.querySelectorAll(".carousel-item").length;
      paginationElementDesktop.textContent = `${index + 1}/${total}`;
    });
  }

  // Basic datepicker placeholders - integrate a real datepicker library
  const checkInDesktopInput = document.getElementById("checkInDesktop");
  const checkOutDesktopInput = document.getElementById("checkOutDesktop");

  if (checkInDesktopInput) {
    checkInDesktopInput.addEventListener("focus", function () {
      this.placeholder = "Select date";
    });
    checkInDesktopInput.addEventListener("blur", function () {
      if (!this.value) this.placeholder = "Add date";
    });
  }
  if (checkOutDesktopInput) {
    checkOutDesktopInput.addEventListener("focus", function () {
      this.placeholder = "Select date";
    });
    checkOutDesktopInput.addEventListener("blur", function () {
      if (!this.value) this.placeholder = "Add date";
    });
  }

  // Smooth scroll to reviews section (Desktop)
  document
    .querySelector('.listing-meta-desktop a[href="#reviews-section"]')
    ?.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .getElementById("reviews-section")
        ?.scrollIntoView({ behavior: "smooth" });
    });
});
