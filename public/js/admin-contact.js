console.log("ADMIN CONTACT JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // ELEMENTS
    // =========================================================

    let selectedContactId = null;
    let selectedContactData = null;

    const rows = Array.from(
        document.querySelectorAll(".contact-row")
    );

    const detailsPanel =
        document.getElementById("contactDetailsPanel");

    const closeButton =
        document.getElementById("closeContactDetails");

    const statusSelect =
        document.getElementById("detailsStatusSelect");

    const markReadButton =
        document.getElementById("markContactRead");

    const replyButton =
        document.getElementById("replyToContact");

    const deleteButton =
        document.getElementById("deleteContact");

    const noteTextarea =
        document.getElementById("contactAdminNote");

    const saveNoteButton =
        document.getElementById("saveContactNote");

    const searchInput =
        document.getElementById("contactSearch");

    const statusFilter =
        document.getElementById("contactStatusFilter");

    const dateFilter =
        document.getElementById("contactDateFilter");

    const paginationContainer =
        document.querySelector(".pagination-buttons");

    const showingText =
        document.querySelector(".contacts-pagination span");


    // =========================================================
    // STATE
    // =========================================================

    let dateFrom = null;
    let dateTo = null;

    let currentPage = 1;

    const ITEMS_PER_PAGE = 10;


    // =========================================================
    // HELPERS
    // =========================================================

    function capitalizeStatus(status) {

        if (!status) {
            return "New";
        }

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );
    }


    function formatDate(dateValue) {

        if (!dateValue) {
            return "";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    function formatDateTime(dateValue) {

        if (!dateValue) {
            return "";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }


    function getRowStatus(row) {

        if (!row) {
            return "new";
        }

        const statusElement =
            row.querySelector(".contact-status");

        if (!statusElement) {
            return "new";
        }

        const statusClass =
            Array.from(statusElement.classList)
                .find(className =>
                    className.startsWith("status-")
                );

        if (!statusClass) {
            return "new";
        }

        return statusClass.replace(
            "status-",
            ""
        );
    }


    function setRowStatus(row, status) {

        if (!row) {
            return;
        }

        const statusElement =
            row.querySelector(".contact-status");

        if (!statusElement) {
            return;
        }

        statusElement.className =
            `contact-status status-${status}`;

        statusElement.textContent =
            capitalizeStatus(status);
    }


    function selectRow(row) {

        rows.forEach(item => {
            item.classList.remove("active");
        });

        if (row) {
            row.classList.add("active");
        }
    }


    function getSelectedRow() {

        if (!selectedContactId) {
            return null;
        }

        return rows.find(
            row =>
                row.dataset.contactId ===
                selectedContactId
        );
    }


    // =========================================================
    // STATISTICS
    // =========================================================

    function updateStatistics() {

        let newCount = 0;
        let readCount = 0;
        let repliedCount = 0;

        rows.forEach(row => {

            const status =
                getRowStatus(row);

            if (status === "new") {
                newCount++;
            }

            if (status === "read") {
                readCount++;
            }

            if (status === "replied") {
                repliedCount++;
            }

        });


        const statCards =
            document.querySelectorAll(
                ".contact-stat-card"
            );


        statCards.forEach(card => {

            const label =
                card.querySelector(
                    ".stat-label"
                );

            const number =
                card.querySelector(
                    ".stat-number"
                );

            if (!label || !number) {
                return;
            }

            const text =
                label.textContent
                    .trim()
                    .toLowerCase();


            if (text.includes("total")) {
                number.textContent =
                    rows.length;
            }

            if (text === "new") {
                number.textContent =
                    newCount;
            }

            if (text === "read") {
                number.textContent =
                    readCount;
            }

            if (text === "replied") {
                number.textContent =
                    repliedCount;
            }

        });

    }


    // =========================================================
    // OPEN CONTACT
    // =========================================================

    async function openContact(contactId) {

        if (!contactId) {
            return;
        }

        selectedContactId =
            contactId;


        const row =
            rows.find(
                item =>
                    item.dataset.contactId ===
                    contactId
            );


        selectRow(row);


        try {

            const response =
                await fetch(
                    `/admin/contacts/${contactId}`
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                alert(
                    data.message ||
                    "Unable to load contact."
                );

                return;
            }


            const contact =
                data.contact;


            selectedContactData =
                contact;


            // -------------------------------------------------
            // DETAILS
            // -------------------------------------------------

            const avatar =
                document.getElementById(
                    "detailsAvatar"
                );

            const name =
                document.getElementById(
                    "detailsName"
                );

            const email =
                document.getElementById(
                    "detailsEmail"
                );

            const subject =
                document.getElementById(
                    "detailsSubject"
                );

            const phone =
                document.getElementById(
                    "detailsPhone"
                );

            const date =
                document.getElementById(
                    "detailsDate"
                );

            const message =
                document.getElementById(
                    "detailsMessage"
                );


            if (avatar) {

                avatar.textContent =
                    (
                        contact.fullName ||
                        "U"
                    )
                        .charAt(0)
                        .toUpperCase();

            }


            if (name) {

                name.textContent =
                    contact.fullName ||
                    "Unknown";

            }


            if (email) {

                email.textContent =
                    contact.email || "";

            }


            if (subject) {

                subject.textContent =
                    contact.subject ||
                    "General Inquiry";

            }


            if (phone) {

                phone.textContent =
                    contact.phone ||
                    "Not provided";

            }


            if (date) {

                date.textContent =
                    formatDateTime(
                        contact.createdAt
                    );

            }


            if (message) {

                message.textContent =
                    contact.message || "";

            }


            // -------------------------------------------------
            // STATUS
            // -------------------------------------------------

            const contactStatus =
                contact.status || "new";


            if (statusSelect) {

                statusSelect.value =
                    contactStatus;

            }


            updateDetailsStatus(
                contactStatus
            );


            setRowStatus(
                row,
                contactStatus
            );


            // -------------------------------------------------
            // NOTE
            // -------------------------------------------------

            if (noteTextarea) {

                noteTextarea.value =
                    contact.adminNote || "";

            }


            // -------------------------------------------------
            // SHOW DETAILS
            // -------------------------------------------------

            if (detailsPanel) {

                detailsPanel.classList.add(
                    "active"
                );

            }


            document.body.classList.add(
                "contact-details-open"
            );


        } catch (error) {

            console.error(
                "Open contact error:",
                error
            );

            alert(
                "Unable to load contact."
            );

        }

    }


    // =========================================================
    // CONTACT ROW CLICK
    // =========================================================

    rows.forEach(row => {

        row.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".contact-view-btn"
                    )
                ) {
                    return;
                }


                const contactId =
                    row.dataset.contactId;


                selectRow(row);


                openContact(
                    contactId
                );

            }
        );

    });


    // =========================================================
    // VIEW BUTTON
    // =========================================================

    document
        .querySelectorAll(
            ".contact-view-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const contactId =
                        button.dataset.contactId;


                    const row =
                        button.closest(
                            ".contact-row"
                        );


                    selectRow(row);


                    openContact(
                        contactId
                    );

                }
            );

        });


    // =========================================================
    // CLOSE DETAILS
    // =========================================================

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                if (detailsPanel) {

                    detailsPanel.classList.remove(
                        "active"
                    );

                }


                document.body.classList.remove(
                    "contact-details-open"
                );


                selectedContactId =
                    null;

                selectedContactData =
                    null;


                rows.forEach(row => {

                    row.classList.remove(
                        "active"
                    );

                });

            }
        );

    }


    // =========================================================
    // UPDATE DETAILS STATUS UI
    // =========================================================

    function updateDetailsStatus(
        status
    ) {

        const statusElement =
            document.getElementById(
                "detailsStatus"
            );


        if (!statusElement) {
            return;
        }


        statusElement.className =
            `contact-status status-${status}`;


        statusElement.textContent =
            capitalizeStatus(status);

    }


    // =========================================================
    // UPDATE STATUS
    // =========================================================

    async function updateStatus(
        status
    ) {

        if (!selectedContactId) {

            alert(
                "Please select a contact first."
            );

            return false;
        }


        try {

            const response =
                await fetch(
                    `/admin/contacts/${selectedContactId}/status`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            status
                        })
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                alert(
                    data.message ||
                    "Unable to update status."
                );

                return false;
            }


            selectedContactData =
                data.contact;


            updateDetailsStatus(
                data.contact.status
            );


            if (statusSelect) {

                statusSelect.value =
                    data.contact.status;

            }


            const row =
                getSelectedRow();


            setRowStatus(
                row,
                data.contact.status
            );


            updateStatistics();


            // Keep current filters/pagination correct
            renderPagination();


            return true;


        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                "Unable to update status."
            );

            return false;

        }

    }


    // =========================================================
    // STATUS DROPDOWN
    // =========================================================

    if (statusSelect) {

        statusSelect.addEventListener(
            "change",
            async () => {

                const newStatus =
                    statusSelect.value;


                await updateStatus(
                    newStatus
                );

            }
        );

    }


    // =========================================================
    // MARK AS READ
    // =========================================================

    if (markReadButton) {

        markReadButton.addEventListener(
            "click",
            async () => {

                const success =
                    await updateStatus(
                        "read"
                    );


                if (
                    success &&
                    statusSelect
                ) {

                    statusSelect.value =
                        "read";

                }

            }
        );

    }


    // =========================================================
    // REPLY UI
    // =========================================================

    function showReplyView() {

        if (!selectedContactId) {

            alert(
                "Please select a contact first."
            );

            return;
        }


        const detailsContent =
            document.querySelector(
                ".contact-details-content"
            );


        if (!detailsContent) {
            return;
        }


        if (
            document.getElementById(
                "contactReplyView"
            )
        ) {
            return;
        }


        detailsContent
            .querySelectorAll(
                ":scope > *"
            )
            .forEach(element => {

                element.dataset.previousDisplay =
                    element.style.display;

                element.style.display =
                    "none";

            });


        const replyView =
            document.createElement(
                "div"
            );


        replyView.id =
            "contactReplyView";


        replyView.className =
            "contact-reply-view";


        replyView.innerHTML = `
            <div class="reply-view-header">

                <button
                    type="button"
                    id="backFromReply"
                    class="reply-back-btn"
                >
                    <i class="fa-solid fa-arrow-left"></i>
                    Back
                </button>

                <h3>Reply to Contact</h3>

            </div>

            <div class="reply-to-info">

                <span>Replying to</span>

                <strong>
                    ${escapeHtml(
                        selectedContactData?.fullName ||
                        "Unknown"
                    )}
                </strong>

                <small>
                    ${escapeHtml(
                        selectedContactData?.email ||
                        ""
                    )}
                </small>

            </div>

            <div class="reply-original-message">

                <span>Original Message</span>

                <div>
                    ${escapeHtml(
                        selectedContactData?.message ||
                        ""
                    )}
                </div>

            </div>

            <div class="reply-form">

                <label for="contactReplyMessage">
                    Your Reply
                </label>

                <textarea
                    id="contactReplyMessage"
                    placeholder="Write your reply..."
                    rows="8"
                ></textarea>

                <button
                    type="button"
                    id="sendContactReply"
                    class="action-btn action-reply"
                >
                    <i class="fa-solid fa-paper-plane"></i>
                    <span>Send Reply</span>
                </button>

            </div>
        `;


        detailsContent.appendChild(
            replyView
        );


        const backButton =
            document.getElementById(
                "backFromReply"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                () => {

                    replyView.remove();


                    detailsContent
                        .querySelectorAll(
                            ":scope > *"
                        )
                        .forEach(element => {

                            if (
                                element.dataset
                                    .previousDisplay !==
                                undefined
                            ) {

                                element.style.display =
                                    element.dataset
                                        .previousDisplay;


                                delete element.dataset
                                    .previousDisplay;

                            }

                        });

                }
            );

        }


        const sendButton =
            document.getElementById(
                "sendContactReply"
            );


        if (sendButton) {

            sendButton.addEventListener(
                "click",
                sendReply
            );

        }

    }


    // =========================================================
    // ESCAPE HTML
    // =========================================================

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }


        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    // =========================================================
    // SEND REPLY
    // =========================================================

    async function sendReply() {

        if (!selectedContactId) {
            return;
        }


        const textarea =
            document.getElementById(
                "contactReplyMessage"
            );


        const sendButton =
            document.getElementById(
                "sendContactReply"
            );


        if (!textarea) {
            return;
        }


        const message =
            textarea.value.trim();


        if (!message) {

            alert(
                "Please write a reply first."
            );

            textarea.focus();

            return;
        }


        if (sendButton) {

            sendButton.disabled =
                true;

        }


        try {

            const response =
                await fetch(
                    `/admin/contacts/${selectedContactId}/reply`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            message
                        })
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                alert(
                    data.message ||
                    "Unable to save reply."
                );

                return;
            }


            selectedContactData =
                data.contact;


            updateDetailsStatus(
                "replied"
            );


            if (statusSelect) {

                statusSelect.value =
                    "replied";

            }


            const row =
                getSelectedRow();


            setRowStatus(
                row,
                "replied"
            );


            updateStatistics();


            renderPagination();


            alert(
                "Reply saved successfully."
            );


            const replyView =
                document.getElementById(
                    "contactReplyView"
                );


            if (replyView) {

                replyView.remove();

            }


            const detailsContent =
                document.querySelector(
                    ".contact-details-content"
                );


            if (detailsContent) {

                detailsContent
                    .querySelectorAll(
                        ":scope > *"
                    )
                    .forEach(element => {

                        if (
                            element.dataset
                                .previousDisplay !==
                            undefined
                        ) {

                            element.style.display =
                                element.dataset
                                    .previousDisplay;


                            delete element.dataset
                                .previousDisplay;

                        }

                    });

            }


        } catch (error) {

            console.error(
                "Reply error:",
                error
            );

            alert(
                "Unable to save reply."
            );

        } finally {

            if (sendButton) {

                sendButton.disabled =
                    false;

            }

        }

    }


    // =========================================================
    // REPLY BUTTON
    // =========================================================

    if (replyButton) {

        replyButton.addEventListener(
            "click",
            () => {

                showReplyView();

            }
        );

    }


    // =========================================================
    // DELETE CONTACT
    // =========================================================

    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            async () => {

                if (!selectedContactId) {

                    alert(
                        "Please select a contact first."
                    );

                    return;
                }


                const confirmed =
                    confirm(
                        "Are you sure you want to delete this contact?"
                    );


                if (!confirmed) {
                    return;
                }


                try {

                    const response =
                        await fetch(
                            `/admin/contacts/${selectedContactId}`,
                            {
                                method: "DELETE"
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        alert(
                            data.message ||
                            "Unable to delete contact."
                        );

                        return;
                    }


                    const row =
                        getSelectedRow();


                    if (row) {
                        row.remove();
                    }


                    selectedContactId =
                        null;

                    selectedContactData =
                        null;


                    if (detailsPanel) {

                        detailsPanel.classList.remove(
                            "active"
                        );

                    }


                    document.body.classList.remove(
                        "contact-details-open"
                    );


                    updateStatistics();


                    renderPagination();


                    alert(
                        "Contact deleted successfully."
                    );


                } catch (error) {

                    console.error(
                        "Delete error:",
                        error
                    );

                    alert(
                        "Unable to delete contact."
                    );

                }

            }
        );

    }


    // =========================================================
    // SAVE ADMIN NOTE
    // =========================================================

    if (saveNoteButton) {

        saveNoteButton.addEventListener(
            "click",
            async () => {

                if (!selectedContactId) {

                    alert(
                        "Please select a contact first."
                    );

                    return;
                }


                const note =
                    noteTextarea
                        ? noteTextarea.value.trim()
                        : "";


                try {

                    saveNoteButton.disabled =
                        true;


                    const response =
                        await fetch(
                            `/admin/contacts/${selectedContactId}/note`,
                            {
                                method: "PATCH",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    note
                                })
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        alert(
                            data.message ||
                            "Unable to save note."
                        );

                        return;
                    }


                    selectedContactData =
                        data.contact;


                    alert(
                        "Note saved successfully."
                    );


                } catch (error) {

                    console.error(
                        "Note error:",
                        error
                    );

                    alert(
                        "Unable to save note."
                    );

                } finally {

                    saveNoteButton.disabled =
                        false;

                }

            }
        );

    }


    // =========================================================
    // FILTERED ROWS
    // =========================================================

    function getFilteredRows() {

        const searchValue =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "all";


        return rows.filter(row => {

            // -------------------------------------------------
            // SEARCH
            // -------------------------------------------------

            const rowText =
                row.textContent
                    .toLowerCase();


            const matchesSearch =
                !searchValue ||
                rowText.includes(
                    searchValue
                );


            if (!matchesSearch) {
                return false;
            }


            // -------------------------------------------------
            // STATUS
            // -------------------------------------------------

            const rowStatus =
                getRowStatus(row);


            const matchesStatus =
                selectedStatus === "all" ||
                rowStatus === selectedStatus;


            if (!matchesStatus) {
                return false;
            }


            // -------------------------------------------------
            // DATE
            // -------------------------------------------------

            if (dateFrom || dateTo) {

                const rowDate =
                    parseRowDate(row);


                if (!rowDate) {
                    return false;
                }


                rowDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                if (
                    dateFrom &&
                    rowDate < dateFrom
                ) {
                    return false;
                }


                if (
                    dateTo &&
                    rowDate > dateTo
                ) {
                    return false;
                }

            }


            return true;

        });

    }


    // =========================================================
    // SEARCH
    // =========================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                currentPage = 1;

                renderPagination();

            }
        );

    }


    // =========================================================
    // STATUS FILTER
    // =========================================================

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            () => {

                currentPage = 1;

                renderPagination();

            }
        );

    }


    // =========================================================
    // DATE PARSER
    // =========================================================

    function parseRowDate(row) {

        const contactDate =
            row.querySelector(
                ".contact-date"
            );


        if (!contactDate) {
            return null;
        }


        const value =
            contactDate.textContent.trim();


        if (!value) {
            return null;
        }


        const parsed =
            new Date(value);


        if (
            !Number.isNaN(
                parsed.getTime()
            )
        ) {

            return parsed;

        }


        const match =
            value.match(
                /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/
            );


        if (!match) {
            return null;
        }


        const fallback =
            new Date(
                `${match[1]} ${match[2]} ${match[3]}`
            );


        if (
            Number.isNaN(
                fallback.getTime()
            )
        ) {

            return null;

        }


        return fallback;

    }


    // =========================================================
    // CALENDAR POPUP
    // =========================================================

    function createCalendarPopup() {

        if (
            document.getElementById(
                "contactCalendarPopup"
            )
        ) {
            return;
        }


        const popup =
            document.createElement(
                "div"
            );


        popup.id =
            "contactCalendarPopup";


        popup.className =
            "contact-calendar-popup";


        popup.innerHTML = `
            <div class="calendar-popup-header">
                <strong>Filter by Date</strong>
            </div>

            <div class="calendar-fields">

                <div>
                    <label>From</label>

                    <input
                        type="date"
                        id="contactDateFrom"
                    >
                </div>

                <div>
                    <label>To</label>

                    <input
                        type="date"
                        id="contactDateTo"
                    >
                </div>

            </div>

            <div class="calendar-popup-actions">

                <button
                    type="button"
                    id="clearContactDate"
                >
                    Clear
                </button>

                <button
                    type="button"
                    id="applyContactDate"
                >
                    Apply
                </button>

            </div>
        `;


        const wrapper =
            document.querySelector(
                ".contact-date-filter"
            );


        if (wrapper) {

            wrapper.style.position =
                "relative";

            wrapper.appendChild(
                popup
            );

        } else {

            document.body.appendChild(
                popup
            );

        }


        const fromInput =
            document.getElementById(
                "contactDateFrom"
            );


        const toInput =
            document.getElementById(
                "contactDateTo"
            );


        const applyButton =
            document.getElementById(
                "applyContactDate"
            );


        const clearButton =
            document.getElementById(
                "clearContactDate"
            );


        if (applyButton) {

            applyButton.addEventListener(
                "click",
                () => {

                    dateFrom =
                        fromInput.value
                            ? new Date(
                                `${fromInput.value}T00:00:00`
                            )
                            : null;


                    dateTo =
                        toInput.value
                            ? new Date(
                                `${toInput.value}T00:00:00`
                            )
                            : null;


                    if (
                        dateFrom &&
                        dateTo &&
                        dateFrom > dateTo
                    ) {

                        alert(
                            "From date cannot be after To date."
                        );

                        return;

                    }


                    updateDateInputText();


                    currentPage =
                        1;


                    renderPagination();


                    popup.classList.remove(
                        "show"
                    );

                }
            );

        }


        if (clearButton) {

            clearButton.addEventListener(
                "click",
                () => {

                    dateFrom =
                        null;

                    dateTo =
                        null;


                    if (fromInput) {
                        fromInput.value = "";
                    }


                    if (toInput) {
                        toInput.value = "";
                    }


                    if (dateFilter) {
                        dateFilter.value = "";
                    }


                    currentPage =
                        1;


                    renderPagination();


                    popup.classList.remove(
                        "show"
                    );

                }
            );

        }

    }


    if (dateFilter) {

        createCalendarPopup();


        dateFilter.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const popup =
                    document.getElementById(
                        "contactCalendarPopup"
                    );


                if (popup) {

                    popup.classList.toggle(
                        "show"
                    );

                }

            }
        );

    }


    // =========================================================
    // DATE INPUT DISPLAY
    // =========================================================

    function updateDateInputText() {

        if (!dateFilter) {
            return;
        }


        if (!dateFrom && !dateTo) {

            dateFilter.value =
                "";

            return;

        }


        const fromText =
            dateFrom
                ? formatDate(dateFrom)
                : "";


        const toText =
            dateTo
                ? formatDate(dateTo)
                : "";


        if (
            fromText &&
            toText
        ) {

            dateFilter.value =
                `${fromText} - ${toText}`;

        } else if (fromText) {

            dateFilter.value =
                `From ${fromText}`;

        } else {

            dateFilter.value =
                `Until ${toText}`;

        }

    }


    // =========================================================
    // CLOSE CALENDAR OUTSIDE CLICK
    // =========================================================

    document.addEventListener(
        "click",
        event => {

            const popup =
                document.getElementById(
                    "contactCalendarPopup"
                );


            if (!popup) {
                return;
            }


            if (
                !event.target.closest(
                    ".contact-date-filter"
                ) &&
                !event.target.closest(
                    "#contactCalendarPopup"
                )
            ) {

                popup.classList.remove(
                    "show"
                );

            }

        }
    );


    // =========================================================
    // PAGINATION
    // =========================================================

    function renderPagination() {

        if (!paginationContainer) {
            return;
        }


        // IMPORTANT:
        // Get filtered rows BEFORE changing display.
        const filteredRows =
            getFilteredRows();


        const totalItems =
            filteredRows.length;


        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    totalItems /
                    ITEMS_PER_PAGE
                )
            );


        if (
            currentPage >
            totalPages
        ) {

            currentPage =
                totalPages;

        }


        const startIndex =
            (
                currentPage - 1
            ) *
            ITEMS_PER_PAGE;


        const endIndex =
            startIndex +
            ITEMS_PER_PAGE;


        const pageRows =
            filteredRows.slice(
                startIndex,
                endIndex
            );


        // -----------------------------------------------------
        // Hide all rows
        // -----------------------------------------------------

        rows.forEach(row => {

            row.style.display =
                "none";

        });


        // -----------------------------------------------------
        // Show current page rows
        // -----------------------------------------------------

        pageRows.forEach(row => {

            row.style.display =
                "";

        });


        // -----------------------------------------------------
        // Clear old pagination buttons
        // -----------------------------------------------------

        paginationContainer.innerHTML =
            "";


        // -----------------------------------------------------
        // Previous
        // -----------------------------------------------------

        const previous =
            document.createElement(
                "button"
            );


        previous.type =
            "button";


        previous.innerHTML =
            `<i class="fa-solid fa-chevron-left"></i>`;


        previous.disabled =
            currentPage === 1;


        previous.addEventListener(
            "click",
            () => {

                if (
                    currentPage >
                    1
                ) {

                    currentPage--;

                    renderPagination();

                }

            }
        );


        paginationContainer.appendChild(
            previous
        );


        // -----------------------------------------------------
        // Page numbers
        // -----------------------------------------------------

        for (
            let page = 1;
            page <= totalPages;
            page++
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                page;


            if (
                page ===
                currentPage
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
                "click",
                () => {

                    currentPage =
                        page;


                    renderPagination();

                }
            );


            paginationContainer.appendChild(
                button
            );

        }


        // -----------------------------------------------------
        // Next
        // -----------------------------------------------------

        const next =
            document.createElement(
                "button"
            );


        next.type =
            "button";


        next.innerHTML =
            `<i class="fa-solid fa-chevron-right"></i>`;


        next.disabled =
            currentPage ===
            totalPages;


        next.addEventListener(
            "click",
            () => {

                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderPagination();

                }

            }
        );


        paginationContainer.appendChild(
            next
        );


        // -----------------------------------------------------
        // Showing text
        // -----------------------------------------------------

        if (showingText) {

            if (totalItems === 0) {

                showingText.innerHTML =
                    `Showing <strong>0</strong> requests`;

            } else {

                const firstShown =
                    startIndex + 1;


                const lastShown =
                    Math.min(
                        endIndex,
                        totalItems
                    );


                showingText.innerHTML =
                    `Showing <strong>${firstShown}-${lastShown}</strong> of <strong>${totalItems}</strong> requests`;

            }

        }

    }


    // =========================================================
    // INITIALIZATION
    // =========================================================

    rows.forEach(row => {

        row.style.display =
            "";

    });


    updateStatistics();


    currentPage =
        1;


    renderPagination();


    console.log(
        "Admin Contact JS initialized successfully."
    );

});