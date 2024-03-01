$(document).ready(function() {
    $("#generate-btn").click(function() {
      var length = $("#length").val();
      var uppercase = $("#uppercase").prop("checked");
      var lowercase = $("#lowercase").prop("checked");
      var numbers = $("#numbers").prop("checked");
      var symbols = $("#symbols").prop("checked");
  
      var password = generatePassword(length, uppercase, lowercase, numbers, symbols);
  
      $("#password").val(password);
    });
  
    function generatePassword(length, uppercase, lowercase, numbers, symbols) {
      var charset = "";
      if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
      if (numbers) charset += "0123456789";
      if (symbols) charset += "!@#$%^&*()-_+=";
  
      var password = "";
      for (var i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return password;
    }
  });
  