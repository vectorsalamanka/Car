let carsData = [];

// بارگذاری داده‌ها
async function loadCars() {
    try {
        const response = await fetch('data.json');
        carsData = await response.json();
        displayCars(carsData);
        populateFilters();
    } catch (error) {
        console.error('خطا در بارگذاری داده‌ها:', error);
    }
}

// نمایش ماشین‌ها
function displayCars(cars) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (cars.length === 0) {
        resultsDiv.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: white; font-size: 1.2em;">ماشینی پیدا نشد!</p>';
        return;
    }

    cars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <div class="car-image">${car.emoji}</div>
            <div class="car-info">
                <h3>${car.name}</h3>
                <p><strong>برند:</strong> ${car.brand}</p>
                <p><strong>نوع:</strong> ${car.type}</p>
                <p><strong>سال:</strong> ${car.year}</p>
                <p class="price">${car.price.toLocaleString('fa-IR')} تومان</p>
            </div>
        `;

        carCard.addEventListener('click', () => showModal(car));
        resultsDiv.appendChild(carCard);
    });
}

// پرکردن فیلتر برندها
function populateFilters() {
    const brands = [...new Set(carsData.map(car => car.brand))];
    const brandFilter = document.getElementById('brandFilter');
    
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

// جستجو و فیلتر
function filterCars() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const brand = document.getElementById('brandFilter').value;
    const type = document.getElementById('typeFilter').value;
    const maxPrice = parseInt(document.getElementById('priceFilter').value);

    const filtered = carsData.filter(car => {
        const matchSearch = car.name.toLowerCase().includes(searchTerm) || 
                          car.brand.toLowerCase().includes(searchTerm);
        const matchBrand = !brand || car.brand === brand;
        const matchType = !type || car.type === type;
        const matchPrice = car.price <= maxPrice;

        return matchSearch && matchBrand && matchType && matchPrice;
    });

    displayCars(filtered);
}

// نمایش جزئیات در Modal
function showModal(car) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 5em; margin-bottom: 20px;">${car.emoji}</div>
            <h2>${car.name}</h2>
            <p><strong>برند:</strong> ${car.brand}</p>
            <p><strong>نوع:</strong> ${car.type}</p>
            <p><strong>سال:</strong> ${car.year}</p>
            <p><strong>قدرت موتور:</strong> ${car.hp} اسب بخار</p>
            <p><strong>سرعت بیشینه:</strong> ${car.speed} کیلومتر بر ساعت</p>
            <p style="font-size: 1.3em; color: #667eea; font-weight: bold; margin-top: 20px;">
                قیمت: ${car.price.toLocaleString('fa-IR')} تومان
            </p>
            <p style="color: #666; margin-top: 15px; line-height: 1.6;">${car.description}</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

// بستن Modal
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// تغییر نمایش قیمت در فیلتر
document.getElementById('priceFilter').addEventListener('input', (e) => {
    document.getElementById('priceValue').textContent = 
        parseInt(e.target.value).toLocaleString('fa-IR') + ' تومان';
    filterCars();
});

// رویدادهای فیلتر
document.getElementById('searchInput').addEventListener('input', filterCars);
document.getElementById('brandFilter').addEventListener('change', filterCars);
document.getElementById('typeFilter').addEventListener('change', filterCars);

// بارگذاری اولیه
loadCars();