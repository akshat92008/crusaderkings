// Individually authored, context-bound scenarios. No generated permutations.
const rows=[
 [
  "sanctuary_hostel",
  "Religion",
  "The crowded sanctuary",
  "Visitors are sleeping in the open near a recognized sanctuary.",
  "sanctuary",
  [
   "Endow a guesthouse",
   145,
   {
    "trust": 10,
    "devotion": 7
   }
  ],
  [
   "Leave hospitality to local hosts",
   0,
   {
    "trust": -4
   }
  ],
  [
   "A roof for the travelers",
   "The new hostel requires a steward and provisions.",
   [
    "Fund a steward and provisions",
    80,
    {
     "trust": 8,
     "faithAuthority": 5
    }
   ],
   [
    "Leave it to the hosts",
    0,
    {
     "devotion": 2
    }
   ]
  ],
  [
   "A petition from the road",
   "Pilgrims ask for better arrangements before the next gathering.",
   [
    "Provide shared lodging",
    115,
    {
     "trust": 8,
     "devotion": 4
    }
   ],
   [
    "Decline the petition",
    0,
    {
     "faithAuthority": -3,
     "trust": -3
    }
   ]
  ],
  [
   "Endow sanctuary hospitality",
   170,
   {
    "trust": 12,
    "devotion": 10
   },
   36
  ]
 ],
 [
  "sanctuary_water",
  "Religion",
  "Water for the sacred precinct",
  "A sanctuary's surrounding settlement needs a reliable supply of water.",
  "sanctuary",
  [
   "Support a communal well",
   125,
   {
    "development": 1,
    "trust": 5
   }
  ],
  [
   "Use existing stores",
   0,
   {
    "food": -12,
    "trust": 2
   }
  ],
  [
   "A dispute over access",
   "Residents request that visitors and neighbors have equal access.",
   [
    "Pay for public access",
    70,
    {
     "acceptance": 8,
     "unrest": -5
    }
   ],
   [
    "Let local custom decide",
    0,
    {
     "trust": 1
    }
   ]
  ],
  [
   "Water during the gathering",
   "The hosts struggle to supply another gathering.",
   [
    "Arrange water deliveries",
    90,
    {
     "trust": 7,
     "devotion": 3
    }
   ],
   [
    "Restrict the gathering",
    0,
    {
     "devotion": -4
    }
   ]
  ],
  [
   "Maintain sanctuary waterworks",
   155,
   {
    "development": 1,
    "trust": 9
   },
   48
  ]
 ],
 [
  "language_interpreters",
  "Culture",
  "The disputed translation",
  "Petitioners in a culturally distinct district complain that legal requests were mistranslated.",
  "culturalDistrict",
  [
   "Retain qualified interpreters",
   110,
   {
    "acceptance": 9,
    "trust": 7
   }
  ],
  [
   "Retain the old procedure",
   0,
   {
    "unrest": 4
   }
  ],
  [
   "A bilingual register",
   "Clerks propose maintaining local-language copies of the register.",
   [
    "Prepare parallel registers",
    90,
    {
     "acceptance": 8,
     "trust": 6
    }
   ],
   [
    "Issue a short summary",
    0,
    {
     "acceptance": 2
    }
   ]
  ],
  [
   "A mistranslated obligation",
   "A second disagreement threatens compliance with a local obligation.",
   [
    "Review the interpretation",
    115,
    {
     "unrest": -10,
     "loyalty": 5
    }
   ],
   [
    "Enforce the original record",
    0,
    {
     "trust": -6,
     "unrest": 5
    }
   ]
  ],
  [
   "Establish interpreter services",
   160,
   {
    "acceptance": 13,
    "trust": 10
   },
   36
  ]
 ],
 [
  "cultural_artisans",
  "Culture",
  "Two traditions of workmanship",
  "Artisans in a culturally distinct district request space to demonstrate their methods.",
  "culturalDistrict",
  [
   "Sponsor a joint workshop",
   140,
   {
    "acceptance": 6,
    "development": 1
   }
  ],
  [
   "Allow an informal exchange",
   0,
   {
    "acceptance": 2
   }
  ],
  [
   "A shared workshop",
   "The artisans agree to train apprentices together.",
   [
    "Support apprentices",
    90,
    {
     "trust": 8,
     "prestige": 3
    }
   ],
   [
    "Recognize the workshop",
    0,
    {
     "trust": 3
    }
   ]
  ],
  [
   "The guild's objection",
   "Some established artisans fear losing their position.",
   [
    "Arrange joint rules",
    100,
    {
     "acceptance": 8,
     "unrest": -5
    }
   ],
   [
    "Leave the guilds divided",
    0,
    {
     "acceptance": -3
    }
   ]
  ],
  [
   "Sponsor intercultural artisans",
   165,
   {
    "acceptance": 10,
    "development": 1
   },
   48
  ]
 ],
 [
  "language_manuscript",
  "Culture",
  "A manuscript in an unfamiliar language",
  "The ruler's language studies have revealed a work worth translating.",
  "languageStudent",
  [
   "Commission a translation",
   100,
   {
    "stress": -5,
    "prestige": 4
   }
  ],
  [
   "Study only the familiar passages",
   0,
   {
    "stress": 2
   }
  ],
  [
   "The translator's questions",
   "The translator asks the ruler to settle difficult expressions.",
   [
    "Attend the scholarly discussion",
    70,
    {
     "prestige": 5,
     "stress": -4
    }
   ],
   [
    "Approve the existing draft",
    0,
    {
     "prestige": 1
    }
   ]
  ],
  [
   "An incomplete manuscript",
   "The unfinished translation is returned to the court.",
   [
    "Invite another scholar",
    110,
    {
     "prestige": 5,
     "stress": -5
    }
   ],
   [
    "Put the work aside",
    0,
    {
     "stress": -3
    }
   ]
  ],
  [
   "Support the ruler's language studies",
   120,
   {
    "stress": -12,
    "prestige": 5
   },
   24
  ]
 ],
 [
  "court_interpreter",
  "Culture",
  "A reception in two languages",
  "The ruler's studies offer an opportunity to receive foreign visitors in their own language.",
  "languageStudent",
  [
   "Arrange a practice reception",
   80,
   {
    "prestige": 5,
    "stress": 3
   }
  ],
  [
   "Ask a secretary to lead",
   0,
   {
    "stress": -2
   }
  ],
  [
   "The visiting scholars",
   "The guests request a second audience to exchange expressions and customs.",
   [
    "Host a scholarly audience",
    80,
    {
     "prestige": 5,
     "stress": -5
    }
   ],
   [
    "Exchange written greetings",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "A misunderstood greeting",
   "The secretary reports an awkward exchange at the reception.",
   [
    "Arrange a clarification",
    75,
    {
     "prestige": 4,
     "stress": -4
    }
   ],
   [
    "Let the matter pass",
    0,
    {
     "prestige": -2
    }
   ]
  ],
  [
   "Hold a multilingual reception",
   115,
   {
    "prestige": 7,
    "stress": -7
   },
   24
  ]
 ],
 [
  "network_stipend",
  "Intrigue",
  "The intelligence contact's petition",
  "A retained intelligence contact requests payment for additional service.",
  "networkContact",
  [
   "Reward dependable service",
   75,
   {
    "opinion": 16,
    "prestige": 2
   }
  ],
  [
   "Keep the ordinary stipend",
   0,
   {
    "opinion": -6
   }
  ],
  [
   "An unexpected introduction",
   "The contact introduces another useful court acquaintance.",
   [
    "Acknowledge the service",
    55,
    {
     "opinion": 12,
     "securityMonths": 3
    }
   ],
   [
    "Offer thanks",
    0,
    {
     "opinion": 4
    }
   ]
  ],
  [
   "A disappointed contact",
   "The contact doubts the value placed on their service.",
   [
    "Restore their confidence",
    85,
    {
     "opinion": 18
    }
   ],
   [
    "Accept the distance",
    0,
    {
     "opinion": -8
    }
   ]
  ],
  [
   "Recognize intelligence service",
   110,
   {
    "opinion": 22,
    "securityMonths": 3
   },
   24
  ]
 ],
 [
  "network_records",
  "Intrigue",
  "Conflicting intelligence records",
  "An intelligence contact reports inconsistencies in records submitted to the court.",
  "networkContact",
  [
   "Commission an independent review",
   110,
   {
    "securityMonths": 6,
    "opinion": 5
   }
  ],
  [
   "Retain the existing records",
   0,
   {
    "opinion": -3
   }
  ],
  [
   "The independent report",
   "The review recommends revised recordkeeping procedures.",
   [
    "Implement the recommendations",
    90,
    {
     "securityMonths": 6,
     "prestige": 2
    }
   ],
   [
    "File the report",
    0,
    {
     "opinion": 3
    }
   ]
  ],
  [
   "The contact's misgivings",
   "The contact requests a clear explanation of the court's priorities.",
   [
    "Discuss the report privately",
    65,
    {
     "opinion": 12,
     "stress": -4
    }
   ],
   [
    "Dismiss the objections",
    0,
    {
     "opinion": -9
    }
   ]
  ],
  [
   "Review intelligence recordkeeping",
   145,
   {
    "securityMonths": 9,
    "opinion": 8
   },
   36
  ]
 ],
 [
  "foreign_scheme_warning",
  "Intrigue",
  "A warning from counterintelligence",
  "A discovered foreign scheme has prompted concerns at court.",
  "detectedPlot",
  [
   "Reinforce court protections",
   110,
   {
    "securityMonths": 9,
    "stress": -4
   }
  ],
  [
   "Keep the existing protections",
   0,
   {
    "stress": 6
   }
  ],
  [
   "Officials request reassurance",
   "Court staff want to know that the threat is being taken seriously.",
   [
    "Fund safeguards",
    80,
    {
     "securityMonths": 6,
     "legitimacy": 3
    }
   ],
   [
    "Issue a reassurance",
    0,
    {
     "stress": -2
    }
   ]
  ],
  [
   "An uneasy household",
   "Rumors of the discovered scheme are disturbing the ruler's household.",
   [
    "Address the household's concerns",
    95,
    {
     "stress": -12,
     "stability": 3
    }
   ],
   [
    "Continue ordinary business",
    0,
    {
     "stress": 5
    }
   ]
  ],
  [
   "Review a discovered foreign scheme",
   150,
   {
    "securityMonths": 12,
    "stress": -5
   },
   24
  ]
 ],
 [
  "foreign_scheme_counsel",
  "Intrigue",
  "A question of response",
  "The court is debating how to respond politically to a detected foreign scheme.",
  "detectedPlot",
  [
   "Convene trusted advisers",
   95,
   {
    "legitimacy": 5,
    "stress": -5
   }
  ],
  [
   "Handle the matter informally",
   0,
   {
    "stress": 4
   }
  ],
  [
   "A divided council",
   "The advisers disagree over how much of the matter should be made public.",
   [
    "Issue a measured statement",
    70,
    {
     "stability": 5,
     "prestige": 3
    }
   ],
   [
    "Keep deliberations private",
    0,
    {
     "legitimacy": 2
    }
   ]
  ],
  [
   "The cost of uncertainty",
   "Lack of clear guidance has weakened confidence in the court.",
   [
    "Clarify the response",
    95,
    {
     "legitimacy": 6,
     "stress": -6
    }
   ],
   [
    "Let the discussion end",
    0,
    {
     "legitimacy": -3
    }
   ]
  ],
  [
   "Convene a counterintelligence council",
   130,
   {
    "legitimacy": 8,
    "securityMonths": 6
   },
   36
  ]
 ],
 [
  "estate_witnesses",
  "Government",
  "Witnesses to an estate compact",
  "A local estate's consent agreement is approaching renewal.",
  "compactExpiry",
  [
   "Pay for an agreed review",
   105,
   {
    "loyalty": 9,
    "trust": 5
   }
  ],
  [
   "Leave renewal to the lord",
   0,
   {
    "loyalty": -3
   }
  ],
  [
   "The witnesses return",
   "The local witnesses propose clearer terms of cooperation.",
   [
    "Support the written terms",
    90,
    {
     "loyalty": 8,
     "unrest": -5
    }
   ],
   [
    "Record their advice",
    0,
    {
     "loyalty": 2
    }
   ]
  ],
  [
   "An objection to renewal",
   "The estate asks the crown to explain its intentions.",
   [
    "Offer a new hearing",
    100,
    {
     "loyalty": 10,
     "trust": 6
    }
   ],
   [
    "Postpone discussion",
    0,
    {
     "loyalty": -5
    }
   ]
  ],
  [
   "Review expiring estate consent",
   140,
   {
    "loyalty": 14,
    "trust": 8
   },
   24
  ]
 ],
 [
  "tribute_petition",
  "Government",
  "A petition over unpaid tribute",
  "A tributary with outstanding payments seeks a discussion of the relationship.",
  "tributeDebt",
  [
   "Open an arbitration hearing",
   80,
   {
    "relation": 9,
    "prestige": 2
   }
  ],
  [
   "Insist on the recorded obligation",
   0,
   {
    "relation": -5,
    "prestige": 2
   }
  ],
  [
   "The tribute delegation",
   "The representatives request a written understanding.",
   [
    "Fund a diplomatic exchange",
    90,
    {
     "relation": 10,
     "stability": 2
    }
   ],
   [
    "Return the written record",
    0,
    {
     "relation": 3
    }
   ]
  ],
  [
   "An unresolved account",
   "The other court protests the crown's stance.",
   [
    "Send a mediator",
    90,
    {
     "relation": 12
    }
   ],
   [
    "Reject the protest",
    0,
    {
     "relation": -6
    }
   ]
  ],
  [
   "Arbitrate a tribute disagreement",
   120,
   {
    "relation": 15,
    "prestige": 3
   },
   24
  ]
 ],
 [
  "motion_delegates",
  "Government",
  "Delegates at the capital",
  "An active government motion has brought competing delegates to court.",
  "governmentDebate",
  [
   "Provide a neutral meeting place",
   90,
   {
    "legitimacy": 4,
    "stability": 4
   }
  ],
  [
   "Limit the reception",
   0,
   {
    "legitimacy": -2
   }
  ],
  [
   "A record of objections",
   "Delegates agree that their objections should be recorded.",
   [
    "Publish a fair record",
    75,
    {
     "prestige": 4,
     "legitimacy": 4
    }
   ],
   [
    "Retain the minutes",
    0,
    {
     "legitimacy": 1
    }
   ]
  ],
  [
   "Competing accounts",
   "The delegations disagree over what was discussed.",
   [
    "Fund another hearing",
    100,
    {
     "legitimacy": 6,
     "stability": 4
    }
   ],
   [
    "End the hearings",
    0,
    {
     "stability": -4
    }
   ]
  ],
  [
   "Support a government deliberation",
   140,
   {
    "legitimacy": 8,
    "stability": 5
   },
   24
  ]
 ],
 [
  "faith_council_audience",
  "Religion",
  "Delegates to the religious council",
  "A pending institutional council attracts local representatives.",
  "faithDebate",
  [
   "Receive delegates from all districts",
   95,
   {
    "faithAuthority": 5,
    "legitimacy": 3
   }
  ],
  [
   "Keep the ordinary schedule",
   0,
   {
    "faithAuthority": -2
   }
  ],
  [
   "The council's written findings",
   "Representatives request a record of their deliberations.",
   [
    "Endow a public record",
    85,
    {
     "faithAuthority": 5,
     "prestige": 3
    }
   ],
   [
    "Store the findings",
    0,
    {
     "faithAuthority": 1
    }
   ]
  ],
  [
   "Questions from absent districts",
   "Representatives who missed the hearing request a summary.",
   [
    "Sponsor a further consultation",
    95,
    {
     "faithAuthority": 6,
     "stability": 3
    }
   ],
   [
    "Reject further requests",
    0,
    {
     "faithAuthority": -4
    }
   ]
  ],
  [
   "Support religious council consultations",
   135,
   {
    "faithAuthority": 9,
    "legitimacy": 4
   },
   24
  ]
 ],
 [
  "disputed_scholarship",
  "Religion",
  "The scholar's interpretation",
  "An active innovation project has raised questions among local institutional scholars.",
  "research",
  [
   "Arrange a documented scholarly debate",
   125,
   {
    "research": 16,
    "prestige": 3
   }
  ],
  [
   "Let scholars continue independently",
   0,
   {
    "research": 3
   }
  ],
  [
   "A collection of commentaries",
   "The debate has produced a useful collection of explanations.",
   [
    "Commission copies",
    95,
    {
     "research": 14,
     "prestige": 4
    }
   ],
   [
    "Archive the original",
    0,
    {
     "research": 4
    }
   ]
  ],
  [
   "Disagreement among the scholars",
   "The research team requests mediation over its conclusions.",
   [
    "Support a further review",
    110,
    {
     "research": 16,
     "stress": -3
    }
   ],
   [
    "Leave the disagreement unresolved",
    0,
    {
     "research": 2
    }
   ]
  ],
  [
   "Fund scholarly peer review",
   170,
   {
    "research": 24,
    "prestige": 3
   },
   36
  ]
 ],
 [
  "heir_civic_duties",
  "Family",
  "The heir and the petitioners",
  "An adult dynastic child is ready to learn from the court's civic obligations.",
  "adultHeir",
  [
   "Entrust supervised hearings",
   90,
   {
    "education": 8,
    "opinion": 9
   }
  ],
  [
   "Keep the heir at court",
   0,
   {
    "opinion": -3
   }
  ],
  [
   "The heir's recommendations",
   "The heir reports on the hearings and proposes improvements.",
   [
    "Discuss the recommendations",
    65,
    {
     "education": 9,
     "opinion": 7
    }
   ],
   [
    "Thank the heir",
    0,
    {
     "opinion": 4
    }
   ]
  ],
  [
   "The heir's frustration",
   "The heir asks for a greater share of household duties.",
   [
    "Offer supervised instruction",
    100,
    {
     "education": 12,
     "opinion": 10
    }
   ],
   [
    "Retain current arrangements",
    0,
    {
     "opinion": -6
    }
   ]
  ],
  [
   "Train an adult heir in public duty",
   140,
   {
    "education": 15,
    "opinion": 12
   },
   36
  ]
 ],
 [
  "rival_shared_duty",
  "Family",
  "A rival at the hearing",
  "A known court rival must cooperate with the ruler during a public hearing.",
  "courtRival",
  [
   "Share the duties fairly",
   90,
   {
    "opinion": 16,
    "legitimacy": 3
   }
  ],
  [
   "Insist on precedence",
   0,
   {
    "opinion": -9,
    "prestige": 2
   }
  ],
  [
   "A moment of agreement",
   "The rival acknowledges one of the ruler's arguments.",
   [
    "Recognize the agreement",
    65,
    {
     "opinion": 12,
     "stress": -5
    }
   ],
   [
    "Move to the next matter",
    0,
    {
     "opinion": 3
    }
   ]
  ],
  [
   "The dispute continues",
   "The disagreement has spilled over into court conversation.",
   [
    "Seek a private reconciliation",
    105,
    {
     "opinion": 18,
     "stress": -4
    }
   ],
   [
    "Allow the dispute to continue",
    0,
    {
     "opinion": -8
    }
   ]
  ],
  [
   "Arrange a shared duty with a rival",
   135,
   {
    "opinion": 24,
    "stress": -6
   },
   36
  ]
 ],
 [
  "friend_patronage",
  "Family",
  "A friend's household request",
  "A friend seeks the ruler's advice regarding an important household expense.",
  "courtFriend",
  [
   "Provide measured support",
   100,
   {
    "opinion": 14,
    "prestige": 2
   }
  ],
  [
   "Offer advice instead",
   0,
   {
    "opinion": 4
   }
  ],
  [
   "A renewed friendship",
   "The friend invites the ruler to a private celebration.",
   [
    "Attend and bring a gift",
    75,
    {
     "opinion": 10,
     "stress": -10
    }
   ],
   [
    "Send warm greetings",
    0,
    {
     "opinion": 4
    }
   ]
  ],
  [
   "A request for recognition",
   "The friend asks whether their past service is remembered.",
   [
    "Acknowledge their service",
    65,
    {
     "opinion": 9,
     "stress": -5
    }
   ],
   [
    "Leave the matter private",
    0,
    {
     "opinion": -2
    }
   ]
  ],
  [
   "Recognize a personal friendship",
   120,
   {
    "opinion": 18,
    "stress": -10
   },
   24
  ]
 ],
 [
  "market_petitioners",
  "Economy",
  "The traders' weights",
  "Local traders dispute the standards used at a busy market.",
  "trade",
  [
   "Commission a public inspection",
   105,
   {
    "credit": 7,
    "trust": 5
   }
  ],
  [
   "Let merchants settle the question",
   0,
   {
    "credit": -2
   }
  ],
  [
   "Agreed market standards",
   "The merchants request new reference weights.",
   [
    "Provide reference standards",
    90,
    {
     "credit": 6,
     "development": 1
    }
   ],
   [
    "Approve the agreement",
    0,
    {
     "credit": 2
    }
   ]
  ],
  [
   "A dispute over the scales",
   "The disagreement has reduced confidence in market transactions.",
   [
    "Fund mediation",
    100,
    {
     "credit": 8,
     "unrest": -5
    }
   ],
   [
    "Leave the dispute unresolved",
    0,
    {
     "credit": -4
    }
   ]
  ],
  [
   "Standardize market weights",
   150,
   {
    "credit": 10,
    "trust": 7
   },
   36
  ]
 ],
 [
  "damaged_storehouse",
  "Disaster",
  "The damaged storehouse",
  "A disaster-stricken province has lost part of its communal storage.",
  "crisis",
  [
   "Repair the storehouse",
   140,
   {
    "crisis": -12,
    "grain": 12
   }
  ],
  [
   "Release a modest reserve",
   0,
   {
    "food": -10,
    "crisis": -3
   }
  ],
  [
   "A new supply arrangement",
   "The repaired building needs provisions and management.",
   [
    "Supply grain and tools",
    85,
    {
     "grain": 16,
     "tools": 8,
     "trust": 5
    }
   ],
   [
    "Use the local allocation",
    0,
    {
     "grain": 4
    }
   ]
  ],
  [
   "A second request for relief",
   "Local residents warn that supplies are still inadequate.",
   [
    "Arrange deliveries",
    115,
    {
     "crisis": -12,
     "grain": 14
    }
   ],
   [
    "Release a small reserve",
    0,
    {
     "food": -12,
     "crisis": -3
    }
   ]
  ],
  [
   "Restore damaged local storage",
   180,
   {
    "crisis": -18,
    "grain": 22,
    "trust": 7
   },
   24
  ]
 ],
 [
  "frontier_interpreters",
  "Diplomacy",
  "Disagreement over a frontier message",
  "A hostile neighbor's envoy disputes the wording of a recent message.",
  "hostile",
  [
   "Commission a neutral translation",
   95,
   {
    "relation": 12,
    "prestige": 2
   }
  ],
  [
   "Repeat the original message",
   0,
   {
    "relation": -4
   }
  ],
  [
   "A clarified exchange",
   "The envoy brings a reply that acknowledges the clarification.",
   [
    "Send a courteous reply",
    70,
    {
     "relation": 9,
     "stability": 2
    }
   ],
   [
    "Record the reply",
    0,
    {
     "relation": 2
    }
   ]
  ],
  [
   "A renewed protest",
   "The neighbor repeats the original objection.",
   [
    "Invite another delegation",
    105,
    {
     "relation": 14
    }
   ],
   [
    "Maintain the earlier position",
    0,
    {
     "relation": -5
    }
   ]
  ],
  [
   "Clarify contested frontier messages",
   140,
   {
    "relation": 18,
    "prestige": 3
   },
   36
  ]
 ]
];
export function supplementalEvents(E,C){return rows.flatMap(([id,cat,title,desc,trigger,a,b,positive,negative])=>[
 E(id,cat,title,desc,trigger,[C(...a,id+'_resolution'),C(...b,id+'_complication')]),
 E(id+'_resolution',cat,positive[0],positive[1],'followup',[C(...positive[2]),C(...positive[3])]),
 E(id+'_complication',cat,negative[0],negative[1],'followup',[C(...negative[2]),C(...negative[3])])]);}
export function supplementalDecisions(D){return rows.map(([id,cat,,,,,,,,d])=>D('decision_'+id,cat,d[0],d[0]+'.',rows.find(x=>x[0]===id)[4],d[1],d[2],d[3]));}
