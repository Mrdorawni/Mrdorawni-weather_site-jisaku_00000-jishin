var QuakeJson;
var JMAPointsJson;

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
map.createPane("pane_map0").style.zIndex = 0; //地図(背景)
map.createPane("pane_map1").style.zIndex = 1; //地図(背景)
map.createPane("pane_map2").style.zIndex = 2; //地図(市町村)
map.createPane("pane_map3").style.zIndex = 3; //地図(細分)
map.createPane("pane_map_filled").style.zIndex = 5; //塗りつぶし
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
    "weight": 3.2,
    "opacity": 0,
    "fillOpacity": 0,
}



//自作geojson
var base = L.geoJSON();

fetch('source/japan.geojson')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    pane: "pane_map1",
                    style: {
                        color: "#000000",
                        weight: 1.5,
                        opacity: 1,
                        fillColor: "#ffffff",
                        fillOpacity: 1,
                    }
                }).addTo(base);
            });

//ここからタイルマップ

var google1 = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    pane: "pane_map1",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://www.google.com/maps" target="_blank">googleマップ</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
});

var google2 = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    pane: "pane_map1",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://www.google.com/maps" target="_blank">googleマップ</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
}); //最初に表示させるタイルに addTo() をつける

var google3 = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    pane: "pane_map1",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://www.google.com/maps" target="_blank">googleマップ</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
});

var google4 = L.tileLayer('https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}', {
    pane: "pane_map1",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://www.google.com/maps" target="_blank">googleマップ</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
});

var tanshoku = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    pane: "pane_map1",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
}).addTo(map);


var hyojun = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    pane: "pane_map1",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
});

var dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    pane: "pane_map1",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://carto.com/" target="_blank">CARTO Dark</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
});

var inei = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png', {
    pane: "pane_map1",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
});

var hyoko_color = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png', {
    pane: "pane_map1",
    style: PolygonLayer_Style_nerv_1,
    attribution: '地図情報:<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>、地震・津波情報:<a href="https://www.p2pquake.net/" target="_blank">P2P地震情報</a>'
});

var geojsonLayer = L.geoJSON();

fetch('source/nankai.geojson')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    pane: "pane_map1",
                    style: {
                        color: "#000000",
                        weight: 1.5,
                        opacity: 1,
                        fillColor: "#C2E1A5",
                        fillOpacity: 0.6,
                    }
                }).addTo(geojsonLayer);
            });




L.control.layers({
    "単色(black)": base,
    "地図": google1,  
    "航空写真": google2,
    "航空+地図": google3,
    "地図(透過)": google4,
    "地理院地図(淡色)": tanshoku,
    "地理院地図(標準)": hyojun,
    "CARTO Dark": dark,
    "地理院陰影起伏図": inei,
    "地理院色別標高図": hyoko_color,

    "南海トラフ想定震源域": geojsonLayer,
    
}).addTo(map);

var PolygonLayer_Style_nerv_J = {
    "color": "#000000",
    "weight": 3.0,
    "opacity": 1,
    "fillOpacity": 0
}
var PolygonLayer_Style_nerv_J2 = {
    "color": "#ffffff",
    "weight": 8,
    "opacity": 1,
    "fillOpacity": 0
}
/*
$.getJSON("source/japan.geojson", function (data) {
    L.geoJson(data, {
        pane: "pane_map3",
        style: PolygonLayer_Style_nerv_J
    }).addTo(map);
});

$.getJSON("source/japan.geojson", function (data) {
    L.geoJson(data, {
        pane: "pane_map2",
        style: PolygonLayer_Style_nerv_J2
    }).addTo(map);
});
*/
$.getJSON("source/JMAstations.json", function (data) {
    JMAPointsJson = data;
});

$.getJSON("source/JMAstations.json", function (data) {
    JMAPointsJson = data;
    GetQuake();
})

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
    document.getElementById('reload').innerText = "更新中";
    setTimeout(() => {
        document.getElementById('reload').innerText = "更新完了";
        setTimeout(() => {
            document.getElementById('reload').innerText = "情報更新";
        }, 1000);
    }, 1000);
});

//P2P地震情報　API取得
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
                text = "【遠地地震に関する情報】" + Time.slice(0, -3) + " " + Name;
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
            iconSize: [60, 60],
            iconAnchor: [30, 30],
            popupAnchor: [0, -10]
        });
        shingenIcon = L.marker(shingenLatLng, {icon: shingenIconImage }).addTo(map);
        shingenIcon.bindPopup('発生時刻：'+Time+'<br>最大震度：'+maxIntText+'<br>震源地：'+Name+'<span style=\"font-size: 85%;\"> ('+QuakeJson[num]["earthquake"]["hypocenter"]["latitude"]+", "+QuakeJson[num]["earthquake"]["hypocenter"]["longitude"]+')</span><br>規模：M'+Magnitude+'　深さ：'+Depth+'<br>受信：'+QuakeJson[num]['issue']['time']+', '+QuakeJson[num]['issue']['source'],{closeButton: false, zIndexOffset: 10000, maxWidth: 10000});
        shingenIcon.on('mouseover', function (e) {this.openPopup();});
        shingenIcon.on('mouseout', function (e) {this.closePopup();});

        if (QuakeJson[num]["issue"]["type"] != "ScalePrompt") { //各地の震度に関する情報
            //観測点の震度について全ての観測点に対して繰り返す
            QuakeJson[num]["points"].forEach(element => {
            var result = JMAPoints.indexOf(element["addr"]);
            if (result != -1) {
                var ImgUrl = "";
                var PointShindo = "";
                if (element["scale"] == 10) {
                    ImgUrl ="source/shindo/wni/wni_int1.png";
                    PointShindo = "震度1";
                }
                else if (element["scale"] == 20) {
                    ImgUrl ="source/shindo/wni/wni_int2.png";
                    PointShindo = "震度2";
                }
                else if (element["scale"] == 30) {
                    ImgUrl ="source/shindo/wni/wni_int3.png";
                    PointShindo = "震度3";
                }
                else if (element["scale"] == 40) {
                    ImgUrl ="source/shindo/wni/wni_int4.png";
                    PointShindo = "震度4";
                }
                else if (element["scale"] == 45) {
                    ImgUrl ="source/shindo/wni/wni_int5-.png";
                    PointShindo = "震度5弱";
                }
                else if (element["scale"] == 46) {
                    ImgUrl ="source/shindo/wni/wni_int5++.png";
                    PointShindo = "震度5以上と推定(未入電)";
                }
                else if (element["scale"] == 50) {
                    ImgUrl ="source/shindo/wni/wni_int5+.png";
                    PointShindo = "震度5強";
                }
                else if (element["scale"] == 55) {
                    ImgUrl ="source/shindo/wni/wni_int6-.png";
                    PointShindo = "震度6弱";
                }
                else if (element["scale"] == 60) {
                    ImgUrl ="source/shindo/wni/wni_int6+.png";
                    PointShindo = "震度6強";
                }
                else if (element["scale"] == 70) {
                    ImgUrl ="source/shindo/wni/wni_int7.png";
                    PointShindo = "震度7";
                }
                else {
                    ImgUrl ="source/shindo/wni/wni_int_?.png";
                    PointShindo = "震度不明";
                }
                if (element["isArea"] == false) {
                    let shindo_latlng = new L.LatLng(JMAPointsJson[result]["lat"], JMAPointsJson[result]["lon"]);
                    let shindoIcon = L.icon({
                        iconUrl: ImgUrl,
                        iconSize: [40, 40],
                        popupAnchor: [0, -10]
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
        map.addLayer(shindo_layer)
        map.flyTo(shingenLatLng, 7.5, { duration: 0.5 })
        }

    function hantei_maxIntText(param) {
        let kaerichi = param == 10 ? "1" : 
                    param == 20 ? "2" : 
                    param == 30 ? "3" : 
                    param == 40 ? "4" : 
                    param == 45 ? "5-" : 
                    param == 46 ? "5-" : 
                    param == 50 ? "5+" : 
                    param == 55 ? "6-" : 
                    param == 60 ? "6+" : 
                    param == 70 ? "7" : "不明";
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
        param == "Warning" ? "津波警報" :
        param == "MajorWarning" ? "大津波警報" : "情報なし";
        return kaerichi;
    }
