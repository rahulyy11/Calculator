
function calculatePrice(propertyType, rooms) {
  let pricePerRoom = 0;

  if (propertyType === "house") {
    pricePerRoom = 500;
  } else if (propertyType === "condo") {
    pricePerRoom = 300;
  } else {
    return "Invalid property type";
  }

  return pricePerRoom * rooms;
}

const calculateButton = document.getElementById("calculateButton");

calculateButton.addEventListener("click", function () {
  const propertyType = document.getElementById("propertyType").value;
  const rooms = Number(document.getElementById("rooms").value);
  const resultElement = document.getElementById("result");

  if (!Number.isInteger(rooms) || rooms < 1) {
    resultElement.textContent =
      "Please enter a whole number of rooms greater than zero.";
    return;
  }

  const result = calculatePrice(propertyType, rooms);

  const formattedResult = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD"
  }).format(result);

  resultElement.textContent = formattedResult;
});

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

contactForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  contactStatus.textContent = "Sending message...";

  const formData = {
    name: document.getElementById("contactName").value.trim(),
    email: document.getElementById("contactEmail").value.trim(),
    message: document.getElementById("contactMessage").value.trim()
  };

  if (!formData.name || !formData.email || !formData.message) {
    contactStatus.textContent = "Please complete all fields.";
    return;
  }

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to send your message.");
    }

    contactStatus.textContent = "Message sent successfully!";
    contactForm.reset();
  } catch (error) {
    console.error("Contact form error:", error);
    contactStatus.textContent =
      error.message || "Something went wrong. Please try again.";
  }
});
