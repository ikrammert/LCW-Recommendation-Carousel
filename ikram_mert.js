(() => {
    // değişkenler
    const STORAGE_KEY = 'lcw_custom_carousel_data';
    const FAVORITES_KEY = 'lcw_custom_favorites';
    let products = [];

    const init = async () => {
        // sadece ürün sayfalarında çalışacak
        if (!document.querySelector('.product-detail')) return;
        
        // jQuery var mı
        if (typeof jQuery === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.onload = async () => {
                products = await getProducts();
                buildCSS();
                buildHTML();
                setEvents();
            };
            document.head.appendChild(script);
        } else {
            products = await getProducts();
            buildCSS();
            buildHTML();
            setEvents();
        }
    };

    const getProducts = async () => {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            console.log("veriler localStorageden alınıyor")
            return JSON.parse(storedData);
        }
        console.log("veriler get isteği ile çekiliyor")

        try {
            const response = await fetch('https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            //const response = await fetch('https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json');
            /*const response = await $.ajax({
                url: 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json',
                method: 'GET',
                dataType: 'json'
            });
            if (!response || response.length === 0) {
                throw new Error('Ürün verisi boş veya geçersiz');
            }
            */
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            const data = await response.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('Ürünler yüklenirken hata oluştu:', error);
            return [];
        }
    };

    const buildHTML = () => {
        const favorites = getFavorites(); //favorileri al
        const html = `
            <div class="custom-carousel-container">
                <h2 class="custom-carousel-title">You Might Also Like</h2> 
                <button class="custom-carousel-button custom-prev">❮</button>
                <div class="custom-product-carousel">
                    ${products.map(product => `
                        <div class="custom-product-card">
                            <a href="${product.url}" target="_blank">
                                <img src="${product.img}" alt="${product.name}" class="custom-product-image">
                                <p class="custom-product-title">${product.name}</p>
                                <div class="custom-product-price">${product.price} TL</div>
                            </a>
                            <div class="custom-heart-icon ${favorites.includes(product.id) ? 'active' : ''}" data-id="${product.id}">❤</div>
                        </div>
                    `).join('')}
                </div>
                <button class="custom-carousel-button custom-next">❯</button>
            </div>
        `;

        $(".product-detail").after(html);
    };

    const buildCSS = () => {
        const css = `
            .custom-carousel-container {
                max-width: 100%;
                margin: 20px auto;
                position: relative;
                padding: 0 60px;
            }
            .custom-carousel-title {
                font-size: 32px;
                margin-bottom: 20px;
                color: #29323b;
                font-weight: lighter;
            }
            .custom-product-carousel {
                display: flex;
                overflow: hidden;
                scroll-behavior: smooth;
                gap: 15px;
            }
            .custom-product-card {
                flex: 0 0 calc((100% - (15px * 5)) / 6.5);
                min-width: calc((100% - (15px * 5)) / 6.5);
                position: relative;
            }
            .custom-product-card a {
                text-decoration: none;
            }
            .custom-product-card a:hover {
                text-decoration: none;
            }
            .custom-product-image {
                width: 100%;
                margin-bottom: 10px;
            }
            .custom-product-title {
                color: #302e2b;
            }
            .custom-product-price {
                font-size: 16px;
                color: #193db0;
                font-weight: bold;
            }
            .custom-heart-icon {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 20px;
                color: #ccc;
                background: #fff;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .custom-heart-icon.active {
                color: #193db1;
            }
            .custom-carousel-button {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: white;
                border: 1px solid #ddd;
                width: 40px;
                height: 40px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }
            .custom-carousel-button.custom-prev { left: 10px; }
            .custom-carousel-button.custom-next { right: 10px; }
            
            @media (max-width: 768px) {
                .custom-product-card {
                    flex: 0 0 calc((100% - (15px * 1)) / 2.5);
                    min-width: calc((100% - (15px * 1)) / 2.5);
                }
                .custom-carousel-container {
                    padding: 0 30px;
                }
                .custom-carousel-title {
                    font-size: 16px;
                }
                .custom-product-price {
                    font-size: 14px;
                }
                .custom-carousel-button.custom-prev { left: 5px; }
                .custom-carousel-button.custom-next { right: 5px; }
            }
        `;
        if (!document.querySelector('.custom-carousel-style')) {
            $('<style>').addClass('custom-carousel-style').html(css).appendTo('head');
        }
    };

    const setEvents = () => {
        let scrollAmount = 0;
        const carousel = $('.custom-product-carousel');
        const cardWidth = carousel.width() / 6.5;

        $('.custom-carousel-button.custom-prev').on('click', () => {
            scrollAmount = Math.max(scrollAmount - cardWidth, 0);
            carousel.animate({ scrollLeft: scrollAmount }, 300);
        });

        $('.custom-carousel-button.custom-next').on('click', () => {
            const maxScroll = carousel[0].scrollWidth - carousel.width();
            scrollAmount = Math.min(scrollAmount + cardWidth, maxScroll);
            carousel.animate({ scrollLeft: scrollAmount }, 300);
        });

        $('.custom-heart-icon').on('click', function(e) {
            e.preventDefault();
            const productId = $(this).data('id');
            const isFavorited = toggleFavorite(productId);
            $(this).toggleClass('active', isFavorited);
        });
    };

    const getFavorites = () => {
        const favorites = localStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    };

    const toggleFavorite = (productId) => {
        const favorites = getFavorites();
        const index = favorites.indexOf(productId);
        
        if (index === -1) {
            favorites.push(productId);
        } else {
            favorites.splice(index, 1);
        }
        
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return index === -1;
    };

    init();
})(); 