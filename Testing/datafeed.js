const local_url = "http://localhost:4321";
import IndustryController from "../controllers/Configuration/industryController.js";
const Industry = [
  "BFSI : Banking, financial services and Insurance",
  "EUR : :  Energy Utility and Resources",
  "TMET : Telcom, Media, Entertainment and Technology",
  "HCLS : : Healthcare and Life Sciences",
  "PSG : Public Sector and Government",
  "REC : Real Estate and Construction",
  "CGR : Consumer Goods and Retail",
  "LT&T : Logistics, Travel and Transport",
  "MAN&I : Manufacturing and Industrials",
  "M&M : Materials and Mining",
  "NP&S : Not Profit and Services",
  "MIC : Multi Industry Conglomorate",
];

const SubIndustry = [
  "Banking",
  "Insurance",
  "NBFS",
  "Cooporative",
  "Stock Market",
  "FinTech",
  "Oil and Gas",
  "Utilities",
  "Green Energy",
  "Telecom",
  "Media",
  "Entertainment",
  "Technology",
  "Hospitals - 1000+ beds",
  "Hospitals -  100+ Beds",
  "Hospitals - 10+ Beds",
  "Clinics - No Beds",
  "One Person Clinic",
  "Veterinary",
  "Pharmacy",
  "Blood Banks",
  "Labs",
  "Medical Device",
  "BioTech",
  "Food Related",
  "Government",
  "Regulatory",
  "Police & Security",
  "Goverment Department",
  "Real Estate",
  "Construction",
  "Retail",
  "FMCG",
  "Aggregator",
  "Metro Services",
  "Airline",
  "Railway",
  "Shipping",
  "Airport",
  "Trucking",
  "Shipyard",
  "Logistics",
  "Manufacturing",
  "Industrials",
  "Distribution",
  "Mining",
  "Defense",
  "NGO",
  "Research Organisation",
  "Universities & Education",
  "Startups",
  "Others",
];

const Solution = [
  "Strategy",
  "Digital",
  "Data",
  "Security",
  "Engineering",
  "BEAS",
  "Audit ",
  "Frontier Tech",
];

const SalesStage = [
  "Lead",
  "Prospecting",
  "Qualification",
  "Proposal",
  "Followup",
  "Closing",
];

const SalesSubStage = [
  "Lead - market Intelligence",
  "Lead - from the client",
  "Opportunity being probed",
  "Yet to connect with decision maker",
  "As of now, we are in the dark",
  "Some connect made with prospect",
  "Building Rapport with propect",
  "Prospect not favourably inclined yet ",
  "Well Positioned  - Prospect favourable",
  "TOR / Demo..2",
  "Project being defined / shaped by us",
  "Decided not to Pursue Further",
  "Under Finance Qualification",
  "Under Technical Qualification",
  "Under Expert Decision",
  "Not Qualified by us",
  "Proposal being developed",
  "Proposal not submitted",
  "Proposal Submitted",
  "Positive Feedback",
  "Under Active Negotiation",
  "Negative Feedback - Pricing Off Mark",
  "Negative Feedback - Technical Not Right ",
  "No insights or inputs yet",
  "Project On Hold",
  "Above budget - Will go for retender",
  "Management not convinced - retender",
  "Won",
  "Lost",
  "TOR / Demo..",
  "Project being defined / shaped by us",
  "Decided not to Pursue Further",
  "Under Finance Qualification",
  "Under Technical Qualification",
  "Under Expert Decision",
  "Not Qualified by us",
  "Proposal being developed",
  "Proposal not submitted",
  "Proposal Submitted",
  "Positive Feedback",
  "Under Active Negotiation",
  "Negative Feedback - Pricing Off Mark",
  "Negative Feedback - Technical Not Right",
  "No insights or inputs yet",
  "Project On Hold",
  "Above budget - Will go for retender",
  "Management not convinced - retender",
  "Won",
  "Lost",
];

const TerritoryMaster = [
  "Chennai SCR",
  "Tamil nadu - Others",
  "Bangalore SCR",
  "Karnataka - Others",
  "Mumbai MMR",
  "Maharastra - Others",
  "Delhi - NCR",
  "Doha, Qatar",
  "Abu Dhabi, UAE",
  "Dubai, UAE",
  "Others, UAE",
  "Eastern Province Saudi",
  "Riyadh, Saudi",
  "Bahrain",
  "Oman",
  "Kuwait",
];

const Client = {
  classification: [
    "Platinum (10B $+)",
    "Gold (1-10B $)",
    "Silver (500-1B $)",
    "Copper (100-500M $)",
    "Bronze (10-100M $)",
    "Nickel (Low Revenue)",
  ],
  incorporationType: [
    "Independent",
    "Subsidiary",
    "Holding",
    "Government body",
    "Semi Government",
    "NGO",
    "Ministry",
    "Family Owned",
    "Employee Owned",
  ],
  relationShipStatus: [
    "Well entrenched",
    "me relationships exists",
    "cently Delivered (within 12 months)",
    "recent delivery",
    "trained Relationship",
    "relationship",
  ],
};

const Contact = {
  archetype: [
    "Decision Maker ",
    "Influencer",
    "Economic Buyer",
    "Technical Evaluator",
    "Specifier ",
    "Detractor",
    "Generic",
  ],
  relationShipDegree: [
    "1st deegree (Very Close)",
    "2nd degree (Knows us)",
    "3rd degree (Connected through someone)",
    "Estranged",
    "Zero Degree (Passive Relationship)",
  ],
};

const Tender = {
  stage: [
    "Tender Being Recieved",
    "Tender Sent To Technical Team",
    "Awaiting Confirmation of Participation ",
    "Confirmed Participation - Confirmed to Client",
    "Tender Dropped",
    "Tender Submitted",
  ],
};

const Registration = {
  registrationStatus: [
    "Yet initiate registration",
    "egistration in progess",
    "Stalled- not able toregister",
    "Registered",
    "Registration Expired",
  ],
};

const feedResource = async (route) => {
  let feedData = null;
  switch (route) {
    case "industry":
      feedData = Industry;
      break;
    case "sub-industry":
      feedData = SubIndustry;
      break;
    case "solution":
      feedData = Solution;
      break;
    case "sales-stage":
      feedData = SalesStage;
      break;
    case "sales-sub-stage":
      feedData = SalesSubStage;
      break;
    case "territory":
      feedData = TerritoryMaster;
      break;
    //client
    case "relationship-status":
      feedData = Client.relationShipStatus;
      break;
    case "incorporation-type":
      feedData = Client.incorporationType;
      break;
    case "classification":
      feedData = Client.classification;
      break;

    //contact
    case "relationship-degree":
      feedData = Contact.relationShipDegree;
      break;
    case "archetype":
      feedData = Contact.archetype;
      break;

    //tender
    case "stage":
      feedData = Tender.stage;
      break;

    //registration
    case "registration-status":
      feedData = Registration.registrationStatus;
      break;
  }

  console.log("feedData : ", feedData);

  if (!feedData) {
    console.log("invalid path : ", route);
    return;
  }
  for (let i = 0; i < feedData.length; i++) {
    let salesState = null;
    let level = -1;
    if (i >= 0 && i <= 4) {
      salesState = "670e7df4f5e783c1a47cd48f";
      level = 0;
    }
    if (i >= 5 && i <= 11) {
      salesState = "670e7df4f5e783c1a47cd491";
      level = 1;
    }
    if (i >= 12 && i <= 15) {
      salesState = "670e7df4f5e783c1a47cd493";
      level = 2;
    }
    if (i >= 16 && i <= 18) {
      salesState = "670e7df5f5e783c1a47cd495";
      level = 3;
    }
    if (i >= 19 && i <= 23) {
      salesState = "670e7df5f5e783c1a47cd497";
      level = 4;
    }
    if (i >= 24 && i <= 28) {
      salesState = "670e7df5f5e783c1a47cd499";
      level = 5;
    }
    if (i >= 29 && i <= 31) {
      salesState = "670e7df4f5e783c1a47cd491";
      level = 1;
    }
    if (i >= 32 && i <= 35) {
      salesState = "670e7df4f5e783c1a47cd493";
      level = 2;
    }
    if (i >= 36 && i <= 43) {
      salesState = "670e7df5f5e783c1a47cd497";
      level = 4;
    }
    if (i >= 34 && i <= 50) {
      salesState = "670e7df5f5e783c1a47cd499";
      level = 5;
    }
    console.log(feedData[i]);
    // const result = await fetch(`${local_url}/configuration/${route}`, {
      // const result = await fetch(`${local_url}/client/config/${route}`, {
      // const result = await fetch(`${local_url}/contact/config/${route}`, {
      // const result = await fetch(`${local_url}/tender/config/${route}`, {
      const result = await fetch(`${local_url}/registration/config/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: feedData[i],
        level: level,
        salesStage: salesState,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("created : ", data.data));
  }
};

const deleteResource = async (route) => {
  let deletingIndustries = [];

  const result = await fetch(`${local_url}/configuration/${route}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(async (data) => {
      deletingIndustries = data.data;
      console.log(data);
      for (let i = 0; i < deletingIndustries.length; i++) {
        console.log("delteing id : ");
        const result = await fetch(
          `${local_url}/configuration/${route}/${deletingIndustries[i]._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then((data) => console.log("deleting :", data.data));
      }
    });
};

// feedResource("industry");
// deleteResource("sub-industry")
// feedResource("sub-industry")
// feedResource("solution");
// feedResource("sales-stage");
// deleteResource("sales-stage");
// feedResource("sales-sub-stage");
// deleteResource("sales-sub-stage");
// feedResource("territory");

// //client
// feedResource("relationship-status");
// // deleteResource("relationship-status");
// feedResource("incorporation-type");
// feedResource("classification");

// contact
// feedResource("archetype");
// feedResource("relationship-degree");

//tender
// feedResource("stage");

//registration
feedResource("registration-status");
