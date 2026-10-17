
Oled p5.js generatiivse kunsti abiline. Tõlgi minu kirjeldus töötavaks p5.js koodiks. Anna ainult terviklik JavaScript kood, kommentaaridega ja muudetavate numbriliste parameetritega koodi alguses.

Minu visuaal: [Tee halloweeni tervitus minu parimatele sõbrannadele.Tee kinnine punast värvi punutud korv ja pane sinna istuma kass1.jpg. Korvile kirjuta peale Kallid Ade ja Irka! Seejärel lendab korvile vajutadest korvist välja pilt kass4.jpg ja veereb välja kass2.jpg koos kummitusega kass3.jpg. Tekib paus 2 sek ja seejärel lendab uuesti välja kass4.jpg ning tekst Tagasihoidlik Halloweeni tervitus teile!]
// =====================================================
// 🎃 HALLOWEENI TERVITUS ADELE JA IRKALE 🎃
// Interaktiivne p5.js animatsioon
//
// Pildid peavad olema p5.js projekti kaustas:
// kass1.jpg - kass, kes istub punases korvis
// kass2.jpg - kass, kes veereb korvist välja
// kass3.jpg - kummitus
// kass4.jpg - kass, kes lendab korvist välja
//
// Vajuta punasele korvile, et animatsioon algaks!
// Uuesti alustamiseks vajuta korvile veel kord.
// =====================================================


// =====================================================
// 1. MUUDETAVAD NUMBRILISED PARAMEETRID
// =====================================================

const LAIUS = 900;
const KORGUS = 650;

const KORVI_X = 450;
const KORVI_Y = 435;
const KORVI_LAIUS = 370;
const KORVI_KORGUS = 225;

const KASS1_SUURUS = 175;
const KASS2_SUURUS = 145;
const KASS3_SUURUS = 150;
const KASS4_SUURUS = 165;

const LENDAMISE_KIIRUS = 4.5;
const VEEREMISE_KIIRUS = 3.2;
const KUMMITUSE_KIIRUS = 2.5;

const PAUS = 2000; // Paus millisekundites
const ESIMENE_LEND = 1700;
const VEEREMISE_AEG = 2200;
const TEINE_LEND = 2000;

const TAHTE_ARV = 75;
const KORVI_PUNUTISE_SAMM = 17;
const KONFETI_ARV = 55;


// =====================================================
// 2. GLOBAALSED MUUTUJAD
// =====================================================

let kass1, kass2, kass3, kass4;

let etapp = 0;
let etapiAlgus = 0;

let tahed = [];
let konfetid = [];

let hiireKohal = false;


// =====================================================
// 3. PILTIDE LAADIMINE
// =====================================================

function preload() {
  kass1 = loadImage("kass1.jpg");
  kass2 = loadImage("kass2.jpg");
  kass3 = loadImage("kass3.jpg");
  kass4 = loadImage("kass4.jpg");
}


// =====================================================
// 4. ALGSEADISTUS
// =====================================================

function setup() {
  createCanvas(LAIUS, KORGUS);

  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  rectMode(CENTER);
  angleMode(RADIANS);

  // Tähistaevas
  for (let i = 0; i < TAHTE_ARV; i++) {
    tahed.push({
      x: random(width),
      y: random(height * 0.75),
      r: random(1, 3),
      faas: random(TWO_PI)
    });
  }

  // Sädelevad konfetid
  for (let i = 0; i < KONFETI_ARV; i++) {
    konfetid.push({
      x: random(width),
      y: random(-height, 0),
      kiirus: random(1, 3),
      suurus: random(3, 8),
      toon: random(360)
    });
  }
}


// =====================================================
// 5. ANIMATSIOONI PEATSÜKKEL
// =====================================================

function draw() {
  joonistaTaust();
  joonistaKuu();
  joonistaTahed();
  joonistaKorv();

  // Kass1 istub alguses korvis.
  // Hiljem jääb ta korvist välja piiluma.
  joonistaKorviKass();

  // Korvi esiosa katab kassi alumist osa.
  joonistaKorviEsiosa();

  let aeg = millis() - etapiAlgus;

  if (etapp === 0) {
    joonistaAlgusTekst();
  }

  // ETAPP 1: kass4 lendab korvist välja.
  if (etapp === 1) {
    let p = constrain(aeg / ESIMENE_LEND, 0, 1);
    joonistaLendavKass(p, false);

    if (p >= 1) {
      alustaEtapp(2);
    }
  }

  // ETAPP 2: kass2 veereb välja koos kummitusega.
  if (etapp === 2) {
    let p = constrain(aeg / VEEREMISE_AEG, 0, 1);

    joonistaVeerevKass(p);
    joonistaKummitus(p);

    if (p >= 1) {
      alustaEtapp(3);
    }
  }

  // ETAPP 3: kahe sekundi pikkune paus.
  if (etapp === 3) {
    joonistaVeerevKass(1);
    joonistaKummitus(1);

    if (aeg >= PAUS) {
      alustaEtapp(4);
    }
  }

  // ETAPP 4: kass4 lendab uuesti välja.
  if (etapp === 4) {
    let p = constrain(aeg / TEINE_LEND, 0, 1);

    joonistaVeerevKass(1);
    joonistaKummitus(1);
    joonistaLendavKass(p, true);

    if (p >= 1) {
      alustaEtapp(5);
    }
  }

  // ETAPP 5: lõplik Halloweeni tervitus.
  if (etapp === 5) {
    joonistaVeerevKass(1);
    joonistaKummitus(1);
    joonistaLendavKass(1, true);
    joonistaKonfetid();
    joonistaLopuTekst();
  }

  // Väike dekoratiivne tekst ekraani allosas
  if (etapp !== 5) {
    push();
    fill(255, 190, 105);
    noStroke();
    textSize(15);
    text("🎃  Halloween täis üllatusi!  🎃", width / 2, 625);
    pop();
  }

  hiireKohal =
    mouseX > KORVI_X - KORVI_LAIUS / 2 &&
    mouseX < KORVI_X + KORVI_LAIUS / 2 &&
    mouseY > KORVI_Y - 100 &&
    mouseY < KORVI_Y + KORVI_KORGUS / 2;

  cursor(hiireKohal ? HAND : ARROW);
}


// =====================================================
// 6. TUMELILLA HALLOWEENI TAUST
// =====================================================

function joonistaTaust() {
  background(19, 9, 36);

  // Öötaeva gradient
  noStroke();

  for (let y = 0; y < height; y += 3) {
    let t = y / height;

    let c = lerpColor(
      color(24, 9, 49),
      color(84, 29, 63),
      t
    );

    fill(c);
    rect(width / 2, y, width, 4);
  }

  // Udune maapind
  fill(40, 15, 45, 130);
  ellipse(width / 2, height + 35, 1100, 210);

  // Kõrvitsad maapinnal
  joonistaKorvits(95, 565, 0.85);
  joonistaKorvits(810, 565, 1.05);
}


// =====================================================
// 7. KUU JA TÄHED
// =====================================================

function joonistaKuu() {
  push();

  noStroke();

  fill(255, 185, 65, 20);
  ellipse(735, 115, 175);

  fill(255, 196, 92, 35);
  ellipse(735, 115, 145);

  fill(255, 223, 143);
  ellipse(735, 115, 105);

  fill(255, 242, 190);
  ellipse(722, 100, 20);

  pop();
}

function joonistaTahed() {
  push();
  noStroke();

  for (let t of tahed) {
    let helendus =
      140 + 115 * sin(frameCount * 0.035 + t.faas);

    fill(255, 224, 170, helendus);
    circle(t.x, t.y, t.r * 2);
  }

  pop();
}


// =====================================================
// 8. HALLOWEENI KÕRVITSAD
// =====================================================

function joonistaKorvits(x, y, s) {
  push();

  translate(x, y);
  scale(s);

  noStroke();

  fill(180, 64, 9);
  ellipse(-22, 0, 60, 76);
  ellipse(22, 0, 60, 76);

  fill(244, 109, 18);
  ellipse(0, 0, 70, 82);

  fill(52, 91, 35);
  rect(0, -46, 11, 25, 4);

  // Silmad
  fill(38, 17, 21);

  triangle(-26, -8, -8, -8, -17, 9);
  triangle(8, -8, 26, -8, 17, 9);

  // Naeratus
  arc(0, 13, 39, 28, 0, PI, CHORD);

  pop();
}


// =====================================================
// 9. PUNANE PUNUTUD KORV
// =====================================================

function joonistaKorv() {
  push();

  translate(KORVI_X, KORVI_Y);

  let w = KORVI_LAIUS;
  let h = KORVI_KORGUS;

  // Vari korvi all
  noStroke();
  fill(0, 0, 0, 90);
  ellipse(0, h * 0.52, w * 1.1, 48);

  // Korvi sang
  noFill();
  stroke(114, 23, 31);
  strokeWeight(27);
  arc(0, -45, w * 0.82, 290, PI, TWO_PI);

  stroke(218, 75, 78);
  strokeWeight(17);
  arc(0, -45, w * 0.82, 290, PI, TWO_PI);

  // Korvi tagumine osa
  noStroke();
  fill(122, 20, 35);

  ellipse(0, -36, w, 85);

  // Korvi suletud, punutud ilmega ülemine serv
  fill(183, 35, 49);
  ellipse(0, -52, w * 0.96, 62);

  stroke(245, 118, 109, 140);
  strokeWeight(3);

  for (let x = -w * 0.44; x < w * 0.44; x += 16) {
    line(x, -68, x + 19, -37);
  }

  pop();
}


// =====================================================
// 10. KASS1 ISTUB KORVIS
// =====================================================

function joonistaKorviKass() {
  push();

  let hyplemine = sin(frameCount * 0.045) * 3;

  image(
    kass1,
    KORVI_X,
    KORVI_Y - 83 + hyplemine,
    KASS1_SUURUS,
    KASS1_SUURUS
  );

  pop();
}


// =====================================================
// 11. KORVI ESIPANEEL JA PUNUTIS
// =====================================================

function joonistaKorviEsiosa() {
  push();

  translate(KORVI_X, KORVI_Y);

  let w = KORVI_LAIUS;
  let h = KORVI_KORGUS;

  // Punane korvikeha
  noStroke();
  fill(165, 30, 44);

  beginShape();
  vertex(-w / 2, -28);
  bezierVertex(-w / 2 + 15, 60, -w / 2 + 35, h / 2, 0, h / 2);
  bezierVertex(w / 2 - 35, h / 2, w / 2 - 15, 60, w / 2, -28);
  endShape(CLOSE);

  // Punutud horisontaalsed ribad
  stroke(231, 91, 89, 180);
  strokeWeight(5);

  for (let y = -12; y <= 92; y += KORVI_PUNUTISE_SAMM) {
    let poolLaius = map(y, -12, 92, w * 0.48, w * 0.37);

    line(-poolLaius, y, poolLaius, y);
  }

  // Diagonaalsed punutised
  stroke(105, 15, 29, 145);
  strokeWeight(4);

  for (let x = -260; x <= 260; x += KORVI_PUNUTISE_SAMM) {
    line(x, -22, x + 100, 103);
    line(x + 100, -22, x, 103);
  }

  // Ülemine punane äär
  noFill();
  stroke(105, 16, 28);
  strokeWeight(20);
  arc(0, -29, w, 53, 0, PI);

  stroke(242, 107, 102);
  strokeWeight(11);
  arc(0, -31, w, 53, 0, PI);

  // Sildike korvil
  noStroke();
  fill(79, 10, 27, 210);
  rect(0, 35, 285, 61, 15);

  stroke(255, 184, 119);
  strokeWeight(2);
  noFill();
  rect(0, 35, 275, 53, 12);

  // Tervitustekst korvil
  noStroke();
  fill(255, 230, 183);

  textStyle(BOLD);
  textSize(25);
  text("Kallid Ade ja Irka!", 0, 35);
  textStyle(NORMAL);

  pop();
}


// =====================================================
// 12. ESIMENE JA TEINE LEND - KASS4
// =====================================================

function joonistaLendavKass(p, teineLend) {
  push();

  // Sujuv liikumine
  let sujuv = easeOutCubic(p);

  let algusX = KORVI_X;
  let algusY = KORVI_Y - 65;

  let loppX = teineLend ? 690 : 760;
  let loppY = teineLend ? 205 : 110;

  let x = lerp(algusX, loppX, sujuv);
  let y = lerp(algusY, loppY, sujuv);

  // Kaarekujuline lend
  y -= sin(p * PI) * 125;

  // Lendav kass pöörleb
  translate(x, y);
  rotate(sin(p * TWO_PI) * 0.28);

  let suurus = KASS4_SUURUS * (0.75 + 0.25 * sujuv);

  image(kass4, 0, 0, suurus, suurus);

  pop();

  // Sädelev lennujälg
  push();
  noStroke();

  for (let i = 0; i < 13; i++) {
    let t = max(0, p - i * 0.025);

    let sx = lerp(algusX, loppX, easeOutCubic(t));
    let sy = lerp(algusY, loppY, easeOutCubic(t));

    sy -= sin(t * PI) * 125;

    fill(255, 195, 55, 180 - i * 12);
    circle(
      sx + sin(frameCount * 0.1 + i) * 12,
      sy + cos(frameCount * 0.1 + i) * 12,
      max(2, 12 - i * 0.6)
    );
  }

  pop();
}


// =====================================================
// 13. KASS2 VEEREB KORVIST VÄLJA
// =====================================================

function joonistaVeerevKass(p) {
  push();

  let sujuv = easeOutCubic(p);

  let x = lerp(KORVI_X, 245, sujuv);
  let y = lerp(KORVI_Y - 35, 515, sujuv);

  // Veeremise ajal teeb kass pöördeid.
  let nurk = p < 1 ? -p * TWO_PI * 1.5 : -TWO_PI * 1.5;

  translate(x, y);
  rotate(nurk);

  image(
    kass2,
    0,
    0,
    KASS2_SUURUS,
    KASS2_SUURUS
  );

  pop();
}


// =====================================================
// 14. KUMMITUS KASS3
// =====================================================

function joonistaKummitus(p) {
  push();

  let sujuv = easeOutCubic(p);

  let x = lerp(KORVI_X + 20, 135, sujuv);
  let y = lerp(KORVI_Y - 65, 345, sujuv);

  // Kummitus hõljub õhus.
  y += sin(frameCount * 0.055) * 17;

  translate(x, y);

  // Õrn kummituslik kuma
  noStroke();

  fill(210, 225, 255, 35);
  ellipse(0, 0, KASS3_SUURUS * 1.3);

  // Kummitusena kasutame kass3.jpg pilti.
  tint(235, 245, 255, 210);

  image(
    kass3,
    0,
    0,
    KASS3_SUURUS,
    KASS3_SUURUS
  );

  noTint();

  // Väikesed maagilised täpid
  for (let i = 0; i < 7; i++) {
    let a = frameCount * 0.025 + i * TWO_PI / 7;

    fill(225, 230, 255, 140);
    circle(
      cos(a) * 88,
      sin(a) * 75,
      5
    );
  }

  pop();
}


// =====================================================
// 15. ALGUSTEKST
// =====================================================

function joonistaAlgusTekst() {
  push();

  let helendus = 210 + 45 * sin(frameCount * 0.06);

  noStroke();
  fill(255, 188, 88, helendus);

  textStyle(BOLD);
  textSize(35);

  text(
    "🎃 Head Halloweeni! 🎃",
    width / 2,
    67
  );

  textStyle(NORMAL);
  textSize(21);

  fill(255, 232, 210);

  text(
    "Vajuta punasele korvile!",
    width / 2,
    128
  );

  pop();
}


// =====================================================
// 16. LÕPUTEKST
// =====================================================

function joonistaLopuTekst() {
  push();

  let helendus = 215 + 40 * sin(frameCount * 0.05);

  // Läbipaistev taustapaneel
  noStroke();
  fill(30, 8, 43, 220);

  rect(
    width / 2,
    96,
    720,
    150,
    25
  );

  // Kuldne raam
  noFill();
  stroke(255, 172, 58);
  strokeWeight(3);

  rect(
    width / 2,
    96,
    710,
    140,
    22
  );

  noStroke();

  fill(255, 191, 80, helendus);
  textStyle(BOLD);
  textSize(34);

  text(
    "🎃 Head Halloweeni! 🎃",
    width / 2,
    55
  );

  fill(255, 239, 212);
  textSize(29);

  text(
    "Tagasihoidlik Halloweeni",
    width / 2,
    102
  );

  text(
    "tervitus teile!",
    width / 2,
    140
  );

  textStyle(NORMAL);

  // Taaskäivitamise juhis
  fill(255, 209, 153);
  textSize(16);

  text(
    "Vajuta korvile, et üllatust uuesti vaadata!",
    width / 2,
    625
  );

  pop();
}


// =====================================================
// 17. KONFETID JA SÄDEMED
// =====================================================

function joonistaKonfetid() {
  push();

  colorMode(HSB, 360, 100, 100, 255);
  noStroke();

  for (let k of konfetid) {
    k.y += k.kiirus;
    k.x += sin(frameCount * 0.03 + k.toon) * 0.6;

    if (k.y > height) {
      k.y = -15;
      k.x = random(width);
    }

    fill(k.toon, 85, 100, 210);

    push();
    translate(k.x, k.y);
    rotate(frameCount * 0.025 + k.toon);
    rect(0, 0, k.suurus, k.suurus * 1.5);
    pop();
  }

  pop();
}


// =====================================================
// 18. SUJUVA LIIKUMISE FUNKTSIOON
// =====================================================

function easeOutCubic(t) {
  t = constrain(t, 0, 1);
  return 1 - pow(1 - t, 3);
}


// =====================================================
// 19. ANIMATSIOONI ETAPI VAHETAMINE
// =====================================================

function alustaEtapp(uusEtapp) {
  etapp = uusEtapp;
  etapiAlgus = millis();
}


// =====================================================
// 20. HIIREGA KORVILE VAJUTAMINE
// =====================================================

function mousePressed() {
  kontrolliKorviVajutust();
}


// =====================================================
// 21. PUUTEEKRAANI TUGI
// =====================================================

function touchStarted() {
  kontrolliKorviVajutust();
  return false;
}


// =====================================================
// 22. KORVI VAJUTUSE KONTROLL
// =====================================================

function kontrolliKorviVajutust() {
  let korviSees =
    mouseX > KORVI_X - KORVI_LAIUS / 2 &&
    mouseX < KORVI_X + KORVI_LAIUS / 2 &&
    mouseY > KORVI_Y - 100 &&
    mouseY < KORVI_Y + KORVI_KORGUS / 2;

  if (korviSees) {
    // Alguses käivitab vajutus animatsiooni.
    if (etapp === 0) {
      alustaEtapp(1);
    }

    // Lõpus saab tervitust uuesti mängida.
    else if (etapp === 5) {
      alustaEtapp(1);

      // Konfetid lähevad algasendisse.
      for (let k of konfetid) {
        k.y = random(-height, 0);
        k.x = random(width);
      }
    }
  }
}

// =====================================================
// 🎃 ANIMATSIOONI LÕPP 🎃
//
// 1. Alguses on ekraanil punane punutud korv,
//    mille sees istub kass1.jpg.
//
// 2. Korvil on tekst "Kallid Ade ja Irka!"
//
// 3. Korvile vajutades lendab välja kass4.jpg.
//
// 4. Seejärel veereb välja kass2.jpg ja
//    koos temaga hõljub kummitus kass3.jpg.
//
// 5. Animatsioon peatub kaheks sekundiks.
//
// 6. Kass4.jpg lendab uuesti korvist välja.
//
// 7. Ilmuvad konfetid ja tekst:
//    "Tagasihoidlik Halloweeni tervitus teile!"
//
// 8. Korvile uuesti vajutades algab kõik otsast.
//
// Kõiki animatsiooni suurusi, kiirusi ja aegu
// saab muuta koodi alguses olevate parameetritega.
// =====================================================




