document.addEventListener('DOMContentLoaded', () => {
    let priceFilter = { min: null, max: null };

    // 1. 全局配置与状态
    const BRAND_MAP = {
        "reddy":"shellreddy.png", "reddy express":"shellreddy.png", "coles": "shellreddy.png", "shell": "shell.png",
        "eg":"egampol.png", "ampol": "ampol.png", "caltex": "caltex.png",
        "eleven": "711.png","7-eleven": "711.png", "ampm": "ampm.png", "astron":"astron.png", 
        "bp": "bp.png", "budget":"budget.png", 
        "costco": "costco.png", "enhance":"enhance.png", 
        "liberty": "liberty.png", "mobil": "mobil.png", "metro": "metro.png", "matilda": "matilda.png", 
        "shell": "shell.png", "speedway": "speedway.png",
        "united": "united.png", "puma": "puma.png", "vibe": "vibe.png", "westside": "westside.png"
    };

    const getIconPath = (name) => {
        if (!name) return '/icons/gas.png';
        const low = name.toLowerCase();
        for (const key in BRAND_MAP) {
            if (low.includes(key)) return `/icons/${BRAND_MAP[key]}`;
        }
        return '/icons/gas.png';
    };

    const map = L.map('map', { zoomControl: false }).setView([-33.8688, 151.2093], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    let currentStations = [], selectedFuel = 'U91';
    let excludedBrands = new Set(), tempExcludedBrands = new Set();

    // 2. 核心：渲染逻辑
    const renderMarkers = () => {
        markersLayer.clearLayers();
        if (!currentStations.length) return;

    const filtered = currentStations.filter(s => {
        const fuel = s.fuels.find(f => f.fueltype === selectedFuel);
        if (!fuel || excludedBrands.has(s.brand)) return false;

        const priceInDollars = fuel.price / 100;
        // 价格区间过滤
        if (priceFilter.min !== null && priceInDollars < priceFilter.min) return false;
        if (priceFilter.max !== null && priceInDollars > priceFilter.max) return false;

        return true;
    });

        const prices = filtered.map(s => s.fuels.find(f => f.fueltype === selectedFuel).price).sort((a,b) => a-b);
        if (prices.length > 0) {
            const minP = prices[0], maxP = prices[prices.length - 1];
            const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
            const median = prices[Math.floor(prices.length / 2)];

            document.getElementById('stat-info').innerHTML = `
                <div style="font-size:11px; border-top:1px solid #eee; padding-top:8px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                    <div style="color:#4caf50"><b>Min:</b> $${(minP/100).toFixed(2)}</div>
                    <div style="color:#f44336; text-align:right;"><b>Max:</b> $${(maxP/100).toFixed(2)}</div>
                    <div style="grid-column: span 2; color:#1976d2; margin-top:4px;"><b>Average:</b> $${(avg/100).toFixed(2)}</div>
                </div>`;

            filtered.forEach(s => {
                const fuel = s.fuels.find(f => f.fueltype === selectedFuel);
                const priceCents = fuel.price;
                const priceDisplay = (priceCents / 100).toFixed(2);
                const [lng, lat] = s.location.coordinates;

                // --- 14天数据处理 (仅使用历史数组) ---
                const now = Math.floor(Date.now() / 1000);
                const fourteenDaysAgo = now - (14 * 24 * 60 * 60);

                // 只用 history 中的数据；若缺失则用当前价兜底
                const history14d = (fuel.history || [])
                    .filter(h => h.datetime >= fourteenDaysAgo)
                    .sort((a, b) => a.datetime - b.datetime);

                const dataForStats = history14d.length ? history14d : [{ price: fuel.price, datetime: fuel.datetime }];
                const hPrices = dataForStats.map(h => h.price);
                const low14 = Math.min(...hPrices);
                const high14 = Math.max(...hPrices);

                // --- 生成轻量级 SVG 折线图 ---
                let sparkline = "";
                if (history14d.length > 0) {
                    const points = history14d.map((h, i) => {
                        const x = history14d.length === 1 ? 0 : (i / (history14d.length - 1)) * 180;
                        const y = high14 === low14 ? 15 : 30 - ((h.price - low14) / (high14 - low14)) * 30;
                        return `${x},${y}`;
                    }).join(" ");

                    sparkline = `
                        <svg width="100%" height="35" style="margin-top:5px; stroke:#1976d2; stroke-width:2; fill:none;">
                            <polyline points="${points}" stroke-linejoin="round" />
                        </svg>`;
                }

                // 颜色逻辑
                let bg = "#fff", brd = "#ccc", txt = "#333";
                if (priceCents <= minP * 1.01) { bg = "#4caf50"; brd = "#2e7d32"; txt = "#fff"; }
                else if (priceCents >= median * 1.03 || priceCents === maxP) { bg = "#fff1f0"; brd = "#f44336"; txt = "#cf1322"; }

                const icon = L.divIcon({
                    className: 'custom-marker',
                    html: `<div class="marker-container">
                        <div class="price-bubble" style="background:${bg}; border-color:${brd}; color:${txt}">$${priceDisplay}</div>
                        <img src="${getIconPath(s.brand)}" class="brand-logo">
                    </div>`,
                    iconSize: [40, 50], iconAnchor: [20, 45]
                });

                const street = (s.address && s.address.address) ? s.address.address[0] : "";
                const suburb = (s.address && s.address.suburb) ? s.address.suburb : "";

                const popupContent = `
                    <div style="min-width:200px; padding:2px">
                        <b style="font-size:14px;">${s.name}</b>
                        <div style="font-size:11px; color:#666; margin-bottom:8px;">${street}, ${suburb}</div>
                        
                        <div style="background:#f8f9fa; padding:10px; border-radius:6px; position:relative;">
                            <div style="font-size:22px; font-weight:900; color:${priceCents === minP ? '#4caf50' : (priceCents === maxP ? '#f44336' : '#1976d2')}">
                                $${priceDisplay}
                            </div>
                            <div style="display:flex; justify-content:space-between; font-size:10px; color:#777; margin-top:5px; border-top:1px dashed #ddd; padding-top:5px;">
                                <span>14D Low: <b style="color:#4caf50">$${(low14/100).toFixed(2)}</b></span>
                                <span>14D High: <b style="color:#f44336">$${(high14/100).toFixed(2)}</b></span>
                            </div>
                            <div style="margin-top:5px; border-top:1px dashed #ddd; padding-top:5px;">
                                <span style="font-size:10px; color:#777; margin-top:5px; border-top:1px dashed #ddd; padding-top:5px;"">Price Trend</span>
                                ${sparkline}
                            </div>
                        </div>

                        <div style="display: flex; gap: 8px; margin-top:12px;">
                            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" 
                               style="flex:1; background:#4285F4; color:white; text-decoration:none; text-align:center; padding:8px; border-radius:4px; font-size:11px; font-weight:bold;">
                               Google Maps
                            </a>
                            <a href="https://waze.com/ul?ll=${lat},${lng}&navigate=yes" target="_blank" 
                               style="flex:1; background:#33CCFF; color:white; text-decoration:none; text-align:center; padding:8px; border-radius:4px; font-size:11px; font-weight:bold;">
                               Waze
                            </a>
                        </div>
                    </div>
                `;

                L.marker([lat, lng], {icon}).bindPopup(popupContent).addTo(markersLayer);
            });
        }
    };

    // 3. 核心：数据抓取
    const fetchStations = async () => {
        const b = map.getBounds();
        // 计算视野跨度，超过500km不加载
        const dist = map.getCenter().distanceTo(b.getNorthWest()) / 500; 
        if (map.getZoom() < 9) {
            document.getElementById('map-message').style.display = 'block';
            markersLayer.clearLayers();
            return;
        }
        document.getElementById('map-message').style.display = 'none';

        try {
            const url = `/api/stations?west=${b.getWest()}&south=${b.getSouth()}&east=${b.getEast()}&north=${b.getNorth()}`;
            const res = await fetch(url);
            currentStations = await res.json();
            updateBrandListUI();
            renderMarkers();
        } catch (e) { console.error("API Error:", e); }
    };

    // 4. 侧边栏品牌
    const updateBrandListUI = () => {
        const container = document.getElementById('brand-list');
        const brands = [...new Set(currentStations.map(s => s.brand))].sort();
        container.innerHTML = brands.map(b => `
            <label class="brand-item">
                <input type="checkbox" ${!tempExcludedBrands.has(b) ? 'checked' : ''} data-brand="${b}">
                <img src="${getIconPath(b)}" class="brand-icon-small">
                <span>${b}</span>
            </label>
        `).join('');

        container.querySelectorAll('input').forEach(i => {
            i.onchange = (e) => {
                const b = e.target.dataset.brand;
                e.target.checked ? tempExcludedBrands.delete(b) : tempExcludedBrands.add(b);
            };
        });
    };

    // 1. 全选/全不选逻辑
document.getElementById('select-all-brands').onclick = () => {
    const checkboxes = document.querySelectorAll('#brand-list input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = true;
        tempExcludedBrands.delete(cb.dataset.brand);
    });
};

document.getElementById('unselect-all-brands').onclick = () => {
    const checkboxes = document.querySelectorAll('#brand-list input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = false;
        tempExcludedBrands.add(cb.dataset.brand);
    });
};

// 2. 价格区间 Apply 逻辑
document.getElementById('apply-price-range').onclick = () => {
    const min = document.getElementById('price-min-input').value;
    const max = document.getElementById('price-max-input').value;
    priceFilter.min = min ? parseFloat(min) : null;
    priceFilter.max = max ? parseFloat(max) : null;
    renderMarkers(); // 立即预览
};

// 3. 价格区间 Reset 逻辑
document.getElementById('reset-price-range').onclick = () => {
    document.getElementById('price-min-input').value = '';
    document.getElementById('price-max-input').value = '';
    priceFilter.min = null;
    priceFilter.max = null;
    renderMarkers();
};


// 5. 修改 Apply All Filters 按钮逻辑
document.getElementById('apply-filters').onclick = () => {
    // 同步品牌过滤
    excludedBrands = new Set(tempExcludedBrands);
    // 价格过滤在点击 apply-price-range 时已同步到 priceFilter
    renderMarkers();
    // 关闭菜单
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').style.display = 'none';
};

    // 5. 事件监听
    document.getElementById('apply-filters').onclick = () => {
        excludedBrands = new Set(tempExcludedBrands);
        renderMarkers();
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').style.display = 'none';
    };

    document.getElementById('menu-toggle').onclick = () => {
        document.getElementById('sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').style.display = 'block';
        tempExcludedBrands = new Set(excludedBrands);
        updateBrandListUI();
    };

    document.getElementById('close-sidebar').onclick = () => {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').style.display = 'none';
    };

    document.getElementById('fuel-select').onchange = (e) => {
        selectedFuel = e.target.value;
        renderMarkers();
    };

    document.getElementById('search-input').onkeypress = async (e) => {
        if (e.key === 'Enter') {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e.target.value + ", Australia")}`);
            const data = await res.json();
            if (data && data.length > 0) map.setView([data[0].lat, data[0].lon], 13);
        }
    };

    // --- About 弹窗逻辑 ---
const aboutModal = document.getElementById('about-modal');
const aboutBtn = document.getElementById('about-btn');
const closeAboutX = document.getElementById('close-about');
const closeAboutBtn = document.getElementById('about-close-btn');

// 打开弹窗
aboutBtn.onclick = () => {
    aboutModal.style.display = 'flex';
};

// 关闭弹窗的几种方式
const hideAbout = () => { aboutModal.style.display = 'none'; };
closeAboutX.onclick = hideAbout;
closeAboutBtn.onclick = hideAbout;

// 点击弹窗外部背景关闭
window.onclick = (event) => {
    if (event.target == aboutModal) {
        hideAbout();
    }
};

    // 6. 启动
    map.on('moveend', fetchStations);
    fetchStations();
});
