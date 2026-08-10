/**
 * Atlantis Nồi Phở Điện Inox - Main JavaScript
 * Handles: Sticky Navbar, Mobile menu, Capacity selector filter, Form dual submit, Scroll animations
 */

// Helper to pre-select capacity in form when clicking from product card
function selectCapacityInForm(capacityValue) {
    const id = capacityValue.replace('L', '');
    const input = document.getElementById('qty-' + id);
    if (input) {
        let val = parseInt(input.value) || 0;
        if (val === 0) input.value = 1;
    }
}

function updateOrderQty(id, delta) {
    const input = document.getElementById('qty-' + id);
    if (input) {
        let val = parseInt(input.value) || 0;
        val += delta;
        if (val < 0) val = 0;
        input.value = val;
    }
}

function renderOrderProductsList() {
    const list = document.getElementById('order-products-list');
    if (!list || typeof productsData === 'undefined') return;

    let html = '';
    productsData.forEach(p => {
        html += `
            <div class="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div class="flex items-center gap-3 w-2/3">
                    <img src="${p.image}" class="w-12 h-12 rounded object-cover border border-gray-200">
                    <div>
                        <div class="font-bold text-sm text-gray-800">${p.name}</div>
                        <div class="text-xs font-bold text-red-600">${p.newPrice}</div>
                    </div>
                </div>
                <div class="flex items-center bg-gray-100 rounded-lg">
                    <button type="button" class="px-3 py-1 text-gray-600 hover:text-black font-bold text-lg" onclick="updateOrderQty('${p.id}', -1)">-</button>
                    <input type="number" id="qty-${p.id}" name="qty-${p.id}" value="0" min="0" class="w-10 bg-transparent text-center font-bold text-sm focus:outline-none" readonly>
                    <button type="button" class="px-3 py-1 text-gray-600 hover:text-black font-bold text-lg" onclick="updateOrderQty('${p.id}', 1)">+</button>
                </div>
            </div>
        `;
    });
    // Add combo option manually
    html += `
            <div class="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div class="flex items-center gap-3 w-2/3">
                    <div class="w-12 h-12 rounded bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20">
                        <i data-lucide="package" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <div class="font-bold text-sm text-gray-800">Bộ 2 Nồi (30L + 70L)</div>
                        <div class="text-xs font-bold text-red-600">Liên hệ</div>
                    </div>
                </div>
                <div class="flex items-center bg-gray-100 rounded-lg">
                    <button type="button" class="px-3 py-1 text-gray-600 hover:text-black font-bold text-lg" onclick="updateOrderQty('combo', -1)">-</button>
                    <input type="number" id="qty-combo" name="qty-combo" value="0" min="0" class="w-10 bg-transparent text-center font-bold text-sm focus:outline-none" readonly>
                    <button type="button" class="px-3 py-1 text-gray-600 hover:text-black font-bold text-lg" onclick="updateOrderQty('combo', 1)">+</button>
                </div>
            </div>
    `;
    list.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    renderOrderProductsList();

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ======================== NAVBAR SCROLL EFFECT ========================
    const navbar = document.getElementById('navbar');

    const handleNavbarScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ======================== MOBILE MENU ========================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const openMobileMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.add('open');
        mobileOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('open');
        mobileOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ======================== SMOOTH SCROLLING ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight + 10;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ======================== ACTIVE NAV LINK HIGHLIGHTING ========================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightActiveNavLink = () => {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('bg-white/10', 'text-white');
                    } else {
                        link.classList.remove('bg-white/10');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightActiveNavLink, { passive: true });

    // ======================== SCROLL ANIMATIONS ========================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    const animateOnScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animateOnScrollObserver.observe(el);
    });

    // ======================== DYNAMIC PRODUCTS RENDER & FILTER ========================
    const gridContainer = document.getElementById('product-grid');
    const capacityBtns = document.querySelectorAll('.capacity-btn');

    function renderProducts(filter = 'all') {
        if (!gridContainer || typeof productsData === 'undefined') return;

        gridContainer.innerHTML = ''; // clear

        const filtered = productsData.filter(p => filter === 'all' || p.capacity.toString() === filter);

        filtered.forEach((p, index) => {
            const highlightHtml = p.highlightBadge ?
                `<div class="absolute top-3 right-3 z-10"><span class="bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase shadow">${p.highlightBadge}</span></div>` : '';

            const borderClass = p.customBorder ? p.customBorder : 'border border-gray-200';
            const shadowClass = p.highlightBadge ? 'shadow-lg relative' : 'shadow-sm';

            const delay = index * 0.05;

            let discountHtml = '';
            if (p.oldPrice && p.newPrice) {
                const oldNum = parseInt(p.oldPrice.replace(/\D/g, ''));
                const newNum = parseInt(p.newPrice.replace(/\D/g, ''));
                if (oldNum > newNum) {
                    const percent = Math.round((oldNum - newNum) / oldNum * 100);
                    discountHtml = `<div class="absolute -top-3 -right-2 bg-amber-400 text-red-700 font-black px-2 py-0.5 rounded-md text-[11px] shadow-md transform rotate-3 z-20 border border-yellow-300 pointer-events-none">GIẢM ${percent}%</div>`;
                }
            }

            const cardHtml = `
                <div class="product-card w-[calc((100%-1rem)/2)] md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] animate-on-scroll bg-white rounded-3xl ${borderClass} overflow-hidden ${shadowClass} flex flex-col justify-between"
                    style="animation-delay: ${delay}s">
                    ${highlightHtml}
                    <div>
                        <div class="relative h-36 md:h-64 bg-slate-50 flex items-center justify-center p-3 md:p-6 border-b border-gray-100 cursor-pointer group" onclick="openProductModal('${p.id}')">
                            <span class="absolute top-4 left-4 ${p.badgeColor} text-white text-[0.65rem] md:text-xs font-black px-2 md:px-3 py-1 md:py-1.5 rounded-lg uppercase">${p.badge}</span>
                            <img src="${p.image}" alt="${p.name}" class="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-110">
                        </div>
                        <div class="p-3 md:p-6">
                            <h3 class="text-[1.1rem] leading-snug md:text-2xl font-extrabold text-brand-blue mb-2 cursor-pointer hover:text-brand-sky transition-colors" onclick="openProductModal('${p.id}')">${p.name}</h3>
                            <p class="text-navy-600 text-xs md:text-sm font-semibold text-brand-sky">${p.description}</p>
                        </div>
                    </div>
                    <div class="p-3 md:p-6 pt-0">
                        <div class="mb-4">
                            <span class="text-gray-400 line-through text-sm font-medium mr-2">${p.oldPrice}</span>
                            <span class="text-lg md:text-2xl font-black text-red-600">${p.newPrice}</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <div class="relative w-full">
                                ${discountHtml}
                                <a href="javascript:void(0)" onclick="selectCapacityInForm('${p.capacity}L'); openOrderModal()"
                                    class="bg-brand-blue hover:bg-brand-blue-dark text-white text-center py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 w-full relative z-10">
                                    <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                                    <span>Đặt Mua</span>
                                </a>
                            </div>
                            <button onclick="openProductModal('${p.id}')"
                                class="bg-blue-50 border border-brand-blue text-brand-blue hover:bg-blue-100 text-center py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 w-full">
                                <i data-lucide="info" class="w-4 h-4"></i>
                                <span>Xem Chi Tiết</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.innerHTML += cardHtml;
        });

        // Re-initialize icons for newly added HTML
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Ensure scroll animations trigger for new items
        setTimeout(() => {
            const els = document.querySelectorAll('#product-grid .animate-on-scroll');
            els.forEach(el => {
                // simple hack to make them visible right away since they just rendered
                el.classList.add('visible');
            });
        }, 50);
    }

    // Initial render
    renderProducts('all');

    if (capacityBtns) {
        capacityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedCap = btn.getAttribute('data-capacity');

                capacityBtns.forEach(b => {
                    b.classList.remove('active', 'bg-brand-blue', 'text-white', 'border-brand-blue', 'shadow-md');
                    b.classList.add('bg-white', 'text-brand-blue', 'border-blue-200');
                });
                btn.classList.add('active', 'bg-brand-blue', 'text-white', 'border-brand-blue', 'shadow-md');
                btn.classList.remove('bg-white', 'border-blue-200');

                renderProducts(selectedCap);
            });
        });
    }


    // ======================== DUAL SUBMIT FORM HANDLER ========================
    const forms = document.querySelectorAll('.consultation-form');
    
    forms.forEach(form => {
        let clickedAction = 'order';
        const btnOrderNow = form.querySelector('[data-action="order"]');
        const btnRequestCall = form.querySelector('[data-action="consult"]');
        const formSuccess = form.parentElement.querySelector('.form-success-alert');

        if (btnOrderNow) {
            btnOrderNow.addEventListener('click', () => { clickedAction = 'order'; });
        }

        if (btnRequestCall) {
            btnRequestCall.addEventListener('click', () => { clickedAction = 'consult'; });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullname = form.querySelector('input[name="fullname"]').value.trim();
            const phone = form.querySelector('input[name="phone"]').value.trim();

            const selectedProducts = [];
            if (typeof productsData !== 'undefined') {
                productsData.forEach(p => {
                    const qtyInput = document.getElementById('qty-' + p.id);
                    if (qtyInput) {
                        const qty = parseInt(qtyInput.value) || 0;
                        if (qty > 0) selectedProducts.push(p.name + ' - SL: ' + qty);
                    }
                });
            }
            const qtyCombo = document.getElementById('qty-combo');
            if (qtyCombo) {
                const qty = parseInt(qtyCombo.value) || 0;
                if (qty > 0) selectedProducts.push('Bộ 2 Nồi (30L + 70L) - SL: ' + qty);
            }
            const capacityText = selectedProducts.length > 0 ? selectedProducts.join(', ') : 'Chưa chọn sản phẩm';

            if (!fullname || !phone) {
                alert('Vui lòng điền đầy đủ Họ và tên và Số điện thoại!');
                return;
            }

            // Phone validation regex
            const phoneRegex = /^(0|\+84)[0-9]{9}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                alert('Vui lòng nhập số điện thoại hợp lệ (Ví dụ: 0912345678)');
                return;
            }

            const activeBtn = clickedAction === 'order' ? btnOrderNow : btnRequestCall;
            const originalBtnHtml = activeBtn.innerHTML;

            activeBtn.disabled = true;
            activeBtn.innerHTML = `
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang xử lý yêu cầu...</span>
            `;

            setTimeout(() => {
                form.style.display = 'none';
                if (formSuccess) {
                    formSuccess.classList.remove('hidden');
                }

                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                setTimeout(() => {
                    form.style.display = 'block';
                    form.reset();
                    if (formSuccess) {
                        formSuccess.classList.add('hidden');
                    }
                    activeBtn.disabled = false;
                    activeBtn.innerHTML = originalBtnHtml;
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 5000);
            }, 1200);
        });
    });

    // ======================== SCROLL TO TOP ========================
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    const toggleScrollTopBtn = () => {
        if (!scrollTopBtn) return;
        if (window.scrollY > 400) {
            scrollTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
            scrollTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
            scrollTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
            scrollTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
    };

    window.addEventListener('scroll', toggleScrollTopBtn, { passive: true });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initial checks
    handleNavbarScroll();
    highlightActiveNavLink();
    toggleScrollTopBtn();
});


// ======================== MODAL LOGIC ========================
let countdownInterval;

window.openProductModal = function (productId) {
    if (typeof productsData === 'undefined') return;
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Populate text data
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-image').alt = product.name;

    // Populate specs
    document.getElementById('modal-model').textContent = product.specs.model || '';
    document.getElementById('modal-voltage').textContent = product.specs.voltage || '';
    document.getElementById('modal-power').textContent = product.specs.power || '';
    document.getElementById('modal-capacity').textContent = product.specs.capacityText || '';
    document.getElementById('modal-yield').textContent = product.specs.yield || '';
    document.getElementById('modal-temp').textContent = product.specs.temp || '';
    document.getElementById('modal-material').textContent = product.specs.material || '';
    document.getElementById('modal-weight').textContent = product.specs.weight || '';
    document.getElementById('modal-dimensions').textContent = product.specs.dimensions || '';
    document.getElementById('modal-warranty').textContent = product.specs.warranty || '';

    // Populate Price and Discount Badge
    const oldPriceEl = document.getElementById('modal-old-price');
    const newPriceEl = document.getElementById('modal-new-price');
    const badgeEl = document.getElementById('modal-discount-badge');

    if (oldPriceEl && newPriceEl) {
        oldPriceEl.textContent = product.oldPrice || '';
        newPriceEl.textContent = product.newPrice || '';

        if (badgeEl) {
            if (product.oldPrice && product.newPrice) {
                const oldNum = parseInt(product.oldPrice.replace(/\D/g, ''));
                const newNum = parseInt(product.newPrice.replace(/\D/g, ''));
                if (oldNum > newNum) {
                    const percent = Math.round((oldNum - newNum) / oldNum * 100);
                    badgeEl.textContent = 'GIẢM ' + percent + '%';
                    badgeEl.classList.remove('hidden');
                } else {
                    badgeEl.classList.add('hidden');
                }
            } else {
                badgeEl.classList.add('hidden');
            }
        }
    }

    // Populate Voucher
    const voucherContainer = document.getElementById('modal-voucher-container');
    if (voucherContainer) {
        voucherContainer.innerHTML = '';
        if (product.voucher) {
            // Split voucher text if multiple (e.g. by & or -)
            const promos = product.voucher.split(/&|-/).map(p => p.trim());
            promos.forEach((promo, idx) => {
                const icon = idx === 0 ? 'percent' : (idx === 1 ? 'gift' : 'settings');
                const color = idx === 0 ? 'text-red-500' : (idx === 1 ? 'text-brand-blue' : 'text-amber-500');
                voucherContainer.innerHTML += `
                    <div class="flex items-center gap-2 bg-white px-3 md:px-4 py-2 rounded-xl shadow border border-gray-100">
                        <i data-lucide="${icon}" class="w-5 h-5 ${color}"></i>
                        <span class="font-bold text-gray-800 text-xs md:text-sm">${promo}</span>
                    </div>
                `;
                if (idx < promos.length - 1) {
                    voucherContainer.innerHTML += `<span class="text-xl font-black text-gray-400">+</span>`;
                }
            });
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    // Populate Thumbnails
    const thumbsContainer = document.getElementById('modal-thumbnails');
    if (thumbsContainer && product.thumbnails) {
        thumbsContainer.innerHTML = '';
        product.thumbnails.forEach((thumb, idx) => {
            const isVideo = idx === 0 && product.hasVideo;
            const opacityClass = idx === product.thumbnails.length - 1 ? 'opacity-50' : '';
            const html = `
                <div class="relative w-full border border-gray-200 rounded overflow-hidden cursor-pointer hover:border-brand-blue ${opacityClass}">
                    <img src="${thumb}" class="w-full h-auto object-cover">
                    ${isVideo ? '<div class="absolute inset-0 flex items-center justify-center bg-black/20"><i data-lucide="play-circle" class="w-6 h-6 text-white drop-shadow"></i></div>' : ''}
                </div>
            `;
            thumbsContainer.innerHTML += html;
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    document.getElementById('modal-buy-btn').setAttribute('onclick', `selectCapacityInForm('${product.capacity}L'); closeProductModal(); openOrderModal();`);

    // Show modal
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('hidden');
        void modal.offsetWidth; // trigger reflow

        modal.querySelector('.modal-backdrop').classList.remove('opacity-0');
        modal.querySelector('.modal-backdrop').classList.add('opacity-100');

        const content = modal.querySelector('.modal-content');
        content.classList.remove('opacity-0', 'translate-y-10');
        content.classList.add('opacity-100', 'translate-y-0');

        document.body.style.overflow = 'hidden';

        // Start countdown timer
        startCountdownTimer();
    }
};

window.closeProductModal = function () {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    modal.querySelector('.modal-backdrop').classList.remove('opacity-100');
    modal.querySelector('.modal-backdrop').classList.add('opacity-0');

    const content = modal.querySelector('.modal-content');
    content.classList.remove('opacity-100', 'translate-y-0');
    content.classList.add('opacity-0', 'translate-y-10');

    setTimeout(() => {
        modal.classList.add('hidden');
        const orderModal = document.getElementById('order-modal');
        if (!orderModal || orderModal.classList.contains('hidden')) {
            document.body.style.overflow = '';
        }
        if (countdownInterval) clearInterval(countdownInterval);
    }, 300);
};

window.openOrderModal = function () {
    const modal = document.getElementById('order-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        void modal.offsetWidth; // trigger reflow

        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.classList.remove('opacity-0');
            backdrop.classList.add('opacity-100');
        }

        const content = modal.querySelector('.modal-content');
        if (content) {
            content.classList.remove('opacity-0', 'translate-y-10');
            content.classList.add('opacity-100', 'translate-y-0');
        }

        document.body.style.overflow = 'hidden';
    }
};

window.closeOrderModal = function () {
    const modal = document.getElementById('order-modal');
    if (!modal) return;

    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
    }

    const content = modal.querySelector('.modal-content');
    if (content) {
        content.classList.remove('opacity-100', 'translate-y-0');
        content.classList.add('opacity-0', 'translate-y-10');
    }

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        const productModal = document.getElementById('product-modal');
        if (!productModal || productModal.classList.contains('hidden')) {
            document.body.style.overflow = '';
        }
    }, 300);
};

window.openVideoIfAvailable = function () {
    // In a real app, this would open a video player.
    // For now, it just alerts.
    // alert('Video sẽ được phát tại đây!');
};

function startCountdownTimer() {
    if (countdownInterval) clearInterval(countdownInterval);

    // Set random end time 5 hours from now
    let timeRemaining = 5 * 3600 + 20 * 60 + 15; // 5 hours, 20 mins, 15 secs for demo

    const hEl = document.querySelector('.countdown-hours');
    const mEl = document.querySelector('.countdown-minutes');
    const sEl = document.querySelector('.countdown-seconds');

    if (!hEl || !mEl || !sEl) return;

    countdownInterval = setInterval(() => {
        timeRemaining--;
        if (timeRemaining <= 0) timeRemaining = 0;

        const h = Math.floor(timeRemaining / 3600);
        const m = Math.floor((timeRemaining % 3600) / 60);
        const s = Math.floor(timeRemaining % 60);

        hEl.textContent = h.toString().padStart(2, '0');
        mEl.textContent = m.toString().padStart(2, '0');
        sEl.textContent = s.toString().padStart(2, '0');

        if (timeRemaining <= 0) clearInterval(countdownInterval);
    }, 1000);
}

// ======================== GLOBAL COUNTDOWN TIMER ========================
document.addEventListener('DOMContentLoaded', () => {
    const HOURS = 2;
    const MINUTES = 20;
    const SECONDS = 15;
    const totalDurationMs = (HOURS * 3600 + MINUTES * 60 + SECONDS) * 1000;

    // Đổi tên key để reset lại bộ nhớ tạm thời cho lần này
    const storageKey = 'atlantis_countdown_end_v2';

    let endTime = localStorage.getItem(storageKey);
    const now = new Date().getTime();

    if (!endTime || now > parseInt(endTime)) {
        endTime = now + totalDurationMs;
        localStorage.setItem(storageKey, endTime);
    } else {
        endTime = parseInt(endTime);
    }

    const updateCountdown = () => {
        const currentTime = new Date().getTime();
        const distance = endTime - currentTime;

        if (distance <= 0) {
            // Restart countdown when it reaches 0
            endTime = currentTime + totalDurationMs;
            localStorage.setItem(storageKey, endTime);
        }

        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        const hStr = h < 10 ? '0' + h : h;
        const mStr = m < 10 ? '0' + m : m;
        const sStr = s < 10 ? '0' + s : s;

        document.querySelectorAll('.countdown-hours').forEach(el => el.textContent = hStr);
        document.querySelectorAll('.countdown-minutes').forEach(el => el.textContent = mStr);
        document.querySelectorAll('.countdown-seconds').forEach(el => el.textContent = sStr);
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
});
