/**
 * TECHNICAL CAPABILITIES — organised into categories rather than one long list.
 *
 * Consolidated from both supplied company profiles. Every item traces to a
 * capability stated in Spartcon's own material.
 */

export type CapabilityGroup = {
  id: string;
  index: string;
  title: string;
  summary: string;
  items: { title: string; detail: string }[];
  image: string | null;
  owner: "Spartcon" | "Spartcon Tech" | "Both";
};

export const capabilityGroups: CapabilityGroup[] = [
  {
    id: "structural",
    index: "01",
    title: "Structural & Concrete Works",
    summary:
      "The load-bearing work that determines what can be built and how long it lasts.",
    owner: "Spartcon",
    image: "reinforcement-bars-foundation",
    items: [
      {
        title: "Foundations",
        detail:
          "Strip, raft and pad foundations, column footing foundations and piling.",
      },
      {
        title: "Concrete Structures",
        detail:
          "Vertical, horizontal and transverse columns; formwork design and shuttering, reinforcing, casting, testing and signoff.",
      },
      {
        title: "Concrete & Masonry",
        detail:
          "Load-bearing cavity walls, reinforced concrete walls and masonry structures.",
      },
      {
        title: "Structural Steel",
        detail:
          "Design, fabrication, erection, sheet cladding and corrosion protection of structural steel portals.",
      },
      {
        title: "Mega Structures",
        detail:
          "Structures erected across mining and commercial building, from single to multiple storey with complex structural loads.",
      },
      {
        title: "Onsite Batch Plant & Formwork",
        detail:
          "In-house onsite concrete batch plant, standard to custom formwork and scaffolding.",
      },
    ],
  },
  {
    id: "civil",
    index: "02",
    title: "Earthworks, Roads & Civil Infrastructure",
    summary:
      "Moving ground and building the surfaces and networks that service a site.",
    owner: "Spartcon",
    image: "pipeline-construction-trench",
    items: [
      {
        title: "Bulk Earthworks",
        detail:
          "Grubbing and clearing, rubble removal, top and sub-soil excavation, hard rock excavation and rock breaking.",
      },
      {
        title: "Layerworks & Compaction",
        detail:
          "Layering, levelling and compaction, soil chemical treatment and base finishing.",
      },
      {
        title: "Roads",
        detail:
          "Provincial, local municipal and facilities internal roads, planned, designed, constructed and maintained.",
      },
      {
        title: "Bridges & Sidewalks",
        detail: "Low to medium lying bridges and sidewalks.",
      },
      {
        title: "Transmission Pipelines",
        detail:
          "Mega pipeline projects across varied landscape and terrain, with distribution networks and bulk storage.",
      },
      {
        title: "Sanitation Infrastructure",
        detail:
          "Sewer networks, septic tanks, VIP toilets and associated civil works.",
      },
    ],
  },
  {
    id: "water",
    index: "03",
    title: "Water, Wastewater & Pumping",
    summary:
      "Delivering water in, moving it through a facility, and treating what leaves.",
    owner: "Both",
    image: "cooling-water-pumps-pipework",
    items: [
      {
        title: "Water Treatment & Purification",
        detail:
          "Water treatment plants and purification plants for facilities and bulk infrastructure networks.",
      },
      {
        title: "Pump Stations & Fire Pump Sets",
        detail:
          "Pump stations, fire pump sets and associated valved pipework.",
      },
      {
        title: "Storage & Reservoirs",
        detail: "Water storage including reservoirs, tanks and bulk storage.",
      },
      {
        title: "Boreholes",
        detail:
          "Development of underground water sources, including boreholes and equipping.",
      },
      {
        title: "Wastewater Treatment",
        detail:
          "Feed pumping and networks, filtration, separation, purification and dewatering for sewer sludge and slurry.",
      },
      {
        title: "Plumbing & Utilities",
        detail:
          "Facilities plumbing and utility system maintenance and reticulation.",
      },
    ],
  },
  {
    id: "mechanical",
    index: "04",
    title: "HVAC, Refrigeration & Thermal Systems",
    summary:
      "Air, heat and refrigeration — what makes an occupied or process environment workable.",
    owner: "Spartcon Tech",
    image: "air-handling-units-commercial",
    items: [
      {
        title: "Air Conditioning",
        detail: "Roof packaging, midwall splits and ceiling cassettes.",
      },
      {
        title: "Mechanical Ventilation",
        detail:
          "Ducting, cooling systems, underfloor cooling, water-cooled and air-cooled systems to SANS 10400.",
      },
      {
        title: "Refrigeration",
        detail:
          "Evaporative, mechanical compression, absorption and thermoelectric systems for cold and freezer rooms.",
      },
      {
        title: "Steam Generation",
        detail:
          "Coal, gas, oil and fuel-fired boilers with steam and condensate reticulation, to SANS 347:2007.",
      },
      {
        title: "Heat Exchange",
        detail:
          "Steam calorifiers, hot water storage vessels, condensers and evaporators.",
      },
      {
        title: "Thermal Insulation",
        detail:
          "Steam pipe insulation for heat control efficiency across internal and external reticulation.",
      },
    ],
  },
  {
    id: "electrical",
    index: "05",
    title: "Electrical, Standby Power & Energy",
    summary:
      "Supply, distribution, resilience and the energy performance of an estate.",
    owner: "Spartcon Tech",
    image: "electrical-substation-switchyard",
    items: [
      {
        title: "MV & LV Infrastructure",
        detail:
          "Medium voltage miniature substations, MV and LV distribution boards and LV reticulation to SANS 10142-1.",
      },
      {
        title: "Supply Compliance",
        detail:
          "Municipal and Eskom feed compliance, cabling and reticulation networks.",
      },
      {
        title: "Lighting & Equipment",
        detail:
          "External and internal lighting, and equipment installation including variable speed drives.",
      },
      {
        title: "Earthing & Lightning Protection",
        detail: "Earthing systems and lightning protection installations.",
      },
      {
        title: "Standby Power",
        detail:
          "Diesel, petrol and gas generators, power invertors and UPS, and solar generation.",
      },
      {
        title: "Energy Management",
        detail:
          "Energy audits, cost savings analysis, utility rebates, advanced metering and code compliance.",
      },
    ],
  },
  {
    id: "life-safety",
    index: "06",
    title: "Fire, Access & Surveillance",
    summary:
      "Systems that exist for the moments a facility is under threat — and must work then.",
    owner: "Spartcon Tech",
    image: null,
    items: [
      {
        title: "Fire Detection",
        detail:
          "Point smoke detection, heat signature monitoring, flame detectors and carbon monoxide detectors.",
      },
      {
        title: "Fire Suppression",
        detail:
          "Water suppression, pressurised gas, foam deluge and chemical foam systems.",
      },
      {
        title: "Access Control",
        detail:
          "Access and time management, biometric clocking, turnstiles, boom gates and barrier entry control.",
      },
      {
        title: "Surveillance",
        detail:
          "Internal and external IP and Wi-Fi cameras, alarm systems, intercoms and DVR/NVR recording.",
      },
      {
        title: "Network & Monitoring",
        detail:
          "Switches, Cat5/6 cabling, cabinets, backup drives and remote monitoring.",
      },
    ],
  },
  {
    id: "maintenance",
    index: "07",
    title: "Maintenance & Asset Management",
    summary:
      "The disciplines that keep installed engineering performing across an asset's life.",
    owner: "Spartcon Tech",
    image: "heat-exchanger-bundle-extraction",
    items: [
      {
        title: "Predictive Maintenance",
        detail:
          "Condition-informed intervention scheduled before failure occurs.",
      },
      {
        title: "Pre-emptive Maintenance",
        detail: "Planned, interval-based maintenance protecting reliability.",
      },
      {
        title: "Reactive Maintenance",
        detail:
          "Structured response to faults and breakdowns, restoring service with minimum disruption.",
      },
      {
        title: "Life Cycle Management",
        detail:
          "Maximising asset lifecycle value and continuous optimum performance.",
      },
      {
        title: "Engineering Labour",
        detail:
          "Engineers, technologists, technicians and skilled trades deployed to operate and maintain systems.",
      },
      {
        title: "Operations Platform",
        detail:
          "Tailored per facility on SANS and ASME standards, OEM specifications and OHSA regulations.",
      },
    ],
  },
  {
    id: "engineering",
    index: "08",
    title: "Professional Engineering & Consultancy",
    summary:
      "Registered professional capability across the design and compliance disciplines.",
    owner: "Both",
    image: "structural-steel-welding",
    items: [
      {
        title: "Multidisciplinary Design",
        detail:
          "Architectural, civil, mechanical and electrical engineering, with quantity surveying.",
      },
      {
        title: "Design & Modelling",
        detail:
          "Design and modelling, project budgeting and estimation, and compliance management.",
      },
      {
        title: "Support Consultancy",
        detail: "Fire management, energy management and security management.",
      },
      {
        title: "Outsourced Professional Services",
        detail:
          "Geotechnical assessment, environmental assessment, town planning and land surveying.",
      },
      {
        title: "Professional Registration",
        detail:
          "Construction and engineering managers registered with ECSA and SACPCMP.",
      },
      {
        title: "Green Building Programme",
        detail:
          "Supporting facilities towards Green Building Council South Africa certification.",
      },
    ],
  },
  {
    id: "delivery",
    index: "09",
    title: "Delivery & Construction Support",
    summary:
      "Management capability and physical resource that keep a programme moving.",
    owner: "Spartcon",
    image: "standby-generator-installation",
    items: [
      {
        title: "Programme Planning",
        detail:
          "Programme planning, resource management and contract accounting.",
      },
      {
        title: "Plant & Machinery Pool",
        detail:
          "A managed pool of plant with operators skilled in autonomous onsite maintenance.",
      },
      {
        title: "Quality Control Programme",
        detail:
          "A systematic QCP tailored per project and maintained by the onsite project manager.",
      },
      {
        title: "Risk & Safety Management",
        detail:
          "Risk management and health and safety planned into method and sequence to OHSA.",
      },
      {
        title: "Facilities Equipment",
        detail:
          "Laundry and commercial kitchen equipment designed, installed and maintained to OEM specification.",
      },
    ],
  },
];

export const getCapabilityGroup = (id: string): CapabilityGroup | undefined =>
  capabilityGroups.find((g) => g.id === id);
