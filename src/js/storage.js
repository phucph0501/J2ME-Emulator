// Storage manager for handling game data
export class StorageManager {
    constructor() {
        this.GAMES_KEY = 'j2me_saved_games';
        this.GAME_DATA_KEY = 'j2me_game_data';
    }

    // Save game binary data
    saveGameFile(fileName, gameData) {
        // Return a Promise so callers can await until the file is stored
        return new Promise((resolve, reject) => {
            try {
                const games = this.getSavedGames();
                const reader = new FileReader();

                reader.onload = () => {
                    try {
                        const base64Data = reader.result.split(',')[1];
                        games[fileName] = {
                            data: base64Data,
                            timestamp: Date.now(),
                            size: gameData.size
                        };
                        localStorage.setItem(this.GAMES_KEY, JSON.stringify(games));
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                };

                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(gameData);
            } catch (error) {
                console.error('Error saving game:', error);
                reject(error);
            }
        });
    }

    // Get list of saved games
    getSavedGames() {
        const savedGames = localStorage.getItem(this.GAMES_KEY);
        return savedGames ? JSON.parse(savedGames) : {};
    }

    // Load a specific game's data
    loadGameData(fileName) {
        const games = this.getSavedGames();
        if (!games[fileName]) {
            throw new Error('Game not found in storage');
        }
        
        const base64Data = games[fileName].data;
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: 'application/java-archive' });
    }

    // Save game progress/state
    saveGameState(fileName, stateData) {
        try {
            const key = `${this.GAME_DATA_KEY}_${fileName}`;
            localStorage.setItem(key, JSON.stringify({
                state: stateData,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error saving game state:', error);
            throw error;
        }
    }

    // Load game progress/state
    loadGameState(fileName) {
        const key = `${this.GAME_DATA_KEY}_${fileName}`;
        const savedState = localStorage.getItem(key);
        return savedState ? JSON.parse(savedState).state : null;
    }

    // Delete a saved game and its data
    deleteGame(fileName) {
        try {
            const games = this.getSavedGames();
            if (games[fileName]) {
                delete games[fileName];
                localStorage.setItem(this.GAMES_KEY, JSON.stringify(games));
            }
            
            const stateKey = `${this.GAME_DATA_KEY}_${fileName}`;
            localStorage.removeItem(stateKey);
        } catch (error) {
            console.error('Error deleting game:', error);
            throw error;
        }
    }
}