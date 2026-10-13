document.addEventListener("DOMContentLoaded", () => {

    const sidebar =
        document.getElementById("adminSidebar");

    const closeButton =
        document.getElementById("adminSidebarClose");

    const overlay =
        document.getElementById("adminSidebarOverlay");

    const toggleButtons =
        document.querySelectorAll(
            "#adminSidebarToggle, .admin-tablet-toggle"
        );


    /* ================================
       OPEN SIDEBAR
    ================================= */

    function openSidebar() {

        if (!sidebar || !overlay) return;

        sidebar.classList.add("open");
        overlay.classList.add("active");

        document.body.classList.add("sidebar-open");

        toggleButtons.forEach(button => {
            button.setAttribute("aria-expanded", "true");
            button.setAttribute("aria-label", "Close sidebar");
        });
    }


    /* ================================
       CLOSE SIDEBAR
    ================================= */

    function closeSidebar() {

        if (!sidebar || !overlay) return;

        sidebar.classList.remove("open");
        overlay.classList.remove("active");

        document.body.classList.remove("sidebar-open");

        toggleButtons.forEach(button => {
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-label", "Open sidebar");
        });
    }


    /* ================================
       TOGGLE BUTTONS
    ================================= */

    toggleButtons.forEach(button => {

        button.addEventListener("click", () => {

            if (sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }

        });

    });


    /* ================================
       CLOSE BUTTON
    ================================= */

    if (closeButton) {

        closeButton.addEventListener("click", () => {
            closeSidebar();
        });

    }


    /* ================================
       OVERLAY
    ================================= */

    if (overlay) {

        overlay.addEventListener("click", () => {
            closeSidebar();
        });

    }


    /* ================================
       NAVIGATION
    ================================= */

    if (sidebar) {

        const navItems =
            sidebar.querySelectorAll(".admin-nav-item");

        navItems.forEach(item => {

            item.addEventListener("click", () => {

                if (window.innerWidth <= 1199) {
                    closeSidebar();
                }

            });

        });

    }


    /* ================================
       ESCAPE
    ================================= */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeSidebar();
        }

    });


    /* ================================
       RESIZE
    ================================= */

    window.addEventListener("resize", () => {

        if (window.innerWidth >= 1200) {
            closeSidebar();
        }

    });

});