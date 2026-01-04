document.addEventListener('DOMContentLoaded', () => {

    // --- アコーディオンロジック ---
    // --- アコーディオンロジック（削除済み） ---
    // リンクは現在直接になっています。

    // --- ボイスメッセージロジック ---
    const voiceBtn = document.getElementById('voice-play-btn');
    // 音声をプリロード
    const voiceAudio = new Audio('assets/record/voice_message.mp3');

    if (voiceBtn) {
        const voiceIcon = voiceBtn.querySelector('i');
        const voiceText = voiceBtn.querySelector('span');

        voiceBtn.addEventListener('click', () => {
            if (voiceAudio.paused) {
                voiceAudio.play();
                voiceBtn.classList.add('playing');
                if (voiceIcon) voiceIcon.className = 'ph ph-pause-circle';
                if (voiceText) voiceText.textContent = 'Pause Voice Message';
            } else {
                voiceAudio.pause();
                voiceBtn.classList.remove('playing');
                if (voiceIcon) voiceIcon.className = 'ph ph-play-circle';
                if (voiceText) voiceText.textContent = 'Play Voice Message';
            }
        });

        voiceAudio.addEventListener('ended', () => {
            voiceBtn.classList.remove('playing');
            if (voiceIcon) voiceIcon.className = 'ph ph-play-circle';
            if (voiceText) voiceText.textContent = 'Play Voice Message';
        });
    }

    const filterLinks = document.querySelectorAll('.submenu-item');
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // 実際のアプリでは、これでグリッドをフィルタリングします
            // const filterValue = link.getAttribute('data-filter');
            // filterGrid(filterValue);
        });
    });

    // --- サイドバーリンクのスムーズスクロール ---
    const links = document.querySelectorAll('a[href^="#"]:not(.has-submenu)');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // アクティブ状態を更新
                document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
                // アンカー内のアイコン/スパンを処理するためにclosestを使用
                link.closest('a').classList.add('active');
            }
        });
    });

    // --- スクロールアニメーション（Intersection Observer） ---
    const observerOptions = {
        root: null, // ビューポート
        rootMargin: '0px',
        threshold: 0.1 // 10%表示されたらトリガー
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // オプション：アニメーション後に監視を停止
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // data-animateを持つ要素を監視
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));

    // Worksカードの遅延フィルタリングの特例
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach(card => {
        card.setAttribute('data-animate', 'fade-up');
        observer.observe(card);
    });

    // --- スクロール時のアクティブリンク ---
    const mainContent = document.querySelector('.main-content'); // メインコンテンツがスクロールすると仮定
    const sections = document.querySelectorAll('.content-section');

    // bodyのoverflowが隠れている、またはレイアウトに依存するため、メインコンテンツのスクロールリスナーが必要
    const scrollContainer = document.querySelector('.main-content') || window;

    scrollContainer.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // オフセット調整
            if ((scrollContainer === window ? window.scrollY : scrollContainer.scrollTop) >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            document.querySelectorAll('.nav-item').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');

                    // 必要に応じて親グループも展開
                    const parentGroup = link.closest('.nav-group');
                    if (parentGroup) parentGroup.classList.add('open');
                }
            });
        }
    });



    // --- Worksモーダルロジック ---
    const modal = document.getElementById('works-modal');
    const modalClose = document.querySelector('.modal-close');
    const worksList = document.querySelectorAll('.work-card');

    // モーダル要素
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-desc');
    const mTags = document.getElementById('modal-tags');
    const mImage = document.getElementById('modal-image');

    if (worksList && modal) {
        worksList.forEach(card => {
            // クリックイベント
            card.addEventListener('click', () => {
                // 情報の抽出
                const title = card.querySelector('h3').innerText;
                const desc = card.querySelector('p').innerText;
                const tags = card.querySelector('.tags').innerHTML;
                const imageContent = card.querySelector('.work-image').innerHTML;

                // データの流し込み
                mTitle.innerText = title;
                mDesc.innerText = desc + "\n\n(詳細な説明はここに... これはカードの概要から入力されるデモの説明です)";
                mTags.innerHTML = tags;

                // 画像の場合、スクロールコンテナに直接注入
                const imgContainer = document.querySelector('.modal-image-container');
                imgContainer.innerHTML = imageContent;

                // 表示
                modal.classList.add('open');
            });
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }

    if (modal) {
        // 背景クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });
    }

    // --- モバイルサイドバーロジック ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-item');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // リンククリック時にサイドバーを閉じる（モバイルUX）
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1100) { // 新しいブレークポイントに合わせて更新
                closeSidebar();
            }
        });
    });

    // --- Works「もっと見る」ロジック ---
    const loadMoreContainer = document.getElementById('works-load-more');
    const loadMoreBtn = loadMoreContainer ? loadMoreContainer.querySelector('button') : null;

    // 初期状態：最初の4つだけ表示
    const workItems = document.querySelectorAll('.work-card');
    const VISIBLE_COUNT = 4;

    if (workItems.length > VISIBLE_COUNT) {
        // 制限を超えるアイテムを非表示
        workItems.forEach((item, index) => {
            if (index >= VISIBLE_COUNT) {
                item.classList.add('hidden');
            }
        });

        // ボタンを表示
        if (loadMoreContainer) {
            loadMoreContainer.style.display = 'flex';
        }

        // クリックハンドラ
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                // すべての非表示アイテムを表示
                workItems.forEach(item => {
                    item.classList.remove('hidden');
                    // 必要に応じてアニメーションクラスを追加
                    item.setAttribute('data-animate', 'fade-up');
                    observer.observe(item); // アニメーション監視をトリガー
                });

                // ボタンを非表示
                loadMoreContainer.style.display = 'none';
            });
        }
    }

});
