let currentUser = null;


/* ================= PAGE LOAD ================= */

document.addEventListener("DOMContentLoaded", function () {

    const savedUser =
        localStorage.getItem("loggedInUser");


    if (savedUser) {

        currentUser = JSON.parse(savedUser);

        showApp();

    } else {

        showLogin();

    }


    // Apply saved dark mode
    if (
        localStorage.getItem("darkMode") === "true"
    ) {

        document.body.classList.add("dark");

    }

});


/* ================= LOGIN / REGISTER UI ================= */

function showLogin() {

    document
        .getElementById("loginBox")
        .classList.remove("hidden");


    document
        .getElementById("registerBox")
        .classList.add("hidden");


    clearMessages();
}


function showRegister() {

    document
        .getElementById("loginBox")
        .classList.add("hidden");


    document
        .getElementById("registerBox")
        .classList.remove("hidden");


    clearMessages();
}


function clearMessages() {

    document
        .getElementById("loginMessage")
        .textContent = "";


    document
        .getElementById("registerMessage")
        .textContent = "";
}


/* ================= LOGIN ================= */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const savedUser =
                localStorage.getItem(
                    "registeredUser"
                );


            const registeredUser =
                savedUser
                    ? JSON.parse(savedUser)
                    : null;


            /*
                Login works only with
                the registered account.
            */

            if (
                registeredUser &&
                email === registeredUser.email &&
                password === registeredUser.password
            ) {

                currentUser = {

                    name: registeredUser.name,

                    email: registeredUser.email

                };


                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(currentUser)
                );


                showApp();

            } else {

                const message =
                    document.getElementById(
                        "loginMessage"
                    );


                message.style.color =
                    "#dc2626";


                message.textContent =
                    "Invalid email or password. Please register first.";

            }

        }
    );


/* ================= REGISTER ================= */

document
    .getElementById("registerForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const user = {

                name: name,

                email: email,

                password: password

            };


            localStorage.setItem(
                "registeredUser",
                JSON.stringify(user)
            );


            const message =
                document.getElementById(
                    "registerMessage"
                );


            message.style.color =
                "#16a34a";


            message.textContent =
                "Registration successful. Please login.";


            document
                .getElementById("registerForm")
                .reset();


            setTimeout(
                function () {

                    showLogin();

                },
                1200
            );

        }
    );


/* ================= SWITCH LOGIN / REGISTER ================= */

document
    .getElementById("showRegister")
    .addEventListener(
        "click",
        showRegister
    );


document
    .getElementById("showLogin")
    .addEventListener(
        "click",
        showLogin
    );


/* ================= LOGOUT ================= */

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        logout
    );


function logout() {

    localStorage.removeItem(
        "loggedInUser"
    );


    currentUser = null;


    document
        .getElementById("appPage")
        .classList.add("hidden");


    document
        .getElementById("authPage")
        .classList.remove("hidden");


    document
        .getElementById("loginForm")
        .reset();


    showLogin();
}


/* ================= SHOW APP ================= */

function showApp() {

    document
        .getElementById("authPage")
        .classList.add("hidden");


    document
        .getElementById("appPage")
        .classList.remove("hidden");


    document
        .getElementById("userName")
        .textContent =
        currentUser.name;


    document
        .getElementById("subjectContainer")
        .innerHTML = "";


    addSubject();


    displayHistory();
}


/* ================= ADD SUBJECT ================= */

document
    .getElementById("addSubjectBtn")
    .addEventListener(
        "click",
        addSubject
    );


function addSubject() {

    const container =
        document.getElementById(
            "subjectContainer"
        );


    const row =
        document.createElement("div");


    row.className =
        "subject-row";


    row.innerHTML = `

        <input
            type="text"
            class="subject-name"
            placeholder="Subject name"
        >


        <input
            type="number"
            class="credits"
            placeholder="Credits"
            min="1"
            step="0.5"
        >


        <select class="grade-point">

            <option value="">
                Select grade
            </option>

            <option value="10">
                O - 10
            </option>

            <option value="9">
                A+ - 9
            </option>

            <option value="8">
                A - 8
            </option>

            <option value="7">
                B+ - 7
            </option>

            <option value="6">
                B - 6
            </option>

            <option value="5">
                C - 5
            </option>

            <option value="0">
                F - 0
            </option>

        </select>


        <button
            class="remove-btn"
            type="button"
        >
            Remove
        </button>

    `;


    const removeButton =
        row.querySelector(
            ".remove-btn"
        );


    removeButton.addEventListener(
        "click",
        function () {

            removeSubject(row);

        }
    );


    container.appendChild(row);
}


/* ================= REMOVE SUBJECT ================= */

function removeSubject(row) {

    const rows =
        document.querySelectorAll(
            ".subject-row"
        );


    if (rows.length > 1) {

        row.remove();

    } else {

        alert(
            "At least one subject is required."
        );

    }
}


/* ================= CALCULATE CGPA ================= */

document
    .getElementById("calculateBtn")
    .addEventListener(
        "click",
        calculateCGPA
    );


function calculateCGPA() {

    const rows =
        document.querySelectorAll(
            ".subject-row"
        );


    let totalCredits = 0;

    let totalWeightedPoints = 0;


    if (rows.length === 0) {

        alert(
            "Please add at least one subject."
        );

        return;

    }


    for (const row of rows) {

        const credits =
            parseFloat(
                row
                    .querySelector(".credits")
                    .value
            );


        const gradePoint =
            parseFloat(
                row
                    .querySelector(".grade-point")
                    .value
            );


        if (
            isNaN(credits) ||
            isNaN(gradePoint)
        ) {

            alert(
                "Please enter credits and grade for all subjects."
            );

            return;

        }


        if (credits <= 0) {

            alert(
                "Credits must be greater than zero."
            );

            return;

        }


        totalCredits += credits;


        totalWeightedPoints +=
            credits * gradePoint;

    }


    const cgpa =
        totalWeightedPoints /
        totalCredits;


    const percentage =
        cgpa * 9.5;


    document
        .getElementById("cgpa")
        .textContent =
        cgpa.toFixed(2);


    document
        .getElementById("totalCredits")
        .textContent =
        totalCredits;


    document
        .getElementById("percentage")
        .textContent =
        percentage.toFixed(2);


    document
        .getElementById("result")
        .classList.remove("hidden");


    saveHistory(
        cgpa,
        totalCredits,
        percentage
    );

}


/* ================= SAVE HISTORY ================= */

function saveHistory(
    cgpa,
    totalCredits,
    percentage
) {

    const historyKey =
        "cgpaHistory_" +
        currentUser.email;


    const history =
        JSON.parse(
            localStorage.getItem(
                historyKey
            )
        ) || [];


    history.unshift({

        cgpa:
            cgpa.toFixed(2),

        credits:
            totalCredits,

        percentage:
            percentage.toFixed(2),

        date:
            new Date().toLocaleString()

    });


    localStorage.setItem(
        historyKey,
        JSON.stringify(history)
    );


    displayHistory();
}


/* ================= DISPLAY HISTORY ================= */

document
    .getElementById("historySearch")
    .addEventListener(
        "input",
        displayHistory
    );


function displayHistory() {

    if (!currentUser) {

        return;

    }


    const historyKey =
        "cgpaHistory_" +
        currentUser.email;


    const history =
        JSON.parse(
            localStorage.getItem(
                historyKey
            )
        ) || [];


    const searchText =
        document
            .getElementById(
                "historySearch"
            )
            .value
            .toLowerCase();


    const filteredHistory =
        history.filter(
            function (item) {

                return (

                    item.date
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    item.cgpa
                        .includes(
                            searchText
                        )

                );

            }
        );


    const historyList =
        document.getElementById(
            "historyList"
        );


    if (
        filteredHistory.length === 0
    ) {

        historyList.innerHTML = `

            <div class="empty-history">

                No calculation history found.

            </div>

        `;

        return;

    }


    historyList.innerHTML =
        filteredHistory
            .map(
                function (item) {

                    return `

                        <div class="history-item">

                            <div>

                                <strong>
                                    Date:
                                </strong>

                                ${item.date}

                                <br>

                                <small>
                                    Total Credits:
                                    ${item.credits}
                                </small>

                            </div>


                            <div>

                                <span class="history-cgpa">

                                    CGPA:
                                    ${item.cgpa}

                                </span>

                                <br>

                                <small>

                                    Percentage:
                                    ${item.percentage}%

                                </small>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* ================= CLEAR HISTORY ================= */

document
    .getElementById("clearHistoryBtn")
    .addEventListener(
        "click",
        clearHistory
    );


function clearHistory() {

    const historyKey =
        "cgpaHistory_" +
        currentUser.email;


    if (
        confirm(
            "Are you sure you want to clear all history?"
        )
    ) {

        localStorage.removeItem(
            historyKey
        );


        displayHistory();

    }
}


/* ================= RESET ================= */

document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        resetCalculator
    );


function resetCalculator() {

    document
        .getElementById(
            "subjectContainer"
        )
        .innerHTML = "";


    document
        .getElementById("cgpa")
        .textContent =
        "0.00";


    document
        .getElementById("totalCredits")
        .textContent =
        "0";


    document
        .getElementById("percentage")
        .textContent =
        "0.00";


    document
        .getElementById("result")
        .classList.add("hidden");


    addSubject();
}


/* ================= DARK MODE ================= */

document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        toggleTheme
    );


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const darkModeEnabled =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "darkMode",
        darkModeEnabled
    );

}