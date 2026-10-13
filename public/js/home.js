const heroSwiper = new Swiper(".heroSwiper", {
    loop: true,

    effect: "fade",
    fadeEffect: {
        crossFade: true,
    },

    speed: 1200,

    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    navigation: {
        nextEl: ".hero-next",
        prevEl: ".hero-prev",
    },
});


//partners slider :)
const partnersSlider = document.querySelector(".partners-slider");

if (partnersSlider) {
    partnersSlider.innerHTML += partnersSlider.innerHTML;
}

// ===============================
// Impact Counter Animation
// ===============================
const counters = document.querySelectorAll(".counter");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        const target = +counter.dataset.target;
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 80));
        const updateCounter = () => {
            current += increment;

            if (current >= target) {
                counter.textContent = target + "+";
            } else {
                counter.textContent = current + "+";
                requestAnimationFrame(updateCounter);
            }
        };
        updateCounter();
        observer.unobserve(counter);
    });
}, {
    threshold: 0.4
});

counters.forEach(counter => observer.observe(counter));