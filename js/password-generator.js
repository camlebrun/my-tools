// Password Generator Logic
class PasswordGenerator {
    constructor() {
        this.lengthSlider = document.getElementById('length');
        this.lengthValue = document.querySelector('.length-value');
        this.lowercaseCheckbox = document.getElementById('includeLowercase');
        this.uppercaseCheckbox = document.getElementById('includeUppercase');
        this.numbersCheckbox = document.getElementById('includeNumbers');
        this.symbolsCheckbox = document.getElementById('includeSymbols');
        this.generateBtn = document.getElementById('generate-btn');
        this.regenerateBtn = document.getElementById('regenerate-btn');
        this.passwordDisplay = document.getElementById('password');
        this.copyBtn = document.getElementById('copy-btn');
        this.refreshBtn = document.getElementById('refresh-btn');
        this.passwordActions = document.querySelector('.password-actions');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        
        if (this.generateBtn) {
            this.init();
        }
    }
    
    init() {
        this.setupEventListeners();
        this.updateLengthDisplay();
    }
    
    setupEventListeners() {
        if (this.lengthSlider) {
            this.lengthSlider.addEventListener('input', () => this.updateLengthDisplay());
        }
        
        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => this.generatePassword());
        }
        
        if (this.regenerateBtn) {
            this.regenerateBtn.addEventListener('click', () => this.generatePassword());
        }
        
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyPassword());
        }
        
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => this.generatePassword());
        }
        
        // Update regenerate button visibility when checkboxes change
        [this.lowercaseCheckbox, this.uppercaseCheckbox, this.numbersCheckbox, this.symbolsCheckbox]
            .forEach(checkbox => {
                if (checkbox) {
                    checkbox.addEventListener('change', () => this.updateRegenerateButton());
                }
            });
    }
    
    updateLengthDisplay() {
        if (this.lengthValue && this.lengthSlider) {
            this.lengthValue.textContent = this.lengthSlider.value;
        }
    }
    
    updateRegenerateButton() {
        const hasCheckedOptions = (this.lowercaseCheckbox && this.lowercaseCheckbox.checked) || 
                                (this.uppercaseCheckbox && this.uppercaseCheckbox.checked) || 
                                (this.numbersCheckbox && this.numbersCheckbox.checked) || 
                                (this.symbolsCheckbox && this.symbolsCheckbox.checked);
        
        if (this.regenerateBtn) {
            this.regenerateBtn.style.display = hasCheckedOptions ? 'inline-flex' : 'none';
        }
    }
    
    generatePassword() {
        // Clamp length to avoid weird slider states or NaN
        const rawLength = parseInt(this.lengthSlider ? this.lengthSlider.value : '16', 10);
        const length = Math.min(64, Math.max(8, isNaN(rawLength) ? 16 : rawLength));
        if (this.lengthSlider) {
            this.lengthSlider.value = length;
            this.updateLengthDisplay();
        }
        const options = {
            lowercase: this.lowercaseCheckbox ? this.lowercaseCheckbox.checked : false,
            uppercase: this.uppercaseCheckbox ? this.uppercaseCheckbox.checked : false,
            numbers: this.numbersCheckbox ? this.numbersCheckbox.checked : false,
            symbols: this.symbolsCheckbox ? this.symbolsCheckbox.checked : false
        };
        
        // Validate that at least one option is selected
        if (!Object.values(options).some(Boolean)) {
            this.showError('Veuillez sélectionner au moins une option de complexité');
            return;
        }
        
        try {
            let password = this.createPassword(length, options);

            // Safety net: ensure final length matches request
            if (password.length !== length) {
                password = this.normalizeLength(password, length);
            }
            this.displayPassword(password);
            this.updatePasswordStrength(password);
            this.showPasswordActions();
            this.hideError();
            
            if (window.showToast) {
                window.showToast("Mot de passe généré !");
            }
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    createPassword(length, options) {
        let charset = '';
        let password = '';
        
        // Build character set based on selected options
        if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.numbers) charset += '0123456789';
        if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        if (charset === '') {
            throw new Error('Aucune option de complexité sélectionnée');
        }
        
        // Generate password ensuring at least one character from each selected category
        const selectedOptions = Object.entries(options).filter(([_, checked]) => checked);
        
        // Add one character from each selected category first
        selectedOptions.forEach(([type, _]) => {
            switch (type) {
                case 'lowercase':
                    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
                    break;
                case 'uppercase':
                    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
                    break;
                case 'numbers':
                    password += '0123456789'[Math.floor(Math.random() * 10)];
                    break;
                case 'symbols':
                    password += '!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 26)];
                    break;
            }
        });
        
        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        
        // Shuffle the password to avoid predictable patterns
        return this.shuffleString(password);
    }

    normalizeLength(password, length) {
        const shuffled = this.shuffleString(password);
        if (shuffled.length > length) {
            return shuffled.slice(0, length);
        }
        if (shuffled.length < length) {
            const charset = this.buildCharsetFromLastOptions();
            let extended = shuffled;
            while (extended.length < length && charset.length > 0) {
                extended += charset[Math.floor(Math.random() * charset.length)];
            }
            return this.shuffleString(extended).slice(0, length);
        }
        return shuffled;
    }

    buildCharsetFromLastOptions() {
        // Fallback charset based on current toggles; ensures normalizeLength can pad safely
        let charset = '';
        if (this.lowercaseCheckbox && this.lowercaseCheckbox.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (this.uppercaseCheckbox && this.uppercaseCheckbox.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (this.numbersCheckbox && this.numbersCheckbox.checked) charset += '0123456789';
        if (this.symbolsCheckbox && this.symbolsCheckbox.checked) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        return charset || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    }
    
    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }
    
    displayPassword(password) {
        if (this.passwordDisplay) {
            this.passwordDisplay.innerHTML = `
                <div class="password-result">
                    <span class="password-text-content">${password}</span>
                </div>
            `;
        }
    }
    
    updatePasswordStrength(password) {
        let score = 0;
        let feedback = '';
        
        // Length score
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;
        if (password.length >= 20) score += 1;
        
        // Complexity score
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        // Determine strength level
        let strengthClass = '';
        if (score <= 2) {
            feedback = 'Très faible';
            strengthClass = 'very-weak';
        } else if (score <= 4) {
            feedback = 'Faible';
            strengthClass = 'weak';
        } else if (score <= 6) {
            feedback = 'Moyen';
            strengthClass = 'medium';
        } else if (score <= 8) {
            feedback = 'Fort';
            strengthClass = 'strong';
        } else {
            feedback = 'Très fort';
            strengthClass = 'very-strong';
        }
        
        // Update UI
        if (this.strengthFill) {
            this.strengthFill.className = `strength-fill ${strengthClass}`;
            this.strengthFill.style.width = `${(score / 8) * 100}%`;
        }
        if (this.strengthText) {
            this.strengthText.textContent = `Force : ${feedback}`;
        }
    }
    
    showPasswordActions() {
        if (this.passwordActions) {
            this.passwordActions.style.display = 'flex';
        }
    }
    
    copyPassword() {
        const passwordText = this.passwordDisplay.querySelector('.password-text-content');
        if (!passwordText) return;
        
        const password = passwordText.textContent;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(password).then(() => {
                this.showCopySuccess();
            }).catch(() => {
                this.showCopyError();
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = password;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopySuccess();
        }
    }
    
    showCopySuccess() {
        if (window.showToast) {
            window.showToast("Mot de passe copié !");
            return;
        }

        if (this.copyBtn) {
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = 'Copié !';
            this.copyBtn.style.background = 'var(--success)';
            this.copyBtn.style.color = 'white';
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.style.background = '';
                this.copyBtn.style.color = '';
            }, 2000);
        }
    }
    
    showCopyError() {
        if (window.showError) {
            window.showError('Erreur lors de la copie', this.copyBtn);
        }
    }
    
    showError(message) {
        // Create or update error display
        let errorDiv = document.querySelector('.password-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'password-error';
            if (this.passwordDisplay) {
                this.passwordDisplay.parentNode.insertBefore(errorDiv, this.passwordDisplay.nextSibling);
            }
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
    
    hideError() {
        const errorDiv = document.querySelector('.password-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
}

// Initialize Password Generator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});

