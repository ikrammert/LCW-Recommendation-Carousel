(() => {
    // değişkenler
    const STORAGE_KEY = 'lcw_carousel_data';
    const FAVORITES_KEY = 'lcw_favorites';
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



    init();
})(); 