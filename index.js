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

    function adjustClassPageOffset() {
        const topBar = document.querySelector('.top_bar');
        const classPage = document.querySelectorAll('.page');
      
        classPage.forEach(page => {
            const topBarHeight = topBar.offsetHeight;
            page.style.marginTop = `${topBarHeight}px`;
        });
      }
      
      // Run on load
      window.addEventListener('load', adjustClassPageOffset);
      
      // Run on resize (in case top_bar height changes responsively)
      window.addEventListener('resize', adjustClassPageOffset);
    const menu = document.getElementById('top_bar');
    const float_button = document.querySelector('.float_button');
    
    // Make menu focusable (if needed)
    
    function toggleMenu() {
        menu.classList.toggle('active');
        float_button.classList.toggle('deactive');
    }
    

    function SetPage(page) {
        homePage = document.getElementById('HomePage');
        projectPage = document.getElementById('ProjectsPage');
        modelPage = document.getElementById('ModelsPage');
        TechPage = document.getElementById('TechnicalProjects');
        if(page =="Home") {
            homePage.style.display = "block";
            projectPage.style.display = "none";
            modelPage.style.display = "none";
            TechPage.style.display = "none";
        }
        else if(page == "Projects") {
            homePage.style.display = "none";
            projectPage.style.display = "block";
            modelPage.style.display = "none";
            TechPage.style.display = "none";
        }
        else if(page == "Models") {
            homePage.style.display = "none";
            projectPage.style.display = "none";
            modelPage.style.display = "block";
            TechPage.style.display = "none";
        }
        else if(page == "TechnicalProjects") {
            homePage.style.display = "none";
            projectPage.style.display = "none";
            modelPage.style.display = "none";
            TechPage.style.display = "block";
        }
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
    }

      