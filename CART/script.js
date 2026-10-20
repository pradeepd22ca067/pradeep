const api = 'https://fakestoreapi.com/products';
const container = document.getElementById('container');
const searchInput = document.getElementById('searchInput');
const categoryList = document.getElementById('categoryList');
const sortSelect = document.getElementById('sortSelect');
const statusMessage = document.getElementById('statusMessage');
const productTotal = document.getElementById('productTotal');
const cartCount = document.getElementById('cartCount');
const cartButton = document.getElementById('cartButton');
let products = [];
let activeCategory = 'all';
let cartStorageError = '';

function readCart() {
    try {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!Array.isArray(storedCart)) {
            throw new TypeError('Saved cart must be an array.');
        }
        return storedCart;
    } catch (error) {
        console.error('Could not read the saved cart:', error);
        cartStorageError = 'Your saved bag could not be loaded. Try refreshing the page.';
        setStatus(cartStorageError, true);
        return [];
    }
}

function updateCartCount() {
    const count = readCart().length;
    cartCount.textContent = count;
    cartButton.setAttribute('aria-label', `Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`);
}

function setStatus(message, isError = false) {
    statusMessage.textContent = cartStorageError && !isError ? cartStorageError : message;
    statusMessage.classList.toggle('error', isError || Boolean(cartStorageError));
}

function displayCategory(category) {
    const labels = {
        "men's clothing": 'Men',
        "women's clothing": 'Women',
        jewelery: 'Jewelry',
        electronics: 'Electronics'
    };
    return labels[category] || category;
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function buildCategories() {
    const categories = [...new Set(products.map((product) => product.category))];
    if (categories.some((category) => category.includes('clothing'))) {
        const clothingButton = document.createElement('button');
        clothingButton.type = 'button';
        clothingButton.className = 'category-chip';
        clothingButton.dataset.category = 'clothing';
        clothingButton.textContent = 'Clothing';
        categoryList.appendChild(clothingButton);
    }
    categories.forEach((category) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'category-chip';
        button.dataset.category = category;
        button.textContent = displayCategory(category);
        categoryList.appendChild(button);
    });
}

function getVisibleProducts() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleProducts = products.filter((product) => {
        const matchesCategory = activeCategory === 'all'
            || (activeCategory === 'clothing' ? product.category.includes('clothing') : product.category === activeCategory);
        const matchesSearch = `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    switch (sortSelect.value) {
        case 'price-low':
            visibleProducts = visibleProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            visibleProducts = visibleProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            visibleProducts = visibleProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    return visibleProducts;
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'card';

    const imageWrap = document.createElement('div');
    imageWrap.className = 'product-image-wrap';
    const image = document.createElement('img');
    image.className = 'card-image';
    image.src = product.image;
    image.alt = product.title;
    image.loading = 'lazy';
    image.addEventListener('error', () => {
        imageWrap.classList.add('image-unavailable');
        image.alt = `${product.title} image unavailable`;
    }, { once: true });

    const favorite = document.createElement('button');
    favorite.className = 'favorite-button';
    favorite.type = 'button';
    favorite.setAttribute('aria-label', `Add ${product.title} to favorites`);
    favorite.setAttribute('aria-pressed', 'false');
    favorite.textContent = '♡';

    imageWrap.append(image, favorite);

    const category = document.createElement('p');
    category.className = 'card-category';
    category.textContent = displayCategory(product.category);

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = product.title;

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    const price = document.createElement('span');
    price.className = 'card-price';
    price.textContent = formatPrice(product.price);
    const rating = document.createElement('span');
    rating.className = 'card-rating';
    rating.textContent = `★ ${product.rating?.rate ?? 'New'}${product.rating?.count ? ` (${product.rating.count})` : ''}`;
    meta.append(price, rating);

    const addButton = document.createElement('button');
    addButton.className = 'add-button';
    addButton.type = 'button';
    addButton.dataset.productId = product.id;
    addButton.textContent = 'Add to bag';
    addButton.setAttribute('aria-label', `Add ${product.title} to bag`);

    card.append(imageWrap, category, title, meta, addButton);
    return card;
}

function renderProducts() {
    const visibleProducts = getVisibleProducts();
    container.replaceChildren(...visibleProducts.map(createProductCard));
    productTotal.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? 'piece' : 'pieces'} to discover`;
    setStatus(visibleProducts.length ? '' : 'No products found. Try another search or category.');
}

function selectCategory(category) {
    activeCategory = category;
    categoryList.querySelectorAll('.category-chip').forEach((button) => {
        const isActive = button.dataset.category === category;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
    renderProducts();
}

categoryList.querySelector('[data-category="all"]').setAttribute('aria-pressed', 'true');
categoryList.addEventListener('click', (event) => {
    const button = event.target.closest('.category-chip');
    if (button) selectCategory(button.dataset.category);
});

document.querySelectorAll('[data-nav-category]').forEach((link) => {
    link.addEventListener('click', () => {
        selectCategory(link.dataset.navCategory);
    });
});

searchInput.addEventListener('input', renderProducts);
sortSelect.addEventListener('change', renderProducts);

container.addEventListener('click', (event) => {
    const favorite = event.target.closest('.favorite-button');
    if (favorite) {
        const isFavorite = favorite.getAttribute('aria-pressed') !== 'true';
        favorite.setAttribute('aria-pressed', String(isFavorite));
        favorite.classList.toggle('active', isFavorite);
        favorite.textContent = isFavorite ? '♥' : '♡';
        favorite.setAttribute('aria-label', `${isFavorite ? 'Remove' : 'Add'} ${favorite.closest('.card').querySelector('.card-title').textContent} ${isFavorite ? 'from' : 'to'} favorites`);
        return;
    }

    const addButton = event.target.closest('.add-button');
    if (!addButton) return;

    const product = products.find((item) => item.id === Number(addButton.dataset.productId));
    if (!product) {
        setStatus('That product could not be added. Please refresh and try again.', true);
        return;
    }

    try {
        const cart = readCart();
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        cartStorageError = '';
        updateCartCount();
        addButton.textContent = 'Added to bag ✓';
        addButton.classList.add('added');
        window.setTimeout(() => {
            addButton.textContent = 'Add to bag';
            addButton.classList.remove('added');
        }, 1400);
    } catch (error) {
        console.error('Could not save the cart:', error);
        setStatus('Your bag could not be saved in this browser. Please check your storage settings.', true);
    }
});

cartButton.addEventListener('click', () => {
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    if (readCart().length === 0) {
        setStatus('Your bag is empty. Find something you love and add it here.');
    } else {
        setStatus(`You have ${readCart().length} ${readCart().length === 1 ? 'item' : 'items'} in your bag.`);
    }
});

document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.focus();
    }
});

async function loadProducts() {
    setStatus('Finding the good stuff…');
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error(`Product service returned ${response.status}.`);
        }
        const result = await response.json();
        if (!Array.isArray(result)) {
            throw new TypeError('Product service returned an unexpected response.');
        }
        products = result;
        buildCategories();
        renderProducts();
    } catch (error) {
        console.error('Could not load products:', error);
        container.replaceChildren();
        productTotal.textContent = 'The collection is taking a moment';
        setStatus('We couldn’t load the collection right now. Check your connection and refresh to try again.', true);
    }
}

updateCartCount();
loadProducts();
