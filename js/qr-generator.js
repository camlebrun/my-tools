document.addEventListener("DOMContentLoaded", function() {
    // Initialize QRCode
    const qrContainer = document.getElementById("qrcode");
    if (!qrContainer) return;

    let qrcode = new QRCode(qrContainer);
    
    const generateBtn = document.getElementById("generate-btn");
    const textInput = document.getElementById("qr-text");
    const sizeSelect = document.getElementById("qr-size");
    const colorInput = document.getElementById("qr-foreground");
    const downloadBtn = document.getElementById("download-btn");
    const copyBtn = document.getElementById("copy-btn");
    const qrActions = document.querySelector(".qr-actions");
    const qrDisplay = document.getElementById("qrcode");
    
    function generateQR() {
        const text = textInput.value.trim();
        const size = parseInt(sizeSelect.value);
        const color = colorInput.value;
        
        if (text) {
            qrDisplay.innerHTML = "";
            new QRCode(qrDisplay, {
                text: text,
                width: size,
                height: size,
                colorDark: color,
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            qrActions.style.display = "flex";
            qrDisplay.classList.add("qr-generated");
            
            // Show toast if available
            if (window.showToast) {
                window.showToast("QR Code généré avec succès !");
            }
        } else {
            if (window.showError) {
                window.showError("Veuillez entrer une URL ou un texte.", textInput);
            }
            qrActions.style.display = "none";
        }
    }
    
    // Event listeners
    if (generateBtn) {
        generateBtn.addEventListener("click", generateQR);
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function() {
            const canvas = qrDisplay.querySelector("canvas");
            if (canvas) {
                const link = document.createElement("a");
                link.download = "qr-code.png";
                link.href = canvas.toDataURL();
                link.click();
                if (window.showToast) window.showToast("Image téléchargée !");
            }
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener("click", function() {
            const canvas = qrDisplay.querySelector("canvas");
            if (canvas) {
                canvas.toBlob(function(blob) {
                    if (navigator.clipboard && navigator.clipboard.write) {
                        navigator.clipboard.write([
                            new ClipboardItem({
                                "image/png": blob
                            })
                        ]).then(() => {
                            if (window.showToast) {
                                window.showToast("QR Code copié dans le presse-papier !");
                            } else {
                                const originalText = copyBtn.textContent;
                                copyBtn.textContent = "Copié !";
                                setTimeout(() => copyBtn.textContent = originalText, 2000);
                            }
                        });
                    }
                });
            }
        });
    }
    
    if (textInput) {
        textInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                generateQR();
            }
        });
        
        textInput.addEventListener("input", function() {
            if (this.value.trim()) {
                generateBtn.disabled = false;
                generateBtn.classList.remove("btn-disabled");
            } else {
                generateBtn.disabled = true;
                generateBtn.classList.add("btn-disabled");
            }
        });
    }
    
    // Initialize button state
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.classList.add("btn-disabled");
    }
});

