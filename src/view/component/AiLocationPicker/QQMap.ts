export default function QQMap(key) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(window.qq);
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://map.qq.com/api/js?v=2.exp&callback=init&key=" + key;
    script.onerror = reject;
    document.head.appendChild(script);

    const scriptGEOLocation = document.createElement("script");
    scriptGEOLocation.type = "text/javascript";
    scriptGEOLocation.src =
      "https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js";
    scriptGEOLocation.onerror = reject;
    document.head.appendChild(scriptGEOLocation);
  });
}
