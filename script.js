function calculateDate() {
    var dateInput = document.getElementById('date').value;
    var operation = document.getElementById('operation').value;
    var days = parseInt(document.getElementById('days').value);
    var resultElement = document.getElementById('result');
    var errorElement = document.getElementById('error');
    var resultDate;

    if (dateInput === '') {
        errorElement.textContent = 'Veuillez choisir une date.';
        errorElement.style.display = 'block';
        resultElement.textContent = '';
        return;
    }

    // Parsing de la date dans le format 'd/m/Y'
    var dateParts = dateInput.split('/');
    var inputDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // Attention au décalage de 1 pour le mois

    if (isNaN(inputDate.getTime())) {
        errorElement.textContent = 'La date saisie est invalide.';
        errorElement.style.display = 'block';
        resultElement.textContent = '';
        return;
    }

    if (operation === 'add') {
        resultDate = new Date(inputDate.getTime() + days * 24 * 60 * 60 * 1000);
    } else {
        resultDate = new Date(inputDate.getTime() - days * 24 * 60 * 60 * 1000);
    }

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var locale = 'fr-FR'; // Utilisez 'fr-FR' pour la locale française
    var formattedDate = resultDate.toLocaleDateString(locale, options);

    resultElement.textContent = 'Résultat: ' + formattedDate;
    errorElement.style.display = 'none';
}
