// Date Calculator Logic
class DateCalculator {
    constructor() {
        this.operationSelect = document.getElementById('operation');
        this.dateInput = document.getElementById('date');
        this.secondDateInput = document.getElementById('secondDate');
        this.daysInput = document.getElementById('days');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resultDiv = document.getElementById('result');
        this.errorDiv = document.getElementById('error');
        
        if (this.operationSelect) {
            this.init();
        }
    }
    
    init() {
        this.setupEventListeners();
        this.initializeDatePickers();
    }
    
    setupEventListeners() {
        this.operationSelect.addEventListener('change', () => this.toggleFields());
        this.calculateBtn.addEventListener('click', () => this.calculateDate());
    }
    
    initializeDatePickers() {
        // Initialize Flatpickr for date inputs
        if (typeof flatpickr !== 'undefined') {
            flatpickr(this.dateInput, {
                locale: 'fr',
                dateFormat: 'd/m/Y',
                allowInput: true,
                clickOpens: true
            });
            
            flatpickr(this.secondDateInput, {
                locale: 'fr',
                dateFormat: 'd/m/Y',
                allowInput: true,
                clickOpens: true
            });
        }
    }
    
    toggleFields() {
        const operation = this.operationSelect.value;
        const dateGroup = document.getElementById('dateGroup');
        const secondDateGroup = document.getElementById('secondDateGroup');
        const daysGroup = document.getElementById('daysGroup');
        const calculateBtn = this.calculateBtn;
        
        // Hide all groups first
        if (dateGroup) dateGroup.style.display = 'none';
        if (secondDateGroup) secondDateGroup.style.display = 'none';
        if (daysGroup) daysGroup.style.display = 'none';
        if (calculateBtn) calculateBtn.style.display = 'none';
        
        // Show relevant groups based on operation
        switch (operation) {
            case 'add':
            case 'subtract':
                if (dateGroup) dateGroup.style.display = 'block';
                if (daysGroup) daysGroup.style.display = 'block';
                break;
            case 'difference':
                if (dateGroup) dateGroup.style.display = 'block';
                if (secondDateGroup) secondDateGroup.style.display = 'block';
                break;
        }
        
        // Show calculate button if operation is selected
        if (operation && calculateBtn) {
            calculateBtn.style.display = 'block';
        }
        
        // Clear previous results
        this.clearResults();
    }
    
    calculateDate() {
        const operation = this.operationSelect.value;
        
        try {
            let result;
            
            switch (operation) {
                case 'add':
                    result = this.addDays();
                    break;
                case 'subtract':
                    result = this.subtractDays();
                    break;
                case 'difference':
                    result = this.calculateDifference();
                    break;
                default:
                    throw new Error('Opération non reconnue');
            }
            
            this.showResult(result);
            this.hideError();
            
            if (window.showToast) {
                window.showToast("Calcul terminé !");
            }
            
        } catch (error) {
            this.showError(error.message);
            this.hideResult();
        }
    }
    
    addDays() {
        const date = this.parseDate(this.dateInput.value);
        const days = parseInt(this.daysInput.value);
        
        if (!date || isNaN(days)) {
            throw new Error('Veuillez entrer une date et un nombre de jours valides');
        }
        
        const resultDate = new Date(date);
        resultDate.setDate(resultDate.getDate() + days);
        
        return `Date résultante : ${this.formatDate(resultDate)}`;
    }
    
    subtractDays() {
        const date = this.parseDate(this.dateInput.value);
        const days = parseInt(this.daysInput.value);
        
        if (!date || isNaN(days)) {
            throw new Error('Veuillez entrer une date et un nombre de jours valides');
        }
        
        const resultDate = new Date(date);
        resultDate.setDate(resultDate.getDate() - days);
        
        return `Date résultante : ${this.formatDate(resultDate)}`;
    }
    
    calculateDifference() {
        const date1 = this.parseDate(this.dateInput.value);
        const date2 = this.parseDate(this.secondDateInput.value);
        
        if (!date1 || !date2) {
            throw new Error('Veuillez entrer deux dates valides');
        }
        
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return `${diffDays} jour(s) entre les deux dates`;
    }
    
    parseDate(dateString) {
        if (!dateString) return null;
        
        // Handle dd/mm/yyyy format
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // Month is 0-indexed
            const year = parseInt(parts[2]);
            
            if (isNaN(day) || isNaN(month) || isNaN(year)) {
                return null;
            }
            
            return new Date(year, month, day);
        }
        
        // Handle other formats
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    }
    
    formatDate(date) {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    showResult(result) {
        if (this.resultDiv) {
            this.resultDiv.innerHTML = `<div class="result-success">${result}</div>`;
            this.resultDiv.style.display = 'block';
        }
    }
    
    showError(message) {
        if (this.errorDiv) {
            this.errorDiv.textContent = message;
            this.errorDiv.style.display = 'block';
        }
    }
    
    hideResult() {
        if (this.resultDiv) this.resultDiv.style.display = 'none';
    }
    
    hideError() {
        if (this.errorDiv) this.errorDiv.style.display = 'none';
    }
    
    clearResults() {
        this.hideResult();
        this.hideError();
    }
}

// Initialize Date Calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DateCalculator();
});


