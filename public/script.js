
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
  if (!Number.isInteger(rooms) || rooms < 1) {
  document.getElementById("result").textContent =
    "Please enter a whole number of rooms greater than zero.";
  return;
}

  const result = calculatePrice(propertyType, rooms);

  const formattedResult = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD"
}).format(result);

document.getElementById("result").textContent = formattedResult;
});
// Learning Git: my first tracked change.