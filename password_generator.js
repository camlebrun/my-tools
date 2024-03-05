// passwordGenerator.js

function generatePassword() {
  var minLength = 12;
  var maxLength = 32;

  var length = parseInt($("#length").val());
  if (length < minLength || length > maxLength) {
    alert("Password length must be between 12 and 32 characters.");
    return;
  }

  var includeSymbols = $("#includeSymbols").is(":checked");
  var includeNumbers = $("#includeNumbers").is(":checked");
  var includeUppercase = $("#includeUppercase").is(":checked");

  var charset = "abcdefghijklmnopqrstuvwxyz";
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+{}[]<>";

  var password = "";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  $("#password").val(password);

  // Dynamically adjust the width of the password input field based on password length
  var passwordLength = password.length;
  var inputWidth = 15 * passwordLength + 30; // Adjust this formula for desired width
  $("#password").css("width", inputWidth + "px");
}
