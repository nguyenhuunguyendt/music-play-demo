const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    isRepeat: false,
    isPlaying: true,
    isRandom: false,
    currentIndex: 0,
    songs: [
        {
            name: "Click Pow Get Down",
            singer: "Raftaar x Fortnite",
            path: "./assets/audio/2-Gio-Chieu-Isaac-Lou-Hoang.mp3",
            image: "https://64.media.tumblr.com/edeadaccf64e60c133825f51cf6c08f6/tumblr_oq057fCxeC1qbd81ro1_1280.jpg"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "./assets/audio/co-hen-voi-thanh-xuan-MONSTAR.mp3",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path:
                "./assets/audio/Dem-Ngay-Xa-Em-OnlyC-Lou-Hoang.mp3",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "./assets/audio/Em-Co-Yeu-Anh-Khong-OnlyC-Lou-Hoang.mp3",
            image:
                "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "./assets/audio/Mau-Do-Da-Vang-DTAP-ERIK.mp3",
            image:
                "https://64.media.tumblr.com/fdce8d90185f8f38a5f36a69b198a271/tumblr_ojqkfv1h7c1qbd81ro1_1280.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
                "./assets/audio/Se-Khong-Dung-Lai-Miu-Le.mp3",
            image:
                "https://64.media.tumblr.com/a22dda63a0e8494c72014ba494697cad/3107f3becb2c1c93-84/s1280x1920/63adcda31e4e6c9a9c99d2a99d848838ee398f2c.jpg"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "./assets/audio/Tat-Den-OnlyC-Isaac.mp3",
            image:
                "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],
    render: function () {
        const htmls = this.songs.map(function (song, index) {
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        playlist.innerHTML = htmls.join("")
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //  xu ly phong to thu nho
        document.onscroll = function () {
            const scrolltop = document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrolltop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // xu ly khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.play()
            }
            else {
                audio.pause()

            }

        }
        audio.onplay = function () {
            _this.isPlaying = false
            cdThumbAnimate.play()
            player.classList.add("playing")
        }
        audio.onpause = function () {
            cdThumbAnimate.pause()
            _this.isPlaying = true
            player.classList.remove("playing")
        }
        // xu ly khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration) * 100
                progress.value = Math.floor(progressPercent)
            }
        }
        progress.onchange = function () {
            audio.currentTime = (audio.duration / 100 * progress.value)
        }

        //  xu ly nexoonclicktSong
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play();
            _this.handleNextSongcolor()
            _this.scrollToActiveSong()
        }
        //  xu ly prevonclickSong
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play();
            _this.handleNextSongcolor()
            _this.scrollToActiveSong()

        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active")
        }
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }

        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active")
        }
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.handleNextSongcolor()
                    audio.play()
                }

            }
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`
        audio.src = this.currentSong.path
    },
    // xu ly next
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    // xu ly prev
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    // xu ly random
    randomSong: function () {
        let newCurrentIndex
        do {
            newCurrentIndex = Math.floor(Math.random() * this.songs.length)
        } while (newCurrentIndex == this.currentIndex);
        this.currentIndex = newCurrentIndex;
        this.loadCurrentSong()
    },
    handleNextSongcolor: function () {
        const listSong = $$('.song')
        listSong.forEach(song => {
            song.classList.remove('active')
        });
        for (const key in listSong) {
            if (key == this.currentIndex) {
                listSong[key].classList.add('active')
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            if (app.currentIndex === 0) {
                window.scrollTo(0, 0);

            };
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: "nearest"
            })
        }, 100)
    },
    start: function () {
        // dinh nghia thuoc tinh obj
        this.defineProperties()
        // lang nghe xu ly cac su kien
        this.handleEvent()
        // tai thong tin bai nhac dau tien UI khi chay ung dung 
        this.loadCurrentSong()
        // render playlis
        this.render()
    }
};

app.start();


