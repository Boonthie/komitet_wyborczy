

const formularz = document.getElementById('formularzKomitetu');
const nazwaKomitetu = document.getElementById('nazwaKomitetu');
const czyKoalicja = document.getElementById('czyKoalicja');
const liczbaGlosow = document.getElementById('liczbaGlosow');
const przyciskDodaj = document.getElementById('dodajKomitet');
const przyciskWynik = document.getElementById('pokazWyniki');
const listaKomitetow = document.getElementById('listaKomitetow');
const tabelaWynikow = document.getElementById('tabelaWynikow').querySelector('tbody');
const bladNazwa = document.getElementById('bladNazwa');
const bladGlosy = document.getElementById('bladGlosy');

let komitety = [];

przyciskDodaj.addEventListener('click', () => {
    if (sprawdzFormularz()) {
        dodajKomitet();
        wyczyscFormularz();
        pokazKomitety();
    }
});

przyciskWynik.addEventListener('click', () => {
obliczWyniki();
    pokazWyniki();
});

function sprawdzFormularz() {
    let poprawny = true;
    bladNazwa.textContent = '';
    bladGlosy.textContent = '';

    if (!nazwaKomitetu.value.trim()) {
        bladNazwa.textContent = 'Wpisz nazwę komitetu';
        poprawny = false;
    }

    if (!liczbaGlosow.value || Number(liczbaGlosow.value) <= 0) {
        bladGlosy.textContent = 'Podaj liczbę głosów większą niż 0';
        poprawny = false;
    }

    return poprawny;
}

function dodajKomitet() {
    const komitet = {
        nazwa: nazwaKomitetu.value.trim(),
        koalicja: czyKoalicja.checked,
        glosy: Number(liczbaGlosow.value),
        prog: czyKoalicja.checked ? 8 : 5,
        procent: 0,
        przeszedl: false,
        finalnyProcent: 0
    };
    komitety.push(komitet);
}

function wyczyscFormularz() {
    nazwaKomitetu.value = '';
    czyKoalicja.checked = false;
    liczbaGlosow.value = '';
}

function pokazKomitety() {
    listaKomitetow.innerHTML = '<ol>';
    for (let i = 0; i < komitety.length; i++) {
        const k = komitety[i];
        listaKomitetow.innerHTML += `<li>${k.nazwa} ${k.koalicja ? 'jest koalicją' : 'nie jest koalicją'}, ilość głosów: ${k.glosy}</li>`;
    }
    listaKomitetow.innerHTML += '</ol>';
}

function obliczWyniki() {
    let suma = komitety.reduce((acc, k) => acc + k.glosy, 0);

    let wazneGlosy = 0;
    for (const k of komitety) {
        k.procent = (k.glosy / suma) * 100;
        k.przeszedl = k.procent >= k.prog;
        if (k.przeszedl) {
            wazneGlosy += k.glosy;
        }
    }

    for (const k of komitety) {
        if (k.przeszedl) {
            k.finalnyProcent = (k.glosy / wazneGlosy) * 100;
        }
    }
}

function pokazWyniki() {
    tabelaWynikow.innerHTML = '';
    let lp = 1;

    for (const k of komitety) {
        const kolor = k.przeszedl ? 'green' : 'red';
        const opis = k.przeszedl ? 'Przekroczono próg' : 'Poniżej progu';

        const wiersz = tabelaWynikow.insertRow();
        wiersz.innerHTML =
            `<td>${lp}</td>
             <td>${k.nazwa}</td>
             <td>${k.prog}%</td>
             <td>${k.glosy}</td>
             <td style="color:${kolor};">${k.procent.toFixed(2)}% (${opis})</td>`;
        lp++;
    }
}
