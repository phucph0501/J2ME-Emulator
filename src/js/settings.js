export class Settings {
    constructor() {
        this.defaultSettings = {
            phoneColor: '#333333',
            screenScaling: 'fit',
            enableVibration: false,
            enableKeyboard: true,
            autoSaveInterval: 1,
            volume: 0.7
        };
        
        this.settings = this.loadSettings();
        this.setupEventListeners();
        this.applySettings();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('j2me_settings');
        return savedSettings ? { ...this.defaultSettings, ...JSON.parse(savedSettings) } : this.defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('j2me_settings', JSON.stringify(this.settings));
    }

    setupEventListeners() {
        // Settings button
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.openSettings();
        });

        // Close settings
        document.getElementById('closeSettings')?.addEventListener('click', () => {
            this.closeSettings();
        });

        // Save settings
        document.getElementById('saveSettings')?.addEventListener('click', () => {
            this.updateSettings();
        });

        // Clear storage
        document.getElementById('clearStorage')?.addEventListener('click', () => {
            this.clearStorage();
        });

        // Close modal when clicking outside
        document.getElementById('settingsModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });

        // Update storage info when opening settings
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.updateStorageInfo();
        });
    }

    openSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            // Populate current settings
            document.getElementById('phoneColor').value = this.settings.phoneColor;
            document.getElementById('screenScaling').value = this.settings.screenScaling;
            document.getElementById('enableVibration').checked = this.settings.enableVibration;
            document.getElementById('enableKeyboard').checked = this.settings.enableKeyboard;
            document.getElementById('autoSaveInterval').value = this.settings.autoSaveInterval;

            modal.style.display = 'flex';
            this.updateStorageInfo();
        }
    }

    closeSettings() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    updateSettings() {
        this.settings = {
            phoneColor: document.getElementById('phoneColor').value,
            screenScaling: document.getElementById('screenScaling').value,
            enableVibration: document.getElementById('enableVibration').checked,
            enableKeyboard: document.getElementById('enableKeyboard').checked,
            autoSaveInterval: parseInt(document.getElementById('autoSaveInterval').value),
            volume: this.settings.volume
        };

        this.saveSettings();
        this.applySettings();
        this.closeSettings();
    }

    applySettings() {
        // Apply phone color
        const phoneFrame = document.querySelector('.phone-frame');
        if (phoneFrame) {
            phoneFrame.style.backgroundColor = this.settings.phoneColor;
        }

        // Apply screen scaling
        const gameScreen = document.getElementById('gameScreen');
        if (gameScreen) {
            gameScreen.style.objectFit = this.settings.screenScaling === 'stretch' ? 'fill' : 'contain';
            if (this.settings.screenScaling === 'pixel-perfect') {
                gameScreen.style.imageRendering = 'pixelated';
            }
        }

        // Apply keyboard controls
        if (this.settings.enableKeyboard) {
            this.enableKeyboardControls();
        } else {
            this.disableKeyboardControls();
        }

        // Dispatch event to notify emulator of settings changes
        window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: this.settings }));
    }

    enableKeyboardControls() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    disableKeyboardControls() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown = (e) => {
        const button = document.querySelector(`button[data-key="${e.key}"]`);
        if (button) {
            button.classList.add('active');
            button.click();
        }
    }

    handleKeyUp = (e) => {
        const button = document.querySelector(`button[data-key="${e.key}"]`);
        if (button) {
            button.classList.remove('active');
        }
    }

    updateStorageInfo() {
        const storageUsed = document.getElementById('storageUsed');
        if (storageUsed) {
            let total = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                total += localStorage.getItem(key).length;
            }
            const usedMB = (total / (1024 * 1024)).toFixed(2);
            storageUsed.textContent = `${usedMB} MB`;
        }
    }

    clearStorage() {
        if (confirm('Are you sure you want to clear all data? This will remove all installed apps and saved states.')) {
            localStorage.clear();
            this.settings = this.defaultSettings;
            this.saveSettings();
            this.updateStorageInfo();
            location.reload();
        }
    }

    // Getter for current settings
    getSettings() {
        return { ...this.settings };
    }
}