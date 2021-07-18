var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var txtKaynak = document.getElementById("txtKaynak");

// belirtilen koordinat labirent üzerindeki bir 0 değerine (yola) karşılık geliyor mu?
function yolAcikMi(labirent, x, y) {
    return x >= 0 && y >= 0 && 
        x < labirent[0].length && y < labirent.length && 
        labirent[y][x] == "0";
}

function hedefeUlasildiMi (labirent, x, y) {
    var satirAdet = labirent.length;
    var sutunAdet = labirent[0].length;
    return x == sutunAdet - 1 && y == satirAdet - 1 && labirent[y][x] == "0";
}

function hucreGuncelle(labirent, x, y, deger) {
    labirent[y][x] = deger;
    degisim.push(diziKopyala(labirent));
}

function ara(labirent, x = 0, y = 0) {
    if (!yolAcikMi(labirent, x, y)) return false;
    
    if (hedefeUlasildiMi (labirent, x, y)) {
        hucreGuncelle(labirent, x, y, "7");
        return true;
    }

    // vardığımız noktayı işaretleyelim
    hucreGuncelle(labirent, x, y, "7");

    if (ara(labirent, x + 1, y)) return true; // sağında ara
    if (ara(labirent, x, y - 1)) return true; // üstünde ara
    if (ara(labirent, x - 1, y)) return true; // solunda ara
    if (ara(labirent, x, y + 1)) return true; // aşağıda ara

    hucreGuncelle(labirent, x, y, "9"); // çıkmaz sokak olarak işaretle
    return false;
}

var degisim = [];
function labirentCoz() {
    var labirent = diziyeDonustur();
    degisim = [ diziKopyala(labirent) ];
    ara(labirent);
    labirentCiz(labirent);
}

// x: sütun no  y: satır no   w: genislik   h: yükseklik 
function hucreCiz(x, y, w, h, renk = "black" ) {
    ctx.fillStyle = renk;
    ctx.fillRect(x * w, y * h, w, h);
}

function labirentCiz(labirent) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // temizle
    var dizi = labirent;
    if (!dizi) dizi = diziyeDonustur();
    var satirAdet = dizi.length;
    var sutunAdet = dizi[0].length;
    var hucreGen = canvas.width / sutunAdet;
    var hucreYuk = canvas.height / satirAdet;

    for (var y = 0; y < sutunAdet; y++) {

        for (var x = 0; x < satirAdet; x++) {
            var deger = dizi[y][x];

            switch (deger) {
                case "0":
                    renk = "white"; // yol rengi
                    break;
                case "1":
                    renk = "black"; // duvar rengi
                    break;
                case "7":
                    renk = "green"; // gezilen yol
                    break;
                case "9":
                    renk = "red"; // çıkmaz yol
                    break;
                default:
                    renk = "white";
            }

            hucreCiz(x, y, hucreGen, hucreYuk, renk);
        }

    }

}

function diziyeDonustur() {
    var kaynak = txtKaynak.value.trim();
    var satirlar = kaynak.split("\n");
    var dizi = [];
    for (var i = 0; i < satirlar.length; i++) {
        dizi.push(satirlar[i].split(""));
    }
    return dizi;
}

function diziKopyala(dizi) {
    return JSON.parse(JSON.stringify(dizi));
}

var animIndex = 0;
function animasyon() {
    labirentCiz(degisim[animIndex]);

    setTimeout(function() {
        if (++animIndex < degisim.length)
            animasyon();
        else
            animIndex = 0;
    }, 100);
}

labirentCiz();