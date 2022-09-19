const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');

burger.addEventListener('click', function(){
  burger.classList.toggle('open');
  menu.classList.toggle('open')
})


const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    slidesPerView: 1,
    loop: true,
    spaceBetween: 30,

    breakpoints: {
      1126: {
        slidesPerView: 3,
      },
      689: {
        slidesPerView:2
      },
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next-unique',
      prevEl: '.swiper-button-prev-unique',
    },
  
  });