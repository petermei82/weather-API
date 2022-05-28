let url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-7933C03D-5DB5-4D80-BE9E-61BB4B6C4E62';

let cities = [
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'],
    ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣'],
    ['臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣'],
    ['臺南市', '高雄市', '屏東縣'],
    ['宜蘭縣', '花蓮縣', '臺東縣'],
    ['澎湖縣', '金門縣', '連江縣'],
]

// 應用二維陣列
// [
//      [1,2,3],
//      [4,5,6],
//      [7,8,9],
// ]
// a[0] = [1,2,3];
// a[0][1] = 2;
let nowCities;// 天氣卡需要顯示的那些城市
let orgData = {}// 用來放組織過後的資料
let singlecity;
let allLsit = document.querySelectorAll('li');
let search = document.querySelector('input');
nowCities = cities[0];// 第一列=> 全部城市

allLsit.forEach((list, index) => {
    list.addEventListener('click', function () {
        nowCities = cities[index];
        console.log(nowCities);
        arrange_cities()
    });
});


search.addEventListener('keypress', function (event) {
    if (event.key === "Enter") {
        nowCities = cities[0];
        let search_cities = [];
        for (var j = 0; j < nowCities.length; j++) {
            if (nowCities[j].indexOf(search.value) >= 0) {
                search_cities.push(nowCities[j]);
            }
        }
        if (search.value == 0) {
            return;
        } else if (search_cities == "") {
            let card_region = document.querySelector('.card-region');
            card_region.innerHTML = '<p class="not-found">抱歉，未能查詢到該地區</p>';
            search.value = '';
        } else {
            cities.push(search_cities);
            nowCities = cities[cities.length - 1];
            arrange_cities()
            search.value = '';
        }

    }
});


fetch_data(); // 取資料

// =================================================
function fetch_data() { // 非同步處理=> ajax
    fetch(url) // 去遠端取資料
        .then(function (response) { // 然後=> 把資料做轉換
            return response.json();
        })
        .then(function (data) { // 然後=> 打轉換後的資料回傳
            console.log(data); // 顯示你所接收的資料後=> 再來決定如何使用
            organizationData(data); // 處理資料的組織
            arrange_cities(); // 處理所有的每一個城市=> 
        });
}


function organizationData(data) {
    let locations = data.records.location; // 所有城市
    locations.forEach(location => { // 箭頭函數的表示方式
        let locationName = location.locationName; // 取城市名稱
        let loc_wE_t_0 = location.weatherElement[0].time[0]; // 取出時間訊息    
        let startTime = loc_wE_t_0.startTime // 取開始時間
        let endTime = loc_wE_t_0.endTime // 取結束時間
        let wx = loc_wE_t_0.parameter.parameterName;
        let wxValue = loc_wE_t_0.parameter.parameterValue;

        let maxT = location.weatherElement[4].time[0].parameter.parameterName;
        let minT = location.weatherElement[2].time[0].parameter.parameterName;
        let pop = location.weatherElement[1].time[0].parameter.parameterName;
        let ci = location.weatherElement[3].time[0].parameter.parameterName;

        orgData[locationName] = {
            'wx': wx,
            'startTime': startTime,
            'endTime': endTime,
            'maxT': maxT,
            'minT': minT,
            'pop': pop,
            'ci': ci,
            'wxValue': wxValue,
        }
    });

}



function arrange_cities() {
    let card_region = document.querySelector('.card-region');
    card_region.innerHTML = '';

    nowCities.forEach((city, index) => { // 使用箭頭函數來表示
        let cityData = orgData[city];

        card_region.innerHTML +=
            `
        <div class="single-card">
            <p class="pop">&#9730 ${cityData.pop} %</p>
            <p class="city">${city}</p>
            <p class="temp">${cityData.minT}° / ${cityData.maxT}°</p>
            <p class="wx">${cityData.wx}</p>
            <img src="./img/${cityData.wxValue}.svg" alt="">
        </div>
        `
        // 字串.substr(loc,num); // 從loc位置取num個
        // 字串.reolaceAll(str1,str2); // 把所有的str1換成str2

    });

}






// fetch('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-7933C03D-5DB5-4D80-BE9E-61BB4B6C4E62')
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         console.log(data);
//         let data_records = data.records.location
//         console.log(data_records);
//         let cities = [];

//         for (let i = 0; i < data_records.length; i++) {
//             cities.push(data_records[i]);
//             console.log(cities[i]);
//         }
//         for (let i = 0; i < cities.length; i++) {
//             let city = cities[i];
//             let weather_time = city.weatherElement[0].time[0];// 取出時間訊息
//             console.log(weather_time.startTime);// 取開始時間
//             console.log(weather_time.endTime);// 取結束時間
//             let maxT = city.weatherElement[4].time[0].parameter.parameterName;
//             let minT = city.weatherElement[2].time[0].parameter.parameterName;
//             console.log(maxT, minT);
//         }
//     });


// let org = {};
// org['A'] = {a:1};
// org['B'] = {b:2};

// console.log(org);

// let ooorg = {
//                 '嘉義市':'{1}',
//                 '新竹市':'{1}',
//             }
// console.log(ooorg);
