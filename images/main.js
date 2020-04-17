/* Digital Clock with simple weather screensaver module for CommandFusion
===============================================================================

AUTHOR:		Roman V. Brooks, iHomeControl
CONTACT:	roman@ihomecontrol.ru
URL:		Welcome to Russia!
VERSION:	v1.0.0
LAST MOD:	Friday, 2 February 2018

=========================================================================
HELP:

1. 
2. 
3. 
4. 

=========================================================================
*/

// =======================================================================
function digitalClock() {

    var date = new Date();
    var w = date.getDay();
    var Hour = date.getHours();
    var Min = date.getMinutes();
    var Sec = date.getSeconds();
    //===========================================================================
    var Hour10 = ((Hour < 10 ? "0" : "") + Hour).slice(0, 1);
    var Hour01 = ((Hour < 10 ? "0" : "") + Hour).slice(-1);
    var Min10 = ((Min < 10 ? "0" : "") + Min).slice(0, 1);
    var Min01 = ((Min < 10 ? "0" : "") + Min).slice(-1);
    var Sec10 = ((Sec < 10 ? "0" : "") + Sec).slice(0, 1);
    var Sec01 = ((Sec < 10 ? "0" : "") + Sec).slice(-1);
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Mondey";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    /*===========================================================================  
    Replace text with graphics
    =============================================================================*/
    CF.setJoin("s1000", Hour10 + ".png");
    CF.setJoin("s1001", Hour01 + ".png");
    CF.setJoin("s1002", Min10 + ".png");
    CF.setJoin("s1003", Min01 + ".png");
    CF.setJoin("s1004", Sec10 + ".png");
    CF.setJoin("s1005", Sec01 + ".png");
    CF.setJoin("s1010", weekday[date.getDay()] + ".png");
}

/*  -------------------------------------------------------------------------------------- 
    --------------------------------------------------------------------------------------
    --------------------------------------------------------------------------------------
*/

var Weather = function(url) {

    var self = { url: url };

    self.loadYandexWeather = function() {
        // Load the XML data from a URL
        CF.request(self.url, function(status, headers, body) {
            // Check that the URL request returned without error
            if (status == 200) {
                // Use the returned body and create an XML DOM object
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(body, 'text/xml');
                console.log(xmlDoc);
                self.trafficMoscow = xmlDoc.getElementsByTagName("level")[0];
                CF.setJoin("a10", self.trafficMoscow.textContent * 6553);
                self.cityName = xmlDoc.getElementsByTagName("title")[0];
                CF.setJoin("s2000", self.cityName.textContent);
                self.weatherType = xmlDoc.getElementsByTagName("weather_type")[0];
                CF.setJoin("s2001", self.weatherType.textContent);
                self.dayTime = xmlDoc.getElementsByTagName("daytime")[0];
                 if (self.dayTime.textContent == 'n') {
                     CF.setJoin("d201", 1);
                 } else {
                     CF.setJoin("d201", 0);
                 }
                self.aPressure = xmlDoc.getElementsByTagName("pressure")[0];
                CF.setJoin("s2002", self.aPressure.textContent + " mm Hg");
                self.currentTemp = xmlDoc.getElementsByTagName("temperature")[0];
                CF.setJoin("s2003", self.currentTemp.textContent + "°C");
                self.wImage = xmlDoc.getElementsByTagName("weather_code")[0];
                CF.setJoin("s999", self.wImage.textContent + ".png");
            } else {
                CF.log("XML Request Failed with status " + status);
                CF.setJoin("s2000", "");
                CF.setJoin("s2001", "");
                CF.setJoin("s2002", "");
                CF.setJoin("s2003", "");
            }
        });
    };
    return self;
};

var yaweather;

CF.userMain = function() {
    //startup getWeather
    yaweather = new Weather("https://export.yandex.ru/bar/reginfo.xml");
    yaweather.loadYandexWeather();
    //function updated weather data maybe mistaked solution
    function getWeather() {
        //yaweather = new Weather("https://export.yandex.ru/bar/reginfo.xml?region=10393&lang=en"); // London
        //yaweather = new Weather("https://export.yandex.ru/bar/reginfo.xml?region=10502&lang=fr"); // Paris
        //yaweather = new Weather("https://export.yandex.ru/bar/reginfo.xml?region=202&lang=en"); // New York
        //yaweather = new Weather("https://export.yandex.ru/bar/reginfo.xml?region=213&lang=ru"); // Moscow
        yaweather = new Weather("https://export.yandex.ru/bar/reginfo.xml"); //autodetect
        yaweather.loadYandexWeather();
    }
    setInterval(digitalClock, 1000);
    setInterval(getWeather, 6e5); //update weather every 10 minutes
};