// Dates officielles 2026-2027
const ACADEMIC_START = new Date('2026-09-01T08:00:00');
const ACADEMIC_END = new Date('2027-07-03T18:00:00');

// Dates des épreuves selon la classe
const EXAM_DATES = {
  terminale: {
    name: "Épreuve de Philosophie",
    date: new Date('2027-06-14T08:00:00')
  },
  premiere: {
    name: "Épreuve Écrite de Français",
    date: new Date('2027-06-15T08:00:00')
  }
};

// Calendrier des Vacances 2026-2027 par Zone
const VACANCES_DATA = {
  'A': [
    { name: "Vacances de la Toussaint", start: new Date("2026-10-17T12:00:00") },
    { name: "Vacances de Noël", start: new Date("2026-12-19T12:00:00") },
    { name: "Vacances d'Hiver", start: new Date("2027-02-13T12:00:00") },
    { name: "Vacances de Printemps", start: new Date("2027-04-10T12:00:00") },
    { name: "Grandes Vacances", start: new Date("2027-07-03T12:00:00") }
  ],
  'B': [
    { name: "Vacances de la Toussaint", start: new Date("2026-10-17T12:00:00") },
    { name: "Vacances de Noël", start: new Date("2026-12-19T12:00:00") },
    { name: "Vacances d'Hiver", start: new Date("2027-02-20T12:00:00") },
    { name: "Vacances de Printemps", start: new Date("2027-04-17T12:00:00") },
    { name: "Grandes Vacances", start: new Date("2027-07-03T12:00:00") }
  ],
  'C': [
    { name: "Vacances de la Toussaint", start: new Date("2026-10-17T12:00:00") },
    { name: "Vacances de Noël", start: new Date("2026-12-19T12:00:00") },
    { name: "Vacances d'Hiver", start: new Date("2027-02-06T12:00:00") },
    { name: "Vacances de Printemps", start: new Date("2027-04-03T12:00:00") },
    { name: "Grandes Vacances", start: new Date("2027-07-03T12:00:00") }
  ]
};

const TIPS = [
  "Révise tes spécialités par blocs de 1h30 séparés de 15 minutes de pause active !",
  "Fais une fiche synthétique après chaque chapitre terminé.",
  "Entraîne-toi sur de vrais sujets d'annales en temps limité.",
  "Explique un cours à un ami : si tu y arrives, c'est que tu l'as vraiment compris !",
  "Alterne les matières littéraires et scientifiques dans ta même journée pour garder ton cerveau actif.",
  "Soigne ton sommeil : c'est pendant la nuit que ton cerveau mémorise ce que tu as révisé."
];

// Récupération des éléments du DOM
const selectZoneEl = document.getElementById('select-zone');
const selectLevelEl = document.getElementById('select-level');
const activeZoneLabelEl = document.getElementById('active-zone-label');
const examFooterEl = document.getElementById('exam-footer');

// Récupération des valeurs stockées (ou valeurs par défaut)
let currentZone = localStorage.getItem('bac_zone') || 'C';
let currentLevel = localStorage.getItem('bac_level') || 'terminale';

// Application initiale aux menus déroulants
if (selectZoneEl) selectZoneEl.value = currentZone;
if (selectLevelEl) selectLevelEl.value = currentLevel;

function updateDashboard() {
  const now = new Date();

  // 1. Mise à jour de l'étiquette Zone dans le titre principal
  if (activeZoneLabelEl) {
    activeZoneLabelEl.innerText = `Zone ${currentZone}`;
  }

  // 2. Sélection de l'épreuve dynamique (Terminale ou Première)
  const activeExam = EXAM_DATES[currentLevel] || EXAM_DATES.terminale;

  // Calcul du décompte jusqu'à l'examen
  const bacDiff = activeExam.date - now;
  if (bacDiff > 0) {
    const d = Math.floor(bacDiff / (1000 * 60 * 60 * 24));
    const h = Math.floor((bacDiff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((bacDiff / (1000 * 60)) % 60);
    const s = Math.floor((bacDiff / 1000) % 60);

    document.getElementById('bac-days-main').innerText = d;
    document.getElementById('bac-days').innerText = String(d).padStart(2, '0');
    document.getElementById('bac-hours').innerText = String(h).padStart(2, '0');
    document.getElementById('bac-minutes').innerText = String(m).padStart(2, '0');
    document.getElementById('bac-seconds').innerText = String(s).padStart(2, '0');
  } else {
    document.getElementById('bac-days-main').innerText = "0";
  }

  // Mise à jour du libellé de l'épreuve en bas de la Carte 1
  if (examFooterEl) {
    const day = String(activeExam.date.getDate()).padStart(2, '0');
    const month = activeExam.date.toLocaleString('fr-FR', { month: 'long' });
    const year = activeExam.date.getFullYear();
    const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    
    examFooterEl.innerText = `${activeExam.name} : ${day} ${formattedMonth} ${year}`;
  }

  // 3. Avancement Année Scolaire
  const totalYearMs = ACADEMIC_END - ACADEMIC_START;
  const elapsedMs = now - ACADEMIC_START;
  let percent = Math.min(Math.max((elapsedMs / totalYearMs) * 100, 0), 100).toFixed(0);

  document.getElementById('year-progress-percent').innerText = `${percent}%`;
  document.getElementById('year-progress-bar').style.width = `${percent}%`;

  const weeksPassed = Math.max(0, Math.floor(elapsedMs / (1000 * 60 * 60 * 24 * 7)));
  document.getElementById('weeks-counter').innerText = `${weeksPassed} semaines écoulées sur 43`;

  // 4. Prochaines Vacances selon la Zone choisie
  const zoneVacations = VACANCES_DATA[currentZone] || VACANCES_DATA['C'];
  const upcomingVac = zoneVacations.find(v => v.start > now);
  
  if (upcomingVac) {
    const vacDiff = upcomingVac.start - now;
    const vd = Math.floor(vacDiff / (1000 * 60 * 60 * 24));
    const vh = Math.floor((vacDiff / (1000 * 60 * 60)) % 24);

    document.getElementById('vac-days').innerText = String(vd).padStart(2, '0');
    document.getElementById('vac-hours').innerText = String(vh).padStart(2, '0');
    document.getElementById('vac-name').innerText = upcomingVac.name;
    document.getElementById('vac-zone').innerText = `[Zone ${currentZone}]`;
  } else {
    document.getElementById('vac-days').innerText = "00";
    document.getElementById('vac-hours').innerText = "00";
    document.getElementById('vac-name').innerText = "Vacances d'Été";
  }
}

function getRandomTip() {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  document.getElementById('daily-tip').innerText = `"${tip}"`;
}

// Événements lors du changement de sélection dans Mon Profil
if (selectZoneEl) {
  selectZoneEl.addEventListener('change', (e) => {
    currentZone = e.target.value;
    localStorage.setItem('bac_zone', currentZone);
    updateDashboard();
  });
}

if (selectLevelEl) {
  selectLevelEl.addEventListener('change', (e) => {
    currentLevel = e.target.value;
    localStorage.setItem('bac_level', currentLevel);
    updateDashboard();
  });
}

document.getElementById('refresh-tip-btn').addEventListener('click', getRandomTip);

// Initialisation au chargement de la page
getRandomTip();
updateDashboard();
setInterval(updateDashboard, 1000);