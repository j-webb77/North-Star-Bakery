// script.js
// North Star Bakery - Touchstone 4

// Product data as an array of objects
const products = [
  {
    id: 1,
    name: "Signature Sourdough Loaf",
    category: "breads",
    price: "$8",
    description: "Slow-fermented organic sourdough with a crisp crust.",
    image: "bakery-signature-loaf.jpg",
    alt: "North Star Bakery Signature Loaf"
  },
  {
    id: 2,
    name: "Multigrain Baguette",
    category: "breads",
    price: "$6",
    description: "Hearty multigrain baguette with flax and sunflower seeds.",
    image: "bakery-bread.jpg",
    alt: "Multigrain baguette from North Star Bakery"
  },
  {
    id: 3,
    name: "Butter Croissant",
    category: "pastries",
    price: "$4",
    description: "Flaky, buttery croissant baked fresh every morning.",
    image: "bakery-feature-small.jpg",
    alt: "Butter croissant at North Star Bakery"
  },
  {
    id: 4,
    name: "Almond Morning Bun",
    category: "pastries",
    price: "$5",
    description: "Sweet yeasted bun with almond filling and honey glaze.",
    image: "bakery-feature-large.jpg",
    alt: "Almond morning bun from North Star Bakery"
  },
  {
    id: 5,
    name: "Custom Celebration Cake",
    category: "cakes",
    price: "$45",
    description: "Made-to-order layer cake for birthdays and events.",
    image: "bakery-storefront.jpg",
    alt: "Custom celebration cake at North Star Bakery"
  },
  {
    id: 6,
    name: "Seasonal Fruit Tart",
    category: "cakes",
    price: "$7",
    description: "Buttery tart shell filled with vanilla cream and seasonal fruit.",
    image: "bakery-bread.jpg",
    alt: "Seasonal fruit tart from North Star Bakery"
  }
];

// Category filter state
let currentCategory = "all";

// Function to render product cards
function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  // Clear container
  container.innerHTML = "";

  // Filter products based on current category
  const filteredProducts = products.filter(product => {
    if (currentCategory === "all") {
      return true;
    }
    return product.category === currentCategory;
  });

  // Create and append product cards
  filteredProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.alt;
    card.appendChild(img);

    const name = document.createElement("h3");
    name.textContent = product.name;
    card.appendChild(name);

    const description = document.createElement("p");
    description.textContent = product.description;
    card.appendChild(description);

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = product.price;
    card.appendChild(price);

    container.appendChild(card);
  });

  // Update active button styles
  document.querySelectorAll(".filter-btn").forEach(button => {
    if (button.dataset.category === currentCategory) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

// Function to set category and save to localStorage
function setCategory(category) {
  currentCategory = category;
  localStorage.setItem("northStarCategory", category);
  renderProducts();
}

// Function to load saved category from localStorage
function loadSavedCategory() {
  const savedCategory = localStorage.getItem("northStarCategory");
  if (savedCategory && ["all", "breads", "pastries", "cakes"].includes(savedCategory)) {
    currentCategory = savedCategory;
  }
  renderProducts();
}

// Function to set up product category filter buttons
function setupProductFilters() {
  const filterContainer = document.getElementById("product-filters");
  if (!filterContainer) return;

  filterContainer.addEventListener("click", function(event) {
    const button = event.target.closest(".filter-btn");
    if (button) {
      setCategory(button.dataset.category);
    }
  });

  loadSavedCategory();
}

// Form validation functions
function showError(inputId, message) {
  const errorElement = document.getElementById(inputId + "-error");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function clearError(inputId) {
  const errorElement = document.getElementById(inputId + "-error");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}

function validateForm(event) {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const pickupDate = document.getElementById("pickup-date");
  const requestType = document.getElementById("request-type");
  const itemDetails = document.getElementById("item-details");

  let isValid = true;

  // Clear previous errors
  ["name", "email", "pickup-date", "request-type", "item-details"].forEach(clearError);

  // 1. Required name with minimum length
  if (!name.value.trim()) {
    showError("name", "Name is required.");
    isValid = false;
  } else if (name.value.trim().length < 2) {
    showError("name", "Name must be at least 2 characters long.");
    isValid = false;
  }

  // 2. Email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showError("email", "Email is required.");
    isValid = false;
  } else if (!emailPattern.test(email.value.trim())) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  }

  // 3. Pickup date required and must be in the future
  if (!pickupDate.value) {
    showError("pickup-date", "Pickup date is required.");
    isValid = false;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(pickupDate.value);
    if (selectedDate < today) {
      showError("pickup-date", "Pickup date must be today or in the future.");
      isValid = false;
    }
  }

  // 4. Request type required
  if (!requestType.value) {
    showError("request-type", "Please select a request type.");
    isValid = false;
  }

  // 5. Item details required with minimum length
  if (!itemDetails.value.trim()) {
    showError("item-details", "Item details are required.");
    isValid = false;
  } else if (itemDetails.value.trim().length < 10) {
    showError("item-details", "Please provide at least 10 characters of detail.");
    isValid = false;
  }

  if (!isValid) {
    event.preventDefault();
  } else {
    // Save form draft to localStorage before successful submission
    const formDraft = {
      name: name.value.trim(),
      email: email.value.trim(),
      pickupDate: pickupDate.value,
      requestType: requestType.value,
      itemDetails: itemDetails.value.trim()
    };
    localStorage.setItem("northStarFormDraft", JSON.stringify(formDraft));
    alert("Your request has been submitted successfully!");
  }
}

function setupFormValidation() {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", validateForm);

  // Optional: pre-fill form fields from stored draft
  const savedDraft = localStorage.getItem("northStarFormDraft");
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      document.getElementById("name").value = draft.name || "";
      document.getElementById("email").value = draft.email || "";
      document.getElementById("pickup-date").value = draft.pickupDate || "";
      document.getElementById("request-type").value = draft.requestType || "";
      document.getElementById("item-details").value = draft.itemDetails || "";
    } catch (e) {
      console.log("No saved draft found.");
    }
  }
}

// Initialize all features after DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  setupProductFilters();
  setupFormValidation();
});