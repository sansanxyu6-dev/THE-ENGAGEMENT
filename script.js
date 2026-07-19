// ==========================================================================
// 1. FUNGSI BUKA UNDANGAN & PEMUTAR MUSIK
// ==========================================================================
function bukaUndangan() {
    const coverOverlay = document.getElementById('coverOverlay');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');

    // 1. Hilangkan cover dengan efek transisi smooth
    coverOverlay.style.opacity = '0';
    coverOverlay.style.transform = 'translateY(-100%)'; // Geser ke atas

    // 2. Munculkan konten utama undangan yang bisa di-scroll
    mainContent.classList.remove('hidden');

    // 3. Putar musik latar (Memenuhi aturan browser karena dipicu klik tombol)
    if (bgMusic) {
        bgMusic.play().catch(error => {
            console.log("Musik gagal berputar otomatis karena aturan browser:", error);
        });
    }

    // Hapus element cover dari DOM setelah animasi selesai agar tidak mengganggu scroll
    setTimeout(() => {
        coverOverlay.style.display = 'none';
        // Pemicu awal agar animasi scroll langsung mendeteksi Slide 1 & 2
        handleScrollAnimation();
    }, 800);
}

// ==========================================================================
// 2. FUNGSI COUNTDOWN TIMER (HITUNG MUNDUR)
// ==========================================================================
// Tentukan tanggal acara pertunanganmu di sini (Format: YYYY-MM-DDTHH:MM:SS)
// SUDAH DIUBAH: Menjadi 26 Juli 2026 Jam 13:00 WIB
const tanggalAcara = new Date("2026-07-26T13:00:00").getTime();

const hitungMundur = setInterval(function() {
    const sekarang = new Date().getTime();
    const selisih = tanggalAcara - sekarang;

    // Perhitungan waktu (Hanya dihitung jika selisih masih positif agar tidak minus)
    let hari = 0, jam = 0, menit = 0, detik = 0;

    if (selisih > 0) {
        hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
        jam = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
        detik = Math.floor((selisih % (1000 * 60)) / 1000);
    }

    // Tampilkan hasil ke HTML dengan format 2 digit (tambahkan angka 0 di depan jika < 10)
    document.getElementById("days").innerText = hari < 10 ? "0" + hari : hari;
    document.getElementById("hours").innerText = jam < 10 ? "0" + jam : jam;
    document.getElementById("minutes").innerText = menit < 10 ? "0" + menit : menit;
    document.getElementById("seconds").innerText = detik < 10 ? "0" + detik : detik;

    // Jika hitung mundur selesai
    if (selisih < 0) {
        clearInterval(hitungMundur);
    }
}, 1000);

// ==========================================================================
// 3. ANIMASI SCROLL (MUNCUL DARI KIRI/KANAN & STAGGERED REVEAL)
// ==========================================================================
function handleScrollAnimation() {
    // A. Animasi Mempelai (Muncul dari Kiri & Kanan di Slide 2)
    const animLeft = document.querySelector('.animate-left');
    const animRight = document.querySelector('.animate-right');
    
    // B. Animasi Muncul Berurutan (Slide 3)
    const revealItems = document.querySelectorAll('.reveal-item');

    const triggerBottom = window.innerHeight * 0.85; // Batas memicu animasi saat di-scroll

    // Eksekusi animasi kiri & kanan jika elemen ada
    if(animLeft && animRight) {
        const rectLeft = animLeft.getBoundingClientRect().top;
        if(rectLeft < triggerBottom) {
            animLeft.style.opacity = '1';
            animLeft.style.transform = 'translateX(0)';
            animRight.style.opacity = '1';
            animRight.style.transform = 'translateX(0)';
        }
    }

    // Eksekusi animasi staggered (berurutan) di Slide 3
    revealItems.forEach((item, index) => {
        const itemTop = item.getBoundingClientRect().top;
        if (itemTop < triggerBottom) {
            // Beri delay sedikit antar elemen agar munculnya bergantian (staggered)
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200); 
        }
    });
}

// Daftarkan fungsi ke event scroll di browser
window.addEventListener('scroll', handleScrollAnimation);