let cid = document.URL.split("?cid=")[1];
let vid = document.URL.split("?vid=")[1];
let type = "";
let main = "";
let counts = [];
let id = "";
if (vid) {
    if (vid.includes("&")) {
        main = vid.split("&main=")[1];
        if (main.includes("&")) {
            main = main.split("&")[0];
        }
        if (vid.includes("&counts=")) {
            counts = vid.split("&counts=")[1].split(",");
        }
        vid = vid.split("&")[0];
    }
    type = "video";
    id = vid;
    document.getElementById("embed").value = "https://bitview.mgcounts.com/embeds/?vid=" + vid + "&main=" + main;
    document.getElementById("img").classList.add("rect");
    if (!main) main = "display_views";
    if (counts.length == 0) {
        counts = ["display_views", "ranking_views", "comment_num"];
    }
} else {
    if (cid.includes("&")) {
        main = cid.split("&main=")[1];
        if (main.includes("&")) {
            main = main.split("&")[0];
        }
        if (cid.includes("&counts=")) {
            counts = cid.split("&counts=")[1].split(",");
        }
        cid = cid.split("&")[0];
    }
    type = "user";
    id = cid;
    document.getElementById("embed").value = "https://bitview.mgcounts.com/embeds/?cid=" + cid + "&main=" + main;
    document.getElementById("img").classList.add("round");
    if (!main) main = "subscribers";
    if (counts.length == 0) {
        counts = ["videos_watched", "channel_views", "videos"];
    }
}

let translater = {
    "videos_watched": "Videos Watched",
    "channel_views": "Views",
    "videos": "Videos",
    "subscribers": "Subscribers",
    "subscriptions": "Subscriptions",
    "friends": "Friends",
    "channel_comments": "Comments Sent",
    "display_views": "Views",
    "ranking_views": "Total Ratings",
    "comment_num": "Comments",
    "rankings": "Ratings",
    "goal": "Goal"
}

let chart = new Highcharts.chart({
    chart: {
        renderTo: 'chart',
        type: 'areaspline',
        zoomType: 'x',
        backgroundColor: 'transparent',
        plotBorderColor: 'transparent'
    },
    title: {
        text: ' '
    },
    credits: {
        enabled: false,
    }, xAxis: {
        type: 'datetime',
        visible: false
    },
    yAxis: {
        visible: false,
    },
    plotOptions: {
        series: {
            threshold: null,
            fillOpacity: 0.25
        },
        area: {
            fillOpacity: 0.25
        }
    },
    series: [{
        showInLegend: false,
        name: translater[main],
        marker: { enabled: false },
        color: '#FFF',
        lineColor: '#FFF',
        lineWidth: 2,
    }]
});

function embed() {
    document.getElementById("embed").select();
    document.execCommand("copy");
    document.getElementById("embed").value = "Copied!";
    setTimeout(function () {
        document.getElementById("embed").value = "https://bitview.mgcounts.com/embeds/" + type + ".html?" + type + "=" + (type == "video" ? vid : cid) + "&main=" + main;
    }, 2000);
}

function getInitialStats() {
    fetch('https://bitview.mgcounts.com/' + type + '/' + id)
        .then(response => response.json())
        .then(data => {
            if (type == "user") {
                document.getElementById("img").src = "https://www.bitview.net/" + data.avatar;
                document.getElementById("banner").style.backgroundImage = "url(https://www.bitview.net/" + data.avatar + ")";
                document.getElementById("name").innerHTML = data.username;
            } else {
                document.getElementById("img").src = "https://www.bitview.net/u/thmp/" + data.url + ".jpg";
                document.getElementById("banner").style.backgroundImage = "url(https://www.bitview.net/u/thmp/" + data.url + ".jpg)";
                document.getElementById("name").innerHTML = data.title;
            }
            if (counts[0]) {
                if (counts[0] == "goal") {
                    document.getElementById("counts1").innerHTML = getGoal(data[main])
                    document.getElementById("side1").style.display = "";
                } else if (counts[0] == "rankings") {
                    document.getElementById("side1").style.display = "none";
                    rankings(data);
                } else {
                    document.getElementById("counts1").innerHTML = data[counts[0]];
                    document.getElementById("side1").style.display = "";
                }
            } else {
                document.getElementById("counts1").innerHTML = data[counts[0]];
                document.getElementById("side1").style.display = "";
            }
            if (counts[1]) {
                if (counts[1] == "goal") {
                    document.getElementById("counts2").innerHTML = getGoal(data[main])
                    document.getElementById("side2").style.display = "";
                } else if (counts[1] == "rankings") {
                    document.getElementById("side2").style.display = "none";
                    rankings(data);
                } else {
                    document.getElementById("counts2").innerHTML = data[counts[1]];
                    document.getElementById("side2").style.display = "";
                }
            } else {
                document.getElementById("counts2").innerHTML = data[counts[1]];
                document.getElementById("side2").style.display = "";
            }
            if (counts[2]) {
                if (counts[2] == "goal") {
                    document.getElementById("counts3").innerHTML = getGoal(data[main])
                    document.getElementById("side3").style.display = "";
                } else if (counts[2] == "rankings") {
                    document.getElementById("side3").style.display = "none";
                    rankings(data);
                } else {
                    document.getElementById("counts3").innerHTML = data[counts[2]];
                    document.getElementById("side3").style.display = "";
                }
            } else {
                document.getElementById("counts3").innerHTML = data[counts[2]];
                document.getElementById("side3").style.display = "";
            }
            document.getElementById("count").innerHTML = data[main];
            document.getElementById("label1").innerHTML = translater[counts[0]];
            document.getElementById("label2").innerHTML = translater[counts[1]];
            document.getElementById("label3").innerHTML = translater[counts[2]];
            document.getElementById("label").innerHTML = translater[main];
            if (chart.series[0].points.length == 1500) chart.series[0].data[0].remove();
            chart.series[0].addPoint([Date.now(), Math.floor(data[main])])
        });
}
getInitialStats();
setInterval(getInitialStats, 5000);
let userCounts = [
    "videos_watched",
    "channel_views",
    "videos",
    "subscribers",
    "subscriptions",
    "friends",
    "channel_comments",
    "goal"
];
let videoCounts = [
    "display_views",
    "ranking_views",
    "comment_num",
    "rankings",
    "goal"
];
function selectCounts() {
    let model = document.createElement("div");
    model.classList.add("model");
    model.id = "model";
    let userOptions = `<option value="videos_watched">Videos Watched</option>
    <option value="channel_views">Views</option>
    <option value="videos">Videos</option>
    <option value="subscribers">Subscribers</option>
    <option value="subscriptions">Subscriptions</option>
    <option value="friends">Friends</option>
    <option value="channel_comments">Comments Sent</option>
    <option value="goal">Goal</option>`;
    let videoOptions = `<option value="display_views">Views</option>
    <option value="ranking_views">Ranking Views</option>
    <option value="comment_num">Comments</option>
    <option value="rankings">Rankings</option>
    <option value="goal">Goal</option>`;
    model.innerHTML = `
    <h1>Select Counts</h1>
    <hr>
    <div class="model-content">
        <div class="model-body">
            <div class="model-body-content">
                <h2>Select Main Count</h2>
                <select id="mainCount" onchange="changeMainCount()" autofill="off">
                    ${type == "user" ? userOptions : ""}
                    ${type == "video" ? videoOptions : ""}
                </select>
                <h2>Select Secondary Counts</h2>
                <div style="display grid; grid-template-columns: 1fr 1fr 1fr;">
                    <select id="secondaryCount1" onchange="changeSecondaryCount(1)" autofill="off">
                        ${type == "user" ? userOptions : ""}
                        ${type == "video" ? videoOptions : ""}
                    </select>
                    <select id="secondaryCount2" onchange="changeSecondaryCount(2)" autofill="off">
                        ${type == "user" ? userOptions : ""}
                        ${type == "video" ? videoOptions : ""}
                    </select>
                    <select id="secondaryCount3" onchange="changeSecondaryCount(3)" autofill="off">
                        ${type == "user" ? userOptions : ""}
                        ${type == "video" ? videoOptions : ""}
                    </select>
                </div>
            </div>
        </div>
        <hr>
        <button onclick="closeModel()" style="height: 3vh; width: 10vw; margin: 1vh 0 1vh 0;">Save</button>
    </div>`;
    document.getElementById("m").appendChild(model);
    document.getElementById("mainCount").value = main;
    document.getElementById("secondaryCount1").value = counts[0];
    document.getElementById("secondaryCount2").value = counts[1];
    document.getElementById("secondaryCount3").value = counts[2];
}

function closeModel() {
    let newMain = document.getElementById("mainCount").value;
    let newSecondary1 = document.getElementById("secondaryCount1").value;
    let newSecondary2 = document.getElementById("secondaryCount2").value;
    let newSecondary3 = document.getElementById("secondaryCount3").value;
    if (newMain == "goal") {
        alert("You cannot set the main count to goal.");
        return;
    }
    if (newMain == "rankings") {
        alert("You cannot set the main count to rankings.");
        return;
    }
    if (newMain != main) {
        main = newMain;
        document.getElementById("label").innerHTML = translater[main];
    }
    if (newSecondary1 != counts[0]) {
        counts[0] = newSecondary1;
        document.getElementById("label1").innerHTML = translater[counts[0]];
    }
    if (newSecondary2 != counts[1]) {
        counts[1] = newSecondary2;
        document.getElementById("label2").innerHTML = translater[counts[1]];
    }
    if (newSecondary3 != counts[2]) {
        counts[2] = newSecondary3;
        document.getElementById("label3").innerHTML = translater[counts[2]];
    }
    let rankings = 0;
    for (let i = 0; i < counts.length; i++) {
        if (counts[i] == "rankings") rankings++;
    }
    if (rankings > 1) {
        alert("You cannot have more than 1 count be rankings.");
        return;
    }
    if (type == "user") {
        let newURL = window.location.href.split("?")[0] + "?cid=" + id + "&main=" + main + "&counts=" + counts.join(",");
        window.history.pushState({ path: newURL }, '', newURL);
    } else {
        let newURL = window.location.href.split("?")[0] + "?vid=" + id + "&main=" + main + "&counts=" + counts.join(",");
        window.history.pushState({ path: newURL }, '', newURL);
    }
    document.getElementById("model").remove();
    chart = new Highcharts.chart({
        chart: {
            renderTo: 'chart',
            type: 'areaspline',
            zoomType: 'x',
            backgroundColor: 'transparent',
            plotBorderColor: 'transparent'
        },
        title: {
            text: ' '
        },
        credits: {
            enabled: false,
        }, xAxis: {
            type: 'datetime',
            visible: false
        },
        yAxis: {
            visible: false,
        },
        plotOptions: {
            series: {
                threshold: null,
                fillOpacity: 0.25
            },
            area: {
                fillOpacity: 0.25
            }
        },
        series: [{
            showInLegend: false,
            name: translater[main],
            marker: { enabled: false },
            color: '#FFF',
            lineColor: '#FFF',
            lineWidth: 2,
        }]
    });
}

function getGoal(num) {
    if (num < 10) return 10 - num; let x1 = Math.floor(Math.log10(num)); let x2 = Math.ceil(num / 10 ** x1); let x3 = x2 * 10 ** x1; let goal = x3 - num;
    return goal;
}

function rankings(data) {
    let newCards = `
    <div id="side4">
        <h2 class="label" id="label4">1 Star Ratings</h2>
        <h1 id="counts4" class="side odometer">${data["rankings"][0]}</h1>
    </div>
    <div id="side5">
        <h2 class="label" id="label5">2 Star Ratings</h2>
        <h1 id="counts5" class="side odometer">${data["rankings"][1]}</h1>
    </div>
    <div id="side6">
        <h2 class="label" id="label6">3 Star Ratings</h2>
        <h1 id="counts6" class="side odometer">${data["rankings"][2]}</h1>
    </div>
    <div id="side7">
        <h2 class="label" id="label7">4 Star Ratings</h2>
        <h1 id="counts7" class="side odometer">${data["rankings"][3]}</h1>
    </div>
    <div id="side8">
        <h2 class="label" id="label8">5 Star Ratings</h2>
        <h1 id="counts8" class="side odometer">${data["rankings"][4]}</h1>
    </div>`
    document.getElementById("rankings").innerHTML = newCards;
}