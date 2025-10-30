import { StorageManager } from './storage.js';

// Core emulator class
export class J2MEEmulator {
    constructor() {
        this.canvas = document.getElementById('gameScreen');
        this.ctx = this.canvas.getContext('2d');
        this.gameFile = null;
        this.isRunning = false;
        this.storage = new StorageManager();
        this.currentGameName = null;
        
        // Screen dimensions (typical J2ME screen)
        this.screenWidth = 240;
        this.screenHeight = 320;
        
        this.initializeUI();
        this.initializeControls();
        this.setupEventListeners();
        
        // Initial app list update (no-op if not implemented)
        if (typeof this.updateAppGrid === 'function') this.updateAppGrid();
    }

    setupEventListeners() {
        // Prevent page scroll while interacting with the emulator
        document.addEventListener('touchmove', (e) => {
            if (this.isRunning) e.preventDefault();
        }, { passive: false });

        // Adjust canvas when window resizes
        window.addEventListener('resize', () => this.adjustScreenSize());

        // Initial adjust
        this.adjustScreenSize();
    }

    adjustScreenSize() {
        const container = this.canvas.parentElement;
        if (!container) return;

        // set canvas logical size to screenWidth x screenHeight
        this.canvas.width = this.screenWidth;
        this.canvas.height = this.screenHeight;

        // Fit canvas visually inside container
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        const scale = Math.min(cw / this.screenWidth, ch / this.screenHeight);

        this.canvas.style.width = Math.floor(this.screenWidth * scale) + 'px';
        this.canvas.style.height = Math.floor(this.screenHeight * scale) + 'px';
    }
    initializeControls() {
        // Helper to add pointer handlers that work with mouse and touch
        const bindButton = (el, downHandler, upHandler) => {
            if (!el) return;
            el.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                el.classList.add('active');
                downHandler(e, el);
            });
            el.addEventListener('pointerup', (e) => {
                e.preventDefault();
                el.classList.remove('active');
                if (upHandler) upHandler(e, el);
            });
            el.addEventListener('pointercancel', () => el.classList.remove('active'));
        };

        // D-pad and center
        ['up','down','left','right','center'].forEach(id => {
            const el = document.getElementById(id);
            bindButton(el, () => this.handleKeyPress(id), () => this.handleKeyRelease(id));
        });

        // Soft keys
        ['softLeft','softRight'].forEach(id => {
            const el = document.getElementById(id);
            bindButton(el, () => this.handleSoftKey(id));
        });

        // Navigation buttons (call/end)
        ['call','end'].forEach(id => {
            const el = document.getElementById(id);
            bindButton(el, () => console.log(id + ' pressed'));
        });

        // Numeric pad
        document.querySelectorAll('.num-pad button').forEach(btn => {
            bindButton(btn, () => this.handleNumberPress(btn.dataset.key || btn.textContent));
        });

        // File loading: open file picker and handle selection
        document.getElementById('loadGame')?.addEventListener('click', () => {
            document.getElementById('gameFile')?.click();
        });

        document.getElementById('gameFile')?.addEventListener('change', async (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            // Save uploaded file into storage so user doesn't need to re-upload later
            try {
                await this.storage.saveGameFile(f.name, f);
                await this.loadGame(f);
            } catch (err) {
                console.error('Failed to save uploaded app:', err);
                alert('Failed to install app');
            }
        });
    }

    async loadGame(file) {
        try {
            if (!file) return;
            
            if (file.name.endsWith('.jar') || file.name.endsWith('.jad')) {
                this.gameFile = file;
                console.log('Loading game:', file.name);
                // Here we'll implement the JAR/JAD file parsing
                await this.parseGameFile();
                this.startEmulation();
            } else {
                alert('Please select a valid J2ME game file (.jar or .jad)');
            }
        } catch (error) {
            console.error('Error loading game:', error);
            alert('Error loading game file');
        }
    }

    async parseGameFile() {
        // Implementation for parsing JAR/JAD files
        // This will involve:
        // 1. Reading the manifest
        // 2. Extracting game resources
        // 3. Loading the main class
        console.log('Parsing game file...');
    }

    startEmulation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isRunning) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update game state
        this.update();

        // Render frame
        this.render();

        // Schedule next frame
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Update game logic
    }

    render() {
        // Render game graphics
    }

    handleKeyPress(key) {
        console.log('Key pressed:', key);
    }

    handleKeyRelease(key) {
        console.log('Key released:', key);
    }

    handleSoftKey(key) {
        console.log('Soft key pressed:', key);
    }

    handleNumberPress(number) {
        console.log('Number pressed:', number);
    }
}

// Initialize emulator when page loads
window.addEventListener('load', () => {
    new J2MEEmulator();
});