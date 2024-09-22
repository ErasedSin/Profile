const music = document.getElementById('background-music');
const toggleButton = document.getElementById('toggle-music');

music.volume = 0.2; // Define o volume da música

toggleButton.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        toggleButton.textContent = '🎵';
    } else {
        music.pause();
        toggleButton.textContent = '🎵';
    }
});

// Inicia a música não mutada ao carregar a página
music.play().catch(error => {
    console.log('Erro ao tentar tocar a música:', error);
});
