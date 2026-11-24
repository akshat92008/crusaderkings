// Source-backed historical context, separate from simulated ownership and rulers.
export const HISTORICAL_CONTEXT=Object.freeze({
  "england": {
    "title": "England in 1450",
    "context": "Henry VI's claim to France was increasingly difficult to sustain as the Hundred Years' War approached its end.",
    "source": "Royal Armouries — The Hundred Years' War",
    "url": "https://royalarmouries.org/objects-and-stories/stories/the-hundred-years-war-1337-1453",
    "year": 1450
  },
  "france": {
    "title": "France in 1450",
    "context": "Charles VII's recovery of French territory transformed the closing years of the Hundred Years' War. The campaign does not force the historical outcome.",
    "source": "Royal Armouries — The Hundred Years' War",
    "url": "https://royalarmouries.org/objects-and-stories/stories/the-hundred-years-war-1337-1453",
    "year": 1450
  },
  "vijayanagara": {
    "title": "Vijayanagara in the mid-fifteenth century",
    "context": "The southern empire remained a major regional power after Deva Raya II's death. Relations with Deccan courts were shaped by both conflict and alliances.",
    "source": "Metropolitan Museum of Art — South Asia chronology",
    "url": "https://www.metmuseum.org/toah/ht/08/ssa.html",
    "year": 1450
  },
  "bahmani": {
    "title": "The Bahmani Sultanate",
    "context": "Founded in 1347, the sultanate was still a major Deccan polity in 1450; its later division into successor states had not yet occurred.",
    "source": "Metropolitan Museum of Art — South Asia chronology",
    "url": "https://www.metmuseum.org/toah/ht/08/ssa.html",
    "year": 1450
  },
  "delhi": {
    "title": "Delhi at a dynastic transition",
    "context": "The Sayyid dynasty was nearing the end of its rule; the Lodi dynasty succeeded it in 1451. This transition is historical context, not a forced game event.",
    "source": "Metropolitan Museum of Art — South Asia chronology",
    "url": "https://www.metmuseum.org/toah/ht/08/ssa.html",
    "year": 1450
  },
  "ming": {
    "title": "Ming after the Tumu crisis",
    "context": "The capture of the Zhengtong emperor in 1449 led to the accession of his half-brother, the Jingtai emperor. The political crisis influenced military and court institutions.",
    "source": "UC Berkeley — Taming the Army",
    "url": "https://escholarship.org/uc/item/4p79j55k",
    "year": 1450
  },
  "joseon": {
    "title": "Joseon and Ming diplomacy",
    "context": "The court navigated a period of political change in China following the 1449 crisis while maintaining its diplomatic relationship with Ming.",
    "source": "Korea Citation Index — Jingtai reign and Joseon diplomacy",
    "url": "https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART003003444",
    "year": 1450
  },
  "mamluks": {
    "title": "Mamluk political institutions",
    "context": "The Burji period involved a military elite with forms of advancement and succession that were not exclusively hereditary. Cairo and eastern Mediterranean cities benefited from trade and patronage.",
    "source": "Metropolitan Museum of Art — The Art of the Mamluk Period",
    "url": "https://www.metmuseum.org/pt/essays/the-art-of-the-mamluk-period-1250-1517",
    "year": 1450
  },
  "mexica": {
    "title": "The Triple Alliance in the fifteenth century",
    "context": "Expansion across the Basin of Mexico and urban development at Tenochtitlan formed part of a changing regional political landscape. Later imperial extent is not assumed for 1450.",
    "source": "Metropolitan Museum of Art — Mexico chronology",
    "url": "https://artistproject.metmuseum.org/toah/ht/08/canm.html",
    "year": 1450
  },
  "inca": {
    "title": "Andean consolidation",
    "context": "Inca expansion from the Cuzco region was underway during the fifteenth century. The empire's much larger later extent should not be read back into the starting year.",
    "source": "Metropolitan Museum of Art — Central and Southern Andes",
    "url": "https://82nd-and-fifth.metmuseum.org/toah/ht/08/sanc.html",
    "year": 1450
  },
  "maya": {
    "title": "Maya political diversity",
    "context": "The region contained multiple political communities, including the expanding K’iche’ kingdom in the Guatemalan highlands. The single playable profile is a gameplay abstraction.",
    "source": "Metropolitan Museum of Art — Maya Area chronology",
    "url": "https://artistproject.metmuseum.org/toah/ht/08/cana.html",
    "year": 1450
  }
});
export function historicalContext(id){return Object.hasOwn(HISTORICAL_CONTEXT,id)?HISTORICAL_CONTEXT[id]:null;}
export const HISTORICAL_LIMITATION='Historical reference only. Playable borders, population values, character generation, institutions and alternate outcomes are approximations, not a verified reconstruction.';
