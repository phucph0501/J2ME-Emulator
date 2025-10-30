export const THEMES = {
    classic: {
        name: 'Classic Nokia',
        phoneColor: '#1B1F22',
        buttonColor: '#2C3539',
        textColor: '#32CD32',
        screenBorder: '5px solid #1B1F22',
        fontFamily: "'Nokia Pure Text', sans-serif",
        buttonStyle: 'round',
        screenFilter: 'none',
        backgroundColor: '#1B1F22'
    },
    modern: {
        name: 'Modern Dark',
        phoneColor: '#2C2C2C',
        buttonColor: '#3D3D3D',
        textColor: '#FFFFFF',
        screenBorder: '2px solid #404040',
        fontFamily: "'Roboto', sans-serif",
        buttonStyle: 'flat',
        screenFilter: 'none',
        backgroundColor: '#1A1A1A'
    },
    retro: {
        name: 'Retro Green',
        phoneColor: '#383838',
        buttonColor: '#4A4A4A',
        textColor: '#33FF33',
        screenBorder: '10px solid #383838',
        fontFamily: 'monospace',
        buttonStyle: 'square',
        screenFilter: 'brightness(1.2) contrast(1.1) sepia(0.2)',
        backgroundColor: '#000000'
    },
    blue: {
        name: 'Blue Wave',
        phoneColor: '#1E3F66',
        buttonColor: '#2E5984',
        textColor: '#7FB3D5',
        screenBorder: '3px solid #2E5984',
        fontFamily: "'Segoe UI', sans-serif",
        buttonStyle: 'rounded',
        screenFilter: 'brightness(1.1) contrast(1.05)',
        backgroundColor: '#152F4F'
    },
    vintage: {
        name: 'Vintage Gold',
        phoneColor: '#8B7355',
        buttonColor: '#A67D3D',
        textColor: '#FFD700',
        screenBorder: '6px solid #8B7355',
        fontFamily: "'Times New Roman', serif",
        buttonStyle: 'beveled',
        screenFilter: 'sepia(0.4) contrast(1.1)',
        backgroundColor: '#5C4033'
    }
};

export class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('j2me_theme') || 'classic';
        this.applyTheme(this.currentTheme);
    }

    applyTheme(themeName) {
        const theme = THEMES[themeName];
        if (!theme) return;

        const root = document.documentElement;
        root.style.setProperty('--phone-color', theme.phoneColor);
        root.style.setProperty('--button-color', theme.buttonColor);
        root.style.setProperty('--text-color', theme.textColor);
        root.style.setProperty('--screen-border', theme.screenBorder);
        root.style.setProperty('--font-family', theme.fontFamily);
        root.style.setProperty('--background-color', theme.backgroundColor);

        const phoneFrame = document.querySelector('.phone-frame');
        if (phoneFrame) {
            phoneFrame.className = `phone-frame theme-${themeName} button-${theme.buttonStyle}`;
        }

        const gameScreen = document.getElementById('gameScreen');
        if (gameScreen) {
            gameScreen.style.filter = theme.screenFilter;
        }

        this.currentTheme = themeName;
        localStorage.setItem('j2me_theme', themeName);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getAvailableThemes() {
        return Object.keys(THEMES).map(key => ({
            id: key,
            ...THEMES[key]
        }));
    }
}