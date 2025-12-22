document.addEventListener("DOMContentLoaded", function() {
    const ingredientSelect = document.getElementById('ingredient');
    const inputValue = document.getElementById('inputValue');
    const inputUnit = document.getElementById('inputUnit');
    const resultsContainer = document.getElementById('kitchenResults');

    // Densities relative to water (1g = 1ml)
    const densities = {
        none: 1,
        farine: 0.53,
        sucre: 0.85,
        beurre: 0.91,
        riz: 0.85
    };

    // Conversion factors to base unit (ml for volume, g for weight)
    const units = {
        ml: { factor: 1, type: 'vol' },
        cl: { factor: 10, type: 'vol' },
        l: { factor: 1000, type: 'vol' },
        cup: { factor: 236.588, type: 'vol' },
        tbsp: { factor: 14.7868, type: 'vol' },
        tsp: { factor: 4.92892, type: 'vol' },
        g: { factor: 1, type: 'weight' },
        kg: { factor: 1000, type: 'weight' },
        oz: { factor: 28.3495, type: 'weight' },
        lb: { factor: 453.592, type: 'weight' }
    };

    function updateConversions() {
        const val = parseFloat(inputValue.value);
        if (isNaN(val) || val <= 0) {
            resultsContainer.innerHTML = `
                <div class="qr-placeholder">
                    <div class="placeholder-icon">⚖️</div>
                    <p>Entrez une valeur valide</p>
                </div>`;
            return;
        }

        const unitKey = inputUnit.value;
        const ingredientKey = ingredientSelect.value;
        const density = densities[ingredientKey];
        const unit = units[unitKey];

        // 1. Convert to a common base (we'll use 'ml' as the absolute base via density)
        let baseMl;
        if (unit.type === 'vol') {
            baseMl = val * unit.factor;
        } else {
            // weight to volume: ml = g / density
            baseMl = (val * unit.factor) / density;
        }

        // 2. Generate common conversions
        const displays = [
            { label: 'Grammes', value: baseMl * density, suffix: 'g' },
            { label: 'Millilitres', value: baseMl, suffix: 'ml' },
            { label: 'Tasses (Cup)', value: baseMl / 236.588, suffix: 'tasse(s)' },
            { label: 'C. à Soupe', value: baseMl / 14.7868, suffix: 'càs' },
            { label: 'Onces', value: (baseMl * density) / 28.3495, suffix: 'oz' }
        ];

        let html = '<div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">';
        displays.forEach(item => {
            if (item.value > 0.01) {
                html += `
                    <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--text-mid); font-size: 0.875rem;">${item.label}</span>
                        <span style="font-weight: 700; color: var(--brand-accent);">${formatNum(item.value)} ${item.suffix}</span>
                    </div>
                `;
            }
        });
        html += '</div>';
        resultsContainer.innerHTML = html;
    }

    function formatNum(n) {
        return n < 10 ? n.toFixed(2) : Math.round(n);
    }

    [ingredientSelect, inputValue, inputUnit].forEach(el => {
        el.addEventListener('input', updateConversions);
    });

    // Initial run
    updateConversions();
});
