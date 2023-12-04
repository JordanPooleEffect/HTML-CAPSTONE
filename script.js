let slideIndex = 0;
let timeoutId;

document.addEventListener("DOMContentLoaded", function () {
    showSlides();
});

function showSlides() {
    let slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    slides[slideIndex - 1].style.display = "block";
    timeoutId = setTimeout(showSlides, 3000);
}

function changeSlide(n) {
    clearTimeout(timeoutId);
    slideIndex += n;
    let slides = document.getElementsByClassName("slide");
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    if (slideIndex < 1) {
        slideIndex = slides.length;
    }
    showSlides();
}

function changeColor() {
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById('colorChange').style.color = randomColor;
}

setInterval(changeColor, 500);

let activeButtons = {
    'btn_size': [],
    'btn_size1': []
};

function changeColorBtn(button) {
    const classList = button.classList;
    const maxSelections = 1;

    if (classList.contains('active')) {
        classList.remove('active');
        activeButtons['btn_size'] = activeButtons['btn_size'].filter(btn => btn !== button);
    } else if (activeButtons['btn_size'].length < maxSelections) {
        classList.add('active');
        activeButtons['btn_size'].push(button);
    }
}

let selectedOptions = {
    'btn_size': [],
    'btn_size1': []
};

function changeColorBtn1(button) {
    const classList = button.classList;
    const maxSelections = 1;

    if (classList.contains('active1')) {
        classList.remove('active1');
        activeButtons['btn_size1'] = activeButtons['btn_size1'].filter(btn => btn !== button);
    } else if (activeButtons['btn_size1'].length < maxSelections) {
        classList.add('active1');
        activeButtons['btn_size1'].push(button);
    }
}

function checkoutColor() {
    if (cart.length === 0) {
        alert("Your cart is empty. Add some items before checking out!");
        return;
    }

    let checkoutDetails = "CONGRATULATIONS! YOU HAVE BOUGHT:\n";

    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        let itemSubtotal = cart[i].price;
        checkoutDetails += `Product Name: ${cart[i].name}\n`;
        checkoutDetails += `Variation: ${cart[i].variation}\n`;
        checkoutDetails += `KBD Layout: ${cart[i].layout}\n`;
        checkoutDetails += `Price: $${itemSubtotal.toFixed(2)}\n\n`;
        subtotal += itemSubtotal;
    }

    subtotal += 20;

    checkoutDetails += `Shipping Fee: $20.00\n`;
    checkoutDetails += `Total: $${subtotal.toFixed(2)}`;

    alert(checkoutDetails);
}

// ----------------------------------------------

let exchangeRate;
let isPhpConversion = true;

document.addEventListener("DOMContentLoaded", function () {
    const convertButton = document.getElementById('usd-to-php-btn');
    convertButton.addEventListener('click', toggleConversion);
    hideConversionContainer();
});

async function fetchExchangeRate() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        exchangeRate = data.rates.PHP;

        const conversionContainer = document.getElementById('usd-to-php');
        conversionContainer.textContent = `1 USD = ${exchangeRate.toFixed(2)} PHP`;

        convertPrices();
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        const conversionContainer = document.getElementById('usd-to-php');
        conversionContainer.textContent = 'Error loading exchange rate';
    }
}

function toggleConversion() {
    isPhpConversion = !isPhpConversion;
    const conversionContainer = document.getElementById('usd-to-php');

    if (isPhpConversion) {
        conversionContainer.textContent = `1 USD = ${exchangeRate.toFixed(2)} PHP`;
        convertPrices();
    } else {
        conversionContainer.textContent = `1 PHP = ${(1 / exchangeRate).toFixed(4)} USD`;
        convertPrices();
    }
}

function convertPrices() {
    const productPrices = document.querySelectorAll('.product_info span, .title_box p');

    productPrices.forEach(priceElement => {
        const currencyAmount = parseFloat(priceElement.textContent.replace(/[^\d.]/g, ''));
        if (!isNaN(currencyAmount)) {
            const convertedAmount = isPhpConversion ? currencyAmount * exchangeRate : currencyAmount / exchangeRate;
            priceElement.textContent = `${isPhpConversion ? '₱' : '$'}${convertedAmount.toFixed(2)} ${isPhpConversion ? 'PHP' : 'USD'}`;
        } else {
            console.error('Error parsing currency amount:', priceElement.textContent);
        }
    });
}

fetchExchangeRate();

// --------------------------------------------

function openCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'block';

    updateCartDisplay();
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productName, productPrice) {
    if (activeButtons['btn_size'].length === 0 || activeButtons['btn_size1'].length === 0) {
        alert("Please select both a VARIATION and a KBD LAYOUT before adding to the cart.");
        return;
    }

    let selectedItem = {
        name: productName,
        variation: activeButtons['btn_size'].map(button => button.innerText).join(', '),
        layout: activeButtons['btn_size1'].map(button => button.innerText).join(', '),
        price: productPrice,
    };

    cart.push(selectedItem);

    updateCartDisplay();
    alert("Item Added To Cart!");

    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    let cartContainer = document.getElementById("cartItems");
    let subtotal = 0;

    cartContainer.innerHTML = "";

    cart.forEach(item => {
        let itemElement = document.createElement("div");
        let itemSubtotal = item.price;
        subtotal += itemSubtotal;

        itemElement.innerHTML = `
            <p>${item.name} - ${item.variation} - ${item.layout} - $${item.price.toFixed(2)} + $20 Shipping</p>
            <button style="font-family: 'Prompt';" onclick="removeFromCart(${cart.indexOf(item)})">Remove</button>
        `;
        cartContainer.appendChild(itemElement);
    });

    subtotal += 20;

    let totalElement = document.createElement("div");
    totalElement.innerHTML = `<p>Total: $${subtotal.toFixed(2)}</p>`;
    cartContainer.appendChild(totalElement);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();

    localStorage.setItem('cart', JSON.stringify(cart));
}
