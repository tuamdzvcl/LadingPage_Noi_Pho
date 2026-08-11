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
                        <div class="text-xs font-bold text-bule-600">${p.newPrice}</div>
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
                        <div class="text-xs font-bold text-bule-600">Liên hệ</div>
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
                        link.classList.add('bg-brand-sky', 'text-white', 'shadow-md');
                        link.classList.remove('text-navy-700', 'bg-brand-sky-light/50', 'text-brand-blue');
                    } else {
                        link.classList.remove('bg-brand-sky', 'text-white', 'shadow-md', 'text-brand-blue', 'bg-brand-sky-light/50');
                        link.classList.add('text-navy-700');
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
                            <span class="absolute top-4 left-4 z-10 ${p.badgeColor} text-white text-[0.65rem] md:text-xs font-black px-2 md:px-3 py-1 md:py-1.5 rounded-lg uppercase">${p.badge}</span>
                            <img src="${p.image}" alt="${p.name}" class="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-110">
                        </div>
                        <div class="p-3 md:p-6">
                            <h3 class="text-[1.1rem] leading-snug md:text-2xl font-extrabold text-brand-blue mb-2 cursor-pointer hover:text-brand-sky transition-colors" onclick="openProductModal('${p.id}')">${p.name}</h3>
                            <p class="text-navy-600 text-xs md:text-sm font-semibold text-brand-sky">${p.description}</p>
                        </div>
                    </div>
                    <div class="p-3 md:p-6 pt-0">
                        <div class="mb-3">
                            <span class="text-gray-500 text-sm font-medium">Giá gốc: <span class="line-through">${p.oldPrice}</span></span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                            <div class="relative w-full h-full">
                                ${discountHtml}
                                <a href="javascript:void(0)" onclick="selectCapacityInForm('${p.capacity}L'); openOrderModal()"
                                    class="bg-brand-blue hover:bg-brand-blue-dark text-white text-center py-2 rounded-xl transition-all flex flex-col items-center justify-center w-full h-full min-h-[3.25rem] relative z-10">
                                    <div class="flex items-center gap-1 text-[12px] font-semibold opacity-90 mb-0.5 uppercase">
                                        <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                                        <span>Đặt mua ngay</span>
                                    </div>
                                    <span class="text-yellow-300 font-black text-sm md:text-[15px] leading-none drop-shadow-md">${p.newPrice}</span>
                                </a>
                            </div>
                            <button onclick="openProductModal('${p.id}')"
                                class="bg-blue-50 border border-brand-blue text-brand-blue hover:bg-blue-100 text-center py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 w-full h-full min-h-[3.25rem]">
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
    renderTestimonials();
    renderReasons();

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

    function renderReasons() {
        const grid = document.getElementById('reasons-grid');
        if (!grid || typeof reasonsData === 'undefined') return;

        let html = '';
        reasonsData.forEach((reason) => {
            html += `
            <div class="relative pt-6 animate-on-scroll group cursor-pointer">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-[3px] border-blue-600 flex items-center justify-center text-blue-600 text-2xl font-black shadow-sm z-10">
                ${reason.id}
              </div>
              <div class="bg-blue-600 border-[3px] border-blue-600 rounded-2xl flex flex-col h-full shadow-lg group-hover:-translate-y-1.5 transition-transform duration-300">
                <div class="bg-white rounded-t-[0.85rem] p-1.5 w-full">
                  <div class="w-full aspect-square md:aspect-auto md:h-48 overflow-hidden rounded-lg bg-gray-50">
                    <img src="${reason.image}" alt="${reason.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                  </div>
                </div>
                <div class="p-4 text-center min-h-[5rem] flex items-center justify-center">
                  <h3 class="text-[1rem] md:text-[1.05rem] font-black text-white uppercase leading-snug">
                    ${reason.title}
                  </h3>
                </div>
              </div>
            </div>
            `;
        });
        grid.innerHTML = html;
        
        // Kích hoạt hiệu ứng cuộn cho các thẻ vừa tạo
        setTimeout(() => {
            const els = document.querySelectorAll('#reasons-grid .animate-on-scroll');
            els.forEach(el => {
                el.classList.add('visible');
            });
        }, 50);
    }

    function renderTestimonials() {
        const container = document.getElementById('testimonials-grid');
        const carouselContainer = document.getElementById('testimonials-carousel-container');
        if (!container || typeof testimonialsData === 'undefined') return;

        let html = '';

        testimonialsData.forEach((t) => {
            let starsHtml = '';
            for (let i = 0; i < t.stars; i++) {
                starsHtml += `<i data-lucide="star" class="w-5 h-5 fill-amber-500"></i>\n`;
            }

            // Dùng padding (px-3 md:px-4) thay vì gap để giữ kích thước % chuẩn cho slider
            html += `
            <div class="w-full md:w-1/3 shrink-0 px-3 md:px-4 py-2 flex">
              <div class="bg-brand-sky-light/30 rounded-3xl p-6 md:p-8 border border-blue-100 shadow-sm flex flex-col justify-between whitespace-normal w-full">
                <div>
                  <div class="flex items-center gap-1 text-amber-500 mb-4">
                    ${starsHtml}
                  </div>
                  <p class="text-navy-800 text-base italic leading-relaxed mb-6">
                    "${t.content}"
                  </p>
                </div>
                <div class="flex items-center gap-4 pt-4 border-t border-blue-100">
                  ${t.avatar ? 
                    `<img src="${t.avatar}" alt="${t.name}" class="w-12 h-12 rounded-full object-cover border border-gray-200">` : 
                    `<div class="w-12 h-12 rounded-full ${t.initialsBg} text-white font-bold flex items-center justify-center text-lg">${t.initials}</div>`
                  }
                  <div>
                    <h4 class="font-extrabold text-brand-blue text-base">
                      ${t.name}
                    </h4>
                    <p class="text-xs text-navy-500 font-semibold">
                      ${t.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>`;
        });

        container.innerHTML = html;
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Logic Slider / Carousel
        const totalItems = testimonialsData.length;
        let currentIndex = 0;
        let itemsPerView = window.innerWidth >= 768 ? 3 : 1;

        function updateSlider() {
            if (totalItems <= itemsPerView) {
                container.style.transform = `translateX(0%)`;
                return;
            }
            if (currentIndex > totalItems - itemsPerView) {
                currentIndex = 0; // Kéo lại bình luận 1
            }
            
            const percentage = -(currentIndex * (100 / itemsPerView));
            container.style.transform = `translateX(${percentage}%)`;
        }

        // Auto slide mỗi 5 giây
        let sliderInterval = setInterval(() => {
            if (totalItems > itemsPerView) {
                currentIndex++;
                updateSlider();
            }
        }, 5000);

        // Tạm dừng khi di chuột vào slider
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(sliderInterval));
            carouselContainer.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    clearInterval(sliderInterval); // Đảm bảo không bị trùng lặp interval
                    sliderInterval = setInterval(() => {
                        if (totalItems > itemsPerView) {
                            currentIndex++;
                            updateSlider();
                        }
                    }, 5000);
                }
            });
        }

        // Xử lý khi thay đổi kích thước màn hình
        window.addEventListener('resize', () => {
            itemsPerView = window.innerWidth >= 768 ? 3 : 1;
            if (currentIndex > totalItems - itemsPerView) {
                currentIndex = Math.max(0, totalItems - itemsPerView);
            }
            updateSlider();
        });

        // --- HỖ TRỢ KÉO / VUỐT (DRAG & SWIPE) ---
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let diffX = 0;

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function touchStart(index) {
            return function (event) {
                if (event.type === 'mousedown') {
                    event.preventDefault(); // Prevent native image drag / text selection
                }
                isDragging = true;
                startPos = getPositionX(event);
                clearInterval(sliderInterval);
                
                // Loại bỏ CSS transition để khối trượt mượt theo ngón tay/chuột
                container.classList.remove('transition-transform', 'duration-1000');
                container.style.cursor = 'grabbing';
            }
        }

        function touchMove(event) {
            if (isDragging) {
                if (event.type === 'mousemove') {
                    event.preventDefault();
                }
                const currentPosition = getPositionX(event);
                diffX = currentPosition - startPos;
                
                // Tính toán phần trăm dịch chuyển
                const containerWidth = carouselContainer.offsetWidth;
                const basePercentage = -(currentIndex * (100 / itemsPerView));
                const diffPercentage = (diffX / containerWidth) * 100;
                
                container.style.transform = `translateX(calc(${basePercentage}% + ${diffPercentage}%))`;
            }
        }

        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            container.classList.add('transition-transform', 'duration-1000');
            container.style.cursor = 'grab';

            // Vuốt sang trái (next)
            if (diffX < -50 && currentIndex < totalItems - itemsPerView) {
                currentIndex++;
            }
            // Vuốt sang phải (prev)
            else if (diffX > 50 && currentIndex > 0) {
                currentIndex--;
            }

            updateSlider();
            diffX = 0; // Reset diff

            // Bật lại auto slide
            clearInterval(sliderInterval);
            sliderInterval = setInterval(() => {
                if (totalItems > itemsPerView) {
                    currentIndex++;
                    updateSlider();
                }
            }, 5000);
        }

        // Mouse events
        container.addEventListener('mousedown', touchStart(currentIndex));
        container.addEventListener('mousemove', touchMove);
        container.addEventListener('mouseup', touchEnd);
        container.addEventListener('mouseleave', touchEnd);

        // Touch events
        container.addEventListener('touchstart', touchStart(currentIndex), { passive: true });
        container.addEventListener('touchmove', touchMove, { passive: true });
        container.addEventListener('touchend', touchEnd);
        
        // Thêm class cursor-grab mặc định
        container.classList.add('cursor-grab');
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
            
            const addressInput = form.querySelector('input[name="address"]');
            const address = addressInput ? addressInput.value.trim() : '';
            
            const capacitySelect = form.querySelector('select[name="capacity"]');
            const capacityText = capacitySelect ? capacitySelect.options[capacitySelect.selectedIndex].text : 'Chưa chọn sản phẩm';
            const capacityVal = capacitySelect ? capacitySelect.value : '';
            
            let voucherText = 'Không có';
            let productName = capacityText;
            let price = '';
            
            if (capacityVal && typeof productsData !== 'undefined') {
                const capNum = parseInt(capacityVal.replace('L', ''));
                const product = productsData.find(p => p.capacity === capNum);
                if (product) {
                    productName = product.name;
                    voucherText = product.voucher || 'Không có';
                    price = product.newPrice || '';
                }
            }

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

            // --- LẤY DỮ LIỆU VÀ IN RA CONSOLE ---
            const formData = {
                'Họ và tên': fullname,
                'Số điện thoại': phone,
                'Địa chỉ': address,
                'Sản phẩm quan tâm': productName,
                'Mức giá': price,
                'Khuyến mãi được hưởng': voucherText,
                'Loại yêu cầu': clickedAction === 'order' ? 'Đặt hàng' : 'Tư vấn',
                'Thời gian': new Date().toLocaleString('vi-VN')
            };

            console.log('===== DỮ LIỆU ĐĂNG KÝ MỚI =====');
            console.table(formData);
            console.log('JSON Data:', JSON.stringify(formData));
            // ------------------------------------

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
                // Đóng popup nếu đang ở trong popup
                if (typeof closeProductModal === 'function') {
                    closeProductModal();
                }
                const orderModal = document.getElementById('order-modal');
                if (orderModal && !orderModal.classList.contains('hidden')) {
                    orderModal.classList.add('hidden');
                }
                
                // Chuyển hướng sang trang cảm ơn
                window.location.href = 'thankyou.html';
                
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
let currentMainImageUrl = "";
let currentMainImageIsVideo = false;

window.selectThumbnail = function(thumbUrl, isVideo) {
    currentMainImageUrl = thumbUrl;
    currentMainImageIsVideo = isVideo;
    
    const imgEl = document.getElementById('modal-image');
    if (imgEl) imgEl.src = thumbUrl;
    
    const videoOverlay = document.getElementById('modal-video-overlay');
    if (videoOverlay) {
        if (isVideo) {
            videoOverlay.classList.remove('hidden');
        } else {
            videoOverlay.classList.add('hidden');
        }
    }
};

window.handleMainImageClick = function() {
    if (currentMainImageIsVideo) {
        window.openVideoIfAvailable();
    } else {
        if (typeof Fancybox !== 'undefined') {
            Fancybox.show([{ src: currentMainImageUrl, type: "image" }]);
        }
    }
};

window.openProductModal = function (productId) {
    if (typeof productsData === 'undefined') return;
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Populate text data
    document.getElementById('modal-title').textContent = product.name;
    
    // Khởi tạo ảnh đầu tiên (video hoặc ảnh thường)
    const hasVideo = product.hasVideo === true;
    const firstImage = product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails[0] : product.image;
    window.selectThumbnail(firstImage, hasVideo);
    
    document.getElementById('modal-image').alt = product.name;

    // Populate specs
    document.getElementById('modal-voltage').textContent = product.specs.voltage || '';
    document.getElementById('modal-power').textContent = product.specs.power || '';
    document.getElementById('modal-capacity').textContent = product.specs.capacityText || '';
    document.getElementById('modal-yield').textContent = product.specs.yield || '';
    document.getElementById('modal-temp').textContent = product.specs.temp || '';
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
            const html = `
                <div class="relative w-full aspect-square border border-gray-200 rounded overflow-hidden cursor-pointer hover:border-brand-blue group shrink-0"
                     onclick="selectThumbnail('${thumb}', ${isVideo})">
                    <img src="${thumb}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
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
