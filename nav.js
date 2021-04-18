const nav = document.getElementById('nav-bar');
const welcome = document.getElementById('welcome-bubble');
const burger = document.getElementById('burger');
const navUl = document.getElementById('nav-ul');
const content = document.getElementById('content');
const links = document.getElementsByClassName('nav-link');

// for sticky nav bar
addEventListener('scroll', () => {
    if (welcome.getBoundingClientRect().bottom < 0.05 * innerHeight) {
        nav.classList.add('fixed');
        nav.style.backgroundColor = '#333';
    } else{
        nav.classList.remove('fixed');
        nav.style.backgroundColor = 'transparent';
    }
});

// for the responsive link menu
let menuOut = false;
burger.addEventListener('click', () => {
    if (menuOut) {
        navUl.style.animation = '';
        navUl.offsetHeight;
        navUl.style.animation = `fade-in 0.5s ease reverse both ${0.2 * links.length}s`;
        for (let i = 0; i < links.length; i++) {
            links[i].style.animation = '';
            links[i].offsetHeight;
            links[i].style.animation = `fade-in 0.5s ease reverse both ${0.2 * i}s`;
        }
        menuOut = false;
    } else {
        navUl.style.animation = '';
        navUl.offsetHeight;
        navUl.style.animation = 'fade-in 0.5s ease forwards';
        for (let i = 0; i < links.length; i++) {
            links[i].style.animation = '';
            links[i].offsetHeight;
            links[i].style.animation = `fade-in 0.5s ease forwards ${0.2 * i + 0.5}s`;
        }
        menuOut = true;
    }

    // burger animation
    burger.classList.toggle('toggle');
});
content.addEventListener('click', () => { navUl.classList.remove('nav-active'); });
