import { useState, useMemo, useEffect, useCallback, useRef, memo, createContext, useContext } from "react";

// Daftar nama quest.
// Awalan "*" = wajib untuk membuka quest Urgent, "!" = quest Urgent.
// Detail setelah "|": hadiah|kontrak|menit|area|tujuan (hanya terisi untuk Desa ★1 dan ★2).
const DESA = [
  ["*Mountain Herb Picking|300|0|50|Pegunungan Salju (Siang)|Serahkan 5 Herba Gunung", "An Anteka in the Snow|300|0|50|Pegunungan Salju (Siang)|Serahkan 3 Tanduk Anteka", "*Hunt the Carnivore!|300|0|50|Pegunungan Salju (Siang)|Kalahkan 5 Giaprey", "*Sinking Feeling|300|0|20|Pegunungan Salju (Malam)|Serahkan 3 Lidah Popo", "*Slay the Blangos!|300|0|50|Pegunungan Salju (Malam)|Kalahkan 3 Blango", "!The Carnivorous Leader|900|150|50|Pegunungan Salju (Siang)|Buru Giadrome"],
  ["Gathering - Snowy Mountains|12|0|50|Pegunungan Salju (Siang)|Bertahan sampai waktu habis atau serahkan Paw Pass", "Gathering - Jungle|12|0|50|Hutan Rimba (Siang)|Bertahan sampai waktu habis atau serahkan Paw Pass", "Gathering - Desert|12|0|50|Gurun (Siang)|Bertahan sampai waktu habis atau serahkan Paw Pass", "*Reckless Bulldrome Hunter|1200|200|50|Pegunungan Salju (Siang)|Buru Bulldrome", "Slay the Giaprey!|900|150|50|Pegunungan Salju (Siang)|Kalahkan 20 Giaprey", "The Pack of Blangos|900|150|50|Pegunungan Salju (Malam)|Kalahkan 5 Blango", "The Taboo of Negligence!|900|150|20|Pegunungan Salju (Malam)|Serahkan 15 Herba Gunung", "Hunt Down the Velocidrome!|900|150|50|Hutan Rimba (Siang)|Buru Velocidrome", "*Jungle Menace|1500|250|50|Hutan Rimba (Malam)|Buru Yian Kut-Ku", "*Rarest of the Rare Beasts|1500|250|50|Hutan Rimba (Malam)|Buru Congalala", "Hunt the Rare Forest Congas!|900|150|50|Hutan Rimba (Siang)|Kalahkan 10 Conga", "Attack of the Giant Bugs!|900|150|50|Hutan Rimba (Siang)|Kalahkan 20 Vespoid", "Collect to Combine|900|150|50|Hutan Rimba (Siang)|Serahkan 10 Jamur Spesial", "Hunt the Gendrome!|900|150|50|Gurun (Siang)|Buru Gendrome", "The Land Shark|1200|200|50|Gurun (Siang)|Buru Cephadrome", "*Liver of Legend!|1200|200|50|Gurun (Siang)|Serahkan 3 Hati Piscine", "Gone Fishin'|900|150|50|Gurun (Siang)|Serahkan 2 Ikan Emas", "!Shadow in the Snow|2100|350|50|Pegunungan Salju (Siang)|Buru Khezu"],
  ["Gathering - Swamp Zone|12|0|50|Rawa (Siang)|Bertahan sampai waktu habis atau serahkan Paw Pass", "Gathering - Forest and Hills|12|0|50|Hutan dan Bukit (Siang)|Bertahan sampai waktu habis atau serahkan Paw Pass", "The Subterranean Glutton|1200|200|50|Pegunungan Salju (Malam)|Serahkan 3 Anak Khezu", "*Blango Slaying Tactics|900|150|50|Pegunungan Salju (Malam)|Kalahkan 10 Blango", "Aim for the Jungle Crab|1800|300|50|Hutan Rimba (Malam)|Buru Daimyo Hermitaur", "Master of the Giant Lake|2400|400|50|Hutan Rimba (Malam)|Buru Green Plesioth", "A Swarm of Hermitaurs|900|150|50|Hutan Rimba (Siang)|Kalahkan 10 Hermitaur", "The Purple Poison Menace|2100|350|50|Hutan Rimba (Malam)|Buru Purple Gypceros", "*The Lurking Desert Giant|1800|300|50|Gurun (Siang)|Buru Daimyo Hermitaur", "Water Wyvern in the Desert|2100|350|50|Gurun (Siang)|Buru Plesioth", "Slay the Genprey!|900|150|50|Gurun (Siang)|Kalahkan 20 Genprey", "*Gypceros: Venomous Terror|1800|300|50|Rawa (Malam)|Buru Gypceros", "Attack of the Blue Kut-Ku|1800|300|50|Rawa (Malam)|Buru Blue Yian Kut-Ku", "The Mischief-Maker", "Fang of the Iodrome!", "Slay the Great Kut-Ku!", "*A Killing from Mushrooms", "!The Ruler of the Snow"],
  ["Gathering - Volcano Zone", "Red Shadow on the Swamp", "The Lone Black Garuga", "Twin Velocidrome", "Attack of the Giant Bugs!", "*Battle Of the Blos", "The Silver Horn", "Supreme Ruler of the Swamp", "Trapped by Yian Kut-Ku", "The Ioprey Leader", "*Basarios: Unseen Peril", "*Commander in the Flames", "Ioprey Hunting", "A Band of Ceanataurs", "*More Coal Please", "The Frozen Dictator", "The Elder Dragon of Wind", "!Absolute Power"],
  ["The Legendary Kirin", "Two Roars in the Snow", "*The Poison Seige", "The Tigrex's Roar", "*The Runaway Diablos", "The Fierce Black Horn", "*Ultimate Crab Dinner", "Black Rock in the Swamp", "Seeking the Strange Mask", "*Terror of the Gravios", "Check the Ancient Tower", "Overseer of the Ancients", "The Empress' Blazing Throne", "The Elder Dragon of Mist", "Towards the Silence", "!A Troublesome Pair"],
  ["Dual Plesioth", "Pink Dance in the Jungle", "Four Horns", "A Sun with Fangs", "Emperor of Flame", "The Shogun's Encampment", "Attack of the Rathalos", "A State of Crisis!", "The Final Invitation"],
];
const GUILD = [
  ["A True Foe - The Giadrome", "Reckless Bulldrome Hunter", "A Pack of Blangos", "Mountain Herb Picking", "Rarest of the Rare Beasts", "Hunt the Forest Congas", "A Mushroom Goldrush", "The Land Shark", "The Giant Enemy Crab", "The Lady Gourmet"],
  ["The Shadow in the Mountains", "The King of the Mountains", "A Swarm of Hermitaurs", "Water Wyvern in the Desert", "Gypceros: Venomous Terror", "Supreme Ruler of the Swamp", "Slay the Great Kut-Ku", "Hunt the Rathalos", "Attack of the Rathian"],
  ["Gathering - Snowy Mountains", "Gathering - Jungle", "Gathering - Desert", "*Giadrome Assault", "The Mountain Roughrider", "Slay the Giaprey", "Find the Mountain Herbs", "Hunt Down the Velocidrome", "Blue Menace of the Jungle", "Cunning Raiders", "Attack of the Giant Bugs", "The Mushroom Hunt", "Panning for Goldenfish", "Hunt the Gendrome", "*The Land Shark", "*The Lurking Desert Giant", "Slay the Genprey", "Liver of Legend", "Gone Fishin'", "Attack of the Yian Kut-Ku", "Charge... Charge... Charge!", "*The Mischief Maker", "!The Ruler of the Snow"],
  ["Gathering - Swamp", "Gathering - Forest and Hills", "Gathering - Volcano", "*The Shadow in the Cave", "Red Shadow in the Cave", "Blango Hunting Tactics", "The Subterranean Glutton", "*Master of the Giant Lake", "The Pink Fur Party", "The Hidden Jungle Clouds", "*Evening Hermitaur Sonata", "*Pincer Through the Sky", "Chase the Poison Gypceros", "*Trouble in the Forest", "Seeking the Strange Mask", "*The Ioprey Leader", "Commander in the Flames", "Basarios: Unseen Peril", "A Band of Ceanataurs", "Great Ore Discovery", "!Absolute Power"],
  ["Tigrex Roar", "*The Runaway Diablos", "The Fierce Black Horn", "*Valor in the Swamp", "Terror of the Gravios", "*The King's Domain", "Attack of the Rathalos", "*The Queen's Descent", "The Cherry Blossom Rathian", "The Legendary Kirin", "The Red And Green Wyverns", "Attack of the Wind Dragon", "The Emperor of Flame", "A Sun with Fangs", "Towards the Silence", "!The Approaching Gaoren"],
  ["Gathering - Snowy Mountains", "Gathering - Jungle", "Gathering - Desert", "A True Foe - The Giadrome", "Reckless Bulldrome Hunter", "Flanked by Velocidrome", "Aim for the Jungle Crab", "*The Poisoned Fanged Duo", "Pursuit of the Sand Wyvern", "*Ultimate Crab Dinner", "*Trapped by Yian Kut-Ku", "*Conga Counterattack!", "!Lao Shan-Lung Draws Near"],
  ["Gathering - Swamp", "Gathering - Forest and Hills", "Gathering - Volcano", "*Two Roars in the Snow", "The King of the Mountains", "The Electrified Wyvern", "*Red Shadow on the Swamp", "The Poison Gas", "Dual Plesioth", "Attack of the Rathian", "Water Wyvern in the Desert", "*The Underwater Terror", "An Evening Soaked in Poison", "Supreme Rule of the Swamp", "The Purple Poison Menace", "*Slay the Rathalos!", "The Shogun's Encampment", "*Basarios: Unseen Peril", "Envoy to Disaster", "The Meeting of the Blangogas'", "!Land of the Tremors"],
  ["The Rajang in the Snow", "The Tigrex Roar", "Pink Dance in the Jungle", "The Runaway Diablos", "*The Fierce Black Horn", "Four Horns", "Rajang in the Mountain Flames", "Terror of the Gravios", "*Black Rock in the Swamp", "A Troublesome Pair", "*Blue Sky, Pink Earth", "Attack of the Rathalos", "*Deny the Silver Rathalos", "*Find the Golden Rathian", "The Fleeting Shadow", "The Frozen Dictator", "Emperor of Flame", "The War of Immolation", "Towards the Silence", "!The Approaching Gaoren", "!Rise to the Summit"],
];

const QUEST = [];
[["desa", DESA], ["guild", GUILD]].forEach(([tipe, lv]) =>
  lv.forEach((arr, i) =>
    arr.forEach((s) => {
      const f = s.split("|");
      let n = f[0];
      const flag = n[0] === "*" || n[0] === "!" ? n[0] : "";
      if (flag) n = n.slice(1);
      QUEST.push({
        id: QUEST.length, tipe, bintang: i + 1, nama: n, wajib: flag === "*", urgent: flag === "!",
        d: f.length > 1 ? { hadiah: f[1], kontrak: f[2], waktu: f[3], area: f[4], tujuan: f[5] } : null,
      });
    })
  )
);


// Detail quest Guild (hadiah, kontrak, menit, area, tujuan).
// Format baris: level|nama|hadiah|kontrak|menit|area.waktu|tujuan   (waktu: s=siang, m=malam)
const AREA = { sm: "Pegunungan Salju", hr: "Hutan Rimba", gu: "Gurun", rw: "Rawa", hb: "Hutan dan Bukit", gb: "Gunung Berapi", bt: "Benteng", kt: "Kota" };
const DG_RAW = `1|A True Foe - The Giadrome|1200|100|50|sm.s|Buru Giadrome
1|Reckless Bulldrome Hunter|1500|100|50|sm.m|Buru Bulldrome
1|A Pack of Blangos|900|100|50|sm.s|Kalahkan 15 Blango
1|Mountain Herb Picking|900|100|50|sm.s|Serahkan 20 Herba Gunung
1|Rarest of the Rare Beasts|1800|150|50|hr.m|Buru Congalala
1|Hunt the Forest Congas|900|100|50|hr.s|Kalahkan 15 Conga
1|A Mushroom Goldrush|900|150|50|hr.s|Serahkan 20 Jamur Spesial
1|The Land Shark|1800|150|50|gu.m|Buru Cephadrome
1|The Giant Enemy Crab|2100|180|50|gu.s|Buru Daimyo Hermitaur
1|The Lady Gourmet|900|100|50|gu.s|Serahkan 8 Hati Piscine
2|The Shadow in the Mountains|2100|180|50|sm.m|Buru Khezu
2|The King of the Mountains|2400|200|50|sm.s|Buru Blangonga
2|A Swarm of Hermitaurs|900|100|50|hr.s|Kalahkan 10 Hermitaur
2|Water Wyvern in the Desert|2400|200|50|gu.s|Buru Plesioth
2|Gypceros: Venomous Terror|2100|180|50|rw.s|Buru Gypceros
2|Supreme Ruler of the Swamp|2700|220|50|rw.m|Buru Shogun Ceanataur
2|Slay the Great Kut-Ku|2100|180|50|hb|Buru Yian Kut-Ku
2|Hunt the Rathalos|3000|250|50|hb|Buru Rathalos (syarat: selesaikan Shadow in the Snow)
2|Attack of the Rathian|3000|250|50|hr.s|Buru Rathian (syarat: selesaikan Shadow in the Snow)
3|Gathering - Snowy Mountains|12|0|50|sm.s|Bertahan sampai waktu habis atau serahkan Paw Pass
3|Gathering - Jungle|12|0|50|hr.s|Bertahan sampai waktu habis atau serahkan Paw Pass
3|Gathering - Desert|12|0|50|gu.s|Bertahan sampai waktu habis atau serahkan Paw Pass
3|Giadrome Assault|2400|200|50|sm.m|Buru Giadrome
3|The Mountain Roughrider|2700|220|50|sm.s|Buru Bulldrome
3|Slay the Giaprey|2100|150|50|sm.s|Kalahkan 20 Giaprey
3|Find the Mountain Herbs|2100|150|50|sm.m|Kumpulkan 20 Herba Gunung
3|Hunt Down the Velocidrome|2400|200|50|hr.m|Buru Velocidrome
3|Blue Menace of the Jungle|3600|300|50|hr.s|Buru Blue Yian Kut-Ku (syarat: selesaikan Attack of the Yian Kut-Ku)
3|Cunning Raiders|2100|150|50|hr.m|Kalahkan 20 Velociprey
3|Attack of the Giant Bugs|2100|150|50|hr.m|Kalahkan 50 Vespoid
3|The Mushroom Hunt|2100|150|50|hr.m|Kumpulkan 20 Jamur Spesial
3|Panning for Goldenfish|2100|150|50|hr.s|Kumpulkan 3 Ikan Emas
3|Hunt the Gendrome|2400|200|50|gu.s|Buru Gendrome
3|The Land Shark|2700|220|50|gu.m|Buru Cephadrome
3|The Lurking Desert Giant|4200|350|50|gu.s|Buru Daimyo Hermitaur
3|Slay the Genprey|2100|150|50|gu.s|Kalahkan 20 Genprey
3|Liver of Legend|2100|150|50|gu.s|Serahkan 10 Hati Piscine
3|Gone Fishin'|2100|150|150|gu.s|Serahkan 3 Ikan Emas
3|Attack of the Yian Kut-Ku|3000|250|50|rw.s|Buru Yian Kut-Ku
3|Charge... Charge... Charge!|2700|220|50|rw.s|Buru Bulldrome
3|The Mischief Maker|4200|350|50|rw.m|Buru Congalala
3|The Ruler of the Snow|6000|500|50|sm.m|Buru Blangonga (membuka ★4)
4|Gathering - Swamp|12|0|50|rw.s|Bertahan sampai waktu habis atau serahkan Paw Pass
4|Gathering - Forest and Hills|12|0|50|hb|Bertahan sampai waktu habis atau serahkan Paw Pass
4|Gathering - Volcano|12|0|50|gb.s|Bertahan sampai waktu habis atau serahkan Paw Pass
4|The Shadow in the Cave|5400|450|50|rw.m|Buru Khezu
4|Red Shadow in the Cave|5400|450|50|sm.s|Buru Red Khezu (syarat: selesaikan The Shadow in the Cave)
4|Blango Hunting Tactics|3000|250|50|sm.s|Kalahkan 20 Blango
4|The Subterranean Glutton|3000|250|50|sm.m|Serahkan 5 Anak Khezu
4|Master of the Giant Lake|5400|450|50|hr.m|Buru Plesioth
4|The Pink Fur Party|3000|250|50|hr.s|Kalahkan 20 Conga
4|The Hidden Jungle Clouds|3000|250|50|hr.m|Kalahkan 50 Hornetaur
4|Evening Hermitaur Sonata|3000|250|50|gu.m|Kalahkan 20 Hermitaur
4|Pincer Through the Sky|6000|500|50|rw.s|Buru Shogun Ceanataur
4|Chase the Poison Gypceros|4800|400|50|rw.s|Buru Gypceros
4|Trouble in the Forest|4200|350|50|hb|Kalahkan 20 Bullfango
4|Seeking the Strange Mask|3000|250|50|hb|Kalahkan 10 Shakalaka
4|The Ioprey Leader|4200|350|50|gb.m|Buru Iodrome
4|Commander in the Flames|6000|500|50|gb.m|Buru Shogun Ceanataur
4|Basarios: Unseen Peril|2700|220|50|gb.m|Buru Basarios
4|A Band of Ceanataurs|3000|250|50|gb.s|Kalahkan 20 Ceanataur
4|Great Ore Discovery|3000|250|50|gb.s|Serahkan 20 Batu Bara
4|Absolute Power|6600|550|50|sm.s|Buru Tigrex (membuka ★5)
5|Tigrex Roar|6600|550|50|gu.s|Buru Tigrex
5|The Runaway Diablos|6000|600|50|gu.s|Buru Diablos
5|The Fierce Black Horn|6600|550|50|gu.m|Buru Black Diablos (syarat: selesaikan The Runaway Diablos)
5|Valor in the Swamp|6000|500|50|rw.s|Buru Gravios
5|Terror of the Gravios|6600|550|50|gb.m|Buru Black Gravios (syarat: selesaikan Valor in the Swamp)
5|The King's Domain|6000|500|50|hb|Buru Rathalos
5|Attack of the Rathalos|6600|550|50|hb|Buru Azure Rathalos (syarat: selesaikan The King's Domain)
5|The Queen's Descent|5400|450|50|hr.s|Buru Rathian
5|The Cherry Blossom Rathian|6000|500|50|hr.m|Buru Pink Rathian (syarat: selesaikan The Queen's Descent)
5|The Legendary Kirin|6600|550|50|sm.m|Kalahkan Kirin
5|The Red And Green Wyverns|8100|700|50|hb|Buru Rathalos dan Rathian
5|Attack of the Wind Dragon|8100|700|50|kt|Kalahkan Kushala Daora
5|The Emperor of Flame|9000|750|50|gb.m|Kalahkan Teostra
5|A Sun with Fangs|9000|750|50|gu.s|Kalahkan Teostra
5|Towards the Silence|8100|700|50|rw.s|Kalahkan Chameleos
5|The Approaching Gaoren|12000|1000|35|bt|Pertahankan benteng dari Shen Gaoren (membuka ★6)
6|Gathering - Snowy Mountains|12|0|50|sm.m|Bertahan sampai waktu habis atau serahkan Paw Pass
6|Gathering - Jungle|12|0|50|hr.m|Bertahan sampai waktu habis atau serahkan Paw Pass
6|Gathering - Desert|12|0|50|gu.m|Bertahan sampai waktu habis atau serahkan Paw Pass
6|A True Foe - The Giadrome|4200|350|50|sm.m|Buru Giadrome
6|Reckless Bulldrome Hunter|4800|400|50|sm.m|Buru Bulldrome
6|Flanked by Velocidrome|5100|420|50|hr.s|Buru 2 Velocidrome
6|Aim for the Jungle Crab|5100|420|50|hr.m|Buru Daimyo Hermitaur
6|The Poisoned Fanged Duo|5100|420|50|gu.s|Buru 2 Gendrome
6|Pursuit of the Sand Wyvern|4800|400|50|gu.s|Buru Cephadrome
6|Ultimate Crab Dinner|8100|620|50|gu.s|Buru 2 Daimyo Hermitaur
6|Trapped by Yian Kut-Ku|7200|600|50|rw.m|Buru Yian Kut-Ku dan Blue Yian Kut-Ku
6|Conga Counterattack!|5100|420|50|rw.m|Buru Congalala
6|Lao Shan-Lung Draws Near|24000|2000|35|bt|Pertahankan benteng dari Lao-Shan Lung (membuka ★7)
7|Gathering - Swamp|12|0|50|rw.m|Bertahan sampai waktu habis atau serahkan Paw Pass
7|Gathering - Forest and Hills|12|0|50|hb|Bertahan sampai waktu habis atau serahkan Paw Pass
7|Gathering - Volcano|12|0|50|gb.m|Bertahan sampai waktu habis atau serahkan Paw Pass
7|Two Roars in the Snow|12000|1000|50|sm.m|Buru 2 Blangonga
7|The King of the Mountains|7500|620|50|sm.s|Buru Blangonga
7|The Electrified Wyvern|6900|520|50|sm.m|Buru Khezu
7|Red Shadow on the Swamp|7500|620|50|rw.s|Buru Red Khezu
7|The Poison Gas|9000|750|50|hr.m|Buru Gypceros dan Purple Gypceros
7|Dual Plesioth|10500|870|50|hr.s|Buru Plesioth dan Green Plesioth
7|Attack of the Rathian|7500|620|50|hr.m|Buru Rathian
7|Water Wyvern in the Desert|6900|570|50|gu.s|Buru Plesioth
7|The Underwater Terror|7500|620|50|gu.s|Buru Green Plesioth
7|An Evening Soaked in Poison|6000|500|50|rw.m|Buru Iodrome
7|Supreme Rule of the Swamp|7500|620|50|rw.s|Buru Shogun Ceanataur
7|The Purple Poison Menace|6600|550|50|rw.s|Buru Purple Gypceros
7|Slay the Rathalos!|8100|670|50|hb|Buru Rathalos
7|The Shogun's Encampment|12000|1000|50|gb.s|Buru 2 Shogun Ceanataur
7|Basarios: Unseen Peril|6900|570|50|gb.s|Buru Basarios
7|Envoy to Disaster|6000|500|50|gb.m|Kalahkan 20 Remobra
7|The Meeting of the Blangogas'|8100|670|50|sm.m|Bertahan sampai waktu habis atau serahkan Paw Pass (wajib kalahkan min. 2 Blangonga)
7|Land of the Tremors|15000|1250|50|sm.m|Buru 2 Tigrex (membuka ★8)
8|The Rajang in the Snow|9000|750|50|sm.s|Buru Rajang
8|The Tigrex Roar|8100|670|50|gu.s|Buru Tigrex
8|Pink Dance in the Jungle|8100|670|50|hr.s|Buru Pink Rathian
8|The Runaway Diablos|8100|670|50|gu.s|Buru Diablos
8|The Fierce Black Horn|9000|750|50|gu.s|Buru Black Diablos
8|Four Horns|15000|1250|50|gu.m|Buru Diablos dan Black Diablos
8|Rajang in the Mountain Flames|9000|750|50|gb.m|Buru Rajang
8|Terror of the Gravios|8100|670|50|gb.s|Buru Gravios
8|Black Rock in the Swamp|9000|750|50|rw.m|Buru Black Gravios
8|A Troublesome Pair|15000|1250|50|hb|Buru Rathalos dan Rathian
8|Blue Sky, Pink Earth|18000|1500|50|hb|Buru Azure Rathalos dan Pink Rathian
8|Attack of the Rathalos|9000|750|50|hb|Buru Azure Rathalos`;
const DG = {};
DG_RAW.split("\n").forEach((l) => {
  const [lv, nama, hadiah, kontrak, waktu, ar, tujuan] = l.split("|");
  const [kode, w] = ar.split(".");
  DG[`${lv}|${nama}`] = { hadiah, kontrak, waktu, tujuan, area: AREA[kode] + (w === "s" ? " (Siang)" : w === "m" ? " (Malam)" : "") };
});
QUEST.forEach((q) => { if (q.tipe === "guild" && !q.d) q.d = DG[`${q.bintang}|${q.nama}`] || null; });

// Terjemahan nama quest (kunci = nama asli di game).
const ID = {
  "Mountain Herb Picking": "Memetik Herba Gunung", "An Anteka in the Snow": "Anteka di Tengah Salju", "Hunt the Carnivore!": "Buru Si Karnivora!", "Sinking Feeling": "Firasat Buruk", "Slay the Blangos!": "Basmi Para Blango!", "The Carnivorous Leader": "Pemimpin Karnivora",
  "Gathering - Snowy Mountains": "Pengumpulan - Pegunungan Salju", "Gathering - Jungle": "Pengumpulan - Hutan Rimba", "Gathering - Desert": "Pengumpulan - Gurun", "Reckless Bulldrome Hunter": "Pemburu Bulldrome Nekat", "Slay the Giaprey!": "Basmi Para Giaprey!", "The Pack of Blangos": "Kawanan Blango", "The Taboo of Negligence!": "Pantangan Kelalaian!", "Hunt Down the Velocidrome!": "Kejar Velocidrome!", "Jungle Menace": "Teror Hutan Rimba", "Rarest of the Rare Beasts": "Makhluk Paling Langka", "Hunt the Rare Forest Congas!": "Buru Conga Hutan yang Langka!", "Attack of the Giant Bugs!": "Serangan Serangga Raksasa!", "Collect to Combine": "Kumpulkan untuk Diramu", "Hunt the Gendrome!": "Buru Gendrome!", "The Land Shark": "Hiu Darat", "Liver of Legend!": "Hati Legenda!", "Gone Fishin'": "Pergi Memancing", "Shadow in the Snow": "Bayangan di Salju",
  "Gathering - Swamp Zone": "Pengumpulan - Zona Rawa", "Gathering - Forest and Hills": "Pengumpulan - Hutan dan Bukit", "The Subterranean Glutton": "Si Rakus Bawah Tanah", "Blango Slaying Tactics": "Taktik Membasmi Blango", "Aim for the Jungle Crab": "Incar Kepiting Rimba", "Master of the Giant Lake": "Penguasa Danau Raksasa", "A Swarm of Hermitaurs": "Segerombolan Hermitaur", "The Purple Poison Menace": "Ancaman Racun Ungu", "The Lurking Desert Giant": "Raksasa Gurun yang Mengintai", "Water Wyvern in the Desert": "Wyvern Air di Gurun", "Slay the Genprey!": "Basmi Para Genprey!", "Gypceros: Venomous Terror": "Gypceros: Teror Berbisa", "Attack of the Blue Kut-Ku": "Serangan Kut-Ku Biru", "The Mischief-Maker": "Si Pembuat Onar", "Fang of the Iodrome!": "Taring Iodrome!", "Slay the Great Kut-Ku!": "Tumbangkan Kut-Ku Agung!", "A Killing from Mushrooms": "Untung Besar dari Jamur", "The Ruler of the Snow": "Penguasa Salju",
  "Gathering - Volcano Zone": "Pengumpulan - Zona Gunung Berapi", "Red Shadow on the Swamp": "Bayangan Merah di Rawa", "The Lone Black Garuga": "Garuga Hitam Penyendiri", "Twin Velocidrome": "Velocidrome Kembar", "Battle Of the Blos": "Pertempuran Para Blos", "The Silver Horn": "Tanduk Perak", "Supreme Ruler of the Swamp": "Penguasa Tertinggi Rawa", "Trapped by Yian Kut-Ku": "Terjebak Yian Kut-Ku", "The Ioprey Leader": "Pemimpin Ioprey", "Basarios: Unseen Peril": "Basarios: Bahaya Tak Terlihat", "Commander in the Flames": "Komandan dalam Kobaran Api", "Ioprey Hunting": "Perburuan Ioprey", "A Band of Ceanataurs": "Gerombolan Ceanataur", "More Coal Please": "Tambah Batu Bara", "The Frozen Dictator": "Diktator Beku", "The Elder Dragon of Wind": "Naga Tua Angin", "Absolute Power": "Kekuatan Mutlak",
  "The Legendary Kirin": "Kirin Legendaris", "Two Roars in the Snow": "Dua Raungan di Salju", "The Poison Seige": "Pengepungan Racun", "The Tigrex's Roar": "Raungan Tigrex", "The Runaway Diablos": "Diablos yang Mengamuk", "The Fierce Black Horn": "Tanduk Hitam yang Ganas", "Ultimate Crab Dinner": "Santapan Kepiting Pamungkas", "Black Rock in the Swamp": "Batu Hitam di Rawa", "Seeking the Strange Mask": "Mencari Topeng Aneh", "Terror of the Gravios": "Teror Gravios", "Check the Ancient Tower": "Periksa Menara Kuno", "Overseer of the Ancients": "Pengawas Zaman Kuno", "The Empress' Blazing Throne": "Takhta Permaisuri yang Membara", "The Elder Dragon of Mist": "Naga Tua Kabut", "Towards the Silence": "Menuju Keheningan", "A Troublesome Pair": "Sepasang Pembuat Masalah",
  "Dual Plesioth": "Plesioth Ganda", "Pink Dance in the Jungle": "Tarian Merah Muda di Hutan", "Four Horns": "Empat Tanduk", "A Sun with Fangs": "Matahari Bertaring", "Emperor of Flame": "Kaisar Api", "The Shogun's Encampment": "Perkemahan Shogun", "Attack of the Rathalos": "Serangan Rathalos", "A State of Crisis!": "Keadaan Darurat!", "The Final Invitation": "Undangan Terakhir",
  "A True Foe - The Giadrome": "Lawan Sejati - Giadrome", "A Pack of Blangos": "Kawanan Blango", "Hunt the Forest Congas": "Buru Conga Hutan", "A Mushroom Goldrush": "Demam Emas Jamur", "The Giant Enemy Crab": "Kepiting Raksasa Musuh", "The Lady Gourmet": "Nyonya Gourmet", "The Shadow in the Mountains": "Bayangan di Pegunungan", "The King of the Mountains": "Raja Pegunungan", "Slay the Great Kut-Ku": "Tumbangkan Kut-Ku Agung", "Hunt the Rathalos": "Buru Rathalos", "Attack of the Rathian": "Serangan Rathian",
  "Giadrome Assault": "Serbuan Giadrome", "The Mountain Roughrider": "Penunggang Liar Gunung", "Slay the Giaprey": "Basmi Para Giaprey", "Find the Mountain Herbs": "Cari Herba Gunung", "Hunt Down the Velocidrome": "Kejar Velocidrome", "Blue Menace of the Jungle": "Ancaman Biru Rimba", "Cunning Raiders": "Penjarah Licik", "Attack of the Giant Bugs": "Serangan Serangga Raksasa", "The Mushroom Hunt": "Berburu Jamur", "Panning for Goldenfish": "Mendulang Ikan Emas", "Hunt the Gendrome": "Buru Gendrome", "Slay the Genprey": "Basmi Para Genprey", "Liver of Legend": "Hati Legenda", "Attack of the Yian Kut-Ku": "Serangan Yian Kut-Ku", "Charge... Charge... Charge!": "Seruduk... Seruduk... Seruduk!", "The Mischief Maker": "Si Pembuat Onar",
  "Gathering - Swamp": "Pengumpulan - Rawa", "Gathering - Volcano": "Pengumpulan - Gunung Berapi", "The Shadow in the Cave": "Bayangan di Gua", "Red Shadow in the Cave": "Bayangan Merah di Gua", "Blango Hunting Tactics": "Taktik Berburu Blango", "The Pink Fur Party": "Pesta Bulu Merah Muda", "The Hidden Jungle Clouds": "Awan Tersembunyi di Rimba", "Evening Hermitaur Sonata": "Sonata Hermitaur Senja", "Pincer Through the Sky": "Capit Menembus Langit", "Chase the Poison Gypceros": "Kejar Gypceros Beracun", "Trouble in the Forest": "Masalah di Hutan", "Great Ore Discovery": "Penemuan Bijih Besar",
  "Tigrex Roar": "Raungan Tigrex", "Valor in the Swamp": "Keberanian di Rawa", "The King's Domain": "Wilayah Sang Raja", "The Queen's Descent": "Turunnya Sang Ratu", "The Cherry Blossom Rathian": "Rathian Sakura", "The Red And Green Wyverns": "Wyvern Merah dan Hijau", "Attack of the Wind Dragon": "Serangan Naga Angin", "The Emperor of Flame": "Kaisar Api", "The Approaching Gaoren": "Gaoren yang Mendekat",
  "Flanked by Velocidrome": "Diapit Velocidrome", "The Poisoned Fanged Duo": "Duo Taring Beracun", "Pursuit of the Sand Wyvern": "Mengejar Wyvern Pasir", "Conga Counterattack!": "Serangan Balik Conga!", "Lao Shan-Lung Draws Near": "Lao Shan-Lung Mendekat",
  "The Electrified Wyvern": "Wyvern Bermuatan Listrik", "The Poison Gas": "Gas Beracun", "The Underwater Terror": "Teror Bawah Air", "An Evening Soaked in Poison": "Malam yang Terendam Racun", "Supreme Rule of the Swamp": "Kekuasaan Tertinggi Rawa", "Slay the Rathalos!": "Tumbangkan Rathalos!", "Envoy to Disaster": "Utusan Bencana", "The Meeting of the Blangogas'": "Pertemuan Para Blangoga", "Land of the Tremors": "Tanah Getaran",
  "The Rajang in the Snow": "Rajang di Salju", "The Tigrex Roar": "Raungan Tigrex", "Rajang in the Mountain Flames": "Rajang di Api Gunung", "Blue Sky, Pink Earth": "Langit Biru, Bumi Merah Muda", "Deny the Silver Rathalos": "Hadang Rathalos Perak", "Find the Golden Rathian": "Temukan Rathian Emas", "The Fleeting Shadow": "Bayangan yang Berlalu", "The War of Immolation": "Perang Pembakaran", "Rise to the Summit": "Menuju Puncak",
};
const idn = (n) => ID[n] || n;

// Strategi per quest (kunci = nama asli quest).
const TIPS = {
  "Hunt the Carnivore!": ["Giaprey muncul di Area 5, 6, 7, dan 8."],
  "Sinking Feeling": ["Popo adalah monster jinak mirip yak. Kalahkan 3 ekor atau lebih untuk Lidah Popo."],
  "Slay the Blangos!": ["Blango ada di Area 8."],
  "The Carnivorous Leader": ["Giadrome cepat, jadi pakai senjata lincah: SnS, Longsword, Bow, Bowgun, atau Dual Sword.", "Pindah antara Area 6, 7, dan 8. Bersihkan Giaprey di area itu dulu supaya duelnya satu lawan satu.", "Saat lemah ia kabur ke area lain. Kejar dan habisi dengan cepat."],
  "Reckless Bulldrome Hunter": ["Serangannya hanya menyeruduk. Hammer cocok karena kepalanya mudah dipukul.", "Ia lewat di Area 6, 7, atau 8. Tunggu di salah satunya, dan kejar saat ia kabur."],
  "Jungle Menace": ["Yian Kut Ku lemah terhadap es, air, dan petir. Telinga dan paruh bisa dipatahkan.", "Mulai di Area 3, lalu pindah ke Area 1 atau 5.", "Sonic Bomb membuatnya pusing, dan Flash Bomb membuatnya linglung. Stun Trap juga mempan.", "Waspadai bola api, patukan, cambuk ekor, dan seruduk. Saat rage ia lebih cepat. Armor Battle cukup untuk quest ini."],
  "Rarest of the Rare Beasts": ["Congalala mulai di Area 3, kadang pindah ke Area 5 atau 9. Jangan terlalu lama di depan atau belakangnya.", "Kentutnya membuat status bau (sembuhkan dengan Deodorant), napasnya membuat tertidur.", "Pantat memerah berarti rage. Saat lemah ia kabur ke Area 6."],
  "Liver of Legend!": ["Cephalos ada di Area 2 Gurun. Lempar Sonic Bomb ke sirip yang berenang agar muncul ke permukaan.", "Kalau Sonic Bomb habis, pasang Small Barrel Bomb di jalur renangnya. Carve bangkainya untuk Hati Piscine."],
  "Shadow in the Snow": ["Khezu tidak punya bagian yang bisa dipatahkan. Bawa pelindung roar, misalnya Bowgun dengan perisai.", "Wilayahnya Area 6, 7, dan 8, kadang Area 1. Ia lambat saat terbang, jadi bidik tempat mendaratnya dengan Large Barrel Bomb.", "Bidik kaki dengan senjata jarak dekat. Saat hampir kalah ia pindah ke Area 3."],
  "The Lurking Desert Giant": ["Daimyo Hermituar ada di Area 3 atau 9. Hammer atau Longsword petir cocok.", "Serang kaki dari sisinya dan hindari bagian depan.", "Saat lemah ia ke Area 7 untuk makan. Pasang Stun Trap lalu lempar Tranq Bomb.", "Untuk Monoblos Heart (HR4+), patahkan cangkang Monoblos dua kali."],
  "Ultimate Crab Dinner": ["Ada dua Daimyo Hermituar. Hindari bertemu keduanya sekaligus; Paintball keduanya lalu lawan satu per satu."],
  "Gypceros: Venomous Terror": ["Kilatannya bisa dihindari dengan menyimpan senjata lalu membelakangi, memakai guard, atau mematahkan jambul di kepalanya.", "Hanya Pitfall Trap yang mempan. Stun Trap, Sonic Bomb, dan Flash Bomb tidak.", "Mulai di Area 8, sering ke Area 4, 2, dan 1, dan tidur di Area 2. Patukannya bisa mencuri item."],
  "The Poison Seige": ["Ada Gypceros dan Purple Gypceros. Jangan lawan keduanya di area yang sama; Paintball keduanya lalu lawan satu per satu."],
  "The Ruler of the Snow": ["Blangonga berkaki empat dan cepat, jadi pakai senjata cepat. Bawa Flash Bomb, Stun Trap, dan Thawer.", "Lempar Flash Bomb agar ia linglung, lalu pasang Stun Trap.", "Ia ada di Area 6, 7, atau 8 dan kabur ke Area 3 saat lemah. Taringnya dipatahkan dari kepala."],
  "Water Wyvern in the Desert": ["Plesioth berada di air Area 6 atau 7. Pancing dengan Katak sebagai umpan, atau pakai Sonic Bomb.", "Senjata petir atau stun paling baik. Bidik siripnya. Sirip dibutuhkan untuk Sandman Pike."],
  "Battle Of the Blos": ["Monoblos lemah terhadap petir. Serang dari bawah perut atau kaki.", "Sonic Bomb memaksanya keluar dari pasir. Monoblos Heart hanya 2% drop.", "Ekornya dibutuhkan untuk armor Monodevil."],
  "The Runaway Diablos": ["Strateginya sama dengan Monoblos. Diablos lemah terhadap es dan punya armor sendiri."],
  "Basarios: Unseen Peril": ["Bow sangat efektif. Ia menyamar jadi batu di Area 4 atau 6 Gunung Berapi.", "Beam-nya hanya kadang keluar, jadi gunakan celah itu untuk menembak."],
  "Commander in the Flames": ["Shogun Ceanataur: Hammer paling efektif untuk memecah cangkang. Capit harus dipatahkan untuk bahan armor.", "Cangkang yang pecah total diganti di Area 3, dan ia menjatuhkan item mengilap. Busa gelap dari mulut tanda hampir mati."],
  "Absolute Power": ["Tigrex lemah terhadap petir, titik lemahnya kepala. Ia ada di Area 6, 7, atau 8.", "Roar-nya melukai area sekitar. Seruduknya bisa berulang saat rage.", "Lance atau Gunlance di dekat tembok es bisa membuatnya tersangkut. Kombinasi Flash Bomb + Stun Trap juga efektif."],
  "The Lone Black Garuga": ["Syarat: kalahkan 10 Yian Kut Ku. Yian Garuga lemah terhadap air dan cepat, apalagi saat rage.", "Ekornya selalu berputar ke kanan, jadi larilah ke kiri. Ia bisa meracuni."],
  "The Frozen Dictator": ["Kushala Daora adalah Naga Tua, jadi tidak bisa ditangkap. Selubung anginnya bisa diatasi dengan armor Anti-Wind atau 5 pisau racun.", "Flash Bomb menjatuhkannya saat terbang. Senjata elemen Naga sangat baik. Bawa Thawer dan Hot Drink."],
  "Terror of the Gravios": ["Gravios: Bow air atau Hammer ke perut. Beam-nya selalu keluar dan menembus guard biasa, jadi bawa Earplug.", "Flash dan Sonic Bomb tidak mempan. Pasang Stun Trap sebelum ia tiba di area.", "Perut yang dipatahkan membuatnya lemah terhadap elemen Naga."],
  "A Troublesome Pair": ["Rathalos dan Rathian. Bawa Earplug dan Autotracker, jangan lawan keduanya sekaligus.", "Kepala Rathalos adalah sasaran utama. Ia kabur ke Area 4 lalu Area 5. Rathian menyerang dari darat dan backflip-nya beracun."],
  "The Legendary Kirin": ["Kirin kecil dan sangat cepat. Pakai armor tahan petir. Hammer, SnS, atau Hunting Horn cocok.", "Bom yang diledakkan oleh sambaran petir Kirin bisa melukainya."],
  "Overseer of the Ancients": ["Teostra dan Lunastra punya selubung api yang menguras HP; racuni untuk menghilangkannya.", "Serangan lingkarnya punya tiga jarak (dekat, sedang, jauh) yang bisa dibaca dari warna percikan."],
};
TIPS["The Empress' Blazing Throne"] = TIPS["Overseer of the Ancients"];
TIPS["The Elder Dragon of Wind"] = TIPS["The Frozen Dictator"];
TIPS["Gypceros: Venomous Terror"] = TIPS["Gypceros: Venomous Terror"];
TIPS["Chase the Poison Gypceros"] = TIPS["The Poison Seige"];
TIPS["Slay the Rathalos!"] = TIPS["A Troublesome Pair"];

const PANDUAN = {
  "Resep": [
    ["Potion", "Herba + Jamur Biru"], ["Mega Potion", "Potion + Madu"], ["Paintball", "Sap Plant + Paintberry"],
    ["Stun Trap", "Genprey Fang + Trap Tool"], ["Pitfall Trap", "Net + Trap Tool"], ["Net", "Spiderweb + Ivy"],
    ["Tranq Bomb", "Tranquilizer + Bomb Material"], ["Flash Bomb", "Flashbug + Bomb Material"], ["Sonic Bomb", "Screamer + Gunpowder"],
    ["Demondrug", "Catalyst + Power Seed"], ["Mega Demondrug", "Demondrug + Pale Extract"], ["Power Pill", "Immunizer + Power Seed"],
    ["Immunizer", "Catalyst + Dragon Toadstool"], ["Armorskin", "Armor Seed + Catalyst"], ["Armor Pill", "Armor Seed + Immunizer"],
    ["Mega Armorskin", "Armorskin + Pale Extract"], ["Mega Juice", "Well-Done Steak + Power Extract"],
  ],
  "Armor": [
    ["Awal", "Battle (kuat serangan awal), Kut-Ku (serangan), Ceanataur (Sharpening Skl Inc + Sharp Sword), Hermitaur (Guard +1, cocok Lance/Gunlance), Blango (tahan dingin), Tigrex (Autotracker, Quick Eating, Earplug lewat gem)"],
    ["Menengah", "Monodevil (Loading/Expert), Kirin (Elemental Attack Up, Autotracker), Death Stench (ESP), Rathalos Soul (Earplug, Expert, serangan naik)"],
    ["HR4 ke atas", "Ceanataur S/U, Borealis (Guard +2, cocok Lance/Gunlance), Tigrex S, Rathalos Soul U, Silver Rathalos (ESP), Akantor (Artisan, Expert, Earplug)"],
  ],
  "Senjata": [
    ["Eternal Strife (SnS)", "Elemen Naga, dari Ruststone"], ["Onslaught Hammer", "Hammer terbaik yang mudah didapat"], ["Sakura Bell (HH)", "Senjata elemen Naga paling awal"],
    ["Devil Slicer (LS)", "Mudah dibuat, tapi jangan terlalu diandalkan"], ["Gun Chariot (GL)", "Gunlance elemen Naga"], ["Sandman Pike (SnS)", "Membuat Rajang tertidur"],
    ["Diablos Chaos Broker", "Hammer, sedikit di atas Onslaught"], ["Smolder Dragonsword (LS)", "Longsword elemen Naga"], ["Azure Ogre Sword (SnS)", "SnS elemen Naga terbaik"],
    ["Siegmund (GS)", "Greatsword raw terbaik"], ["Ultimus Heaven & Earth (DS)", "Dual Sword elemen Naga terbaik"], ["Eternal Schism (DS)", "Dual Sword Naga yang lebih mudah didapat"],
    ["Akantor Bow", "Dibuat dari bagian Akantor, cocok untuk Fatalis"], ["Glorious Victory (Bow)", "Dari bagian White Fatalis"],
  ],
  "Material": [
    ["Vibrant Pelt", "Congalala: patahkan wajahnya dengan senjata api"], ["Electro Sac", "Khezu (Red Khezu lebih banyak)"], ["Flashbug", "Beli di Old Lady"],
    ["Piscine Fang", "Cephadrome atau Plesioth"], ["Medium Monster Bone", "Yian Kut Ku"], ["Giant Bone", "Bulldrome atau Congalala"],
    ["Black Pearl", "Daimyo Hermituar"], ["Flame Sac", "Yian Kut Ku, Rathalos, Rathian, Trenya"], ["Pale Bone", "Khezu"], ["Ceanataur Claws", "Patahkan capit saat bertarung"],
  ],
  "Drop mengilap": [
    ["Yian Kut Ku, Cephadrome", "Lempar Sonic Bomb"], ["Gypceros", "Carve saat ia pura-pura mati"], ["Rathalos, Rathian, Gravios", "Bangunkan dari tidurnya"],
    ["Basarios", "Buat ia keluar dari tanah"], ["Diablos, Monoblos", "Saat tanduk tersangkut"], ["Daimyo Hermituar, Shogun Ceanataur", "Biarkan selesai makan"],
    ["Congalala", "Serang ekornya"], ["Khezu", "Saat serangan asam menggantung"], ["Tigrex", "Saat giginya tersangkut dinding"],
    ["Plesioth", "Pancing keluar dari air"], ["Chameleos", "Sonic Bomb saat ia menyerang"],
  ],
};

const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const buat = (nama, p, on, efek, dasar) => {
  const d = dasar || p.bg;
  return { nama, efek, c: { ...p, ontaksen: on, kaca: rgba(d, 0.75), nav: rgba(p.panel, 0.94), kabut: `linear-gradient(180deg, ${rgba(d, 0.25)}, ${rgba(d, 0.9)})`, banner: `radial-gradient(circle at 15% 20%, ${rgba(p.aksen, 0.35)}, transparent 45%), linear-gradient(135deg, ${p.panel2}, ${p.bg} 60%, ${p.garis})` } };
};
const TEMA = {
  malam: buat("Malam", { bg: "#0a1119", panel: "#121c28", panel2: "#182535", garis: "#223246", teks: "#eaf1f8", redup: "#8497ab", aksen: "#5cc8c0", urgent: "#ff7a6b", wajib: "#f2b84b" }, "#07222a"),
  terang: buat("Terang", { bg: "#eef3f7", panel: "#ffffff", panel2: "#e6edf3", garis: "#d3dde6", teks: "#14202b", redup: "#58697a", aksen: "#0b7d77", urgent: "#c93a2b", wajib: "#9a6200" }, "#ffffff", null, "#0a1119"),
  rimba: buat("Rimba", { bg: "#09140f", panel: "#101f17", panel2: "#172a1f", garis: "#223a2c", teks: "#e8f3ec", redup: "#86a592", aksen: "#8fd16b", urgent: "#ff8068", wajib: "#f0c050" }, "#0b1a10"),
  senja: buat("Senja", { bg: "#120f1f", panel: "#1b1730", panel2: "#251f40", garis: "#35295c", teks: "#efeaff", redup: "#9a90c4", aksen: "#b79cff", urgent: "#ff7a9a", wajib: "#ffcf6b" }, "#1a1233"),
  salju: buat("Salju", { bg: "#0b1522", panel: "#132235", panel2: "#1a2e45", garis: "#28425e", teks: "#f0f6fc", redup: "#93aec8", aksen: "#a9d6ff", urgent: "#ff8a80", wajib: "#ffd37a" }, "#08243a", "salju"),
  hujan: buat("Hujan", { bg: "#0e1317", panel: "#151d23", panel2: "#1c262e", garis: "#2a3844", teks: "#e3eaf0", redup: "#8497a6", aksen: "#62b6cb", urgent: "#ff7f73", wajib: "#e8c15a" }, "#07242b", "hujan"),
};
const KonteksTema = createContext(TEMA.malam.c);
const useC = () => useContext(KonteksTema);
const NAV = [["beranda", "Beranda"], ["target", "Target"], ["riwayat", "Riwayat"], ["panduan", "Panduan"], ["profil", "Profil"]];
const TINGKAT = [["Pemula", 0], ["Pemburu", 5], ["Veteran", 15], ["Master Hunter", 30]];

// Penyimpanan lokal: tema, profil, banner, target, dan riwayat tetap ada
// setelah aplikasi ditutup atau APK direstart.
const STORAGE_KEY = "mhf2_hunter_helper_data_v1";
const DATA_AWAL = {
  tema: "malam",
  nama: "Hunter",
  target: [],
  riwayat: [],
  fotoProfil: null,
  banner: null,
};

function bacaData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DATA_AWAL;
    const data = JSON.parse(raw);
    return {
      ...DATA_AWAL,
      ...data,
      target: Array.isArray(data.target) ? data.target : [],
      riwayat: Array.isArray(data.riwayat) ? data.riwayat : [],
    };
  } catch {
    return DATA_AWAL;
  }
}

function simpanData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Jika storage penuh/rusak, aplikasi tetap bisa dipakai tanpa crash.
    console.warn("Data MHF2 tidak dapat disimpan:", e);
  }
}

// Potong tengah (cover) lalu perkecil, supaya data gambar tetap ringan.
function olahGambar(file, lebar, tinggi) {
  return new Promise((ok, gagal) => {
    if (!file || !file.type.startsWith("image/")) return gagal(new Error("Pilih file gambar (JPG, PNG, atau WebP)."));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const rasio = lebar / tinggi;
      let sw = img.width, sh = img.height;
      if (sw / sh > rasio) sw = sh * rasio; else sh = sw / rasio;
      const c = document.createElement("canvas");
      c.width = lebar;
      c.height = tinggi;
      c.getContext("2d").drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, lebar, tinggi);
      URL.revokeObjectURL(url);
      ok(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); gagal(new Error("Gambar tidak bisa dibuka. Coba pilih file lain.")); };
    img.src = url;
  });
}

const gayaBanner = (src, C) => (src ? { backgroundImage: `url("${src}")`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: C.banner });

function Ikon({ d, ukuran = 22, tebal = 1.8 }) {
  return (
    <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={tebal} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}
const IKON = {
  beranda: ["M3 11.5 12 4l9 7.5", "M5 10v10h14V10"],
  target: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M12 12h.01"],
  riwayat: ["M12 7v5l3 2", "M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5", "M3.5 3.5v5h5"],
  profil: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"],
  kamera: ["M4 8h3l1.5-2h7L17 8h3v11H4Z", "M12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"],
  cari: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z", "m20 20-4-4"],
  centang: ["m5 12.5 4.5 4.5L19 7.5"],
  panduan: ["M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z", "M5 17a3 3 0 0 1 3-3h11"],
  sampah: ["M4 7h16", "M9 7V4h6v3", "M6 7l1 13h10l1-13"],
};

function Chip({ aktif, onClick, children }) {
  const C = useC();
  return (
    <button type="button" onClick={onClick} aria-pressed={aktif} style={{ background: aktif ? C.aksen : C.panel, color: aktif ? C.ontaksen : C.redup, border: `1px solid ${aktif ? C.aksen : C.garis}` }} className="chp">
      {children}
    </button>
  );
}
function Tombol({ onClick, utama, bahaya, children }) {
  const C = useC();
  const warna = bahaya ? C.urgent : C.aksen;
  return (
    <button type="button" onClick={onClick} style={{ background: utama ? warna : "transparent", color: utama ? C.ontaksen : bahaya ? C.urgent : C.teks, border: `1px solid ${utama || bahaya ? warna : C.garis}` }} className="tbl">
      {children}
    </button>
  );
}
function Judul({ teks, sub }) {
  const C = useC();
  return (
    <header className="pt-2 mb-5">
      <h1>{teks}</h1>
      {sub && <p style={{ color: C.redup, fontSize: 15 }} className="mt-1">{sub}</p>}
    </header>
  );
}
function Avatar({ src, nama, ukuran, tepi = 0 }) {
  const C = useC();
  const inisial = (nama.trim()[0] || "H").toUpperCase();
  return (
    <div role="img" aria-label={`Foto profil ${nama}`} style={{ width: ukuran, height: ukuran, borderRadius: "50%", border: tepi ? `${tepi}px solid ${C.panel}` : "none", fontSize: ukuran * 0.4, color: C.ontaksen, ...(src ? { backgroundImage: `url("${src}")`, backgroundSize: "cover", backgroundPosition: "center" } : { backgroundImage: `linear-gradient(135deg, ${C.aksen}, #3b8fb0)` }) }} className="flex items-center justify-center font-bold shrink-0">
      {!src && inisial}
    </div>
  );
}
function Lencana({ warna, children }) {
  const C = useC();
  return <span style={{ background: `${warna}22`, color: warna }} className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold">{children}</span>;
}
function Kosong({ children }) {
  const C = useC();
  return <p style={{ color: C.redup }} className="text-sm text-center py-12">{children}</p>;
}

function Kartu({ q, children }) {
  const C = useC();
  const [buka, setBuka] = useState(false);
  const tips = TIPS[q.nama];
  const warna = q.urgent ? C.urgent : q.wajib ? C.wajib : C.aksen;
  const fakta = q.d ? [["Waktu", `${q.d.waktu} menit`], ["Hadiah", `${q.d.hadiah}z`], ["Kontrak", `${q.d.kontrak}z`]] : [];
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.garis}` }} className="relative rounded-2xl p-4 pl-5 mb-3 overflow-hidden">
      <span style={{ background: warna, opacity: q.urgent || q.wajib ? 1 : 0.35 }} className="absolute left-0 top-0 bottom-0 w-1" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3>{idn(q.nama)}</h3>
          {idn(q.nama) !== q.nama && <p style={{ color: C.redup }} className="cap mt-1">{q.nama}</p>}
        </div>
        <span style={{ background: `${C.aksen}1f`, color: C.aksen }} className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">{q.tipe === "guild" ? "Guild" : "Desa"} ★{q.bintang}</span>
      </div>
      {(q.urgent || q.wajib) && (
        <div className="mt-2"><Lencana warna={warna}>{q.urgent ? "Quest Urgent" : "Wajib untuk membuka quest Urgent"}</Lencana></div>
      )}
      {q.d ? (
        <>
          <p style={{ fontSize: 15 }} className="mt-3">{q.d.tujuan}</p>
          <p style={{ color: C.redup }} className="cap mt-1">{q.d.area}</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {fakta.map(([l, v]) => (
              <div key={l} style={{ background: C.panel2 }} className="min-w-0 rounded-xl px-3 py-2">
                <p style={{ color: C.redup }} className="cap">{l}</p>
                <p className="text-sm font-semibold mt-0.5">{v}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ color: C.redup }} className="cap mt-3">Detail hadiah dan tujuan belum dimasukkan.</p>
      )}
      {tips && (
        <div className="mt-3">
          <button type="button" onClick={() => setBuka(!buka)} aria-expanded={buka} style={{ color: C.aksen, fontSize: 15, minHeight: 32 }} className="font-semibold">{buka ? "Sembunyikan strategi" : "Lihat strategi"}</button>
          {buka && (
            <ul style={{ background: C.panel2, fontSize: 14 }} className="mt-2 rounded-xl py-3 pr-3 pl-7 list-disc space-y-1.5">
              {tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          )}
        </div>
      )}
      {children && <div className="aksi">{children}</div>}
    </div>
  );
}

const ItemBeranda = memo(function ItemBeranda({ q, selesai, target, onTarget, onTuntas }) {
  const C = useC();
  return (
    <Kartu q={q}>
      {selesai ? (
        <span style={{ color: C.aksen }} className="inline-flex items-center gap-1.5 text-sm py-2 font-semibold"><Ikon d={IKON.centang} ukuran={18} />Sudah selesai</span>
      ) : (
        <>
          <Tombol onClick={() => onTarget(q.id)}>{target ? "Sudah jadi target" : "Jadikan target"}</Tombol>
          <Tombol utama onClick={() => onTuntas(q.id)}>Tandai selesai</Tombol>
        </>
      )}
    </Kartu>
  );
});

const gayaFokus = (C) => `.mhf button:focus-visible,.mhf input:focus-visible{outline:2px solid ${C.aksen};outline-offset:2px}.mhf input::placeholder{color:${C.redup}}`;
const CSS_DASAR = `.mhf{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Helvetica Neue",system-ui,sans-serif;font-size:16px;line-height:1.35;letter-spacing:-.011em;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
.mhf *{box-sizing:border-box}
.mhf button,.mhf input{font-family:inherit;letter-spacing:inherit;-webkit-tap-highlight-color:transparent}
.mhf input{font-size:16px}
.mhf h1{font-size:34px;line-height:1.08;font-weight:700;letter-spacing:-.025em;margin:0}
.mhf h3{font-size:17px;line-height:1.25;font-weight:600;letter-spacing:-.015em;margin:0}
.mhf .hero h1{font-size:22px;line-height:1.15;letter-spacing:-.02em}
.mhf .tbl{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:12px;font-size:15px;font-weight:600}
.mhf .chp{min-height:34px;padding:0 14px;border-radius:999px;font-size:14px;font-weight:600;white-space:nowrap}
.mhf .aksi{display:flex;gap:8px;margin-top:16px}.mhf .aksi>.tbl{flex:1}
.mhf .gulir{display:flex;gap:8px;overflow-x:auto;margin:0 -16px;padding:0 16px 12px;scrollbar-width:none}.mhf .gulir::-webkit-scrollbar{display:none}
.mhf .cap{font-size:12px;line-height:1.25}
`;
const CSS_EFEK = `.mhf-efek{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:5}.mhf-efek i{position:absolute;top:0;display:block;will-change:transform;animation-timing-function:linear;animation-iteration-count:infinite}
.mhf-salju i{border-radius:50%;background:#fff;box-shadow:0 0 6px rgba(255,255,255,.8);animation-name:jatuhSalju}
.mhf-hujan i{width:1.5px;background:linear-gradient(to bottom,transparent,rgba(170,205,235,.8));animation-name:jatuhHujan}
@keyframes jatuhSalju{from{transform:translate3d(0,-10vh,0)}50%{transform:translate3d(var(--g),50vh,0)}to{transform:translate3d(0,110vh,0)}}
@keyframes jatuhHujan{from{transform:translate3d(0,-12vh,0) rotate(12deg)}to{transform:translate3d(-24vh,112vh,0) rotate(12deg)}}
@media (prefers-reduced-motion:reduce){.mhf-efek{display:none}}`;

function Efek({ jenis }) {
  const butir = useMemo(() => Array.from({ length: jenis === "salju" ? 46 : 70 }, (_, i) => {
    const r = Math.random;
    return jenis === "salju"
      ? { i, left: r() * 100, u: 3 + r() * 5, dur: 9 + r() * 9, tunda: -r() * 18, g: (r() - 0.5) * 80, op: 0.5 + r() * 0.5 }
      : { i, left: r() * 125, h: 14 + r() * 18, dur: 0.7 + r() * 0.6, tunda: -r() * 2, op: 0.3 + r() * 0.5 };
  }), [jenis]);
  return (
    <div className={`mhf-efek mhf-${jenis}`} aria-hidden="true">
      {butir.map((b) => (
        <i key={b.i} style={jenis === "salju"
          ? { left: `${b.left}%`, width: b.u, height: b.u, opacity: b.op, animationDuration: `${b.dur}s`, animationDelay: `${b.tunda}s`, "--g": `${b.g}px` }
          : { left: `${b.left}%`, height: b.h, opacity: b.op, animationDuration: `${b.dur}s`, animationDelay: `${b.tunda}s` }} />
      ))}
    </div>
  );
}

export default function MHF2Full() {
  const [dataTersimpan] = useState(() => bacaData());
  const [tema, setTema] = useState(() => TEMA[bacaData().tema] ? bacaData().tema : DATA_AWAL.tema);
  const C = TEMA[tema].c;
  const [layar, setLayar] = useState("beranda");
  const [nama, setNama] = useState(() => dataTersimpan.nama || DATA_AWAL.nama);
  const [target, setTarget] = useState(() => dataTersimpan.target);
  const [riwayat, setRiwayat] = useState(() => dataTersimpan.riwayat);
  const [tipe, setTipe] = useState("desa");
  const [bintang, setBintang] = useState(0);
  const [cari, setCari] = useState("");
  const [fotoProfil, setFotoProfil] = useState(() => dataTersimpan.fotoProfil || null);
  const [banner, setBanner] = useState(() => dataTersimpan.banner || null);
  const [galat, setGalat] = useState("");
  const [yakinReset, setYakinReset] = useState(false);
  const [bagian, setBagian] = useState("Resep");
  const refBanner = useRef(null);
  const refFoto = useRef(null);

  const [batas, setBatas] = useState(20);
  const [tampilSplash, setTampilSplash] = useState(true);

  // Splash screen aplikasi: loading benar-benar bergerak, bukan gambar statis.
  useEffect(() => {
    const timer = setTimeout(() => setTampilSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Simpan otomatis setiap kali data profil/progres berubah.
  useEffect(() => {
    simpanData({
      tema,
      nama,
      target,
      riwayat,
      fotoProfil,
      banner,
    });
  }, [tema, nama, target, riwayat, fotoProfil, banner]);
  useEffect(() => setBatas(20), [tipe, bintang, cari]);

  const pilihGambar = useCallback(async (file, jenis) => {
    setGalat("");
    try {
      if (jenis === "banner") setBanner(await olahGambar(file, 1200, 450));
      else setFotoProfil(await olahGambar(file, 400, 400));
    } catch (e) {
      setGalat(e.message);
    }
  }, []);
  const saatDipilih = (jenis) => (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (f) pilihGambar(f, jenis);
  };

  const selesai = useMemo(() => new Set(riwayat.map((r) => r.id)), [riwayat]);
  const targetSet = useMemo(() => new Set(target), [target]);
  const lepas = useCallback((id) => setTarget((t) => t.filter((x) => x !== id)), []);
  const jadikanTarget = useCallback((id) => setTarget((t) => (t.includes(id) ? t : [...t, id])), []);
  const tuntas = useCallback((id) => {
    setRiwayat((r) => [{ id, tanggal: new Date().toLocaleString("id-ID") }, ...r]);
    setTarget((t) => t.filter((x) => x !== id));
  }, []);
  const dalamTipe = useMemo(() => QUEST.filter((q) => q.tipe === tipe), [tipe]);
  const daftar = useMemo(() => dalamTipe.filter((q) => (!bintang || q.bintang === bintang) && `${idn(q.nama)} ${q.nama}`.toLowerCase().includes(cari.toLowerCase())), [tipe, bintang, cari]);
  const maks = tipe === "desa" ? 6 : 8;

  const n = riwayat.length;
  let idx = 0;
  TINGKAT.forEach(([, m], i) => { if (n >= m) idx = i; });
  const pangkat = TINGKAT[idx][0];
  const berikut = TINGKAT[idx + 1];
  const persen = berikut ? Math.round(((n - TINGKAT[idx][1]) / (berikut[1] - TINGKAT[idx][1])) * 100) : 100;
  const desaSelesai = riwayat.filter((r) => QUEST[r.id].tipe === "desa").length;
  const tampilNama = nama.trim() || "Hunter";

  return (
    <KonteksTema.Provider value={C}>
    <div className="mhf" style={{ background: C.bg, color: C.teks, minHeight: "100vh" }}>
      <style>{CSS_DASAR + gayaFokus(C) + CSS_EFEK}</style>
      {tampilSplash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99999, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(145deg, #020817 0%, #06152d 55%, #020611 100%)",
          color: "#fff",
        }}>
          <img
            src="/icon-only.png"
            alt="Hunter You"
            style={{ width: 132, height: 132, objectFit: "contain", borderRadius: 28, display: "block", boxShadow: "0 0 40px rgba(0,153,255,.22)" }}
          />
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.8px", marginTop: 22 }}>Hunter You</div>
          <div className="hunter-loading-spinner" aria-label="Memuat aplikasi" />
          <div style={{ color: "#91a4bf", fontSize: 14, marginTop: 10 }}>Memuat...</div>
          <style>{`
            @keyframes hunterSpin { to { transform: rotate(360deg); } }
            .hunter-loading-spinner {
              width: 38px; height: 38px; margin-top: 28px; border-radius: 50%;
              border: 4px solid rgba(70,130,190,.22);
              border-top-color: #159cff; border-right-color: #159cff;
              animation: hunterSpin .8s linear infinite;
            }
          `}</style>
        </div>
      )}
      {TEMA[tema].efek && <Efek jenis={TEMA[tema].efek} />}
      <div className="max-w-2xl mx-auto px-4 pt-4" style={{ paddingBottom: "calc(96px + env(safe-area-inset-bottom, 0px))" }}>
        {layar === "beranda" && (
          <>
            <div style={{ ...gayaBanner(banner, C), border: `1px solid ${C.garis}` }} className="hero rounded-3xl overflow-hidden mb-4">
              <div style={{ background: C.kabut, color: "#f4f8fb" }} className="flex items-center gap-3 p-4 pt-12">
                <button type="button" onClick={() => setLayar("profil")} aria-label="Buka profil" className="rounded-full shrink-0">
                  <Avatar src={fotoProfil} nama={tampilNama} ukuran={56} tepi={2} />
                </button>
                <div className="min-w-0">
                  <h1 className="truncate">Halo, {tampilNama}</h1>
                  <p style={{ color: "#c3d2e0", fontSize: 13 }} className="mt-0.5">{pangkat} · {n} selesai · {target.length} target aktif</p>
                </div>
              </div>
            </div>

            <div style={{ background: C.panel2 }} className="flex rounded-xl p-0.5 mb-3">
              {[["desa", "Quest Desa"], ["guild", "Quest Guild"]].map(([k, l]) => (
                <button type="button" key={k} onClick={() => { setTipe(k); setBintang(0); }} style={{ background: tipe === k ? C.aksen : "transparent", color: tipe === k ? C.ontaksen : C.redup, minHeight: 36, fontSize: 14 }} className="flex-1 rounded-lg font-semibold">{l}</button>
              ))}
            </div>
            <div className="relative mb-3">
              <span style={{ color: C.redup }} className="absolute left-3.5 top-1/2 -translate-y-1/2"><Ikon d={IKON.cari} ukuran={18} /></span>
              <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama quest" aria-label="Cari nama quest" style={{ background: C.panel, border: `1px solid ${C.garis}`, color: C.teks, paddingLeft: 42, height: 44 }} className="w-full pr-4 rounded-xl" />
            </div>
            <div className="gulir">
              <Chip aktif={bintang === 0} onClick={() => setBintang(0)}>Semua</Chip>
              {Array.from({ length: maks }, (_, i) => i + 1).map((b) => (
                <Chip key={b} aktif={bintang === b} onClick={() => setBintang(b)}>★{b} ({dalamTipe.filter((q) => q.bintang === b).length})</Chip>
              ))}
            </div>
            {daftar.length === 0 && <Kosong>Tidak ada quest yang cocok. Coba kata kunci lain atau pilih Semua.</Kosong>}
            {daftar.slice(0, batas).map((q) => (
              <ItemBeranda key={q.id} q={q} selesai={selesai.has(q.id)} target={targetSet.has(q.id)} onTarget={jadikanTarget} onTuntas={tuntas} />
            ))}
            {daftar.length > batas && (
              <div className="aksi" style={{ marginTop: 4 }}>
                <Tombol onClick={() => setBatas(batas + 20)}>Tampilkan lebih banyak ({daftar.length - batas} lagi)</Tombol>
              </div>
            )}
          </>
        )}

        {layar === "target" && (
          <>
            <Judul teks="Target Quest" sub={`${target.length} quest jadi target`} />
            {target.length === 0 && <Kosong>Belum ada target. Buka Beranda dan pilih Jadikan target.</Kosong>}
            {target.map((id) => (
              <Kartu key={id} q={QUEST[id]}>
                <Tombol utama onClick={() => tuntas(id)}>Tandai selesai</Tombol>
                <Tombol onClick={() => lepas(id)}>Lepas target</Tombol>
              </Kartu>
            ))}
          </>
        )}

        {layar === "riwayat" && (
          <>
            <Judul teks="Riwayat Quest" sub={`${n} quest selesai`} />
            {riwayat.length === 0 && <Kosong>Belum ada quest selesai.</Kosong>}
            {riwayat.map((r, i) => (
              <div key={i}>
                <p style={{ color: C.redup }} className="cap mb-1.5 ml-1">{r.tanggal}</p>
                <Kartu q={QUEST[r.id]} />
              </div>
            ))}
          </>
        )}

        {layar === "panduan" && (
          <>
            <Judul teks="Panduan" sub="Resep, armor, senjata, dan tips. Strategi tiap quest ada di kartunya." />
            <div className="gulir">
              {Object.keys(PANDUAN).map((k) => <Chip key={k} aktif={bagian === k} onClick={() => setBagian(k)}>{k}</Chip>)}
            </div>
            <div style={{ background: C.panel, border: `1px solid ${C.garis}` }} className="rounded-2xl px-4">
              {PANDUAN[bagian].map(([a, b], i) => (
                <div key={a} style={{ borderTop: i ? `1px solid ${C.garis}` : "none" }} className="py-3">
                  <p style={{ fontSize: 15 }} className="font-semibold">{a}</p>
                  <p style={{ color: C.redup, fontSize: 14 }} className="mt-0.5">{b}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {layar === "profil" && (
          <>
            <Judul teks="Profil Hunter" sub="Atur foto, banner, dan tema." />

            <input ref={refBanner} type="file" accept="image/*" onChange={saatDipilih("banner")} className="sr-only" tabIndex={-1} aria-hidden="true" />
            <input ref={refFoto} type="file" accept="image/*" onChange={saatDipilih("foto")} className="sr-only" tabIndex={-1} aria-hidden="true" />

            <div style={{ background: C.panel, border: `1px solid ${C.garis}` }} className="rounded-3xl overflow-hidden mb-3">
              <div style={gayaBanner(banner, C)} className="relative h-36">
                <div className="absolute right-3 bottom-3 flex gap-2">
                  {banner && (
                    <button type="button" onClick={() => setBanner(null)} aria-label="Hapus banner" style={{ background: C.kaca, color: "#f4f8fb" }} className="p-2 rounded-full">
                      <Ikon d={IKON.sampah} ukuran={16} />
                    </button>
                  )}
                  <button type="button" onClick={() => refBanner.current && refBanner.current.click()} style={{ background: C.kaca, color: "#f4f8fb" }} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold">
                    <Ikon d={IKON.kamera} ukuran={16} />{banner ? "Ganti banner" : "Tambah banner"}
                  </button>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="flex items-end justify-between -mt-12 mb-3">
                  <div className="relative">
                    <Avatar src={fotoProfil} nama={tampilNama} ukuran={96} tepi={4} />
                    <button type="button" onClick={() => refFoto.current && refFoto.current.click()} aria-label={fotoProfil ? "Ganti foto profil" : "Tambah foto profil"} style={{ background: C.aksen, color: C.ontaksen, border: `3px solid ${C.panel}` }} className="absolute bottom-0 right-0 p-1.5 rounded-full">
                      <Ikon d={IKON.kamera} ukuran={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    {fotoProfil && <Tombol onClick={() => setFotoProfil(null)}>Hapus foto</Tombol>}
                  </div>
                </div>

                {galat && <p role="alert" style={{ color: C.urgent }} className="text-sm mb-3">{galat}</p>}

                <label htmlFor="nama-hunter" style={{ color: C.redup }} className="cap">Nama Hunter</label>
                <input id="nama-hunter" value={nama} onChange={(e) => setNama(e.target.value)} maxLength={24} style={{ background: C.bg, border: `1px solid ${C.garis}`, color: C.teks, height: 44 }} className="w-full px-3 rounded-xl mt-1" />

                <div style={{ borderTop: `1px solid ${C.garis}` }} className="flex items-baseline justify-between mt-4 pt-4">
                  <p className="text-lg font-bold">{pangkat}</p>
                  <p style={{ color: C.redup }} className="text-xs">{berikut ? `${berikut[1] - n} quest lagi menuju ${berikut[0]}` : "Pangkat tertinggi"}</p>
                </div>
                <div style={{ background: C.bg }} className="h-2 rounded-full mt-2 overflow-hidden" role="progressbar" aria-valuenow={persen} aria-valuemin={0} aria-valuemax={100} aria-label="Progres pangkat">
                  <div style={{ width: `${persen}%`, background: C.aksen }} className="h-full rounded-full" />
                </div>
                <p style={{ color: C.redup }} className="text-xs mt-2">Pangkat dihitung dari jumlah quest yang kamu tandai selesai di aplikasi ini.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[["Quest Desa", desaSelesai, QUEST.filter((q) => q.tipe === "desa").length], ["Quest Guild", n - desaSelesai, QUEST.filter((q) => q.tipe === "guild").length]].map(([l, a, b]) => (
                <div key={l} style={{ background: C.panel, border: `1px solid ${C.garis}` }} className="rounded-2xl p-4">
                  <p style={{ color: C.aksen }} className="text-2xl font-bold">{a}<span style={{ color: C.redup }} className="text-sm font-semibold">/{b}</span></p>
                  <p style={{ color: C.redup }} className="text-xs mt-0.5">{l} selesai</p>
                </div>
              ))}
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.garis}` }} className="rounded-2xl p-4 mb-4">
              <p style={{ fontSize: 15 }} className="font-semibold mb-3">Tema</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(TEMA).map(([k, t]) => (
                  <button type="button" key={k} onClick={() => setTema(k)} aria-pressed={tema === k} style={{ background: t.c.bg, color: t.c.teks, border: `2px solid ${tema === k ? C.aksen : C.garis}` }} className="rounded-xl p-3 text-left">
                    <span className="flex gap-1 mb-2">
                      {[t.c.panel, t.c.aksen, t.c.wajib].map((w) => <span key={w} style={{ background: w, border: `1px solid ${t.c.garis}`, width: 14, height: 14, borderRadius: "50%" }} />)}
                    </span>
                    <span style={{ fontSize: 14 }} className="block font-semibold">{t.nama}</span>
                    {t.efek && <span style={{ color: t.c.redup }} className="block cap mt-0.5">Efek {t.efek}</span>}
                  </button>
                ))}
              </div>
            </div>

            {yakinReset ? (
              <div style={{ background: C.panel, border: `1px solid ${C.urgent}66` }} className="rounded-2xl p-4">
                <p style={{ fontSize: 15 }} className="mb-3">Semua riwayat dan target akan dihapus. Foto dan banner tidak ikut terhapus.</p>
                <div className="aksi" style={{ marginTop: 0 }}>
                  <Tombol bahaya utama onClick={() => { setRiwayat([]); setTarget([]); setYakinReset(false); }}>Hapus progres</Tombol>
                  <Tombol onClick={() => setYakinReset(false)}>Batal</Tombol>
                </div>
              </div>
            ) : (
              <div className="aksi" style={{ marginTop: 0 }}><Tombol bahaya onClick={() => setYakinReset(true)}>Reset progres</Tombol></div>
            )}
          </>
        )}
      </div>

      <nav aria-label="Navigasi utama" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 10, background: C.nav, borderTop: `1px solid ${C.garis}`, backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="max-w-2xl mx-auto flex">
          {NAV.map(([k, l]) => {
            const aktif = layar === k;
            return (
              <button type="button" key={k} onClick={() => setLayar(k)} aria-current={aktif ? "page" : undefined} style={{ color: aktif ? C.aksen : C.redup, minHeight: 52 }} className="flex-1 flex flex-col items-center justify-center gap-0.5 pt-1.5 pb-1">
                <Ikon d={IKON[k]} ukuran={24} />
                <span style={{ fontSize: 10, fontWeight: 500 }}>{l}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
    </KonteksTema.Provider>
  );
}
