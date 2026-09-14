/* ==========================================================================
   Belting Engineering Works - Conveyor Cost & Spec Calculator Engine
   Calculates estimated budget & motor kW rating based on technical inputs
   ========================================================================== */

class ConveyorSpecCalculator {
    constructor() {
        this.baseRates = {
            belt: { base: 85000, perMeter: 18000, widthFactor: 1.2 },
            modular: { base: 125000, perMeter: 24000, widthFactor: 1.4 },
            mesh: { base: 165000, perMeter: 32000, widthFactor: 1.6 },
            spiral: { base: 480000, perMeter: 65000, widthFactor: 2.2 },
            round: { base: 75000, perMeter: 14000, widthFactor: 1.1 },
            roller: { base: 110000, perMeter: 21000, widthFactor: 1.3 },
            chain: { base: 145000, perMeter: 28000, widthFactor: 1.5 }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.calculate();
    }

    bindEvents() {
        const inputs = [
            'calcType', 'calcConfig', 'calcFrame', 'calcCargo', 'calcIndustry',
            'calcLength', 'calcWidth', 'calcLoadHeight', 'calcDischargeHeight',
            'calcSpeed', 'calcTempMin', 'calcTempMax', 'calcDirection', 'calcVfd'
        ];

        inputs.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) {
                elem.addEventListener('change', () => this.calculate());
                elem.addEventListener('input', () => this.calculate());
            }
        });

        // Form Submit
        const form = document.getElementById('conveyorCalcForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you! Your conveyor technical specification and cost estimate request has been sent to Belting Engineering Works Kanpur.');
            });
        }
    }

    calculate() {
        const type = document.getElementById('calcType')?.value || 'belt';
        const lengthMm = parseFloat(document.getElementById('calcLength')?.value || 5000);
        const widthMm = parseFloat(document.getElementById('calcWidth')?.value || 600);
        const loadH = parseFloat(document.getElementById('calcLoadHeight')?.value || 800);
        const dischargeH = parseFloat(document.getElementById('calcDischargeHeight')?.value || 800);
        const speed = parseFloat(document.getElementById('calcSpeed')?.value || 15);
        const frame = document.getElementById('calcFrame')?.value || 'ss';
        const vfd = document.getElementById('calcVfd')?.value || 'yes';

        const lengthM = lengthMm / 1000;
        const widthM = widthMm / 1000;
        const inclineH = Math.abs(dischargeH - loadH) / 1000;

        const typeData = this.baseRates[type] || this.baseRates.belt;
        const frameMult = frame === 'ss' ? 1.4 : 1.0;
        const vfdCost = vfd === 'yes' ? 18000 : 0;

        let totalPrice = (typeData.base + (lengthM * typeData.perMeter * (widthM * typeData.widthFactor))) * frameMult + (inclineH * 15000) + vfdCost;
        totalPrice = Math.round(totalPrice);

        // Technical Spec Calculations
        const motorKw = ((lengthM * 0.15) + (inclineH * 0.8) + (widthM * 0.4)).toFixed(2);
        const estDeliveryDays = lengthM <= 10 ? '5-7 Days' : '10-14 Days';

        // Update DOM Displays
        const priceDisplay = document.getElementById('calcPriceDisplay');
        const kwDisplay = document.getElementById('calcMotorKwDisplay');
        const lengthDisplay = document.getElementById('calcLengthDisplay');
        const leadDisplay = document.getElementById('calcLeadDisplay');

        if (priceDisplay) priceDisplay.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
        if (kwDisplay) kwDisplay.textContent = `${motorKw} kW`;
        if (lengthDisplay) lengthDisplay.textContent = `${lengthM.toFixed(1)} m (${widthMm}mm width)`;
        if (leadDisplay) leadDisplay.textContent = estDeliveryDays;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.conveyorCalculator = new ConveyorSpecCalculator();
});
