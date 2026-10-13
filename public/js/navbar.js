const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const menuIcon = menuToggle.querySelector("i");

if (menuToggle && navLinks) {
   menuToggle.addEventListener("click",()=>{

   navLinks.classList.toggle("active");

    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-xmark");

});
}

const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector("a");
    trigger.addEventListener("click",(e)=>{
        if(window.innerWidth<=992){
            e.preventDefault();
            dropdowns.forEach((item)=>{
                if(item!==dropdown){
                    item.classList.remove("active");
                }
            });
            dropdown.classList.toggle("active");
        }

    });

});


document.querySelectorAll(".nav-links a").forEach((link) => {

    link.addEventListener("click", () => {

        if (
            window.innerWidth <= 992 &&
            link.getAttribute("href") !== "#"
        ) {

            navLinks.classList.remove("active");

            dropdowns.forEach((item) => {
                item.classList.remove("active");
            });

        }

    });

});

