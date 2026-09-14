/* ==========================================================================
   Belting Engineering Works - Scroll-Driven Conveyor Belt Canvas Engine
   Palette: Dark Blue, Steel Grey, Cream, White (Strict Color Enforcement)
   ========================================================================== */

class ScrollDrivenConveyor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.width = 0;
        this.height = 0;

        // Motion & State
        this.baseSpeed = 0.8;
        this.scrollBoost = 0;
        this.material = 'pvc'; // 'pvc', 'pu', 'modular', 'mesh'
        
        this.beltOffset = 0;
        this.rollerAngle = 0;
        this.lastScrollY = window.scrollY;

        // Cargo Packages (Navy & Steel Grey palette)
        this.cargoList = [
            { x: 40,  width: 70, height: 44, label: 'BELTING-1' },
            { x: 260, width: 85, height: 52, label: 'KANPUR-PU' },
            { x: 480, width: 65, height: 38, label: 'PVC-MOD' },
            { x: 680, width: 80, height: 48, label: 'BEW-2026' }
        ];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.bindMaterialButtons();
        requestAnimationFrame(() => this.loop());
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width * window.devicePixelRatio;
        this.canvas.height = this.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    handleScroll() {
        const currentY = window.scrollY;
        const deltaY = Math.abs(currentY - this.lastScrollY);
        this.lastScrollY = currentY;

        // Accelerate belt smoothly on scroll
        this.scrollBoost = Math.min(deltaY * 0.18, 7.0);
    }

    bindMaterialButtons() {
        const buttons = document.querySelectorAll('.mat-pill');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.material = btn.dataset.material;
            });
        });
    }

    loop() {
        this.scrollBoost *= 0.92;
        const currentVelocity = this.baseSpeed + this.scrollBoost;

        // Update Motion
        this.beltOffset = (this.beltOffset + currentVelocity * 2.6) % 36;
        this.rollerAngle += currentVelocity * 0.09;

        // Update Cargo
        this.cargoList.forEach(item => {
            item.x += currentVelocity * 2.6;
            if (item.x > this.width + 100) {
                item.x = -110;
            }
        });

        // Update HUD speed display
        const speedDisplay = document.getElementById('beltSpeedValue');
        if (speedDisplay) {
            const mps = (currentVelocity * 0.35).toFixed(2);
            speedDisplay.textContent = `${mps} m/s`;
        }

        this.render();
        requestAnimationFrame(() => this.loop());
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        const beltY = this.height * 0.52;
        const beltHeight = 60;
        const rollerRadius = 65;

        // Render Industrial Background Blueprint Grid
        this.drawBackgroundGrid();

        // Render Massive Metal Drive Drums
        this.drawDriveRoller(70, beltY + beltHeight / 2, rollerRadius);
        this.drawDriveRoller(this.width - 70, beltY + beltHeight / 2, rollerRadius);

        // Render Heavy Metallic Frame Trusses (Logo-Grey Palette)
        this.drawFrameBeams(beltY, beltHeight);

        // Render Heavy Belt Surface
        this.drawBeltSurface(beltY, beltHeight);

        // Render Cargo Packages
        this.drawCargo(beltY);
    }

    drawBackgroundGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        const step = 30;

        for (let x = 0; x < this.width; x += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.height; y += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    drawDriveRoller(x, y, radius) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(this.rollerAngle);

        // Outer Metallic Wheel Hub (Logo Grey Slate #5A6B7C)
        this.ctx.fillStyle = '#374151';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#5A6B7C';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // Inner Spokes (Dark Navy #0A3663)
        this.ctx.strokeStyle = '#0A3663';
        this.ctx.lineWidth = 6;
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(Math.cos(angle) * (radius - 8), Math.sin(angle) * (radius - 8));
            this.ctx.stroke();
        }

        // Glowing Center Axis Bolt
        this.ctx.fillStyle = '#60A5FA';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 14, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    drawFrameBeams(beltY, beltHeight) {
        // Upper & Lower Metallic Guide Rails (Logo-Grey Metallic #5A6B7C)
        this.ctx.fillStyle = '#5A6B7C';
        this.ctx.fillRect(10, beltY - 8, this.width - 20, 10);
        this.ctx.fillRect(10, beltY + beltHeight - 2, this.width - 20, 12);

        // Vertical Support Pillars
        this.ctx.fillStyle = '#1E293B';
        const spacing = 180;
        for (let x = 100; x < this.width - 50; x += spacing) {
            this.ctx.fillRect(x - 12, beltY + beltHeight + 10, 24, this.height - (beltY + beltHeight + 10));

            // Metallic Diagonal Cross Bracing
            this.ctx.strokeStyle = 'rgba(90, 107, 124, 0.4)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(x - 12, beltY + beltHeight + 10);
            this.ctx.lineTo(x + spacing - 12, this.height);
            this.ctx.stroke();
        }
    }
        for (let x = 80; x < this.width - 40; x += spacing) {
            this.ctx.fillRect(x - 7, beltY + beltHeight + 7, 14, this.height - (beltY + beltHeight + 7));
        }
    }

    drawBeltSurface(beltY, beltHeight) {
        this.ctx.save();

        if (this.material === 'pvc') {
            // Dark Navy Industrial PVC Belt
            this.ctx.fillStyle = '#0A3663';
            this.ctx.fillRect(15, beltY, this.width - 30, beltHeight);

            this.ctx.fillStyle = '#062343';
            const step = 28;
            const startX = (this.beltOffset % step) - step;

            for (let x = startX; x < this.width + step; x += step) {
                if (x >= 15 && x <= this.width - 15) {
                    this.ctx.fillRect(x, beltY + 2, 4, beltHeight - 4);
                }
            }
        } else if (this.material === 'pu') {
            // White Food-Grade PU Conveyor Belt
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(15, beltY, this.width - 30, beltHeight);

            this.ctx.fillStyle = '#475569';
            const step = 32;
            const startX = (this.beltOffset % step) - step;

            for (let x = startX; x < this.width + step; x += step) {
                if (x >= 15 && x <= this.width - 15) {
                    this.ctx.fillRect(x, beltY + 3, 3, beltHeight - 6);
                }
            }
        } else if (this.material === 'modular') {
            // Steel Grey Modular Linked Belt
            this.ctx.fillStyle = '#475569';
            this.ctx.fillRect(15, beltY, this.width - 30, beltHeight);

            this.ctx.fillStyle = '#1E293B';
            const slatW = 22;
            const startX = (this.beltOffset % slatW) - slatW;

            for (let x = startX; x < this.width + slatW; x += slatW) {
                if (x >= 15 && x <= this.width - 15) {
                    this.ctx.fillRect(x, beltY + 2, slatW - 2, beltHeight - 4);
                }
            }
        } else if (this.material === 'mesh') {
            // Stainless Steel Wire Mesh Belt
            this.ctx.fillStyle = '#64748B';
            this.ctx.fillRect(15, beltY, this.width - 30, beltHeight);

            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 1.5;
            const step = 14;
            const startX = (this.beltOffset % step) - step;

            for (let x = startX; x < this.width + step; x += step) {
                if (x >= 15 && x <= this.width - 15) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, beltY);
                    this.ctx.lineTo(x + step / 2, beltY + beltHeight / 2);
                    this.ctx.lineTo(x, beltY + beltHeight);
                    this.ctx.stroke();
                }
            }
        }

        this.ctx.restore();
    }

    drawCargo(beltY) {
        this.cargoList.forEach(item => {
            if (item.x + item.width < 15 || item.x > this.width - 15) return;

            const y = beltY - item.height;

            this.ctx.save();
            this.ctx.fillStyle = '#062343';
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 1.5;

            this.ctx.fillRect(item.x, y, item.width, item.height);
            this.ctx.strokeRect(item.x, y, item.width, item.height);

            // Label Tag
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(item.x + 6, y + 6, item.width - 12, 10);

            this.ctx.fillStyle = '#0A3663';
            this.ctx.font = 'bold 8px sans-serif';
            this.ctx.fillText(item.label, item.x + 10, y + 14);

            this.ctx.restore();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.scrollBelt = new ScrollDrivenConveyor('heroBeltCanvas');
});
