/**
 * Sales Whisper - Lost Leads Calculator
 * ======================================
 */

document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
});

function initCalculator() {
    const form = document.getElementById('calculator-form');
    const resultContainer = document.querySelector('.calculator__result');
    const resultValue = document.querySelector('.calculator__result-value');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get values
        const leadsPerDay = parseFloat(document.getElementById('leads-per-day').value) || 0;
        const avgCheck = parseFloat(document.getElementById('avg-check').value) || 0;
        const lostPercent = parseFloat(document.getElementById('lost-percent').value) || 0;

        // Calculate monthly losses
        // Formula: leads_per_day * 30 days * avg_check * (percent / 100)
        const monthlyLosses = leadsPerDay * 30 * avgCheck * (lostPercent / 100);

        // Display result
        if (resultContainer && resultValue) {
            resultValue.textContent = formatNumber(Math.round(monthlyLosses)) + ' ₽';
            resultContainer.classList.add('active');

            // Scroll to result
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Update slider value display
    const slider = document.getElementById('lost-percent');
    const sliderValue = document.getElementById('lost-percent-value');

    if (slider && sliderValue) {
        slider.addEventListener('input', function() {
            sliderValue.textContent = this.value + '%';
        });
    }
}

// Format number with space as thousands separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
