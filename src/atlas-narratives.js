// Individually authored alternate-history petitions for the twelve expanded atlas profiles.
const rows=[
 [
  "scotland",
  "border_lordships",
  "The border lordships",
  "A delegation from the marches asks the crown to clarify local defense obligations and the handling of disputes.",
  [
   "Hear the wardens and landholders",
   140,
   {
    "loyalty": 11,
    "trust": 6
   }
  ],
  [
   "Retain existing obligations",
   0,
   {
    "loyalty": -7,
    "unrest": 4
   }
  ],
  [
   "A witnessed border compact",
   "The representatives bring an agreed account of local obligations.",
   [
    "Record their compact",
    90,
    {
     "loyalty": 8,
     "legitimacy": 5
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
   "A landed household questions the previous settlement.",
   [
    "Arrange an impartial hearing",
    110,
    {
     "loyalty": 9,
     "unrest": -5
    }
   ],
   [
    "Leave the disagreement unresolved",
    0,
    {
     "loyalty": -4
    }
   ]
  ],
  [
   "Review the border obligations",
   180,
   {
    "loyalty": 14,
    "trust": 8
   },
   48
  ]
 ],
 [
  "brittany",
  "ducal_accounts",
  "The ducal accounts",
  "Officials ask the duchy to maintain a separate, reliable record of estates, dues and local jurisdiction.",
  [
   "Endow the accounting chamber",
   135,
   {
    "credit": 8,
    "trust": 5
   }
  ],
  [
   "Keep customary accounts",
   0,
   {
    "credit": -3
   }
  ],
  [
   "The chamber's record",
   "The accounting officials propose a witnessed copy of their records.",
   [
    "Fund the copies",
    85,
    {
     "credit": 7,
     "legitimacy": 4
    }
   ],
   [
    "Archive the original",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "A disputed entry",
   "A contributor disputes a recorded payment.",
   [
    "Reconcile the accounts",
    100,
    {
     "credit": 9,
     "trust": 5
    }
   ],
   [
    "Retain the existing entry",
    0,
    {
     "trust": -5
    }
   ]
  ],
  [
   "Strengthen ducal recordkeeping",
   175,
   {
    "credit": 12,
    "legitimacy": 6
   },
   48
  ]
 ],
 [
  "kalmar",
  "union_delegations",
  "Delegations of the crowns",
  "Representatives from the union's constituent kingdoms seek assurances that their separate customs will be respected.",
  [
   "Receive each delegation",
   160,
   {
    "acceptance": 10,
    "loyalty": 6
   }
  ],
  [
   "Insist on a common procedure",
   0,
   {
    "acceptance": -6,
    "unrest": 5
   }
  ],
  [
   "A negotiated understanding",
   "The delegates propose a written recognition of local custom.",
   [
    "Confirm the local assurances",
    95,
    {
     "acceptance": 8,
     "stability": 5
    }
   ],
   [
    "Record the proposals",
    0,
    {
     "legitimacy": 2
    }
   ]
  ],
  [
   "Objections to the procedure",
   "A delegation reports concern about unequal treatment.",
   [
    "Reconvene the hearing",
    125,
    {
     "acceptance": 9,
     "loyalty": 6
    }
   ],
   [
    "Dismiss the objections",
    0,
    {
     "unrest": 5
    }
   ]
  ],
  [
   "Convene union delegations",
   200,
   {
    "acceptance": 12,
    "stability": 7
   },
   48
  ]
 ],
 [
  "genoa",
  "merchant_notaries",
  "The merchants' notaries",
  "Merchants petition for reliable witnessed copies of commercial obligations before departing on maritime voyages.",
  [
   "Support the notarial offices",
   125,
   {
    "credit": 10,
    "trust": 4
   }
  ],
  [
   "Leave contracts to the merchants",
   0,
   {
    "credit": -3
   }
  ],
  [
   "A clear register",
   "The notaries have prepared a reliable copy of the obligations.",
   [
    "Endow the register",
    90,
    {
     "credit": 8,
     "prestige": 3
    }
   ],
   [
    "Keep the existing record",
    0,
    {
     "credit": 2
    }
   ]
  ],
  [
   "A contested obligation",
   "A merchant challenges the wording of a contract.",
   [
    "Hear the parties",
    100,
    {
     "credit": 7,
     "trust": 6
    }
   ],
   [
    "Decline to intervene",
    0,
    {
     "credit": -4
    }
   ]
  ],
  [
   "Commission merchant registers",
   170,
   {
    "credit": 13,
    "trust": 6
   },
   48
  ]
 ],
 [
  "venice",
  "maritime_supplies",
  "Supplies for maritime workshops",
  "Workshop stewards seek reliable stores of tools and materials for the republic's maritime commerce.",
  [
   "Fund local workshop stores",
   150,
   {
    "tools": 30,
    "development": 1
   }
  ],
  [
   "Preserve the existing allocation",
   0,
   {
    "tools": -3,
    "credit": -2
   }
  ],
  [
   "The workshop accounts",
   "The stewards report on the materials received.",
   [
    "Fund spare tools",
    95,
    {
     "tools": 20,
     "credit": 5
    }
   ],
   [
    "Accept the accounts",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "A shortage of materials",
   "Workshop officials report continuing difficulty obtaining supplies.",
   [
    "Replenish the stores",
    120,
    {
     "tools": 25,
     "development": 1
    }
   ],
   [
    "Defer the purchase",
    0,
    {
     "credit": -5
    }
   ]
  ],
  [
   "Provision maritime workshops",
   190,
   {
    "tools": 35,
    "development": 1
   },
   48
  ]
 ],
 [
  "cyprus",
  "island_petitions",
  "The island's petitions",
  "Residents from different religious and linguistic communities request a hearing concerning local administration.",
  [
   "Receive representatives of the communities",
   130,
   {
    "trust": 9,
    "acceptance": 8
   }
  ],
  [
   "Retain ordinary procedures",
   0,
   {
    "trust": -5
   }
  ],
  [
   "An agreed hearing",
   "The representatives report a better understanding of the local arrangements.",
   [
    "Support further consultation",
    80,
    {
     "trust": 7,
     "acceptance": 6
    }
   ],
   [
    "Record their account",
    0,
    {
     "legitimacy": 2
    }
   ]
  ],
  [
   "An unresolved petition",
   "Several residents believe their concerns were not heard.",
   [
    "Invite another delegation",
    105,
    {
     "trust": 9,
     "unrest": -5
    }
   ],
   [
    "Reject the further request",
    0,
    {
     "acceptance": -4
    }
   ]
  ],
  [
   "Consult the island communities",
   175,
   {
    "trust": 12,
    "acceptance": 10
   },
   48
  ]
 ],
 [
  "oirats",
  "confederate_provisions",
  "Provisions for the confederate gathering",
  "Regional representatives request food reserves and arrangements for a political gathering.",
  [
   "Provision the gathering",
   115,
   {
    "food": 55,
    "loyalty": 8
   }
  ],
  [
   "Rely on customary provisioning",
   0,
   {
    "food": -15,
    "loyalty": -4
   }
  ],
  [
   "A supported gathering",
   "The delegates agree on the allocation of supplies.",
   [
    "Fund additional stores",
    85,
    {
     "food": 45,
     "trust": 6
    }
   ],
   [
    "Accept the allocation",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "A contested allocation",
   "Some households report that their share was inadequate.",
   [
    "Review the distribution",
    100,
    {
     "food": 35,
     "loyalty": 8
    }
   ],
   [
    "Retain the allocation",
    0,
    {
     "loyalty": -5
    }
   ]
  ],
  [
   "Provide for the confederate council",
   160,
   {
    "food": 70,
    "loyalty": 9
   },
   48
  ]
 ],
 [
  "chagatai",
  "caravan_shelters",
  "Shelters along the caravan route",
  "Travelers and local households seek maintained rest places and provisions along an established exchange route.",
  [
   "Endow rest places",
   120,
   {
    "grain": 20,
    "trust": 7
   }
  ],
  [
   "Leave maintenance to local custom",
   0,
   {
    "trust": -4
   }
  ],
  [
   "The travelers' account",
   "Travelers report that the provisions have improved their journeys.",
   [
    "Maintain the stores",
    85,
    {
     "grain": 20,
     "credit": 5
    }
   ],
   [
    "Record the report",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "An insufficient reserve",
   "A household reports that provisions are running low.",
   [
    "Fund additional reserves",
    105,
    {
     "grain": 25,
     "trust": 5
    }
   ],
   [
    "Defer the allocation",
    0,
    {
     "credit": -4
    }
   ]
  ],
  [
   "Maintain caravan provisions",
   165,
   {
    "grain": 35,
    "credit": 7
   },
   48
  ]
 ],
 [
  "tibet",
  "institutional_patronage",
  "The institutional delegation",
  "Religious and regional representatives petition for support of their local institutions and scholarly work.",
  [
   "Endow local institutions",
   145,
   {
    "faithAuthority": 8,
    "devotion": 7
   }
  ],
  [
   "Retain ordinary patronage",
   0,
   {
    "faithAuthority": -3
   }
  ],
  [
   "A record of the endowment",
   "Representatives propose a witnessed record of the institutional support.",
   [
    "Fund the documentation",
    90,
    {
     "faithAuthority": 6,
     "trust": 6
    }
   ],
   [
    "Accept their testimony",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "A disputed contribution",
   "An institution questions the distribution of support.",
   [
    "Hear the institutional representatives",
    110,
    {
     "faithAuthority": 7,
     "trust": 7
    }
   ],
   [
    "Decline further support",
    0,
    {
     "devotion": -4
    }
   ]
  ],
  [
   "Support regional institutions",
   190,
   {
    "faithAuthority": 11,
    "devotion": 9
   },
   48
  ]
 ],
 [
  "lanxang",
  "river_exchange",
  "River exchange and provisions",
  "Communities involved in riverine exchange request support for local provisions and market facilities.",
  [
   "Provide for the market settlements",
   125,
   {
    "grain": 25,
    "development": 1
   }
  ],
  [
   "Keep existing arrangements",
   0,
   {
    "grain": -4
   }
  ],
  [
   "A renewed exchange",
   "Local representatives report improved access to provisions.",
   [
    "Fund a communal reserve",
    90,
    {
     "grain": 20,
     "trust": 6
    }
   ],
   [
    "Receive the account",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "An uneven distribution",
   "Residents of a settlement report difficulty obtaining their share.",
   [
    "Review local allocation",
    110,
    {
     "grain": 25,
     "trust": 7
    }
   ],
   [
    "Leave the allocation unchanged",
    0,
    {
     "unrest": 4
    }
   ]
  ],
  [
   "Support river market provisions",
   175,
   {
    "grain": 35,
    "development": 1
   },
   48
  ]
 ],
 [
  "sunda",
  "regional_markets",
  "Petitions from the regional markets",
  "Market representatives ask for reliable local arrangements for tools, produce and exchange.",
  [
   "Support market facilities",
   130,
   {
    "tools": 20,
    "credit": 7
   }
  ],
  [
   "Retain ordinary market arrangements",
   0,
   {
    "credit": -3
   }
  ],
  [
   "A useful market record",
   "The representatives report improved exchange.",
   [
    "Support the record and supplies",
    90,
    {
     "tools": 15,
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
   "A disputed market arrangement",
   "Local residents seek clarification of the exchange rules.",
   [
    "Convene a local hearing",
    105,
    {
     "credit": 8,
     "trust": 7
    }
   ],
   [
    "Decline the hearing",
    0,
    {
     "trust": -5
    }
   ]
  ],
  [
   "Support local market institutions",
   180,
   {
    "tools": 25,
    "credit": 10
   },
   48
  ]
 ],
 [
  "zayyanid",
  "tlemcen_exchange",
  "The Tlemcen exchange petition",
  "Merchants and local representatives request support for reliable exchange and provisioning near the court.",
  [
   "Support the market and caravan stores",
   140,
   {
    "credit": 9,
    "grain": 20
   }
  ],
  [
   "Keep customary arrangements",
   0,
   {
    "credit": -3
   }
  ],
  [
   "A record of renewed exchange",
   "The merchants report that the arrangements have improved confidence.",
   [
    "Maintain the market records",
    85,
    {
     "credit": 7,
     "prestige": 4
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
   "A renewed provisioning dispute",
   "A group of travelers reports continuing difficulties with supplies.",
   [
    "Arrange local arbitration",
    110,
    {
     "grain": 25,
     "trust": 7
    }
   ],
   [
    "Leave the issue to the merchants",
    0,
    {
     "credit": -4
    }
   ]
  ],
  [
   "Endow caravan exchange facilities",
   185,
   {
    "credit": 12,
    "grain": 30
   },
   48
  ]
 ]
];
export function atlasEvents(E,C){return rows.flatMap(([realm,id,title,desc,a,b,yes,no])=>{const k='regional_'+id;return [E(k,'Regional',title,desc,'region_'+realm,[C(...a,k+'_agreement'),C(...b,k+'_grievance')]),E(k+'_agreement','Regional',yes[0],yes[1],'followup',[C(...yes[2]),C(...yes[3])]),E(k+'_grievance','Regional',no[0],no[1],'followup',[C(...no[2]),C(...no[3])])];});}
export function atlasDecisions(D){return rows.map(([realm,id,title,desc,a,b,yes,no,d])=>D('decision_'+id,'Regional',d[0],desc,'region_'+realm,d[1],d[2],d[3]));}
