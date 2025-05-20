document.addEventListener('DOMContentLoaded', function() {
    const mushrooms = [
        document.getElementById('cap5cena1detalhes1-img'),
        document.getElementById('cap5cena1detalhes2-img'),
        document.getElementById('cap5cena1detalhes3-img')
    ];

    function toggleMushroom(mushroom) {
        const isVisible = !mushroom.classList.contains('popup-appear');
        
        if (isVisible) {
            mushroom.classList.remove('popup-disappear');
            mushroom.classList.add('popup-appear');
        } else {
            mushroom.classList.remove('popup-appear');
            mushroom.classList.add('popup-disappear');
        }
    }

    function randomToggle() {
        const randomMushroom = mushrooms[Math.floor(Math.random() * mushrooms.length)];
        toggleMushroom(randomMushroom);
        
        // Set next random interval between 1 and 3 seconds
        const nextInterval = Math.random() * 2000 + 1000;
        setTimeout(randomToggle, nextInterval);
    }

    // Start the random toggling
    randomToggle();
});