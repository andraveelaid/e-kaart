
/*
  HALLOWEENI INTERAKTIIVNE E-KAART
  =================================

  Animatsioon:
  1. Hõljuv ümbrik
  2. Ümbriku raputamine
  3. Klapi avanemine
  4. Kirja väljatõusmine
  5. Konfettiplahvatus
  6. Nelja kassifoto lend nurkadesse
  7. Fotod hõljuvad
  8. Fotole vajutades hüpe ja südamed

  Pildid:
  pildid/kass1.jpg
  pildid/kass2.jpg
  pildid/kass3.jpg
  pildid/kass4.jpg
*/

// =====================================
// MUUDETAVAD PARAMEETRID
// =====================================

// Ümbrik
const UMBRIKU_LAIUS = 390;
const UMBRIKU_KORGUS = 260;
const HOLJUMISE_KORGUS = 12;
const HOLJUMISE_KIIRUS = 0.002;

// Animatsioonide kestused millisekundites
const RAPUTUSE_AEG = 650;
const KLAPI_AVAMISE_AEG = 850;
const KIRJA_VALJUMISE_AEG = 950;
const PLAHVATUSE_AEG = 450;
const FOTODE_LENNU_AEG = 1900;

// Konfetti
const KONFETI_ARV = 180;
const KONFETI_KIIRUS = 13;
const KONFETI_GRAVITATSIOON = 0.12;

// Fotod
const FOTO_LAIUS = 220;
const FOTO_KORGUS = 265;
const FOTO_AAR = 13;
const FOTO_ALUMINE_AAR = 45;
const FOTO_HOLJUMINE = 9;
const FOTO_HOLJUMISE_KIIRUS = 0.0018;
const FOTO_HUPPE_KORGUS = 35;
const FOTO_HUPPE_AEG = 600;

// Südamed
const SUDAMETE_ARV = 22;
const SUDAMETE_KIIRUS = 5;
const SUDAMETE_ELUIGA = 1100;

// Taust
const TAHTEDE_ARV = 100;
const SADEMETE_ARV = 55;

// =====================================
// GLOBAALSED MUUTUJAD
// =====================================

let fotod = [];
let konfetti = [];
let sudamed = [];
let tahed = [];
let sademed = [];

let etapp = 0;
let etapiAlgus = 0;

let umbrikuNupp;
let juhis;

let paigutusSkaala = 1;

// Etapid:
// 0 = suletud ümbrik
// 1 = raputamine
// 2 = klapi avamine
// 3 = kirja väljatõusmine
// 4 = plahvatus
// 5 = fotode lend
// 6 = fotod hõljuvad

// =====================================
// PILTIDE LAADIMINE
// =====================================

function preload() {
  for (let i = 1; i <= 4; i++) {
    let foto = {
      pilt: null,
      laaditud: false,
      x: 0,
      y: 0,
      sihtX: 0,
      sihtY: 0,
      nurk: 0,
      sihtNurk: 0,
      faas: i * 1.4,
      hyppeAlgus: -10000
    };

    fotod.push(foto);

    const f = foto;

    f.pilt = loadImage(
      "pildid/kass" + i + ".jpg",
      () => {
        f.laaditud = true;
      },
      () => {
        f.laaditud = false;
      }
    );
  }
}

// =====================================
// SETUP
// =====================================

function setup() {
  createCanvas(windowWidth, windowHeight);

  imageMode(CENTER);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  angleMode(RADIANS);

  arvutaPaigutus();
  looTaustaelementid();

  umbrikuNupp =
    document.getElementById("avaNupp");

  juhis =
    document.getElementById("juhis");

  umbrikuNupp.addEventListener(
    "click",
    alustaAnimatsiooni
  );

  uuendaNupuAsukoht();
}

// =====================================
// PAIGUTUS
// =====================================

function arvutaPaigutus() {
  paigutusSkaala = min(
    width / 900,
    height / 650,
    1.15
  );

  // Väiksemal ekraanil paigutuvad
  // fotod nelja nurka väiksemana.
  let positsioonid = [
    [0.19, 0.25, -0.13],
    [0.81, 0.25,  0.12],
    [0.19, 0.75,  0.10],
    [0.81, 0.75, -0.12]
  ];

  for (let i = 0; i < 4; i++) {
    fotod[i].sihtX =
      width * positsioonid[i][0];

    fotod[i].sihtY =
      height * positsioonid[i][1];

    fotod[i].sihtNurk =
      positsioonid[i][2];
  }
}

function uuendaNupuAsukoht() {
  if (!umbrikuNupp) return;

  let w = UMBRIKU_LAIUS * paigutusSkaala;
  let h = UMBRIKU_KORGUS * paigutusSkaala;

  umbrikuNupp.style.width = w + "px";
  umbrikuNupp.style.height = h + "px";
  umbrikuNupp.style.left = width / 2 + "px";
  umbrikuNupp.style.top = height / 2 + "px";
  umbrikuNupp.style.transform =
    "translate(-50%, -50%)";
}

// =====================================
// TAUSTAELEMENDID
// =====================================

function looTaustaelementid() {
  tahed = [];
  sademed = [];

  for (let i = 0; i < TAHTEDE_ARV; i++) {
    tahed.push({
      x: random(1),
      y: random(1),
      suurus: random(1, 3),
      faas: random(TWO_PI)
    });
  }

  for (let i = 0; i < SADEMETE_ARV; i++) {
    sademed.push({
      x: random(1),
      y: random(1),
      suurus: random(2, 5),
      kiirus: random(0.3, 1.2),
      faas: random(TWO_PI)
    });
  }
}

// =====================================
// ANIMATSIOONI KÄIVITAMINE
// =====================================

function alustaAnimatsiooni() {
  if (etapp !== 0) return;

  etapp = 1;
  etapiAlgus = millis();

  umbrikuNupp.classList.add("peidetud");
  juhis.textContent = "";

  konfetti = [];
  sudamed = [];
}

function vahetaEtapp(uusEtapp) {
  etapp = uusEtapp;
  etapiAlgus = millis();

  if (etapp === 4) {
    tekitaKonfetti();
  }

  if (etapp === 6) {
    juhis.textContent =
      "Vajuta kassipildile – südamed lendavad!";
  }
}

// =====================================
// PEAMINE DRAW
// =====================================

function draw() {
  joonistaTaust();
  joonistaKuu();
  joonistaTahed();
  joonistaSademed();

  let aeg = millis() - etapiAlgus;

  if (etapp === 0) {
    joonistaPealkiri();

    let holjumine =
      sin(millis() * HOLJUMISE_KIIRUS) *
      HOLJUMISE_KORGUS;

    joonistaUmbrik(0, 0, holjumine);
  }

  else if (etapp === 1) {
    joonistaPealkiri();

    let raputus =
      sin(aeg * 0.09) *
      15 *
      (1 - aeg / RAPUTUSE_AEG);

    joonistaUmbrik(raputus, 0, 0);

    if (aeg >= RAPUTUSE_AEG) {
      vahetaEtapp(2);
    }
  }

  else if (etapp === 2) {
    joonistaPealkiri();

    let t = constrain(
      aeg / KLAPI_AVAMISE_AEG,
      0, 1
    );

    joonistaUmbrik(0, t, 0);

    if (aeg >= KLAPI_AVAMISE_AEG) {
      vahetaEtapp(3);
    }
  }

  else if (etapp === 3) {
    joonistaPealkiri();

    let t = constrain(
      aeg / KIRJA_VALJUMISE_AEG,
      0, 1
    );

    joonistaUmbrik(0, 1, 0, t);

    if (aeg >= KIRJA_VALJUMISE_AEG) {
      vahetaEtapp(4);
    }
  }

  else if (etapp === 4) {
    joonistaKonfetti();

    if (aeg >= PLAHVATUSE_AEG) {
      vahetaEtapp(5);
    }
  }

  else if (etapp === 5) {
    joonistaKonfetti();

    let t = constrain(
      aeg / FOTODE_LENNU_AEG,
      0, 1
    );

    joonistaLendavadFotod(t);

    if (aeg >= FOTODE_LENNU_AEG) {
      vahetaEtapp(6);
    }
  }

  else if (etapp === 6) {
    joonistaKonfetti();
    joonistaHoljuvadFotod();
    joonistaSudamed();
    joonistaLopputekst();
  }
}

// =====================================
// TÄISEKRAANI TAUST
// =====================================

function joonistaTaust() {
  background(14, 8, 35);
  noStroke();

  for (let y = 0; y < height; y += 4) {
    let t = y / height;

    fill(
      lerp(17, 65, t),
      lerp(9, 15, t),
      lerp(43, 63, t)
    );

    rect(width / 2, y, width, 4);
  }

  fill(35, 15, 40);

  ellipse(
    width / 2,
    height + 115,
    width * 1.5,
    310
  );

  fill(130, 80, 155, 24);

  ellipse(
    width * 0.25,
    height * 0.85,
    width * 0.6,
    90
  );

  ellipse(
    width * 0.75,
    height * 0.87,
    width * 0.55,
    80
  );
}

function joonistaKuu() {
  push();

  let x = width * 0.14;
  let y = height * 0.17;
  let s = 110 * paigutusSkaala;

  noStroke();

  fill(255, 195, 85, 15);
  circle(x, y, s * 1.8);

  fill(255, 198, 92, 30);
  circle(x, y, s * 1.5);

  fill(255, 215, 125);
  circle(x, y, s);

  fill(230, 177, 90, 65);
  circle(x - 18, y - 13, s * 0.17);
  circle(x + 20, y + 16, s * 0.12);

  pop();
}

function joonistaTahed() {
  noStroke();

  for (let t of tahed) {
    let heledus =
      140 +
      115 * sin(
        millis() * 0.002 + t.faas
      );

    fill(255, 225, 165, heledus);

    circle(
      t.x * width,
      t.y * height,
      t.suurus * 2
    );
  }
}

function joonistaSademed() {
  noStroke();

  for (let s of sademed) {
    let x =
      s.x * width +
      sin(millis() * 0.001 + s.faas) * 20;

    let y =
      (
        s.y * height -
        millis() * s.kiirus * 0.025 +
        height * 100
      ) % height;

    fill(255, 150, 55, 135);
    circle(x, y, s.suurus);
  }
}

// =====================================
// PEALKIRI
// =====================================

function joonistaPealkiri() {
  push();

  textFont("Caveat");
  textStyle(BOLD);
  textSize(
    min(78, width * 0.10)
  );

  fill(255, 220, 155);

  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = "#ff923d";

  text(
    "Sulle on kiri!",
    width / 2,
    height * 0.19
  );

  pop();
}

// =====================================
// ÜMBRIKU JOONISTAMINE
// =====================================

function joonistaUmbrik(
  raputus = 0,
  klapp = 0,
  holjumine = 0,
  kiri = 0
) {
  push();

  translate(
    width / 2 + raputus,
    height / 2 + holjumine
  );

  scale(paigutusSkaala);

  let w = UMBRIKU_LAIUS;
  let h = UMBRIKU_KORGUS;

  // Vari.
  noStroke();
  fill(0, 0, 0, 75);
  ellipse(0, h * 0.65, w * 1.05, 35);

  // Ümbriku tagumine osa.
  fill(130, 20, 48);
  rect(0, 0, w, h, 12);

  // Avatud klapp paikneb ümbriku taga.
  if (klapp > 0) {
    let avatus = easeOutCubic(klapp);

    fill(215, 55, 83);
    stroke(105, 15, 40);
    strokeWeight(3);

    beginShape();
    vertex(-w / 2, -h / 2);
    vertex(0, -h / 2 - h * 0.55 * avatus);
    vertex(w / 2, -h / 2);
    endShape(CLOSE);
  }

  // Väljatõusev kiri.
  if (kiri > 0) {
    let t = easeOutCubic(kiri);

    push();

    translate(0, -t * h * 0.65);

    fill(255, 244, 220);
    stroke(220, 190, 150);
    strokeWeight(2);

    rect(0, -10, w * 0.75, h * 0.78, 8);

    noStroke();
    fill(145, 40, 65);
    textFont("Caveat");
    textSize(32);

    text(
      "Kallid Ade ja Irka!",
      0,
      -30
    );

    textSize(21);
    text("Üllatus!", 0, 12);

    pop();
  }

  // Ümbriku esiosa.
  noStroke();
  fill(220, 55, 80);

  beginShape();
  vertex(-w / 2, -h / 2);
  vertex(0, h * 0.12);
  vertex(w / 2, -h / 2);
  vertex(w / 2, h / 2);
  vertex(-w / 2, h / 2);
  endShape(CLOSE);

  // Alumine kolmnurk.
  fill(240, 95, 105);

  triangle(
    -w / 2, h / 2,
    0, -h * 0.03,
    w / 2, h / 2
  );

  // Suletud klapp.
  if (klapp < 1) {
    fill(180, 35, 65);
    stroke(105, 15, 40);
    strokeWeight(3);

    let otsY =
      lerp(
        h * 0.16,
        -h / 2,
        easeOutCubic(klapp)
      );

    triangle(
      -w / 2, -h / 2,
      0, otsY,
      w / 2, -h / 2
    );
  }

  // Südamekujuline pitsat.
  if (klapp < 0.6) {
    noStroke();
    fill(255, 190, 125);
    circle(0, h * 0.10, 68);

    fill(155, 20, 55);
    textSize(36);
    text("♥", 0, h * 0.10);
  }

  pop();
}

// =====================================
// KONFETTIPLAHVATUS
// =====================================

function tekitaKonfetti() {
  konfetti = [];

  let varvid = [
    [255, 100, 120],
    [255, 195, 65],
    [180, 95, 255],
    [105, 220, 185],
    [255, 135, 55],
    [255, 245, 190]
  ];

  for (let i = 0; i < KONFETI_ARV; i++) {
    let nurk = random(TWO_PI);
    let kiirus = random(
      KONFETI_KIIRUS * 0.35,
      KONFETI_KIIRUS
    );

    konfetti.push({
      x: width / 2,
      y: height / 2,
      vx: cos(nurk) * kiirus,
      vy: sin(nurk) * kiirus,
      suurus: random(5, 13),
      poore: random(TWO_PI),
      poorkiirus: random(-0.13, 0.13),
      varv: random(varvid),
      elu: 255
    });
  }
}

function joonistaKonfetti() {
  push();
  rectMode(CENTER);
  noStroke();

  for (let i = konfetti.length - 1; i >= 0; i--) {
    let c = konfetti[i];

    c.x += c.vx;
    c.y += c.vy;

    c.vy += KONFETI_GRAVITATSIOON;
    c.vx *= 0.994;

    c.poore += c.poorkiirus;
    c.elu -= 1.2;

    push();

    translate(c.x, c.y);
    rotate(c.poore);

    fill(
      c.varv[0],
      c.varv[1],
      c.varv[2],
      max(0, c.elu)
    );

    rect(
      0, 0,
      c.suurus,
      c.suurus * 0.6,
      2
    );

    pop();

    if (c.elu <= 0) {
      konfetti.splice(i, 1);
    }
  }

  pop();
}

// =====================================
// FOTODE LEND
// =====================================

function joonistaLendavadFotod(t) {
  let e = easeOutCubic(t);

  for (let i = 0; i < fotod.length; i++) {
    let f = fotod[i];

    // Kõik pildid stardivad ümbrikust.
    let x = lerp(
      width / 2,
      f.sihtX,
      e
    );

    let y =
      lerp(
        height / 2,
        f.sihtY,
        e
      ) -
      sin(t * PI) * 140 * paigutusSkaala;

    let nurk =
      lerp(0, f.sihtNurk, e) +
      sin(t * TWO_PI) * 0.35;

    let suurus = lerp(0.15, 1, e);

    joonistaPolaroid(
      f,
      x,
      y,
      nurk,
      suurus
    );
  }
}

// =====================================
// HÕLJUVAD POLAROIDID
// =====================================

function joonistaHoljuvadFotod() {
  for (let i = 0; i < fotod.length; i++) {
    let f = fotod[i];

    let holjumine =
      sin(
        millis() * FOTO_HOLJUMISE_KIIRUS +
        f.faas
      ) * FOTO_HOLJUMINE;

    let hyppeAeg =
      millis() - f.hyppeAlgus;

    let hyppeT = constrain(
      hyppeAeg / FOTO_HUPPE_AEG,
      0, 1
    );

    let hyppeKorgus = 0;

    if (hyppeT < 1) {
      hyppeKorgus =
        sin(hyppeT * PI) *
        FOTO_HUPPE_KORGUS;
    }

    let x = f.sihtX;
    let y =
      f.sihtY +
      holjumine -
      hyppeKorgus;

    let nurk =
      f.sihtNurk +
      sin(
        millis() * 0.0015 + f.faas
      ) * 0.025;

    let suurus =
      1 +
      (hyppeT < 1
        ? sin(hyppeT * PI) * 0.12
        : 0);

    joonistaPolaroid(
      f,
      x,
      y,
      nurk,
      suurus
    );
  }
}

// =====================================
// POLAROIDFOTO JOONISTAMINE
// =====================================

function joonistaPolaroid(
  foto, x, y, nurk, suurus = 1
) {
  push();

  translate(x, y);
  rotate(nurk);

  // Mahutame fotod ka mobiiliekraanile.
  let mobiiliSkaala = min(
    1,
    width / 650,
    height / 550
  );

  scale(suurus * mobiiliSkaala);

  let w = FOTO_LAIUS;
  let h = FOTO_KORGUS;

  // Vari.
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor =
    "rgba(0,0,0,0.55)";
  drawingContext.shadowOffsetY = 12;

  noStroke();
  fill(255);
  rect(0, 0, w, h, 4);

  drawingContext.shadowBlur = 0;
  drawingContext.shadowOffsetY = 0;

  let pildiW = w - FOTO_AAR * 2;

  let pildiH =
    h -
    FOTO_AAR -
    FOTO_ALUMINE_AAR;

  let pildiY =
    -h / 2 +
    FOTO_AAR +
    pildiH / 2;

  // Foto taust.
  fill(230, 210, 220);
  rect(
    0,
    pildiY,
    pildiW,
    pildiH
  );

  if (
    foto.laaditud &&
    foto.pilt &&
    foto.pilt.width > 0
  ) {
    // Pildi täitmine ilma moonutamiseta.
    let img = foto.pilt;

    let pildiSuhe = img.width / img.height;
    let raamiSuhe = pildiW / pildiH;

    let sx = 0;
    let sy = 0;
    let sw = img.width;
    let sh = img.height;

    if (pildiSuhe > raamiSuhe) {
      sw = img.height * raamiSuhe;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / raamiSuhe;
      sy = (img.height - sh) / 2;
    }

    imageMode(CORNER);

    image(
      img,
      -pildiW / 2,
      pildiY - pildiH / 2,
      pildiW,
      pildiH,
      sx, sy, sw, sh
    );

    imageMode(CENTER);
  } else {
    fill(120, 70, 90);
    textSize(55);
    text("🐈", 0, pildiY);
  }

  // Polaroidi alumine tekst.
  fill(105, 55, 70);
  textFont("Caveat");
  textSize(26);

  let number = fotod.indexOf(foto) + 1;

  text(
    "Kassike " + number + " ♥",
    0,
    h / 2 - 22
  );

  pop();
}

// =====================================
// FOTOLE VAJUTAMINE
// =====================================

function kontrolliFotoVajutust(px, py) {
  if (etapp !== 6) return;

  let mobiiliSkaala = min(
    1,
    width / 650,
    height / 550
  );

  // Kontrollime pealmisest fotost alates.
  for (let i = fotod.length - 1; i >= 0; i--) {
    let f = fotod[i];

    let holjumine =
      sin(
        millis() * FOTO_HOLJUMISE_KIIRUS +
        f.faas
      ) * FOTO_HOLJUMINE;

    let x = f.sihtX;
    let y = f.sihtY + holjumine;

    let nurk =
      f.sihtNurk +
      sin(
        millis() * 0.0015 + f.faas
      ) * 0.025;

    // Teisendame kliki pööratud foto
    // kohalikku koordinaatsüsteemi.
    let dx = px - x;
    let dy = py - y;

    let kohalikX =
      dx * cos(nurk) + dy * sin(nurk);

    let kohalikY =
      -dx * sin(nurk) + dy * cos(nurk);

    let w = FOTO_LAIUS * mobiiliSkaala;
    let h = FOTO_KORGUS * mobiiliSkaala;

    if (
      abs(kohalikX) <= w / 2 &&
      abs(kohalikY) <= h / 2
    ) {
      f.hyppeAlgus = millis();

      tekitaSudamed(x, y);

      return;
    }
  }
}

// =====================================
// SÜDAMETE TEKITAMINE
// =====================================

function tekitaSudamed(x, y) {
  for (let i = 0; i < SUDAMETE_ARV; i++) {
    let nurk = random(TWO_PI);
    let kiirus = random(
      1.5,
      SUDAMETE_KIIRUS
    );

    sudamed.push({
      x: x,
      y: y,
      vx: cos(nurk) * kiirus,
      vy: sin(nurk) * kiirus - 2,
      suurus: random(10, 25),
      elu: SUDAMETE_ELUIGA,
      poore: random(-0.4, 0.4),
      varv: random([
        [255, 80, 120],
        [255, 130, 160],
        [255, 190, 205],
        [255, 95, 85]
      ])
    });
  }
}

// =====================================
// SÜDAMETE ANIMATSIOON
// =====================================

function joonistaSudamed() {
  for (let i = sudamed.length - 1; i >= 0; i--) {
    let s = sudamed[i];

    s.x += s.vx;
    s.y += s.vy;

    s.vy += 0.035;
    s.vx *= 0.99;

    s.elu -= deltaTime;

    let alpha = map(
      s.elu,
      0,
      SUDAMETE_ELUIGA,
      0,
      255,
      true
    );

    push();

    translate(s.x, s.y);
    rotate(s.poore);

    fill(
      s.varv[0],
      s.varv[1],
      s.varv[2],
      alpha
    );

    noStroke();
    joonistaSuda(0, 0, s.suurus);

    pop();

    if (s.elu <= 0) {
      sudamed.splice(i, 1);
    }
  }
}

function joonistaSuda(x, y, s) {
  push();

  translate(x, y);
  scale(s / 30);

  beginShape();

  vertex(0, 10);

  bezierVertex(
    -25, -5,
    -15, -22,
    0, -10
  );

  bezierVertex(
    15, -22,
    25, -5,
    0, 10
  );

  endShape(CLOSE);

  pop();
}

// =====================================
// LÕPUTEKST
// =====================================

function joonistaLopputekst() {
  push();

  textFont("Caveat");
  textStyle(BOLD);

  let suurus = min(
    55,
    width * 0.07,
    height * 0.09
  );

  textSize(suurus);
  fill(255, 220, 150);

  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = "#ff8035";

  text(
    "Kallid Ade ja Irka!",
    width / 2,
    height * 0.46
  );

  textSize(suurus * 0.75);

  text(
    "Tagasihoidlik Halloweeni",
    width / 2,
    height * 0.53
  );

  text(
    "tervitus teile! ♥",
    width / 2,
    height * 0.59
  );

  pop();
}

// =====================================
// HIIR JA PUUDUTUSED
// =====================================

function mousePressed() {
  kontrolliFotoVajutust(
    mouseX,
    mouseY
  );
}

function touchStarted() {
  // Puudutuse käsitleb p5.js mousePressed
  // ühilduvuskiht, vältides topeltkäivitust.
  return true;
}

// =====================================
// AKNA SUURUSE MUUTMINE
// =====================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  arvutaPaigutus();
  uuendaNupuAsukoht();
}

// =====================================
// SUJUV LIIKUMINE
// =====================================

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}
