const app = require('express')().use(require('cors')())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
//const fetch = require('node-fetch')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const jsdom = require('jsdom')

app.get('/user/:name', (req, res) => {
    fetch('https://www.bitview.net/api.php?ty=user&ta=' + req.params.name)
        .then(res => res.json())
        .then(json => res.json(json))
        .catch(err => {
            res.json({
                error: err
            })
        })
})

app.get('/video/:id', (req, res) => {
    fetch('https://www.bitview.net/api.php?ty=video&ta=' + req.params.id)
        .then(res => res.json())
        .then(json => res.json(json))
        .catch(err => {
            res.json({
                error: err
            })
        })
})

app.post('/search/user', (req, res) => {
    fetch('https://www.bitview.net/results?search=' + req.body.query + '&t=Search+Users')
        .then(res => res.text())
        .then(html => {
            const dom = new jsdom.JSDOM(html)
            const users = []
            dom.window.document.querySelectorAll('.memberContainer').forEach(user => {
                const name = user.querySelector('.vltitle').children[0].innerHTML;
                const subscribers = user.querySelector('.channel-sub-count').textContent.split(' ')[0];
                const views = user.querySelector('.channel-view-count').textContent.split(' ')[0];
                users.push({
                    name,
                    subscribers,
                    views,
                })
            })
            res.json(users)
        }).catch(err => {
            res.json({
                error: err
            })
        })
})

app.post('/search/video', (req, res) => {
    fetch('https://www.bitview.net/results?search=' + req.body.query + '&t=Search+Videos')
        .then(res => res.text())
        .then(html => {
            const dom = new jsdom.JSDOM(html)
            const videos = []
            dom.window.document.querySelectorAll('.video-entry').forEach(video => {
                const id = video.querySelector('.vimg120').src.split('/')[video.querySelector('.vimg120').src.split('/').length - 1].split('.')[0];
                const title = video.querySelector('#video-long-title').textContent;
                const description = video.querySelector('#video-description').textContent;
                const views = video.querySelector('#video-num-views').textContent.split(' ')[0];
                const posted = video.querySelector('#video-added-time').textContent;
                const poster = video.querySelector('#video-from-username').textContent;
                const rating = video.querySelector('.star_rating').innerHTML.toString()
                videos.push({
                    id,
                    title,
                    description,
                    views,
                    rating,
                    posted,
                    poster
                })
            })
            res.json(videos)
        }).catch(err => {
            res.json({
                error: err
            })
        })
})

app.listen(process.env.port || 1111)