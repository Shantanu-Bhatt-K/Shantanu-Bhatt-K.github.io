const buttons = document.querySelectorAll('.tab_button');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove 'active' from all buttons
            buttons.forEach(b => b.classList.remove('active'));

            // Add 'active' to clicked button
            btn.classList.add('active');
        });
    });

