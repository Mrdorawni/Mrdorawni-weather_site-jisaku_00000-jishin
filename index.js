var QuakeJson;
var JMAPointJson;

var map = L.map('map').setView([36.575, 137.984], 6);
L.control.scale({ maxWidth: 150, position: 'bottomright', imperial: false }).addTo(map);
map.zoomControl.setPosition('topright')



//オープンストリートマップのleafletタイルデータ取得
//＜参考＞
    /*
        オープンストリート　https://tile.openstreetmap.org/{z}/{x}/{y}.png
        地理院　標準　https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png
        地理院　淡色　https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png
        地理院　写真　https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg
    */

//レイヤの順番z-index
map.createPane("tsunami_map").style.zIndex = 110; //津波
map.createPane("tsunami_map2").style.zIndex = 120; //津波
map.createPane("back").style.zIndex = 1; //地図
map.createPane("pane_map").style.zIndex = 5; //地図
map.createPane("nihon").style.zIndex = 7; //地図
map.createPane("shindo10").style.zIndex = 10; //ここから震度
map.createPane("shindo20").style.zIndex = 20;
map.createPane("shindo30").style.zIndex = 30;
map.createPane("shindo40").style.zIndex = 40;
map.createPane("shindo45").style.zIndex = 45;
map.createPane("shindo46").style.zIndex = 46;
map.createPane("shindo50").style.zIndex = 50;
map.createPane("shindo55").style.zIndex = 55;
map.createPane("shindo60").style.zIndex = 60;
map.createPane("shindo70").style.zIndex = 70; //ここまで震度
map.createPane("shingen").style.zIndex = 100; //震源
map.createPane("tsumami_map").style.zIndex = 110; //津波

var PolygonLayer_Style_nerv_1 = {
    "color": "#ffffff",
    "weight": 1,
    "opacity": 1,
    "fillColor": "#3a3a3a",
    "fillOpacity": 1,
}

//日本
var PolygonLayer_Style_nerv_J = {
    "color": "#000000",
    "weight": 1.0,
    "opacity": 1,
    "fillColor": "#ECEDEC",
    "fillOpacity": 1
}
//海外
var PolygonLayer_Style_nerv_W = {
    "color": "#9BACC5",
    "weight": 1.0,
    "opacity": 1,
    "fillColor": "#4F617B",
    "fillOpacity": 1
}
//日本境
var nihon = {
    "color": "#9C9E9B",
    "weight": 1.0,
    "opacity": 1,
    "fillColor": "#ECEDEC",
    "fillOpacity": 0
}

$.getJSON("source/prefectures.geojson", function (data) {
    L.geoJson(data, {
        pane: "back",
        style: PolygonLayer_Style_nerv_J
    }).addTo(map);
});

$.getJSON("source/prefectures2.geojson", function (data) {
    L.geoJson(data, {
        pane: "back",
        style: PolygonLayer_Style_nerv_W
    }).addTo(map);
});
//自作geojson
var base = L.tileLayer('', {
    pane: "pane_map",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
}).addTo(map);

//ここからタイルマップ

var tanshoku = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    pane: "pane_map",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
});

var hyojun = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    pane: "pane_map",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
});

var chiri_img = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', {
    pane: "pane_map",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
});






L.control.layers({
    "単色(black)": base,
    "地理院地図(淡色)": tanshoku,
    "地理院地図(標準)": hyojun,
    "地理院地図(航空)": hyojun,  
}).addTo(map);

$.getJSON("source/prefectures.geojson", function (data) {
    L.geoJson(data, {
        pane: "nihon",
        style: nihon
    }).addTo(map);
});

$.getJSON("source/JMAstations.json", function (data) {
    JMAPointsJson = data;
    GetQuake();
});

//ボタン押下時のイベント設定とローカルストレージの設定
document.getElementById('reload').addEventListener("click",()=>{
    if (document.getElementById('reload_num').value != "") {
        if (document.getElementById('reload_num').value > 100 || document.getElementById('reload_num').value <= 0) {
            GetQuake(100);
        } else {
            GetQuake(document.getElementById('reload_num').value);
        }
    } else {
        GetQuake();
    }
    document.getElementById('reload').innerText = "更新中…";
    setTimeout(() => {
        document.getElementById('reload').innerText = "更新完了";
        setTimeout(() => {
            document.getElementById('reload').innerText = "情報更新";
        }, 1000);
    }, 1000);
});

function GetQuake(option) {
    var url;
    if (!isNaN(option)) {
        url = "https://api.p2pquake.net/v2/history?codes=551&limit="+option;
    } else {
        url = "https://api.p2pquake.net/v2/history?codes=551&limit=20";
    }
    $.getJSON(url, function (data) {
        QuakeJson = data;

        while (document.getElementById('quakelist').lastChild) {
            document.getElementById('quakelist').removeChild(document.getElementById('quakelist').lastChild);
        }
    
        var forEachNum = 0;
        data.forEach(element => {
            var option = document.createElement("option");
            var text;
            let maxInt_data = element['earthquake']['maxScale'];
            let maxIntText = hantei_maxIntText(maxInt_data);
            let Name = hantei_Name(element['earthquake']['hypocenter']['name']);
            let Time = element['earthquake']['time'];
            if (element["issue"]["type"] == "ScalePrompt") {
                text = "【震度速報】" + element["points"][0]["addr"] + "など " + "\n" + Time.slice(0, -3) + "\n最大震度 : " + maxIntText;
            } else if (element["issue"]["type"] == "Foreign") {
                text = "【遠地地震】" + Time.slice(0, -3) + " " + Name;
            } else {
                text = Time.slice(0, -3) + " " + Name + " " +  "\n" + "\n最大震度 : " + maxIntText;
            }
            option.value = "" + forEachNum + "";
            option.textContent = text;
            document.getElementById('quakelist').appendChild(option);
            forEachNum++;
        });
    
        //地震情報リストをクリックしたときの発火イベント
        var list = document.getElementById('quakelist');
        list.onchange = event => {
            QuakeSelect(list.selectedIndex);
        }
        
        QuakeSelect(0);
    });
}

var shingenIcon;
var shindo_icon;
var shindo_layer = L.layerGroup();
function QuakeSelect(num) {
    if (shingenIcon && shindo_layer) {
        map.removeLayer(shingenIcon);
        map.removeLayer(shindo_layer);
        shingenIcon = "";
        shindo_layer = L.layerGroup();
        shindo_icon = "";
    }
    let maxInt_data = QuakeJson[num]['earthquake']['maxScale'];
    var maxIntText = hantei_maxIntText(maxInt_data);
    var Magnitude = hantei_Magnitude(QuakeJson[num]['earthquake']['hypocenter']['magnitude']);
    var Name = hantei_Name(QuakeJson[num]['earthquake']['hypocenter']['name']);
    var Depth = hantei_Depth(QuakeJson[num]['earthquake']['hypocenter']['depth']);
    var tsunamiText = hantei_tsunamiText(QuakeJson[num]['earthquake']['domesticTsunami']);
    var Time = QuakeJson[num]['earthquake']['time'];

    var shingenLatLng = new L.LatLng(QuakeJson[num]["earthquake"]["hypocenter"]["latitude"], QuakeJson[num]["earthquake"]["hypocenter"]["longitude"]);
    var shingenIconImage = L.icon({
        iconUrl: 'source/shingen.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -40]
    });
    shingenIcon = L.marker(shingenLatLng, {icon: shingenIconImage }).addTo(map);
    shingenIcon.bindPopup('発生時刻：'+Time+'<br>最大震度：'+maxIntText+'<br>震源地：'+Name+'<span style=\"font-size: 85%;\"> ('+QuakeJson[num]["earthquake"]["hypocenter"]["latitude"]+", "+QuakeJson[num]["earthquake"]["hypocenter"]["longitude"]+')</span><br>規模：M'+Magnitude+'　深さ：'+Depth+'<br>受信：'+QuakeJson[num]['issue']['time']+', '+QuakeJson[num]['issue']['source'],{closeButton: false, zIndexOffset: 10000, maxWidth: 10000});
    shingenIcon.on('mouseover', function (e) {this.openPopup();});
    shingenIcon.on('mouseout', function (e) {this.closePopup();});

    if (QuakeJson[num]["issue"]["type"] != "ScalePrompt") { //各地の震度に関する情報
        //観測点の震度についてすべての観測点に対して繰り返す
        QuakeJson[num]["points"].forEach(element => {
        var result = JMAPoints.indexOf(element["addr"]);
        if (result != -1) {
            var ImgUrl = "";
            var PointShindo = "";
            var icon_theme = "wni";
            if (element["scale"] == 10) {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int1.png";
                PointShindo = "震度1";
            } else if (element["scale"] == 20) {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int2.png";
                PointShindo = "震度2";
            } else if (element["scale"] == 30) {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int3.png";
                PointShindo = "震度3";
            } else if (element["scale"] == 40) {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int4.png";
                PointShindo = "震度4";
            } else if (element["scale"] == 45) {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int5-.png";
                PointShindo = "震度5弱";
            } else if (element["scale"] == 46) {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int5++.png";
                PointShindo = "震度5弱以上と推定";
            } else if (element["scale"] == 50) {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int5+.png";
                PointShindo = "震度5強";
            } else if (element["scale"] == 55) {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int6-.png";
                PointShindo = "震度6弱";
            } else if (element["scale"] == 60) {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int6+.png";
                PointShindo = "震度6強";
            } else if (element["scale"] == 70) {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int7.png";
                PointShindo = "震度7";
            } else {
                ImgUrl = "source/shindo/wni/"+icon_theme+"_int_.png";
                PointShindo = "震度不明";
            }
            if (element["isArea"] == false) { //観測点
                let shindo_latlng = new L.LatLng(JMAPointsJson[result]["lat"], JMAPointsJson[result]["lon"]);
                let shindoIcon = L.icon({
                    iconUrl: ImgUrl,
                    iconSize: [40, 40],
                    popupAnchor: [0, -15]
                });
                let shindoIcon_big = L.icon({
                    iconUrl: ImgUrl,
                    iconSize: [34, 34],
                    popupAnchor: [0, -40]
                });
                shindo_icon = L.marker(shindo_latlng, { icon: shindoIcon,pane: eval('\"shindo'+element["scale"]+'\"') });
                shindo_icon.bindPopup('<ruby>'+element["addr"] + '<rt style="font-size: 0.7em;">' + JMAPointsJson[result]["furigana"] + '</rt></ruby>　'+ PointShindo,{closeButton: false, zIndexOffset: 10000,autoPan: false,});
                shindo_icon.on('mouseover', function (e) {
                    this.openPopup();
                });
                shindo_icon.on('mouseout', function (e) {
                    this.closePopup();
                });
                shindo_layer.addLayer(shindo_icon);
            }
        }
        });
    }
    map.addLayer(shindo_layer);
    map.flyTo(shingenLatLng, 7.5, { duration: 0.5 })
}


function hantei_maxIntText(param) {
    let kaerichi = param == 10 ? "1" : param == 20 ? "2" : param == 30 ? "3" : param == 40 ? "4" :
    param == 45 ? "5弱" : param == 46 ? "5弱" : param == 50 ? "5強" : param == 55 ? "6弱" :
    param == 60 ? "6強" : param == 70 ? "7" : "不明";
    return kaerichi;
}
function hantei_Magnitude(param) {
    let kaerichi = param != -1 ? param.toFixed(1) : 'ー.ー';
    return kaerichi;
}
function hantei_Name(param) {
    let kaerichi = param != "" ? param : '情報なし';
    return kaerichi;
}
function hantei_Depth(param) {
    let kaerichi = param != -1 ? "約"+param+"km" : '不明';
    return kaerichi;
}
function hantei_tsunamiText(param) {
    let kaerichi = param == "None" ? "なし" :
    param == "Unknown" ? "不明" :
    param == "Checking" ? "調査中" :
    param == "NonEffective" ? "若干の海面変動" :
    param == "Watch" ? "津波注意報" :
    param == "Warning" ? "津波警報" : "情報なし";
    return kaerichi;
}
