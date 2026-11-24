// Individually authored situations with stable campaign target references.
const rows=[
 [
  "feast_guest_accounts",
  "Activities",
  "Guests remember the feast",
  "After the recent feast, servants and guests disagree about which households were overlooked.",
  "recentFeast",
  [
   "Thank the guests and staff",
   75,
   {
    "courtReputation": 5,
    "stress": -5
   }
  ],
  [
   "Leave the matter to the steward",
   0,
   {
    "courtReputation": -2
   }
  ],
  [
   "A gracious acknowledgment",
   "The households appreciate the public recognition.",
   [
    "Record their service",
    60,
    {
     "courtReputation": 4,
     "prestige": 3
    }
   ],
   [
    "Send written thanks",
    0,
    {
     "prestige": 1
    }
   ]
  ],
  [
   "An overlooked household",
   "A household complains that its contribution was ignored.",
   [
    "Invite their representatives",
    95,
    {
     "courtReputation": 5,
     "stress": -4
    }
   ],
   [
    "Decline another reception",
    0,
    {
     "courtReputation": -3
    }
   ]
  ],
  [
   "Recognize feast contributors",
   120,
   {
    "courtReputation": 8,
    "stress": -8
   },
   36
  ]
 ],
 [
  "tournament_prizes",
  "Activities",
  "The tournament prizes",
  "Participants in the recent tournament petition for a public record of honors.",
  "recentTournament",
  [
   "Publish the list of honors",
   95,
   {
    "prestige": 6,
    "courtReputation": 3
   }
  ],
  [
   "Keep the customary record",
   0,
   {
    "prestige": 1
   }
  ],
  [
   "A respected competition",
   "The list of honors is accepted by the households.",
   [
    "Endow the next ceremonial prizes",
    100,
    {
     "prestige": 7,
     "courtReputation": 4
    }
   ],
   [
    "Close the accounts",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "Disputed recognition",
   "A participant disputes the way the prizes were recorded.",
   [
    "Review the record",
    85,
    {
     "courtReputation": 5,
     "legitimacy": 3
    }
   ],
   [
    "Let the result stand",
    0,
    {
     "courtReputation": -4
    }
   ]
  ],
  [
   "Publish tournament honors",
   135,
   {
    "prestige": 9,
    "courtReputation": 5
   },
   36
  ]
 ],
 [
  "pilgrim_testimony",
  "Religion",
  "A pilgrim's testimony",
  "The ruler's completed journey has prompted questions about hospitality along the route.",
  "recentPilgrimage",
  [
   "Receive the local hosts",
   100,
   {
    "trust": 8,
    "faithAuthority": 4
   }
  ],
  [
   "Send an acknowledgment",
   0,
   {
    "faithAuthority": 1
   }
  ],
  [
   "The hosts' concerns",
   "Hosts describe the need for reliable arrangements at future gatherings.",
   [
    "Support their hospitality",
    90,
    {
     "trust": 8,
     "devotion": 4
    }
   ],
   [
    "Record the recommendation",
    0,
    {
     "trust": 2
    }
   ]
  ],
  [
   "A neglected reception",
   "A host complains that the court's promises were forgotten.",
   [
    "Offer a further audience",
    110,
    {
     "trust": 10,
     "faithAuthority": 4
    }
   ],
   [
    "Dismiss the complaint",
    0,
    {
     "trust": -5
    }
   ]
  ],
  [
   "Recognize pilgrimage hosts",
   145,
   {
    "trust": 12,
    "faithAuthority": 6
   },
   36
  ]
 ],
 [
  "tour_petitions",
  "Activities",
  "Petitions from the provincial tour",
  "Residents of the visited district request a reply to their earlier petitions.",
  "recentTour",
  [
   "Review the requests",
   125,
   {
    "trust": 9,
    "unrest": -6
   }
  ],
  [
   "Return a brief reply",
   0,
   {
    "trust": 1
   }
  ],
  [
   "The local report",
   "Officials report that residents appreciate the review.",
   [
    "Implement further local improvements",
    110,
    {
     "trust": 8,
     "unrest": -5
    }
   ],
   [
    "Accept the report",
    0,
    {
     "trust": 3
    }
   ]
  ],
  [
   "Unanswered requests",
   "Petitioners fear that their concerns were only ceremonial.",
   [
    "Arrange a practical review",
    130,
    {
     "trust": 10,
     "unrest": -7
    }
   ],
   [
    "Close the petition",
    0,
    {
     "trust": -6
    }
   ]
  ],
  [
   "Follow up provincial tour petitions",
   165,
   {
    "trust": 13,
    "unrest": -9
   },
   36
  ]
 ],
 [
  "summit_correspondence",
  "Diplomacy",
  "Letters after the summit",
  "The visiting delegation has left questions about the commitments made at the gathering.",
  "recentSummit",
  [
   "Fund a formal correspondence",
   95,
   {
    "relation": 8,
    "courtReputation": 3
   }
  ],
  [
   "Send a short reply",
   0,
   {
    "relation": 1
   }
  ],
  [
   "An agreed account",
   "Both courts acknowledge the clarifications.",
   [
    "Exchange copies of the record",
    80,
    {
     "relation": 9,
     "prestige": 3
    }
   ],
   [
    "Archive the agreement",
    0,
    {
     "relation": 2
    }
   ]
  ],
  [
   "A disputed promise",
   "The delegation questions the accuracy of the court's account.",
   [
    "Offer a new exchange",
    115,
    {
     "relation": 12
    }
   ],
   [
    "Maintain the existing account",
    0,
    {
     "relation": -5
    }
   ]
  ],
  [
   "Continue summit correspondence",
   150,
   {
    "relation": 14,
    "prestige": 4
   },
   36
  ]
 ],
 [
  "assembly_minutes",
  "Religion",
  "The assembly record",
  "Representatives of the recent religious assembly request a record of its conclusions.",
  "recentAssembly",
  [
   "Endow public copies",
   100,
   {
    "faithAuthority": 5,
    "devotion": 5
   }
  ],
  [
   "Keep the household copy",
   0,
   {
    "faithAuthority": 1
   }
  ],
  [
   "The public record",
   "Local institutions welcome a documented account.",
   [
    "Support further copies",
    80,
    {
     "faithAuthority": 5,
     "trust": 5
    }
   ],
   [
    "Leave the record with the hosts",
    0,
    {
     "devotion": 2
    }
   ]
  ],
  [
   "Questions over the record",
   "Representatives who missed the meeting ask for clarification.",
   [
    "Arrange a further consultation",
    110,
    {
     "faithAuthority": 7,
     "trust": 5
    }
   ],
   [
    "End the consultation",
    0,
    {
     "faithAuthority": -3
    }
   ]
  ],
  [
   "Distribute assembly records",
   145,
   {
    "faithAuthority": 9,
    "trust": 7
   },
   36
  ]
 ],
 [
  "symposium_library",
  "Culture",
  "The symposium manuscripts",
  "A recent scholarly gathering produced materials worth preserving.",
  "recentSymposium",
  [
   "Commission manuscript copies",
   110,
   {
    "prestige": 5,
    "courtReputation": 4
   }
  ],
  [
   "Preserve the originals",
   0,
   {
    "prestige": 1
   }
  ],
  [
   "A collection for scholars",
   "The scholars propose keeping a shared reference collection.",
   [
    "Support the collection",
    100,
    {
     "prestige": 6,
     "courtReputation": 5
    }
   ],
   [
    "Accept the private copies",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "A lost copy",
   "One contributor reports that their material was overlooked.",
   [
    "Commission a replacement",
    100,
    {
     "courtReputation": 6,
     "prestige": 3
    }
   ],
   [
    "Accept the loss",
    0,
    {
     "courtReputation": -3
    }
   ]
  ],
  [
   "Preserve symposium manuscripts",
   150,
   {
    "prestige": 9,
    "courtReputation": 7
   },
   36
  ]
 ],
 [
  "memorial_remembrance",
  "Family",
  "The memorial's witnesses",
  "Relatives and household members have returned from the dynastic memorial.",
  "recentMemorial",
  [
   "Record their recollections",
   90,
   {
    "legitimacy": 4,
    "stress": -8
   }
  ],
  [
   "Keep the remembrance private",
   0,
   {
    "stress": -3
   }
  ],
  [
   "The family record",
   "The household presents a collection of recollections.",
   [
    "Support its preservation",
    80,
    {
     "prestige": 5,
     "legitimacy": 4
    }
   ],
   [
    "Thank the household",
    0,
    {
     "stress": -2
    }
   ]
  ],
  [
   "An unrecorded branch",
   "A relative fears their family's place in the memorial was forgotten.",
   [
    "Hear the recollections",
    95,
    {
     "legitimacy": 6,
     "stress": -5
    }
   ],
   [
    "Decline further discussion",
    0,
    {
     "legitimacy": -4
    }
   ]
  ],
  [
   "Preserve dynastic remembrance",
   130,
   {
    "legitimacy": 8,
    "stress": -10
   },
   36
  ]
 ],
 [
  "coming_age_duties",
  "Family",
  "A place at the household table",
  "A recent coming-of-age ceremony has raised expectations about the young household member's duties.",
  "recentComingAge",
  [
   "Arrange supervised duties",
   85,
   {
    "education": 5,
    "opinion": 12
   }
  ],
  [
   "Allow time for adjustment",
   0,
   {
    "opinion": 3
   }
  ],
  [
   "A confident young adult",
   "The young household member asks for guidance in a difficult matter.",
   [
    "Offer a private lesson",
    70,
    {
     "education": 8,
     "opinion": 10
    }
   ],
   [
    "Offer encouragement",
    0,
    {
     "opinion": 4
    }
   ]
  ],
  [
   "An uncertain place",
   "The young person is unsure what is expected of them.",
   [
    "Clarify their duties",
    90,
    {
     "education": 7,
     "opinion": 14
    }
   ],
   [
    "Leave the question open",
    0,
    {
     "opinion": -6
    }
   ]
  ],
  [
   "Mentor the young household member",
   125,
   {
    "education": 12,
    "opinion": 18
   },
   36
  ]
 ],
 [
  "arts_commission_reception",
  "Court",
  "A patronage reception",
  "The creator of a completed court arts project seeks recognition for the work.",
  "completedArts",
  [
   "Hold a modest reception",
   85,
   {
    "courtReputation": 5,
    "opinion": 12
   }
  ],
  [
   "Offer private thanks",
   0,
   {
    "opinion": 4
   }
  ],
  [
   "The artist's acknowledgment",
   "The creator proposes showing the work to visitors.",
   [
    "Support a presentation",
    95,
    {
     "prestige": 5,
     "courtReputation": 5
    }
   ],
   [
    "Keep the work in the collection",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "The neglected artisan",
   "The creator feels the project received insufficient attention.",
   [
    "Acknowledge the work publicly",
    90,
    {
     "opinion": 15,
     "courtReputation": 4
    }
   ],
   [
    "Let the matter pass",
    0,
    {
     "opinion": -8
    }
   ]
  ],
  [
   "Recognize a completed arts commission",
   135,
   {
    "opinion": 18,
    "courtReputation": 8
   },
   36
  ]
 ],
 [
  "archive_catalogue",
  "Court",
  "The manuscript catalogue",
  "The curator of a completed archive project proposes cataloguing the collection.",
  "completedArchives",
  [
   "Fund a usable catalogue",
   100,
   {
    "prestige": 5,
    "opinion": 8
   }
  ],
  [
   "Keep the existing inventory",
   0,
   {
    "prestige": 1
   }
  ],
  [
   "An improved catalogue",
   "The curator has prepared a clearer record.",
   [
    "Distribute working copies",
    85,
    {
     "courtReputation": 5,
     "prestige": 4
    }
   ],
   [
    "Retain a master copy",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "A disputed record",
   "A contributor claims their manuscript is missing from the inventory.",
   [
    "Review the catalogue",
    110,
    {
     "courtReputation": 5,
     "opinion": 12
    }
   ],
   [
    "Retain the inventory",
    0,
    {
     "opinion": -5
    }
   ]
  ],
  [
   "Catalogue the manuscript collection",
   145,
   {
    "courtReputation": 7,
    "prestige": 7
   },
   36
  ]
 ],
 [
  "ceremony_witness",
  "Court",
  "Witnesses to the ceremony",
  "The organizer of a completed ceremonial project requests a review of the occasion.",
  "completedCeremony",
  [
   "Honor the organizer",
   100,
   {
    "courtReputation": 5,
    "legitimacy": 3,
    "opinion": 10
   }
  ],
  [
   "Send an acknowledgment",
   0,
   {
    "opinion": 3
   }
  ],
  [
   "A respected organizer",
   "The organizer reports confidence in the court's ceremonial arrangements.",
   [
    "Record the contributions",
    80,
    {
     "prestige": 4,
     "legitimacy": 4
    }
   ],
   [
    "Accept the report",
    0,
    {
     "legitimacy": 1
    }
   ]
  ],
  [
   "Unsettled expectations",
   "Some witnesses question the recognition given to contributors.",
   [
    "Convene a small review",
    105,
    {
     "courtReputation": 6,
     "legitimacy": 4
    }
   ],
   [
    "Dismiss the matter",
    0,
    {
     "courtReputation": -4
    }
   ]
  ],
  [
   "Recognize ceremonial service",
   145,
   {
    "courtReputation": 8,
    "legitimacy": 6
   },
   36
  ]
 ],
 [
  "fellowship_correspondence",
  "Culture",
  "A scholar's correspondence",
  "A scholar associated with a completed fellowship seeks help maintaining academic contacts.",
  "completedScholarship",
  [
   "Fund correspondence",
   95,
   {
    "opinion": 12,
    "prestige": 4
   }
  ],
  [
   "Offer introductions",
   0,
   {
    "opinion": 4
   }
  ],
  [
   "New scholarly contacts",
   "The scholar brings news of a useful academic exchange.",
   [
    "Support the exchange",
    100,
    {
     "prestige": 6,
     "courtReputation": 4
    }
   ],
   [
    "Receive the written report",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "A missed exchange",
   "The scholar reports that an opportunity was lost.",
   [
    "Provide further support",
    105,
    {
     "opinion": 15,
     "prestige": 4
    }
   ],
   [
    "Accept the delay",
    0,
    {
     "opinion": -5
    }
   ]
  ],
  [
   "Support fellowship correspondence",
   140,
   {
    "opinion": 18,
    "prestige": 7
   },
   36
  ]
 ],
 [
  "court_reputation_petitions",
  "Court",
  "A court under criticism",
  "Low court reputation has encouraged household petitions about ordinary administration.",
  "lowCourtReputation",
  [
   "Open a practical review",
   110,
   {
    "courtReputation": 10,
    "legitimacy": 3
   }
  ],
  [
   "Issue a brief response",
   0,
   {
    "courtReputation": 1
   }
  ],
  [
   "A more trusted household",
   "Petitioners report that ordinary court administration has improved.",
   [
    "Maintain the reforms",
    90,
    {
     "courtReputation": 7,
     "stability": 3
    }
   ],
   [
    "Record the findings",
    0,
    {
     "courtReputation": 2
    }
   ]
  ],
  [
   "Persistent dissatisfaction",
   "Household complaints remain unresolved.",
   [
    "Fund a further review",
    135,
    {
     "courtReputation": 10,
     "legitimacy": 4
    }
   ],
   [
    "Ignore further complaints",
    0,
    {
     "courtReputation": -5
    }
   ]
  ],
  [
   "Review court administration",
   165,
   {
    "courtReputation": 14,
    "legitimacy": 5
   },
   36
  ]
 ],
 [
  "court_reputation_envoys",
  "Court",
  "A court of good standing",
  "The court's reputation has attracted visitors seeking an introduction.",
  "highCourtReputation",
  [
   "Receive the visitors",
   100,
   {
    "prestige": 6,
    "courtReputation": 4
   }
  ],
  [
   "Send greetings",
   0,
   {
    "prestige": 2
   }
  ],
  [
   "A wider reputation",
   "Visitors carry a favorable account of the reception.",
   [
    "Support a measured exchange",
    85,
    {
     "prestige": 6,
     "courtReputation": 3
    }
   ],
   [
    "Thank the visitors",
    0,
    {
     "prestige": 2
    }
   ]
  ],
  [
   "An uncertain reception",
   "The visitors request a clearer arrangement for future audiences.",
   [
    "Clarify the arrangements",
    90,
    {
     "courtReputation": 5,
     "prestige": 3
    }
   ],
   [
    "End the discussion",
    0,
    {
     "courtReputation": -2
    }
   ]
  ],
  [
   "Host a respected court reception",
   135,
   {
    "prestige": 9,
    "courtReputation": 5
   },
   36
  ]
 ],
 [
  "roleplay_reading",
  "Lifestyle",
  "The specialization notebook",
  "The ruler's selected specialization provides an opportunity to review accumulated lessons.",
  "activeSpecialization",
  [
   "Arrange focused instruction",
   85,
   {
    "branchXP": 14,
    "stress": 3
   }
  ],
  [
   "Review existing notes",
   0,
   {
    "branchXP": 3
   }
  ],
  [
   "A practical exercise",
   "The tutor proposes applying the lessons to an ordinary court problem.",
   [
    "Complete the exercise",
    95,
    {
     "branchXP": 16,
     "prestige": 3
    }
   ],
   [
    "Review the example",
    0,
    {
     "branchXP": 4
    }
   ]
  ],
  [
   "An incomplete exercise",
   "The tutor suggests returning to the difficult material.",
   [
    "Resume instruction",
    100,
    {
     "branchXP": 14,
     "stress": 3
    }
   ],
   [
    "Put the material aside",
    0,
    {
     "stress": -3
    }
   ]
  ],
  [
   "Fund specialization instruction",
   140,
   {
    "branchXP": 22,
    "stress": 4
   },
   24
  ]
 ],
 [
  "roleplay_teaching",
  "Lifestyle",
  "A lesson for the household",
  "The ruler's specialization has attracted a request to teach its practical lessons.",
  "advancedSpecialization",
  [
   "Arrange a small teaching session",
   95,
   {
    "branchXP": 12,
    "prestige": 4
   }
  ],
  [
   "Discuss the subject informally",
   0,
   {
    "branchXP": 3
   }
  ],
  [
   "A useful discussion",
   "The participants return with questions about the lesson.",
   [
    "Continue instruction",
    85,
    {
     "branchXP": 12,
     "prestige": 4
    }
   ],
   [
    "Answer briefly",
    0,
    {
     "prestige": 1
    }
   ]
  ],
  [
   "A demanding lesson",
   "The ruler finds the preparation more tiring than expected.",
   [
    "Arrange assistance",
    95,
    {
     "branchXP": 10,
     "stress": -5
    }
   ],
   [
    "Cancel the next session",
    0,
    {
     "stress": -3
    }
   ]
  ],
  [
   "Teach a specialization lesson",
   130,
   {
    "branchXP": 18,
    "prestige": 6
   },
   24
  ]
 ],
 [
  "language_practice_letters",
  "Culture",
  "A letter in the studied language",
  "The ruler's ongoing language studies have prompted an exercise in correspondence.",
  "activeLanguageStudy",
  [
   "Retain a tutor for the exercise",
   80,
   {
    "languageMonths": -1,
    "stress": -4
   }
  ],
  [
   "Work through the letter privately",
   0,
   {
    "stress": 2
   }
  ],
  [
   "A corrected letter",
   "The tutor has prepared an annotated version of the text.",
   [
    "Review the corrections",
    70,
    {
     "languageMonths": -1,
     "prestige": 2
    }
   ],
   [
    "Retain the letter",
    0,
    {
     "stress": -2
    }
   ]
  ],
  [
   "A difficult passage",
   "The ruler finds one passage particularly difficult.",
   [
    "Arrange another lesson",
    90,
    {
     "languageMonths": -1,
     "stress": -5
    }
   ],
   [
    "Accept the difficulty",
    0,
    {
     "stress": 3
    }
   ]
  ],
  [
   "Fund additional language practice",
   115,
   {
    "languageMonths": -2,
    "stress": -4
   },
   24
  ]
 ],
 [
  "religious_exchange_records",
  "Religion",
  "Correspondence between institutions",
  "An ongoing religious exchange has produced a request for copies of scholarly materials.",
  "activeFaithExchange",
  [
   "Support the copying",
   85,
   {
    "faithAuthority": 4,
    "relation": 4
   }
  ],
  [
   "Send a short reply",
   0,
   {
    "relation": 1
   }
  ],
  [
   "A shared record",
   "The advisers report that the exchange has clarified important questions.",
   [
    "Continue the scholarly exchange",
    75,
    {
     "faithAuthority": 5,
     "relation": 5
    }
   ],
   [
    "Archive the correspondence",
    0,
    {
     "faithAuthority": 1
    }
   ]
  ],
  [
   "An incomplete exchange",
   "One court asks whether its requested materials can still be provided.",
   [
    "Provide the copies",
    95,
    {
     "relation": 7,
     "faithAuthority": 3
    }
   ],
   [
    "Decline further support",
    0,
    {
     "relation": -3
    }
   ]
  ],
  [
   "Support religious correspondence",
   130,
   {
    "faithAuthority": 7,
    "relation": 8
   },
   36
  ]
 ],
 [
  "merchant_route_witness",
  "Economy",
  "The merchant route petition",
  "Merchants on a current route report a disagreement over the terms of exchange.",
  "activeMerchantRoute",
  [
   "Fund neutral arbitration",
   100,
   {
    "credit": 7,
    "trust": 4
   }
  ],
  [
   "Refer the matter to the merchants",
   0,
   {
    "credit": -2
   }
  ],
  [
   "A clearer commercial record",
   "Merchants report that the arbitration clarified the terms.",
   [
    "Support recordkeeping",
    85,
    {
     "credit": 6,
     "trust": 4
    }
   ],
   [
    "Accept the record",
    0,
    {
     "credit": 2
    }
   ]
  ],
  [
   "A renewed disagreement",
   "Merchants report that uncertainty persists.",
   [
    "Convene another hearing",
    110,
    {
     "credit": 8,
     "trust": 4
    }
   ],
   [
    "Leave the matter unresolved",
    0,
    {
     "credit": -4
    }
   ]
  ],
  [
   "Review merchant route terms",
   145,
   {
    "credit": 11,
    "trust": 6
   },
   36
  ]
 ],
 [
  "merchant_route_inactive",
  "Economy",
  "A quiet market route",
  "An established route has recently carried no goods; traders seek a review.",
  "idleMerchantRoute",
  [
   "Review the source settlement",
   95,
   {
    "credit": 6,
    "trust": 7
   }
  ],
  [
   "Wait for demand to recover",
   0,
   {
    "credit": -2
   }
  ],
  [
   "The merchants' report",
   "Merchants identify improvements to the arrangements at the source settlement.",
   [
    "Support local arrangements",
    110,
    {
     "trust": 8,
     "credit": 7
    }
   ],
   [
    "Record the report",
    0,
    {
     "trust": 2
    }
   ]
  ],
  [
   "A prolonged interruption",
   "The route remains uncertain, and merchants request guidance.",
   [
    "Fund further consultation",
    120,
    {
     "credit": 8,
     "trust": 6
    }
   ],
   [
    "Leave the route unchanged",
    0,
    {
     "credit": -5
    }
   ]
  ],
  [
   "Review an idle merchant route",
   150,
   {
    "credit": 10,
    "trust": 9
   },
   36
  ]
 ],
 [
  "situation_local_review",
  "Government",
  "A regional pressure report",
  "An active conditional situation has prompted requests for information from local delegates.",
  "liveSituation",
  [
   "Fund a measured review",
   100,
   {
    "situationCooperation": 12,
    "legitimacy": 3
   }
  ],
  [
   "Retain ordinary reports",
   0,
   {
    "situationCooperation": -3
   }
  ],
  [
   "The delegates' account",
   "Delegates bring an agreed account of the local difficulties.",
   [
    "Support further consultation",
    90,
    {
     "situationCooperation": 14,
     "stability": 3
    }
   ],
   [
    "Record the findings",
    0,
    {
     "situationCooperation": 3
    }
   ]
  ],
  [
   "Unresolved objections",
   "The delegates disagree about the report's accuracy.",
   [
    "Arrange another hearing",
    115,
    {
     "situationCooperation": 15,
     "legitimacy": 3
    }
   ],
   [
    "Dismiss the objections",
    0,
    {
     "situationCooperation": -5
    }
   ]
  ],
  [
   "Review a regional pressure",
   140,
   {
    "situationCooperation": 18,
    "legitimacy": 4
   },
   24
  ]
 ],
 [
  "settlement_records",
  "Government",
  "The regional settlement record",
  "A recent negotiated settlement requires a clear account of the arrangements.",
  "recentSettlement",
  [
   "Record the settlement",
   100,
   {
    "legitimacy": 5,
    "courtReputation": 4
   }
  ],
  [
   "Keep the existing minutes",
   0,
   {
    "legitimacy": 1
   }
  ],
  [
   "A witnessed settlement",
   "The participating communities appreciate the public account.",
   [
    "Support a further hearing",
    80,
    {
     "stability": 4,
     "legitimacy": 4
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
   "Questions from local delegates",
   "Some participants ask whether their concerns were recorded.",
   [
    "Arrange a clarification",
    110,
    {
     "legitimacy": 6,
     "stability": 3
    }
   ],
   [
    "Leave the record unchanged",
    0,
    {
     "legitimacy": -3
    }
   ]
  ],
  [
   "Publish the regional settlement record",
   140,
   {
    "legitimacy": 9,
    "courtReputation": 5
   },
   36
  ]
 ],
 [
  "estate_charter_review",
  "Government",
  "Review of an estate's succession charter",
  "A landed estate has adopted a distinct inheritance rule and requests a review of the records.",
  "charteredEstate",
  [
   "Fund the witnessed record",
   110,
   {
    "loyalty": 10,
    "trust": 5
   }
  ],
  [
   "Keep the ordinary record",
   0,
   {
    "loyalty": 1
   }
  ],
  [
   "The witnesses agree",
   "The estate's representatives report that the current rule is understood.",
   [
    "Support a further copy",
    85,
    {
     "loyalty": 8,
     "trust": 5
    }
   ],
   [
    "Accept the record",
    0,
    {
     "loyalty": 2
    }
   ]
  ],
  [
   "An uncertain interpretation",
   "The estate asks for clearer documentation of the rule.",
   [
    "Arrange a legal hearing",
    125,
    {
     "loyalty": 12,
     "legitimacy": 3
    }
   ],
   [
    "Retain the existing charter",
    0,
    {
     "loyalty": -6
    }
   ]
  ],
  [
   "Review a local inheritance charter",
   150,
   {
    "loyalty": 14,
    "trust": 8
   },
   36
  ]
 ]
];
export function depthEvents(E,C){return rows.flatMap(([id,cat,title,desc,trigger,a,b,yes,no])=>[E(id,cat,title,desc,trigger,[C(...a,id+'_resolution'),C(...b,id+'_complication')]),E(id+'_resolution',cat,yes[0],yes[1],'followup',[C(...yes[2]),C(...yes[3])]),E(id+'_complication',cat,no[0],no[1],'followup',[C(...no[2]),C(...no[3])])]);}
export function depthDecisions(D){return rows.map(([id,cat,title,desc,trigger,,,,,d])=>D('decision_'+id,cat,d[0],desc,trigger,d[1],d[2],d[3]));}
export function depthContext(g,r,head,land){
 if(!head?.alive)return {};
 const h=g.heritage?.realms[r],court=g.royalCourt?.realms[r],identity=g.identity?.realms[r],rp=head.civic?.roleplay,base={actor:head.id,person:head.id},out={};
 const own=new Set(land.map(p=>p.id));
 const records=h?.activityRecords||[];
 for(const [kind,trigger] of Object.entries({feast:'recentFeast',tournament:'recentTournament',pilgrimage:'recentPilgrimage',tour:'recentTour',summit:'recentSummit',assembly:'recentAssembly',symposium:'recentSymposium',memorial:'recentMemorial',coming_age:'recentComingAge'})){
  const x=records.find(x=>x.host===head.id&&x.kind===kind&&g.turn-x.turn<=12&&own.has(x.destination));if(!x)continue;
  const target={...base,activityRecord:{kind,turn:x.turn,host:x.host},province:x.destination};
  if(kind==='summit'){if(!x.guest||!g.factions[x.guest])continue;target.other=x.guest;}
  if(kind==='coming_age'){const p=g.politics.people[x.subject];if(!p?.alive||p.realm!==r||!p.civic)continue;target.person=p.id;}
  out[trigger]=target;
 }
 for(const [kind,trigger] of Object.entries({arts:'completedArts',archives:'completedArchives',ceremony:'completedCeremony',scholarship:'completedScholarship'})){
  const x=court?.collection?.find(x=>x.kind===kind&&x.patron===head.id&&Number.isFinite(x.turn)&&g.turn-x.turn<=18&&g.politics.people[x.creator]?.alive&&g.politics.people[x.creator]?.realm===r);
  if(x)out[trigger]={...base,person:x.creator,collection:{kind,turn:x.turn,creator:x.creator}};
 }
 if(court?.reputation<45)out.lowCourtReputation=base;if(court?.reputation>=70)out.highCourtReputation=base;
 const focus=head.civic?.focus,branch=rp?.selected?.[focus],key=focus+':'+branch,record=rp?.branches?.[key];
 if(branch&&record&&record.rank<3&&record.xp<180){out.activeSpecialization={...base,branch:key};if(record.rank>=1)out.advancedSpecialization=out.activeSpecialization;}
 const study=identity?.culturalCourt?.study;if(study?.person===head.id&&study.ends-g.turn>=5)out.activeLanguageStudy={...base,study:{language:study.language,person:study.person}};
 const exchange=identity?.faithExchange;if(exchange?.ends-g.turn>=4&&g.factions[exchange.realm])out.activeFaithExchange={...base,other:exchange.realm,exchange:{realm:exchange.realm,advisor:exchange.advisor,otherAdvisor:exchange.otherAdvisor}};
 const routes=Object.values(g.economy?.routes||{}).filter(x=>x.realm===r&&x.status==='active'&&own.has(x.from));
 const route=routes[0],idle=routes.find(x=>x.started<g.turn-3&&x.lastVolume===0);if(route)out.activeMerchantRoute={province:route.from,route:route.id};if(idle)out.idleMerchantRoute={province:idle.from,route:idle.id};
 const situations=Object.values(g.heritage?.struggles||{}).filter(x=>Object.hasOwn(x.influence||{},r));const active=situations.find(x=>x.phase!=='dormant'&&x.ended===null&&x.tension>=45);if(active)out.liveSituation={...base,situation:{id:active.id,cycle:active.cycle,settled:false}};
 const settled=situations.find(x=>x.outcome?.kind==='negotiated'&&g.turn-x.outcome.turn<=12);if(settled)out.recentSettlement={...base,situation:{id:settled.id,cycle:settled.cycle,settled:true}};
 const estate=land.find(p=>{const h=g.politics.holdings[p.id];return h?.realm===r&&h.lord!==head.id&&h.successionLaw&&h.successionLaw!=='customary';});if(estate){const x=g.politics.holdings[estate.id];out.charteredEstate={province:estate.id,estate:{lord:x.lord,law:x.successionLaw}};}
 return out;
}
export function depthTargetValid(g,r,t){
 if(!t)return false;
 if(t.activityRecord&&!g.heritage?.realms[r]?.activityRecords?.some(x=>x.kind===t.activityRecord.kind&&x.turn===t.activityRecord.turn&&x.host===t.activityRecord.host))return false;
 if(t.collection&&!g.royalCourt?.realms[r]?.collection?.some(x=>x.kind===t.collection.kind&&x.turn===t.collection.turn&&x.creator===t.collection.creator))return false;
 if(t.branch){const p=g.politics.people[t.actor],rp=p?.civic?.roleplay,focus=p?.civic?.focus;if(t.branch!==focus+':'+rp?.selected?.[focus]||!rp?.branches?.[t.branch])return false;}
 if(t.study){const x=g.identity?.realms[r]?.culturalCourt?.study;if(!x||x.language!==t.study.language||x.person!==t.study.person||x.ends<=g.turn)return false;}
 if(t.exchange){const x=g.identity?.realms[r]?.faithExchange;if(!x||x.realm!==t.exchange.realm||x.advisor!==t.exchange.advisor||x.otherAdvisor!==t.exchange.otherAdvisor)return false;}
 if(t.route){const x=g.economy?.routes[t.route];if(!x||x.realm!==r||x.status!=='active'||x.from!==t.province)return false;}
 if(t.situation){const x=g.heritage?.struggles[t.situation.id];if(!x||x.cycle!==t.situation.cycle||!Object.hasOwn(x.influence||{},r)||(t.situation.settled?x.outcome?.kind!=='negotiated':x.ended!==null||x.phase==='dormant'))return false;}
 if(t.estate){const h=g.politics.holdings[t.province];if(!h||h.realm!==r||h.lord!==t.estate.lord||h.successionLaw!==t.estate.law)return false;}
 return true;
}
const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
export const depthEffectKeys=['courtReputation','branchXP','languageMonths','situationCooperation'];
export function depthEffectAvailable(g,r,t,k){
 if(k==='courtReputation')return Number.isFinite(g.royalCourt?.realms[r]?.reputation);
 if(k==='branchXP')return Number.isFinite(g.politics.people[t.actor]?.civic?.roleplay?.branches?.[t.branch]?.xp);
 if(k==='languageMonths')return !!t.study&&!!g.identity?.realms[r]?.culturalCourt?.study;
 if(k==='situationCooperation')return !!t.situation&&!t.situation.settled&&!!g.heritage?.struggles[t.situation.id];
 return false;
}
export function applyDepthEffect(g,r,t,k,v){
 if(!depthEffectAvailable(g,r,t,k))return;
 if(k==='courtReputation'){const s=g.royalCourt.realms[r];s.reputation=cap(s.reputation+v,0,100);}
 if(k==='branchXP'){const b=g.politics.people[t.actor].civic.roleplay.branches[t.branch];b.xp=cap(b.xp+v,0,180);}
 if(k==='languageMonths'){const s=g.identity.realms[r].culturalCourt.study;s.ends=Math.max(g.turn+1,s.ends+v);}
 if(k==='situationCooperation'){const s=g.heritage.struggles[t.situation.id];s.cooperation=cap(s.cooperation+v,0,100);}
}
