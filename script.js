
function calculatePrice(propertyType, rooms) {
  let price = 0;
  if (propertyType === "house") {
    price = 500;
  } else if (propertyType === "condo") {
    price = 300;
  } else {
    return "Invalid property type";
  }
  return price * rooms;
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

  document.getElementById("result").textContent = result;
});
// Learning Git: my first tracked change.