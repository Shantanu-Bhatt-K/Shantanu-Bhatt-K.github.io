const buttons = document.querySelectorAll('.tab_button');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove 'active' from all buttons
            buttons.forEach(b => b.classList.remove('active'));

            // Add 'active' to clicked button
            btn.classList.add('active');
        });
    });

    window.addEventListener('scroll', () => {
        const topBar = document.querySelector('.top_bar');
        if (window.scrollY > 10) {
            topBar.classList.add('scrolled');
        } else {
            topBar.classList.remove('scrolled');
        }
    });