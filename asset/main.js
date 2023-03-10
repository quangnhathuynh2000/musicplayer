const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const cd = $('.cd')
const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const timeAudioLeft = $('.time-audio-left')
const timeAudioRight = $('.time-audio-right')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [{
            name: 'Neveda',
            singer: 'Vicetone',
            path: './asset/music/Vicetone-Nevada-Remix.mp3',
            image: './asset/img/img7.jpeg'
        },
            {
            name: 'Dau mua',
            singer: 'Trung quan idol',
            path: './asset/music/dau_mua.mp3',
            image: './asset/img/dau_mua.jpg'
        },
        {
            name: 'mai mai ben nhau',
            singer: 'noo phuoc thinh',
            path: './asset/music/song2.mp3',
            image: './asset/img/img2.jpg'
        },
        {
            name: 'lac troi',
            singer: 'son tung mtp',
            path: './asset/music/song3.mp3',
            image: './asset/img/img3.jpeg'
        },
        {
            name: 'thai binh mo hoi roi',
            singer: 'son tung mtp',
            path: './asset/music/song4.mp3',
            image: './asset/img/img4.jpeg'
        },
        {
            name: 'doi mat',
            singer: 'wannbi tuan anh',
            path: './asset/music/song5.mp3',
            image: './asset/img/img5.jpeg'
        },
        {
            name: 'minh tri live',
            singer: 'minh tri',
            path: './asset/music/song6.mp3',
            image: './asset/img/img6.jpeg'
        }



    ],
    // setConfig: function(key, value) {
    //     this.config[key] = value;
    //     localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    // },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index ="${index}">
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
        playlist.innerHTML = htmls.join('')

    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // x??? l?? cd quay / d???ng 
        const cdthumbAnimeate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdthumbAnimeate.pause()


        // x??? l?? ph??ng to thu nh??? c??c cd

        document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : '0px'
                cd.style.opacity = newCdWidth / cdWidth


            }
            //  x??? l?? khi play
        playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }

            }
            // khi song ???????c play
        audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdthumbAnimeate.play()
            }
            // khi song b??? pasue 
        audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdthumbAnimeate.pause()
            }
            // khi ti???n ????? b??i h??t thay ?????i 
        audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }

            }
            // x??? l?? khi tua nh???c 
        progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
            // khi next b??i h??t
        nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()
                } else {
                    _this.nextSong()

                }

                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }
            // khi prev b??i h??t
        prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()
                } else {
                    _this.prevSong()

                }

                audio.play()
                _this.render()
                _this.scrollToActiveSong()


            }
            // repeat 
        repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat
                    // _this.setConfig('isRepeat', _this.isRepeat)

                repeatBtn.classList.toggle('active', _this.isRepeat)


            }
            // khi random b??i h??t
        randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom
                    // _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle('active', _this.isRandom)

            }
            // x??? l?? next xong khi audio ended
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click()

                }
            }
            // l???ng nghe h??nh vi click v??o playlish
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
                // x??? l?? khi click v??o song
            if (songNode ||
                !e.target.closest('.option')) {
                // x??? l?? v??o song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

            }

        }
        audio.onloadedmetadata = function() {
            const floorDura = Math.floor(audio.duration)
            const second = floorDura % 60
            const minute = (floorDura - second) / 60
            const TimeAudio = minute + ':' + second
            if (minute < 10) {
                timeAudioRight.textContent = '0' + TimeAudio
            }
        }
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
                timeAudioLeft.textContent = _this.SetTimeChangeAudio(Math.floor(audio.currentTime))


            }
        }

    },
    SetTimeChangeAudio: function(val) {
        if (val > 60) {
            const second = val % 60
            const minute = (val - second) / 60
            TimeAudio = (minute < 10 ? '0' : '') + minute + ':' + (second < 10 ? '0' : '') + second;
        } else {
            TimeAudio = '00:' + (val < 10 ? '0' : '') + val;
        }
        return TimeAudio

    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 500)
    },
    // loadConfig: function() {
    //     this.isRandom = this.config.isRandom
    //     this.isRepeat = this.config.isRepeat
    // },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        this.loadCurrentSong()


    },
    prevSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // g??n c???u h??nh t??? config v??o ???ng d???ng
        // this.loadConfig()

        // dinh nghia cac thuoc tinh cho object
        this.defineProperties()
            // lang nghe va su li cac su kien
        this.handleEvent()
            // t???i th??ng tin b??i h??t v??o ui khi ch???y ???ng d???ng
        this.loadCurrentSong()
            // reder ra b??i h??t
        this.render()
            // hi???n th??? tr???ng th??i ban ?????u c???a button repeat v?? random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }


}

app.start()
