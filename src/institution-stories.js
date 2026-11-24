// Distinct alternate-history narrative chains tied to actual institutional records.
import {controller} from './campaign-war.js';
import {isImprisoned} from './feudal-systems.js';
const rows=[
 [
  "assembly_ratification",
  "Government",
  "Witnesses to the assembly vote",
  "A recently approved institutional motion has prompted requests for a witnessed public record.",
  "recentMotionPassed",
  [
   "Publish the ratified obligations",
   100,
   {
    "legitimacy": 5,
    "trust": 6
   }
  ],
  [
   "Retain the ordinary minutes",
   0,
   {
    "trust": 1
   }
  ],
  [
   "The ratified record",
   "Local representatives accept the wording of the institutional agreement.",
   [
    "Fund additional copies",
    80,
    {
     "trust": 7,
     "legitimacy": 3
    }
   ],
   [
    "Archive the record",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "Questions of interpretation",
   "Several representatives ask for clarification of the adopted obligations.",
   [
    "Receive their petitions",
    110,
    {
     "trust": 8,
     "unrest": -5
    }
   ],
   [
    "Decline another hearing",
    0,
    {
     "trust": -4
    }
   ]
  ],
  [
   "Publish the assembly settlement",
   145,
   {
    "legitimacy": 8,
    "trust": 9
   },
   36
  ]
 ],
 [
  "assembly_rejection",
  "Government",
  "After a rejected motion",
  "A recent assembly rejected a proposal. Delegates ask whether the court will recognize the result.",
  "recentMotionRejected",
  [
   "Respect the vote and hear concerns",
   100,
   {
    "trust": 8,
    "stability": 3
   }
  ],
  [
   "Dismiss the objections",
   0,
   {
    "trust": -5
   }
  ],
  [
   "An agreed account of the vote",
   "Delegates accept that the rejected proposal will not be imposed.",
   [
    "Record the remaining concerns",
    85,
    {
     "legitimacy": 4,
     "trust": 6
    }
   ],
   [
    "Close the assembly",
    0,
    {
     "stability": 1
    }
   ]
  ],
  [
   "Concern about future proposals",
   "Representatives fear that the court may disregard the vote in future.",
   [
    "Arrange a further hearing",
    115,
    {
     "trust": 10,
     "stability": 4
    }
   ],
   [
    "End further discussion",
    0,
    {
     "trust": -5
    }
   ]
  ],
  [
   "Recognize the rejected motion",
   150,
   {
    "trust": 12,
    "stability": 5
   },
   36
  ]
 ],
 [
  "merchant_election_record",
  "Economy",
  "The elected merchant chair",
  "A recent merchant election produced a new record of obligations to the assembly.",
  "recentMerchantWinner",
  [
   "Receive the elected representative",
   95,
   {
    "credit": 7,
    "prestige": 3
   }
  ],
  [
   "Send customary congratulations",
   0,
   {
    "prestige": 1
   }
  ],
  [
   "A reliable commercial record",
   "The chair proposes a clearer accounting procedure.",
   [
    "Support a public register",
    85,
    {
     "credit": 8,
     "trust": 5
    }
   ],
   [
    "Retain the existing records",
    0,
    {
     "credit": 2
    }
   ]
  ],
  [
   "A disputed commercial account",
   "Merchants question how the elected chair will handle obligations.",
   [
    "Hear the merchants",
    110,
    {
     "credit": 8,
     "trust": 6
    }
   ],
   [
    "Leave the matter to the assembly",
    0,
    {
     "credit": -4
    }
   ]
  ],
  [
   "Recognize the merchant assembly result",
   140,
   {
    "credit": 11,
    "trust": 7
   },
   36
  ]
 ],
 [
  "merchant_election_minorities",
  "Economy",
  "The unsuccessful merchant candidate",
  "The defeated merchant candidate requests a hearing about the interests represented in the recent election.",
  "recentMerchantRunnerUp",
  [
   "Hear the competing commercial interests",
   100,
   {
    "credit": 6,
    "trust": 5
   }
  ],
  [
   "Keep the election proceedings closed",
   0,
   {
    "credit": -3
   }
  ],
  [
   "A constructive minority",
   "The defeated candidate acknowledges a fair hearing.",
   [
    "Record their recommendations",
    80,
    {
     "credit": 6,
     "trust": 6
    }
   ],
   [
    "Thank the delegation",
    0,
    {
     "trust": 2
    }
   ]
  ],
  [
   "Unsettled commercial grievances",
   "Supporters of the unsuccessful candidate question how their interests will be represented.",
   [
    "Arrange an impartial review",
    115,
    {
     "credit": 8,
     "trust": 7
    }
   ],
   [
    "Decline further review",
    0,
    {
     "credit": -5
    }
   ]
  ],
  [
   "Hear the unsuccessful merchant delegation",
   150,
   {
    "credit": 10,
    "trust": 8
   },
   36
  ]
 ],
 [
  "civil_service_certificate",
  "Government",
  "The examination certificate",
  "A qualified candidate from the recent civil-service examinations requests a witnessed record of merit.",
  "recentImperialExam",
  [
   "Recognize the candidate's qualification",
   90,
   {
    "prestige": 4,
    "legitimacy": 4
   }
  ],
  [
   "Record the result privately",
   0,
   {
    "prestige": 1
   }
  ],
  [
   "A respected qualification",
   "The candidate's documented qualification is recognized at court.",
   [
    "Support the examination records",
    85,
    {
     "prestige": 5,
     "legitimacy": 3
    }
   ],
   [
    "Retain the ordinary record",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "Questions about the examination",
   "Court officials ask that the standards be explained to future candidates.",
   [
    "Fund a written explanation",
    110,
    {
     "legitimacy": 6,
     "trust": 5
    }
   ],
   [
    "Leave the standards unchanged",
    0,
    {
     "legitimacy": -3
    }
   ]
  ],
  [
   "Preserve the civil-service examination records",
   140,
   {
    "prestige": 7,
    "legitimacy": 6
   },
   36
  ]
 ],
 [
  "imperial_governor_accounts",
  "Government",
  "The governor's disputed accounts",
  "A current imperial governor has accumulated administrative corruption; local officials request an independent review.",
  "corruptImperialOffice",
  [
   "Fund an independent review",
   110,
   {
    "officeCorruption": -12,
    "trust": 6
   }
  ],
  [
   "Retain the governor's accounts",
   0,
   {
    "officeCorruption": 3,
    "trust": -3
   }
  ],
  [
   "The corrected accounts",
   "The governor's office provides more reliable records.",
   [
    "Support continued oversight",
    90,
    {
     "officeCorruption": -10,
     "legitimacy": 3
    }
   ],
   [
    "Accept the revised accounts",
    0,
    {
     "officeCorruption": -2
    }
   ]
  ],
  [
   "Persistent discrepancies",
   "The office's accounts remain disputed.",
   [
    "Commission a further review",
    130,
    {
     "officeCorruption": -16,
     "trust": 6
    }
   ],
   [
    "Close the review",
    0,
    {
     "officeCorruption": 4
    }
   ]
  ],
  [
   "Review the imperial governor's accounts",
   165,
   {
    "officeCorruption": -18,
    "trust": 8
   },
   36
  ]
 ],
 [
  "regional_grant_witness",
  "Government",
  "Witnesses to a regional grant",
  "A currently recognized local lord requests a witnessed account of the obligations attached to the grant.",
  "activeRegionalGrant",
  [
   "Hear the lord and local witnesses",
   105,
   {
    "loyalty": 8,
    "trust": 6
   }
  ],
  [
   "Retain the ordinary grant record",
   0,
   {
    "loyalty": 1
   }
  ],
  [
   "An agreed interpretation",
   "Representatives acknowledge a clearer account of their local obligations.",
   [
    "Record the understanding",
    85,
    {
     "loyalty": 7,
     "trust": 5
    }
   ],
   [
    "Accept the testimony",
    0,
    {
     "trust": 2
    }
   ]
  ],
  [
   "A disputed local obligation",
   "The lord's representatives question the interpretation of the grant.",
   [
    "Arrange a legal hearing",
    120,
    {
     "loyalty": 10,
     "unrest": -4
    }
   ],
   [
    "Leave the interpretation unchanged",
    0,
    {
     "loyalty": -5
    }
   ]
  ],
  [
   "Witness the regional grant obligations",
   155,
   {
    "loyalty": 12,
    "trust": 8
   },
   36
  ]
 ],
 [
  "sultanate_scholarly_record",
  "Religion",
  "The sponsored scholar's record",
  "A currently supported religious scholar requests assistance preserving a collection of scholarly correspondence.",
  "activeSultanateScholar",
  [
   "Fund the copies",
   100,
   {
    "faithAuthority": 6,
    "prestige": 3
   }
  ],
  [
   "Keep the originals",
   0,
   {
    "faithAuthority": 1
   }
  ],
  [
   "The preserved correspondence",
   "The scholar reports that the collection is now accessible to local students.",
   [
    "Support another set of copies",
    85,
    {
     "faithAuthority": 5,
     "trust": 5
    }
   ],
   [
    "Accept the collection",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "An incomplete collection",
   "Several requested materials remain unavailable.",
   [
    "Fund further correspondence",
    110,
    {
     "faithAuthority": 7,
     "prestige": 3
    }
   ],
   [
    "Accept the remaining gap",
    0,
    {
     "faithAuthority": -3
    }
   ]
  ],
  [
   "Preserve the sponsored scholar's work",
   145,
   {
    "faithAuthority": 9,
    "prestige": 5
   },
   36
  ]
 ],
 [
  "shogunal_mediation_records",
  "Government",
  "The mediated household agreement",
  "A current mediation between leading warrior houses requires a record of the agreed local obligations.",
  "activeHouseMediation",
  [
   "Fund a witnessed account",
   115,
   {
    "stability": 5,
    "trust": 6
   }
  ],
  [
   "Leave the agreement informal",
   0,
   {
    "trust": -3
   }
  ],
  [
   "Recognized household obligations",
   "The representatives acknowledge the account of the mediation.",
   [
    "Support the written record",
    90,
    {
     "stability": 4,
     "legitimacy": 4
    }
   ],
   [
    "Accept their acknowledgment",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "A disputed interpretation",
   "One household questions the wording of the current agreement.",
   [
    "Convene a clarifying hearing",
    125,
    {
     "trust": 9,
     "stability": 4
    }
   ],
   [
    "Decline to reopen the record",
    0,
    {
     "stability": -4
    }
   ]
  ],
  [
   "Witness the household mediation",
   165,
   {
    "stability": 7,
    "trust": 8
   },
   36
  ]
 ],
 [
  "steppe_pasture_records",
  "Government",
  "The shared pasture reserve",
  "A current seasonal pasture agreement has prompted clan representatives to discuss local provisioning.",
  "activePastureReserve",
  [
   "Fund additional shared provisions",
   90,
   {
    "food": 40,
    "trust": 5
   }
  ],
  [
   "Keep the existing allocation",
   0,
   {
    "trust": -3
   }
  ],
  [
   "A well-provisioned gathering",
   "Representatives acknowledge that the current reserve has eased local difficulties.",
   [
    "Maintain the additional stocks",
    75,
    {
     "food": 35,
     "prestige": 3
    }
   ],
   [
    "Record the account",
    0,
    {
     "trust": 2
    }
   ]
  ],
  [
   "A disputed allocation",
   "A household questions the distribution of provisions.",
   [
    "Support a further allocation",
    105,
    {
     "food": 40,
     "trust": 6
    }
   ],
   [
    "Keep the allocation unchanged",
    0,
    {
     "trust": -4
    }
   ]
  ],
  [
   "Provision the seasonal pasture reserve",
   130,
   {
    "food": 60,
    "trust": 8
   },
   36
  ]
 ],
 [
  "crown_inspection_aftercare",
  "Government",
  "The implemented inspection",
  "A completed royal inspection and its implemented recommendations have prompted requests for follow-up oversight.",
  "recentCrownInspection",
  [
   "Visit the inspected district",
   105,
   {
    "unrest": -7,
    "trust": 6
   }
  ],
  [
   "Retain the existing report",
   0,
   {
    "trust": 1
   }
  ],
  [
   "The district's new account",
   "Residents describe the effect of the implemented recommendations.",
   [
    "Fund a further local review",
    85,
    {
     "unrest": -5,
     "trust": 6
    }
   ],
   [
    "Accept the report",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "Persistent administrative concerns",
   "Residents report that several difficulties remain after the inspection.",
   [
    "Commission follow-up oversight",
    120,
    {
     "unrest": -8,
     "trust": 8
    }
   ],
   [
    "Close the inspection record",
    0,
    {
     "trust": -4
    }
   ]
  ],
  [
   "Follow up the implemented inspection",
   150,
   {
    "unrest": -10,
    "trust": 9
   },
   36
  ]
 ],
 [
  "confederate_relief_minutes",
  "Government",
  "The member relief fund",
  "A recent member assembly considered a common relief fund. Representatives ask for an account of the collective vote.",
  "recentConfederateVote",
  [
   "Receive the participating chiefs",
   105,
   {
    "trust": 7,
    "legitimacy": 4
   }
  ],
  [
   "Retain the customary account",
   0,
   {
    "trust": 1
   }
  ],
  [
   "An accepted assembly record",
   "Representatives acknowledge the documented collective decision.",
   [
    "Support its preservation",
    80,
    {
     "trust": 6,
     "stability": 3
    }
   ],
   [
    "Archive the record",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "Questions from participating chiefs",
   "A representative asks whether their objections were accurately recorded.",
   [
    "Arrange a further hearing",
    110,
    {
     "trust": 8,
     "legitimacy": 4
    }
   ],
   [
    "Decline further discussion",
    0,
    {
     "trust": -5
    }
   ]
  ],
  [
   "Record the member assembly decision",
   145,
   {
    "trust": 10,
    "legitimacy": 6
   },
   36
  ]
 ],
 [
  "retainer_commission_record",
  "Government",
  "The retainer service record",
  "A completed military household service commission has generated a request to clarify the recognition of service.",
  "recentMilitaryProgram",
  [
   "Record the household's contribution",
   100,
   {
    "loyalty": 8,
    "prestige": 4
   }
  ],
  [
   "Send ordinary thanks",
   0,
   {
    "loyalty": 1
   }
  ],
  [
   "The household's acknowledgment",
   "Representatives acknowledge the recognition of their service.",
   [
    "Endow a further record",
    85,
    {
     "loyalty": 7,
     "prestige": 3
    }
   ],
   [
    "Accept the account",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "Questions over recognition",
   "The household's representatives ask for clarification of their contribution.",
   [
    "Receive the household",
    115,
    {
     "loyalty": 10,
     "trust": 5
    }
   ],
   [
    "Decline another hearing",
    0,
    {
     "loyalty": -4
    }
   ]
  ],
  [
   "Recognize completed household service",
   145,
   {
    "loyalty": 12,
    "prestige": 6
   },
   36
  ]
 ],
 [
  "urban_works_accounts",
  "Economy",
  "The completed public works",
  "A city institution has completed a public-works program, and residents request an account of the materials and results.",
  "recentCityProgram",
  [
   "Publish the local works accounts",
   105,
   {
    "trust": 7,
    "tools": 15
   }
  ],
  [
   "Retain the existing record",
   0,
   {
    "trust": 1
   }
  ],
  [
   "A useful public record",
   "Residents report that the account has clarified the maintenance obligations.",
   [
    "Provide maintenance materials",
    90,
    {
     "tools": 20,
     "trust": 5
    }
   ],
   [
    "Accept the account",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "Unresolved maintenance concerns",
   "Residents report that some work requires additional attention.",
   [
    "Support maintenance",
    120,
    {
     "tools": 25,
     "unrest": -5
    }
   ],
   [
    "Leave maintenance to residents",
    0,
    {
     "trust": -4
    }
   ]
  ],
  [
   "Support the completed city works",
   155,
   {
    "tools": 30,
    "trust": 9
   },
   36
  ]
 ],
 [
  "community_food_accounts",
  "Government",
  "The communal food allocation",
  "A completed kinship-based food allocation has prompted local representatives to review the distribution.",
  "recentKinshipProgram",
  [
   "Hear the households and support stores",
   90,
   {
    "grain": 20,
    "trust": 7
   }
  ],
  [
   "Retain the customary allocation",
   0,
   {
    "trust": 1
   }
  ],
  [
   "The community's account",
   "Representatives report improved confidence in local food arrangements.",
   [
    "Support further storage",
    75,
    {
     "grain": 20,
     "trust": 5
    }
   ],
   [
    "Accept the report",
    0,
    {
     "trust": 2
    }
   ]
  ],
  [
   "An uneven distribution",
   "Some households report that their needs were not addressed.",
   [
    "Support an additional allocation",
    105,
    {
     "grain": 25,
     "trust": 8
    }
   ],
   [
    "Keep the existing allocation",
    0,
    {
     "trust": -4
    }
   ]
  ],
  [
   "Follow up communal food allocation",
   130,
   {
    "grain": 35,
    "trust": 9
   },
   36
  ]
 ]
];
export function institutionEvents(E,C){return rows.flatMap(([id,cat,title,desc,trigger,a,b,yes,no])=>[E(id,cat,title,desc,trigger,[C(...a,id+'_agreement'),C(...b,id+'_objection')]),E(id+'_agreement',cat,yes[0],yes[1],'followup',[C(...yes[2]),C(...yes[3])]),E(id+'_objection',cat,no[0],no[1],'followup',[C(...no[2]),C(...no[3])])]);}
export function institutionDecisions(D){return rows.map(([id,cat,title,desc,trigger,,,,,d])=>D('decision_'+id,cat,d[0],desc,trigger,d[1],d[2],d[3]));}
const adult=(g,r,id)=>{const p=g.politics.people[id];return p?.alive&&p.realm===r&&p.age>=18&&!isImprisoned(g,id);};
const recent=(g,x,n=18)=>Number.isFinite(x?.turn)&&x.turn<=g.turn&&g.turn-x.turn<=n;
const own=(g,r,id)=>g.provinces[id]?.owner===r&&controller(g,id)===r;
export function institutionStoryContext(g,r,head,land){
 const s=g.institutions?.realms[r],type=g.civic.realms[r]?.government,out={};if(!s||!type||!head?.alive||!land.length)return out;
 const first=land[0].id,base={actor:head.id,person:head.id,province:first};
 const marker=(kind,record,extra={})=>({...base,...extra,governmentStory:{kind,type,...record}});
 const motion=s.deliberation?.government===type?s.deliberation.history?.find(x=>recent(g,x)):null;
 if(motion)out[motion.passed?'recentMotionPassed':'recentMotionRejected']=marker('motion',{turn:motion.turn,passed:motion.passed,enact:motion.enact});
 if(['republic','city'].includes(type)){const x=s.election?.history?.find(x=>recent(g,x));if(x){if(adult(g,r,x.winner))out.recentMerchantWinner=marker('election',{turn:x.turn,winner:x.winner,person:x.winner},{person:x.winner});if(adult(g,r,x.runnerUp))out.recentMerchantRunnerUp=marker('election',{turn:x.turn,winner:x.winner,person:x.runnerUp},{person:x.runnerUp});}}
 if(type==='imperial'){
  const exam=Object.entries(s.civilService?.exams||{}).find(([id,x])=>x.rank>0&&recent(g,{turn:x.last})&&adult(g,r,id));if(exam)out.recentImperialExam=marker('exam',{person:exam[0],turn:exam[1].last,rank:exam[1].rank},{person:exam[0]});
  const office=land.find(p=>{const o=s.offices?.[p.id];return o&&o.corruption>=20&&adult(g,r,o.person);});if(office)out.corruptImperialOffice=marker('office',{person:s.offices[office.id].person},{province:office.id,person:s.offices[office.id].person});
 }
 if(type==='regional'){const p=land.find(p=>{const x=s.regionalPolitics?.grants?.[p.id];return x&&x.until-g.turn>=6&&g.politics.holdings[p.id]?.lord===x.lord&&adult(g,r,x.lord);});if(p){const x=s.regionalPolitics.grants[p.id];out.activeRegionalGrant=marker('grant',{person:x.lord,until:x.until},{province:p.id,person:x.lord});}}
 if(type==='sultanate'){const x=s.regionalPolitics?.scholar;if(x&&x.until-g.turn>=6&&x.faith===g.civic.realms[r].faith&&adult(g,r,x.person))out.activeSultanateScholar=marker('scholar',{person:x.person,until:x.until,faith:x.faith},{person:x.person});}
 if(type==='shogunate'){const x=s.regionalPolitics?.mediation;if(x&&x.until-g.turn>=6&&Array.isArray(x.houses)&&x.houses.length===2)out.activeHouseMediation=marker('mediation',{until:x.until,houses:[...x.houses]});}
 if(type==='steppe'&&(s.pastureUntil??0)-g.turn>=6)out.activePastureReserve=marker('pasture',{until:s.pastureUntil});
 if(type==='centralized'){const x=s.procedures?.history?.find(x=>recent(g,x)&&land.some(p=>x.message==='Royal inspection recommendations were implemented in '+p.id+'.'));if(x){const p=land.find(p=>x.message==='Royal inspection recommendations were implemented in '+p.id+'.');out.recentCrownInspection=marker('procedure',{turn:x.turn,message:x.message},{province:p.id});}}
 if(type==='confederation'){const x=s.procedures?.history?.find(x=>recent(g,x)&&x.message.startsWith('Member relief fund '));if(x)out.recentConfederateVote=marker('procedure',{turn:x.turn,message:x.message});}
 if(['military','city','kinship'].includes(type)){const x=s.localPrograms?.history?.find(x=>recent(g,x)&&land.some(p=>x.message==='The institutional program in '+p.id+' was completed.'));if(x){const p=land.find(p=>x.message==='The institutional program in '+p.id+' was completed.');const trigger={military:'recentMilitaryProgram',city:'recentCityProgram',kinship:'recentKinshipProgram'}[type];out[trigger]=marker('program',{turn:x.turn,message:x.message},{province:p.id});}}
 return out;
}
export function institutionStoryValid(g,r,t){
 const m=t?.governmentStory;if(!m)return true;const s=g.institutions?.realms[r];if(!s||g.civic.realms[r]?.government!==m.type||!own(g,r,t.province))return false;
 if(m.kind==='motion')return s.deliberation?.government===m.type&&!!s.deliberation.history?.some(x=>x.turn===m.turn&&x.passed===m.passed&&x.enact===m.enact);
 if(m.kind==='election')return adult(g,r,m.person)&&!!s.election?.history?.some(x=>x.turn===m.turn&&x.winner===m.winner&&[x.winner,x.runnerUp].includes(m.person));
 if(m.kind==='exam'){const x=s.civilService?.exams?.[m.person];return adult(g,r,m.person)&&x?.last===m.turn&&x.rank===m.rank;}
 if(m.kind==='office')return adult(g,r,m.person)&&s.offices?.[t.province]?.person===m.person;
 if(m.kind==='grant'){const x=s.regionalPolitics?.grants?.[t.province];return adult(g,r,m.person)&&x?.until===m.until&&x.until>g.turn&&x.lord===m.person&&g.politics.holdings[t.province]?.lord===m.person;}
 if(m.kind==='scholar'){const x=s.regionalPolitics?.scholar;return adult(g,r,m.person)&&x?.until===m.until&&x.until>g.turn&&x.person===m.person&&x.faith===m.faith&&g.civic.realms[r].faith===m.faith;}
 if(m.kind==='mediation'){const x=s.regionalPolitics?.mediation;return x?.until===m.until&&x.until>g.turn&&JSON.stringify(x.houses)===JSON.stringify(m.houses);}
 if(m.kind==='pasture')return s.pastureUntil===m.until&&m.until>g.turn;
 if(m.kind==='procedure'||m.kind==='program'){const history=m.kind==='procedure'?s.procedures?.history:s.localPrograms?.history;return !!history?.some(x=>x.turn===m.turn&&x.message===m.message);}
 return false;
}
export function institutionEffectAvailable(g,r,t,key){return key==='officeCorruption'&&t?.governmentStory?.kind==='office'&&institutionStoryValid(g,r,t)&&Number.isFinite(g.institutions.realms[r].offices[t.province].corruption);}
export function applyInstitutionEffect(g,r,t,key,n){if(!institutionEffectAvailable(g,r,t,key))return;const o=g.institutions.realms[r].offices[t.province];o.corruption=Math.max(0,Math.min(100,o.corruption+n));}
