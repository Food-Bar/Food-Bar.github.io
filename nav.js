const nav = document.getElementById('nav-bar');
const welcome = document.getElementById('welcome-bubble');

addEventListener('scroll', () => {
    if(welcome.getBoundingClientRect().bottom < 0){
        nav.classList.add('fixed');
    }else{
        nav.classList.remove('fixed');
    }
});