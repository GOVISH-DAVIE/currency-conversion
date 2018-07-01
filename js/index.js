/* jshint esversion: 6*/
$(window).load(function () {
    $(".loader").fadeOut("slow");
});
class converter {
    constructor(url = 'https://free.currencyconverterapi.com/api/v5/convert?q=USD_PHP&compact=y', listcurrency = "https://free.currencyconverterapi.com/api/v5/countries") {

        this.fetchInsternt(url); 
       this.fetchListcurrency();    
       this.installSW();
    }
    querygen(to,from, att){
       let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=y`;
        fetch(url)
        .then(res => res.json())
        .then(data => {
            for (const key in data) {
                 this.retUI(to, from,data[key],  att);  
                 this.chatGraph(to,from); 
            }
        }).catch(err => console.log(err)); 
    }
    chatGraph(to , from){
        let d = new Date();
        let dt = new Date();
        let te = dt.toLocaleDateString().split('/');
        d.setDate(d.getDate() - 8);
        let darr =  d.toLocaleDateString().split('/');
        let firstDay = darr[2] +'-0' + darr[0] + '-' + darr[1];
        let day = te[2] +'-0' + te[0] + '-' + te[1];
        console.log(firstDay, day); 
        let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to},${to}_${from}&compact=ultra&date=${firstDay}&endDate=${day} `;
        fetch(url).then(res => res.json())
        .then(data => {
            
            let entries = [],
                lables = [],
                reventries = [],
                revlables = [];
                    for (const key in data[`${from}_${to}`]) {
                        lables.push(key);
                       entries.push(data[`${from}_${to}`][`${key}`]);
                    }
                    for (const key in data[`${to}_${from}`]) {
                        revlables.push(key);
                        reventries.push(data[`${to}_${from}`][`${key}`]);
                    }
                    console.log(Math.max.apply(Math, entries), Math.min.apply(Math, entries));
                    return [
                        this.chartUi(lables, entries, Math.max.apply(Math, entries), Math.min.apply(Math, entries), `${from}_${to}`),
                        this.revchatGraph(revlables, reventries, Math.max.apply(Math, reventries), Math.min.apply(Math, reventries), `${to}_${from}`)
                    ];     
        })
        .catch(err => console.log(err));
    }
    chartUi(labels, entries, maxent , minent,name){
        new Chart(document.getElementById("myChart"), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: entries,
                    label: name ,
                    borderColor: "#3e95cd",
                    fill: false
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            steps: 10,
                            stepValue: 5,
                            max: maxent,
                            min: minent,
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'currency conversion'
                }
            }
        });
    }
        revchatGraph(labels, entries, maxent, minent, name) {
            new Chart(document.getElementById("revmyChart"), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        data:entries,
                        label: name,
                        borderColor: "#3e95cd",
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Month'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                steps: 10,
                                stepValue: 5,
                                max: maxent,
                                min:minent,
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: 'currency conversion'
                    }
                }
            });
    }
    retUI(to, from,dat, att){
                 console.log(dat, att, dat.val * parseInt(att));     
                let val = dat.val * parseInt(att);
         let dis = `<div id="top">
                        <span class="title">result::  </span>
                        <span class="" id="fromCurr">${att} ${from}</span>
                        <span class="italic">
                            =
                        </span>
                        <span class="" id="toCurr">${val}${to}</span>
                    </div>
                    <div id="addit">
                        <span class = "title" > rates:: </span>
                        <span class="" id="fromCurr">1 ${from}</span>
                        <span class="italic">
                            =
                        </span>
                        <span class="" id="toCurr">${dat.val}${to}</span>
                    </div>`;
                   return  (document.getElementById('results').innerHTML = dis);
    }

    installSW(){
    if ('serviceWorker' in navigator) {
        window.addEventListener('load',  () =>{
            navigator.serviceWorker.register('sw.js')
                .then(reg => {
                    console.log("worked", reg);
                    if(reg.installing){
                        return window.location.reload();
                    }
                    if (reg.waiting) {
                        return window.location.reload();
                    }
            })
                .catch(err => console.log("dd not" + err));
        });
    }
}
    fetchInsternt(){
        fetch('https://free.currencyconverterapi.com/api/v5/convert?q=USD_PHP&compact=y')
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));  
    }
    fetchListcurrency(){
        fetch('https://free.currencyconverterapi.com/api/v5/currencies')
            .then(res => res.json())
            .then( data => {
                this.indexDBMeth(data.results);
                
                let arr = ' <select name="" id="to" class="inputs" >';
                for (let key in data.results) {
                    // console.log(data.res/ults[`${key}`]);
                    arr += '<option value="' + data.results[`${key}`].id + '"> ' + data.results[`${key}`].currencyName + ' the code  is ' + data.results[`${key}`].id + '</option>';
                }
                arr += '</select>';
                document.getElementById('from').innerHTML = arr;
                document.getElementById('to').innerHTML = arr;
              }).catch(err => console.log(err));
            }
    indexDBMeth(meth){
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        if (!window.indexedDB) {
            alert("no offline feature found");
        }
        let req = window.indexedDB.open('currencies', 3),
            db,
            tx,
            store,
            index;

        req.onupgradeneeded = e => {
            let db = req.result,
                store = db.createObjectStore('currency', {
                    keyPath: "qID"
                }),
                index = store.createIndex('currI', 'currI', {
                    unique: false
                });
        };
        req.onerror = e => console.log("[indexDb]", e);
        req.onsuccess = e => {
            db = req.result;
            tx = db.transaction('currency', 'readwrite');
            store = tx.objectStore('currency');
            index = store.index('currI');

            db.onerror = e => console.log(e);
            let u = 1;
              for (let key in meth) {
                    store.put({
                        qID: u,
                        cID: meth[`${key}`].id,
                        currencyName: meth[`${key}`].currencyName,
                        symbol: meth[`${key}`].symbol
                    });
                  u++;
                }
            tx.oncomplete = () => db.close();
        };
    }  
}

let instcon = new converter();
let validate = () => {
    let att = document.forms.curr.amt.value;
    let to = document.getElementById('to').value;
    let from = document.getElementById('from').value;
    if (att != '') return instcon.querygen(to,from, att);
        document.getElementById('inpstatus').innerHTML = 'the field is empty';
    
    
};
