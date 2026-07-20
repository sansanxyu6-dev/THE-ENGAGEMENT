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

// ==========================================================================
// 4. FUNGSI KIRIM & TAMPILKAN UCAPAN TAMU (GOOGLE SHEETS / API)
// ==========================================================================

// PASTE URL GOOGLE APPS SCRIPT / API KAMU DI DALAM TANDA PETIK DI BAWAH INI
const URL_DATABASE_UCAPAN = "https://script.google.com/macros/s/AKfycbyi87H9LX__cruiFtgCtF5wAQwpufnjBY1aQZuvJGq3AiUR5DNfKvFc-WiotNS9oKL8/exec"; 

document.addEventListener("DOMContentLoaded", function() {
    const rsvpForm = document.getElementById("rsvpForm");
    const commentsContainer = document.getElementById("commentsContainer");

    // A. FUNGSI AMBIL DAFTAR UCAPAN DARI DATABASE
    function muatDaftarUcapan() {
        if (!commentsContainer) return;

        fetch(URL_DATABASE_UCAPAN)
            .then(response => response.json())
            .then(data => {
                commentsContainer.innerHTML = ""; // Bersihkan teks loading

                if (!data || data.length === 0) {
                    commentsContainer.innerHTML = "<p style='color:#e0e0e0;'>Belum ada ucapan. Jadilah yang pertama!</p>";
                    return;
                }

                // Tampilkan daftar ucapan
                data.forEach(item => {
                    const card = document.createElement("div");
                    card.className = "comment-item";
                    card.style.cssText = "background: rgba(255,255,255,0.1); padding: 12px; margin-bottom: 10px; border-radius: 8px; text-align: left; box-sizing: border-box; width: 100%; max-width: 100%; word-break: break-all; overflow-wrap: anywhere;";
                    
                    const nama = item.nama || item.Name || 'Tamu';
                    const kehadiran = item.kehadiran || item.Kehadiran || '';
                    const pesan = item.ucapan || item.pesan || item.Pesan || '';

                    card.innerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                            <strong style="color: #f4cf9b;">${nama}</strong>
                            <span style="font-size:0.75rem; background:rgba(244,207,155,0.2); color:#f4cf9b; padding:2px 8px; border-radius:10px;">${kehadiran}</span>
                        </div>
                        <p style="margin:0; font-size:0.85rem; color:#e0e0e0; line-height:1.4; word-break: break-all; overflow-wrap: anywhere; white-space: normal;">${pesan}</p>
                    `;
                    commentsContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Gagal memuat ucapan:", error);
                if (commentsContainer) {
                    commentsContainer.innerHTML = "<p style='color:#ff6b6b; font-size:0.85rem;'>Gagal memuat ucapan. Cek koneksi / URL API.</p>";
                }
            });
    }

    // Jalankan pemanggilan data pertama kali saat halaman dibuka
    muatDaftarUcapan();

    // B. FUNGSI KIRIM FORM UCAPAN (LANGSUNG TAMPIL TANPA NUNGGU / OPTIMISTIC)
    if (rsvpForm) {
        rsvpForm.addEventListener("submit", function(e) {
            e.preventDefault(); 

            const inputNama = document.getElementById("inputNama").value;
            const inputUcapan = document.getElementById("inputUcapan").value;
            const inputKehadiran = document.getElementById("inputKehadiran").value;

            // 1. BIKIN KARTU UCAPAN BARU & LANGSUNG TAMPILKAN DI WEB INSTAN (0 DETIK)
            const cardBaru = document.createElement("div");
            cardBaru.className = "comment-item";
            cardBaru.style.cssText = "background: rgba(255,255,255,0.1); padding: 12px; margin-bottom: 10px; border-radius: 8px; text-align: left; box-sizing: border-box; width: 100%; max-width: 100%; word-break: break-all; overflow-wrap: anywhere;";
            cardBaru.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                    <strong style="color: #f4cf9b;">${inputNama}</strong>
                    <span style="font-size:0.75rem; background:rgba(244,207,155,0.2); color:#f4cf9b; padding:2px 8px; border-radius:10px;">${inputKehadiran}</span>
                </div>
                <p style="margin:0; font-size:0.85rem; color:#e0e0e0; line-height:1.4; word-break: break-all; overflow-wrap: anywhere; white-space: normal;">${inputUcapan}</p>
            `;

            // Kalau sebelumnya ada pesan "Belum ada ucapan", hapus dulu
            if (commentsContainer.innerHTML.includes("Belum ada ucapan")) {
                commentsContainer.innerHTML = "";
            }

            // Tempel pesan ke urutan paling atas
            commentsContainer.prepend(cardBaru);

            // Reset form langsung
            rsvpForm.reset();

            // 2. KIRIM DATA KE GOOGLE SHEETS DI BACKGROUND
            const payload = new FormData();
            payload.append("nama", inputNama);
            payload.append("ucapan", inputUcapan);
            payload.append("kehadiran", inputKehadiran);

            fetch(URL_DATABASE_UCAPAN, {
                method: "POST",
                body: payload
            })
            .then(response => response.json())
            .then(data => {
                console.log("Berhasil tersimpan di Google Sheets!");
            })
            .catch(error => {
                console.error("Gagal mengirim ke Sheets:", error);
            });
        });
    }
});