const nav = document.getElementById('nav-bar');
const welcome = document.getElementById('welcome-bubble');
const burger = document.getElementById('burger');
const navLink = document.getElementById('nav-links');
const content = document.getElementById('content');
const links = document.getElementsByClassName('nav-link');

// for sticky nav bar
addEventListener('scroll', () => {
    if (welcome.getBoundingClientRect().bottom < -5) {
        nav.classList.add('fixed');
        nav.style.backgroundColor = '#333';
        content.style.marginTop = '5vh';
    } else {
        nav.classList.remove('fixed');
        nav.style.backgroundColor = 'transparent';
        content.style.marginTop = 0;
    }
});

// for the responsive link menu
burger.addEventListener('click', () => {
    navLink.classList.toggle('nav-active');
    for (let i = 0; i < links.length; i++) {
        if (links[i].style.animation) links[i].style.animation = '';
        else links[i].style.animation = `link-fade 0.5s ease forwards ${0.2 * i + 0.5}s`;
    }
});
content.addEventListener('click', () => { navLink.classList.remove('nav-active'); });
