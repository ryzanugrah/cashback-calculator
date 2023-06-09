(function () {
    const generateCalculatorButton = document.querySelector("#submit-btn");
    generateCalculatorButton.addEventListener("click", function (event) {
        event.preventDefault();

        const name = document.querySelector("#name").value;
        const minPurchase = document.querySelector("#min-purchase").value;
        const maxCashback = document.querySelector("#max-cashback").value;
        const cashbackPercentage = document.querySelector(
            "#cashback-percentage"
        ).value;

        if (!isValidInput(name, minPurchase, maxCashback, cashbackPercentage)) {
            return;
        }

        const calculator = {
            name: name,
            minPurchase: parseFloat(minPurchase),
            maxCashback: parseFloat(maxCashback),
            cashbackPercentage: parseFloat(cashbackPercentage),
        };

        saveCalculatorToLocalStorage(calculator);
        updateCalculatorButton(name);
    });

    const totalPurchaseInput = document.querySelector("#total-purchase");
    totalPurchaseInput.addEventListener("input", function (event) {
        const totalPurchase = parseFloat(event.target.value);
        const chosenCalculator = localStorage.getItem("chosenCalculator");

        updateCashbackReceived(totalPurchase, chosenCalculator);
    });

    window.addEventListener("load", function () {
        restoreCalculatorButtons();
        restoreChosenCalculator();
    });
})();

function isValidInput(name, minPurchase, maxCashback, cashbackPercentage) {
    const isInvalidInput =
        !name || !minPurchase || !maxCashback || !cashbackPercentage;
    const isInvalidNumber =
        isNaN(minPurchase) ||
        minPurchase <= 0 ||
        isNaN(maxCashback) ||
        maxCashback <= 0 ||
        isNaN(cashbackPercentage) ||
        cashbackPercentage < 0 ||
        cashbackPercentage > 100;

    if (isInvalidInput || isInvalidNumber) {
        alert("Input tidak valid!");
        return false;
    }

    return true;
}

function saveCalculatorToLocalStorage(calculator) {
    localStorage.setItem(calculator.name, JSON.stringify(calculator));
}

function updateCalculatorButton(name) {
    const isCalculatorButtonExists = document.querySelector(
        `button[data-name="${name}"]`
    );
    if (isCalculatorButtonExists) {
        isCalculatorButtonExists.innerHTML = name;
    } else {
        const calculatorButton = addCalculatorButton(name);
        document
            .querySelector("#calculator-buttons")
            .appendChild(calculatorButton);

        calculatorButton.addEventListener("click", function () {
            setChosenCalculator(name);
        });
    }
}

function addCalculatorButton(name) {
    const calculatorButton = document.createElement("button");
    calculatorButton.innerHTML = name;
    calculatorButton.setAttribute("class", "btn");
    calculatorButton.setAttribute("data-name", name);
    return calculatorButton;
}

function setChosenCalculator(name) {
    document.querySelector("#chosen-calculator").textContent = name;
    localStorage.setItem("chosenCalculator", name);
}

function updateCashbackReceived(totalPurchase, chosenCalculator) {
    const cashbackReceived = calculateCashback(totalPurchase, chosenCalculator);
    document.querySelector("#cashback-received").textContent = cashbackReceived;
}

function calculateCashback(totalPurchase, chosenCalculator) {
    const calculator = JSON.parse(chosenCalculator);
    const cashbackPercentage = calculator.cashbackPercentage / 100;
    const maxCashback = calculator.maxCashback;

    let cashbackReceived = 0;
    if (totalPurchase >= calculator.minPurchase) {
        cashbackReceived = Math.min(
            totalPurchase * cashbackPercentage,
            maxCashback
        );
    }

    return cashbackReceived;
}

function restoreCalculatorButtons() {
    const localStorageKeys = Object.keys(localStorage);

    for (let i = 0; i < localStorageKeys.length; i++) {
        const key = localStorageKeys[i];
        if (key !== "chosenCalculator") {
            const calculator = JSON.parse(localStorage.getItem(key));
            updateCalculatorButton(calculator.name);
        }
    }
}

function restoreChosenCalculator() {
    const chosenCalculator = localStorage.getItem("chosenCalculator");
    if (chosenCalculator) {
        document.querySelector("#chosen-calculator").textContent =
            chosenCalculator;
    }
}
