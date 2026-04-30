/* ===================================================
   products-data.js  —  Avartanam Test Labs
   Source: avartanamlabs.com (official site data)
   4 Services  |  3 Products
   Item Codes sourced from IndiaMART listings
=================================================== */

/* SERVICES (shown on Services page & detail panels) */
var ATL_PRODUCTS = [

  /* 1. RF / Radio Frequency Testing — 11 sub-services */
  {
    id: "RF-001", partNo: "2851807191873",
    name: "RF Wireless Testing Service", shortName: "Radio Frequency",
    category: "rf", categoryLabel: "Radio Frequency",
    badge: "RF / OTA", color: "blue",
    accreditation: "NABL / WPC", leadTime: "7 Days",
    desc: "Radio Frequency (RF) technology plays a pivotal role in the functionality of modern electronic products, including televisions, smartphones, Bluetooth\u00ae and Wi-Fi networks, LoRa, and Zigbee devices. At our state-of-the-art facilities, we provide extensive RF testing services that cater to all stages of product development and manufacturing. Our commitment to delivering exceptional RF testing solutions ensures your electronic products meet the highest standards and perform optimally.",
    standards: ["ETSI EN 300220","ETSI EN 300328","ETSI EN 301893","FCC Part 15.247","3GPP","IEC 62368"],
    image: "images/services/rf/basic-testing.jpg",
    options: [
      { partNo:"RFSRV-ANTR", service:"Antenna Radiation Pattern & Gain Measurement", standard:"3GPP / ETSI", scope:"Wi-SUN, LoRa, Bluetooth, Wi-Fi 2.4/5 GHz, GPRS, GPS, GLONASS, Galileo, Zigbee, 2G/3G/4G/5G, LTE, Sub-GHz. RMS 370 MHz to 6 GHz. Radiation Pattern (3 plane), Antenna Gain (Avg & Peak), Directivity, Sweep Gain, F/B Ratio", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"RFSRV-ATUN", service:"Antenna Tuning & Optimization",                standard:"ETSI",          scope:"Single and dual-frequency band antennas: PCB, Chip, Coil, Flexible, MIMO, CPE, Directional, Array. Smith Chart analysis, impedance matching", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"RFSRV-VSWR", service:"Antenna VSWR & Return Loss Measurement",       standard:"ETSI",          scope:"30 kHz to 26 GHz across UHF, VHF, HF, L, S, C, X, Ku, K bands. Both magnitude & phase. VSWR and Return Loss measurements", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"RFSRV-TRPM", service:"Total Radiated Power (TRP) Measurement",       standard:"3GPP",          scope:"Precise TRP using advanced radiation measurement technology. Supported frequency range 370 MHz to 6 GHz", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"RFSRV-TISM", service:"Total Isotropic Sensitivity (TIS) Measurement",standard:"3GPP",          scope:"RF TIP and TIS based on 3GPP Pre-Compliance standard. Frequency bands: 433 MHz, 865 MHz, 915 MHz, 2.4 GHz, 5.1 GHz", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"RFSRV-BRFT", service:"Product Basic RF Testing",                     standard:"ETSI / FCC",    scope:"433 MHz, 865 MHz, 915 MHz, 2.4 GHz, 5.1 GHz. Max output power, TX frequency offset, input chip reflection, receiver path loss", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"RFSRV-PCMT", service:"Pre-Compliance Testing",                       standard:"ETSI / FCC",    scope:"ETSI EN 300220 (25 MHz-1 GHz), ETSI EN 300328 (2.4 GHz), ETSI EN 301893 (5 GHz), FCC 15.247 Part C", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"RFSRV-ODRT", service:"Outdoor Range (CW) Testing",                   standard:"Custom",        scope:"LOS Type and Deployment Type scenarios. 433 MHz, 865 MHz, 915 MHz, 2.4 GHz, 5.1 GHz", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"RFSRV-SPRO", service:"Radio Spurious Optimization",                  standard:"ETSI / FCC",    scope:"Radiative Spurious Failure Re-Verification, Filter Design and Analysis, Optimized RF Component BOM Finalization, Spurious Level Measurement", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"RFSRV-WPCT", service:"WPC Type Approval Testing",                    standard:"WPC India",     scope:"Short range devices, Wi-Fi, Bluetooth, Zigbee, LoRa modules for Indian market WPC type approval", accr:"WPC", leadTime:"7 Days", status:"Active" },
      { partNo:"RFSRV-BISC", service:"BIS / CRS RF Certification",                   standard:"BIS CRS",       scope:"Bureau of Indian Standards CRS for wireless and IoT products for the Indian market", accr:"BIS", leadTime:"7 Days", status:"Active" },
    ],
    docs: [
      { title:"RF Testing Service Overview",              type:"Datasheet",      std:"ETSI / FCC",     rev:"v2.0", size:"1.8 MB", format:"PDF" },
      { title:"Antenna Radiation Pattern Test Procedure", type:"Test Procedure", std:"3GPP",           rev:"v1.5", size:"2.4 MB", format:"PDF" },
      { title:"Pre-Compliance Test Plan Template",        type:"Template",       std:"ETSI EN 300328", rev:"v1.2", size:"0.9 MB", format:"DOCX" },
      { title:"VSWR & Return Loss Measurement Guide",     type:"App Note",       std:"ETSI",           rev:"v1.0", size:"0.6 MB", format:"PDF" },
      { title:"WPC Type Approval Checklist",              type:"Checklist",      std:"WPC India",      rev:"v1.1", size:"0.5 MB", format:"XLSX" },
    ],
    boards: [
      { name:"OTA Anechoic Chamber (RMS)",       model:"ATL-OTA-6G",      type:"Anechoic Chamber",  freq:"370 MHz - 6 GHz",  cert:"NABL",      avail:"Available" },
      { name:"Vector Network Analyser (VNA)",    model:"Keysight E5063A", type:"VNA",               freq:"100 kHz - 18 GHz", cert:"NABL Cal.", avail:"Available" },
      { name:"RF Signal Generator",             model:"Keysight N5181B", type:"RF Instrument",     freq:"100 kHz - 6 GHz",  cert:"NABL Cal.", avail:"Available" },
      { name:"Spectrum Analyser",               model:"R&S FSV3000",     type:"Spectrum Analyser", freq:"10 Hz - 30 GHz",   cert:"NABL Cal.", avail:"Available" },
    ],
    software: [
      { name:"RF Test Automation Suite", ver:"v3.5", platform:"Windows 10/11", license:"Licensed", desc:"Automated OTA and conducted RF test sequencing with auto-report generation" },
      { name:"Antenna Pattern Viewer",   ver:"v2.1", platform:"Windows",       license:"Licensed", desc:"3D radiation pattern visualization and gain comparison tool" },
    ],
    videos: [
      { title:"RF OTA Testing at Avartanam",                 dur:"15 min", type:"Tutorial", desc:"Complete walkthrough of the OTA test process in our anechoic chamber from 370 MHz to 6 GHz." },
      { title:"Antenna Tuning — PCB vs Chip vs Coil",        dur:"20 min", type:"Webinar",  desc:"How antenna type affects tuning strategy with live Smith Chart demo." },
      { title:"WPC Type Approval — Step by Step Guide",      dur:"18 min", type:"Tutorial", desc:"Documents, test sequence and timelines for WPC type approval in India." },
    ],
  },

  /* 2. EMI / EMC Testing — 3 sub-services */
  {
    id: "EMI-001", partNo: "2851807192001",
    name: "EMI / EMC Testing Service", shortName: "EMI-EMC",
    category: "emi", categoryLabel: "EMI / EMC",
    badge: "CISPR / IEC", color: "red",
    accreditation: "NABL", leadTime: "7 Days",
    desc: "EMI (Electromagnetic Interference) and EMC (Electromagnetic Compatibility) testing ensure seamless device coexistence. Our comprehensive pre-compliance testing services aid electronic product manufacturers in achieving system integration and legal compliance. We cover conducted emission, ESD, and surge testing.",
    standards: ["CISPR 11","CISPR 32","IEC 61000-4-2","IEC 61000-4-5","EN 55032","FCC Part 15"],
    image: "images/services/emi/conducted-emission.jpg",
    options: [
      { partNo:"EMISRV-COND", service:"Conducted Emission Testing (CE)", standard:"CISPR / FCC / EN", scope:"Electromagnetic Disturbance 9 kHz to 300 MHz per CISPR standards. Common-Mode and Differential Mode interference on supply grid. CISPR 11, CISPR 32, EN 55032, FCC Part 15", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"EMISRV-ESDT", service:"Electrostatic Discharge (ESD) Testing", standard:"IEC 61000-4-2", scope:"Contact and Air discharge up to 20 kV with VCP to HCP. Simulates human ESD on electronic components. Assesses ESD protective area (User Accessible Part)", accr:"NABL", leadTime:"7 Days", status:"Active" },
      { partNo:"EMISRV-SRGT", service:"Surge Testing", standard:"IEC 61000-4-5", scope:"Lightning Surge Immunity per IEC 61000-4-5, EN 61000-4-5, GB/T17626.5. Combination Wave Generator. AC power supplies and lengthy cables", accr:"NABL", leadTime:"7 Days", status:"Active" },
    ],
    docs: [
      { title:"Conducted Emission Test Report Template", type:"Template",       std:"CISPR 32",      rev:"v2.0", size:"1.4 MB", format:"PDF" },
      { title:"ESD Testing Procedure IEC 61000-4-2",     type:"Test Procedure", std:"IEC 61000-4-2", rev:"v1.5", size:"1.1 MB", format:"PDF" },
      { title:"Surge Test Plan (IEC 61000-4-5)",         type:"Test Plan",      std:"IEC 61000-4-5", rev:"v1.3", size:"0.8 MB", format:"PDF" },
      { title:"EMC Pre-Compliance Checklist",            type:"Checklist",      std:"EN 55032",      rev:"v1.0", size:"0.5 MB", format:"XLSX" },
    ],
    boards: [
      { name:"10m Semi-Anechoic Chamber",          model:"ATL-SAC-10M",      type:"EMC Chamber",     freq:"30 MHz - 18 GHz", cert:"NABL",      avail:"Available" },
      { name:"Conducted Emission LISN",            model:"R&S NNBM 550",     type:"LISN",            freq:"9 kHz - 30 MHz",  cert:"NABL Cal.", avail:"Available" },
      { name:"ESD Generator (20 kV)",              model:"Schaffner NSG 436", type:"ESD Simulator",   freq:"N/A",             cert:"IEC 61000", avail:"Available" },
      { name:"Surge / Combination Wave Generator", model:"Haefely AXOS 5",   type:"Surge Generator", freq:"N/A",             cert:"IEC 61000", avail:"Available" },
    ],
    software: [
      { name:"EMC Analyser Pro", ver:"v6.4", platform:"Windows", license:"Licensed", desc:"Spectrum analysis with CISPR limit-line comparison and auto-reporting" },
    ],
    videos: [
      { title:"Conducted Emission Test — Setup & Procedure", dur:"18 min", type:"Tutorial", desc:"End-to-end CE test setup, LISN connection and limit line comparison." },
      { title:"ESD Testing — IEC 61000-4-2",                 dur:"14 min", type:"Webinar",  desc:"ESD test levels, contact vs air discharge, and common product failure points." },
      { title:"Surge Testing — Protecting Your Design",      dur:"16 min", type:"Tutorial", desc:"How surge levels are defined, coupled, and how to design for compliance." },
    ],
  },

  /* 3. Environmental Testing — 1 sub-service */
  {
    id: "ENV-001", partNo: "2851807192101",
    name: "Environmental Testing Service", shortName: "Environmental",
    category: "environmental", categoryLabel: "Environmental",
    badge: "IEC 60068", color: "teal",
    accreditation: "NABL", leadTime: "7 Days",
    desc: "Avartanam's testing facility replicates diverse climatic conditions — extreme temperatures, humidity, vibrations, and more — to assess the products' durability in harsh environments, refining them for peak performance. We offer a fully automated environmental chamber capable of testing from -20\u00b0C to +100\u00b0C per IEC 60068 Series.",
    standards: ["IEC 60068-2-1","IEC 60068-2-2","IEC 60068-2-78","IEC 60068 Series"],
    image: "images/services/environmental/environmental-testing.jpg",
    options: [
      { partNo:"ENVSRV-ENVT", service:"Environmental Testing for Equipment Performance Assessment", standard:"IEC 60068 Series", scope:"Fully automated chamber. Temp range -20\u00b0C to +100\u00b0C. Cold (IEC 60068-2-1), Dry Heat (IEC 60068-2-2), Damp Heat (IEC 60068-2-78). Evaluates durability under extreme temperatures and humidity", accr:"NABL", leadTime:"7 Days", status:"Active" },
    ],
    docs: [
      { title:"IEC 60068 Environmental Test Scope Overview", type:"Scope Doc", std:"IEC 60068",      rev:"v2.0", size:"1.8 MB", format:"PDF" },
      { title:"Damp Heat Test Procedure (IEC 60068-2-78)",   type:"Procedure", std:"IEC 60068-2-78", rev:"v1.3", size:"1.0 MB", format:"PDF" },
      { title:"Thermal Test Report Template",                type:"Template",  std:"IEC 60068-2-2",  rev:"v1.1", size:"0.7 MB", format:"DOCX" },
    ],
    boards: [
      { name:"Automated Environmental Chamber", model:"Memmert HPP 110", type:"Env. Chamber",   freq:"N/A", cert:"NABL Cal.", avail:"Available" },
    ],
    software: [
      { name:"Env. Test Manager", ver:"v2.3", platform:"Windows", license:"Licensed", desc:"Test scheduling, profile configuration and auto-reporting for IEC 60068 series" },
    ],
    videos: [
      { title:"Environmental Chamber — Cold & Dry Heat Testing", dur:"12 min", type:"Demo",     desc:"Live demonstration of IEC 60068-2-1 and 2-2 temperature tests on IoT module." },
      { title:"Damp Heat Testing — Why It Matters for IoT",      dur:"15 min", type:"Tutorial", desc:"Humidity effects on PCBs. Test setup and profile config on Memmert chamber." },
    ],
  },

  /* 4. Consultancy Services — 1 sub-service */
  {
    id: "CON-001", partNo: "2851807192201",
    pageUrl: "consultancy.html",
    name: "Consultancy Services", shortName: "Consultancy",
    category: "consultancy", categoryLabel: "Consultancy",
    badge: "WPC / BIS / FCC", color: "purple",
    accreditation: "NABL / ISO", leadTime: "1–5 days",
    desc: "The dynamic landscape of wireless standards continually necessitates precise certifications like WPC, FCC, BIS, TEC, CE, UL, IP, RoHS, WEEE, and safety standards. Our industry experts offer tailored guidance, helping clients navigate the certification process and make well-informed decisions. Our consultancy services cater to external clients, tailoring solutions to meet their specific needs.",
    standards: ["WPC India","FCC USA","BIS CRS","CE Europe","TEC","UL","IP","RoHS","WEEE"],
    image: "images/services/consultancy/consultancy.jpg",
    options: [
      { partNo:"CONSRV-CERT", service:"Certification Consultancy & External Lab Support", standard:"WPC / FCC / BIS / CE / TEC / UL / IP / RoHS / WEEE / SAFETY", scope:"External Lab Enquiry Support, DUT Handling Support, Witness Support during testing, Testing Status & Report Verification. Full certification journey management for WPC, FCC, BIS, TEC, CE, UL, IP, RoHS, WEEE and Safety standards", accr:"NABL/ISO", leadTime:"1-5 days", status:"Active" },
    ],
    docs: [
      { title:"Certification Pathway Guide (India)", type:"Reference", std:"WPC / BIS",     rev:"v2.0", size:"1.5 MB", format:"PDF" },
      { title:"Global Certification Overview",       type:"Reference", std:"FCC / CE / TEC",rev:"v1.8", size:"2.1 MB", format:"PDF" },
      { title:"DUT Handling & Submission Checklist", type:"Checklist", std:"General",       rev:"v1.0", size:"0.4 MB", format:"XLSX" },
    ],
    boards: [
      { name:"Documentation Review Station", model:"ATL-DOC-WS",   type:"Workstation", freq:"N/A", cert:"ISO 17025", avail:"Available" },
    ],
    software: [
      { name:"Certification Tracker", ver:"v1.5", platform:"Web / Excel", license:"Free Template", desc:"Track certification milestones, documents, lab slots and submission status" },
    ],
    videos: [
      { title:"BIS CRS — Complete Step-by-Step Guide",           dur:"22 min", type:"Tutorial", desc:"Documents, portal registration, product categories and BIS lab empanelment process." },
      { title:"WPC Type Approval — India Wireless Certification", dur:"18 min", type:"Tutorial", desc:"Short range device rules, test requirements and WPC portal submission." },
    ],
  },

  /* 5. Consultancy Service for Product Board Design Review */
  {
    id: "CON-002", partNo: "2851807192202",
    pageUrl: "consultancy-product-board-design-review.html",
    name: "Consultancy Service for Product Board Design Review", shortName: "Board Design Review",
    category: "consultancy", categoryLabel: "Consultancy",
    badge: "PCB / RF Layout", color: "purple",
    accreditation: "NABL / ISO", leadTime: "3–7 days",
    desc: "Expert PCB layout and schematic review consultancy to identify RF signal integrity issues, antenna placement problems, ground plane deficiencies, and EMC gaps before production. Avoid costly re-spins with a thorough design review by our RF engineers.",
    standards: ["IPC-2221","IEC 61000-5","CISPR 22","IEEE 802.11","3GPP TS 51.010"],
    image: "images/services/consultancy/consultancy-1.jpg",
    options: [
      { partNo:"CONSRV-BDR-SCH", service:"Schematic Design Review", standard:"IPC-2221 / IEC 61000-5", scope:"Review of schematic for RF signal integrity, decoupling, power supply noise, ESD protection, and antenna feed network correctness", accr:"Expert Advisory", leadTime:"2-3 days", status:"Active" },
      { partNo:"CONSRV-BDR-PCB", service:"PCB Layout Review", standard:"IPC-2221 / CISPR 22", scope:"Review of PCB Gerber files for RF trace routing, ground plane continuity, antenna keep-out zones, layer stack-up, and EMC best practices", accr:"Expert Advisory", leadTime:"3-5 days", status:"Active" },
      { partNo:"CONSRV-BDR-FULL", service:"Full Board Design Review (Schematic + PCB)", standard:"IPC-2221 / IEC 61000-5 / CISPR 22", scope:"Comprehensive schematic and PCB layout review with detailed written report, annotated Gerber markups, and recommended corrective actions", accr:"Expert Advisory", leadTime:"5-7 days", status:"Active" },
    ],
    docs: [
      { title:"PCB Layout RF Best Practices Guide", type:"Reference", std:"IPC-2221",        rev:"v1.0", size:"1.2 MB", format:"PDF" },
      { title:"Design Review Checklist — RF & EMC",  type:"Checklist", std:"IEC 61000-5",    rev:"v1.1", size:"0.3 MB", format:"XLSX" },
      { title:"Gerber Submission Requirements",       type:"Reference", std:"General",         rev:"v1.0", size:"0.2 MB", format:"PDF" },
    ],
    boards: [
      { name:"PCB Review Workstation", model:"ATL-PCB-RVW", type:"Workstation", freq:"N/A", cert:"ISO 17025", avail:"Available" },
    ],
    software: [
      { name:"KiCad / Altium DRC Reference", ver:"v2024", platform:"Windows / Linux", license:"Advisory", desc:"Design rule reference profiles for RF and EMC-aware PCB layout" },
    ],
    videos: [
      { title:"RF PCB Layout — Common Mistakes & Fixes",    dur:"20 min", type:"Tutorial", desc:"Ground plane splits, antenna keep-out violations, and trace impedance issues." },
      { title:"EMC Pre-compliance PCB Design Strategies",   dur:"16 min", type:"Tutorial", desc:"Filtering, shielding, and layout techniques to pass CISPR radiated emission tests." },
    ],
  },

  /* 6. Consultancy Service for QC Jig RF Calibration Support */
  {
    id: "CON-003", partNo: "2851807192203",
    pageUrl: "consultancy-qc-jig-rf-calibration.html",
    name: "Consultancy Service for QC Jig RF Calibration Support", shortName: "QC Jig RF Calibration",
    category: "consultancy", categoryLabel: "Consultancy",
    badge: "RF Calibration", color: "purple",
    accreditation: "NABL Traceable", leadTime: "5–10 days",
    desc: "Specialised consultancy for designing, validating, and calibrating RF QC jigs used in production line testing. Ensure your factory test fixtures deliver accurate, repeatable RF measurements that align with NABL-traceable calibration standards. Covers pogo-pin contactors, SMA fixtures, and OTA test chambers from Sub-GHz to 6 GHz.",
    standards: ["ISO 17025","NABL","IEC 61326","IPC-9252"],
    image: "images/services/consultancy/consultancy-2.jpg",
    options: [
      { partNo:"CONSRV-JIG-DES", service:"QC Jig Design Consultancy", standard:"ISO 17025 / IPC-9252", scope:"Mechanical and electrical design review of RF test fixtures including pogo-pin layout, SMA connector placement, coaxial trace routing, and spring probe selection", accr:"NABL Traceable", leadTime:"3-5 days", status:"Active" },
      { partNo:"CONSRV-JIG-CAL", service:"RF Jig Calibration & Characterisation", standard:"ISO 17025 / NABL", scope:"NABL-traceable insertion loss, return loss, and isolation characterisation of production test jigs. Includes calibration certificate and recommended correction factors", accr:"NABL Traceable", leadTime:"5-7 days", status:"Active" },
      { partNo:"CONSRV-JIG-SOP", service:"Calibration SOP Development", standard:"ISO 17025", scope:"Development of documented calibration and verification procedures for production floor RF jig maintenance, including interval recommendations and pass/fail criteria", accr:"Expert Advisory", leadTime:"3-5 days", status:"Active" },
    ],
    docs: [
      { title:"RF QC Jig Design Guidelines",       type:"Reference", std:"IPC-9252",    rev:"v1.0", size:"1.0 MB", format:"PDF" },
      { title:"Jig Calibration Record Template",   type:"Template",  std:"ISO 17025",  rev:"v1.2", size:"0.2 MB", format:"XLSX" },
      { title:"Insertion Loss Measurement Guide",  type:"Reference", std:"NABL",        rev:"v1.0", size:"0.8 MB", format:"PDF" },
    ],
    boards: [
      { name:"Vector Network Analyser (VNA)",         model:"ATL-VNA-9GHz", type:"Instrument", freq:"300 kHz–9 GHz", cert:"NABL Calibrated", avail:"Available" },
      { name:"RF Signal Generator",                   model:"ATL-SG-6GHz",  type:"Instrument", freq:"100 kHz–6 GHz", cert:"NABL Calibrated", avail:"Available" },
    ],
    software: [
      { name:"Jig Calibration Tracker", ver:"v1.0", platform:"Excel", license:"Free Template", desc:"Track jig calibration intervals, correction factors, and pass/fail history" },
    ],
    videos: [
      { title:"RF Test Jig Design for Production Lines",   dur:"18 min", type:"Tutorial", desc:"Pogo-pin selection, SMA connector placement, and ground stitch techniques." },
      { title:"VNA Calibration for Production Jigs",       dur:"14 min", type:"Tutorial", desc:"SOLT calibration procedure, correction factor application, and uncertainty budget." },
    ],
  },

  /* 7. Consultancy Service for Customize Antenna Design */
  {
    id: "CON-004", partNo: "2851807192204",
    pageUrl: "consultancy-customize-antenna-design.html",
    name: "Consultancy Service for Customize Antenna Design", shortName: "Custom Antenna Design",
    category: "consultancy", categoryLabel: "Consultancy",
    badge: "Antenna Design", color: "purple",
    accreditation: "NABL / ISO", leadTime: "7–21 days",
    desc: "End-to-end custom antenna design service — from requirement specification through EM simulation, prototype fabrication co-ordination, and NABL-accredited characterisation. Covers PCB trace antennas, coil antennas, chip antennas, and external whip/patch designs across Sub-GHz to 6 GHz. Validation includes VSWR, radiation pattern measurement, TRP, and TIS testing.",
    standards: ["IEEE 149","IEC 62369","3GPP TS 34.121","CTIA OTAv3.9"],
    image: "images/services/consultancy/consultancy-3.jpg",
    options: [
      { partNo:"CONSRV-ANT-SPEC", service:"Antenna Specification & Feasibility Study", standard:"IEEE 149 / IEC 62369", scope:"Frequency band analysis, gain/efficiency targets, size constraints, and substrate selection guidance. Deliverable: antenna specification document and feasibility summary", accr:"Expert Advisory", leadTime:"2-4 days", status:"Active" },
      { partNo:"CONSRV-ANT-SIM",  service:"EM Simulation & Design Optimisation", standard:"IEEE 149 / 3GPP TS 34.121", scope:"Simulated antenna model development, parametric sweep optimisation, and design finalisation with predicted VSWR, gain, and radiation pattern results", accr:"Expert Advisory", leadTime:"5-10 days", status:"Active" },
      { partNo:"CONSRV-ANT-VAL",  service:"Prototype Validation (VSWR, Pattern, TRP/TIS)", standard:"CTIA OTAv3.9 / IEEE 149", scope:"NABL-accredited measurement of prototype antenna: VSWR/return loss, 2D/3D radiation pattern, TRP and TIS in our anechoic chamber. Deliverable: NABL test report", accr:"NABL Accredited", leadTime:"5-7 days", status:"Active" },
    ],
    docs: [
      { title:"Custom Antenna Design Brief Template", type:"Template",  std:"General",          rev:"v1.0", size:"0.3 MB", format:"DOCX" },
      { title:"Antenna Measurement Methodology",      type:"Reference", std:"IEEE 149",          rev:"v2.0", size:"1.8 MB", format:"PDF" },
      { title:"VSWR & Radiation Pattern Report Sample",type:"Sample",   std:"CTIA OTAv3.9",     rev:"v1.0", size:"2.4 MB", format:"PDF" },
    ],
    boards: [
      { name:"Anechoic Chamber (2D/3D OTA)",  model:"ATL-OTA-6GHz",  type:"Test Chamber", freq:"400 MHz–6 GHz", cert:"NABL Accredited", avail:"Available" },
      { name:"Vector Network Analyser (VNA)", model:"ATL-VNA-9GHz",   type:"Instrument",   freq:"300 kHz–9 GHz", cert:"NABL Calibrated", avail:"Available" },
    ],
    software: [
      { name:"Antenna Design Brief Wizard", ver:"v1.0", platform:"Web / PDF", license:"Free Template", desc:"Guided questionnaire to capture frequency, gain, size, and substrate requirements for custom antenna projects" },
    ],
    videos: [
      { title:"PCB Trace Antenna Design — Sub-GHz & 2.4 GHz",  dur:"24 min", type:"Tutorial", desc:"Inverted-F, meandered monopole, and loop antenna design for IoT products." },
      { title:"Antenna Measurement in an Anechoic Chamber",    dur:"19 min", type:"Tutorial", desc:"VSWR, radiation pattern, TRP and TIS measurement procedures at ATL." },
    ],
  },

];

/* HARDWARE PRODUCTS — AFL0001, AFL0003, Coil Antenna */
var ATL_HW_PRODUCTS = [

  {
    id: "AFL0001", partNo: "AFL0001",
    name: "Avartanam RF Filter - AFL0001", shortName: "RF Filter AFL0001",
    category: "product", categoryLabel: "RF Filter",
    badge: "LOW PASS", color: "blue",
    family: "AFL Series", status: "Active",
    accreditation: "In-house Design",
    desc: "The Avartanam RF Filter AFL0001 is a precision low-pass RF filter designed for sub-GHz applications. Engineered to suppress harmonic and spurious emissions, ensuring your wireless product meets ETSI, FCC, and BIS radiated emission limits. Ideal for LoRa, Zigbee, 433 MHz, and 868/915 MHz modules.",
    image: "images/products/afl001.jpg",
    standards: ["ETSI EN 300220","FCC Part 15","BIS CRS"],
    specs: {
      "Filter Type":"Low Pass Filter","Frequency Range":"DC - 1 GHz (passband)",
      "Insertion Loss":"< 0.5 dB @ passband","Attenuation":"> 40 dB @ 2x fc",
      "Impedance":"50 Ohm","Connector":"SMA Female","Power Handling":"1 W max",
      "Operating Temp.":"-20 to +85 deg C","Dimensions":"25 x 12 x 8 mm",
      "Applications":"LoRa / Zigbee / 433 / 868 / 915 MHz spurious suppression"
    },
    options: [
      { partNo:"AFL0001-STD", service:"AFL0001 Standard",      standard:"ETSI / FCC", scope:"Sub-GHz passband 433-915 MHz",        accr:"In-house", leadTime:"3 days", status:"In Stock" },
      { partNo:"AFL0001-SMA", service:"AFL0001 with SMA Male", standard:"ETSI / FCC", scope:"SMA Male variant for direct board use", accr:"In-house", leadTime:"3 days", status:"In Stock" },
    ],
    docs: [
      { title:"AFL0001 Product Datasheet",            type:"Datasheet",   std:"In-house", rev:"v1.2", size:"1.2 MB", format:"PDF" },
      { title:"AFL0001 S-Parameter Data (Touchstone)", type:"S-Parameters",std:"N/A",      rev:"v1.0", size:"0.3 MB", format:"S2P" },
      { title:"AFL0001 Application Note",             type:"App Note",    std:"ETSI",     rev:"v1.0", size:"0.8 MB", format:"PDF" },
    ],
    boards: [],
    software: [{ name:"AFL0001 S-Parameter Viewer", ver:"v1.0", platform:"ADS / Keysight", license:"Free", desc:"View AFL0001 S2P data in Keysight ADS or similar EDA tools" }],
    videos: [{ title:"AFL0001 — Spurious Suppression Demo", dur:"8 min", type:"Demo", desc:"Before-and-after radiated emission measurement with AFL0001 installed on a 433 MHz module." }],
  },

  {
    id: "AFL0003", partNo: "AFL0003",
    name: "Avartanam RF Filter - AFL0003", shortName: "RF Filter AFL0003",
    category: "product", categoryLabel: "RF Filter",
    badge: "BAND PASS", color: "navy",
    family: "AFL Series", status: "Active",
    accreditation: "In-house Design",
    desc: "The Avartanam RF Filter AFL0003 is a precision band-pass RF filter for 2.4 GHz and 5 GHz Wi-Fi / Bluetooth applications. Excellent out-of-band rejection with low insertion loss in passband. Perfect for IoT devices, smart home gateways, and wireless modules requiring FCC / CE / BIS pre-compliance improvement.",
    image: "images/products/afl003.jpg",
    standards: ["ETSI EN 300328","ETSI EN 301893","FCC Part 15"],
    specs: {
      "Filter Type":"Band Pass Filter","Centre Frequency":"2.45 GHz / 5.8 GHz",
      "3 dB Bandwidth":"±100 MHz","Insertion Loss":"< 1.0 dB @ centre",
      "Rejection":"> 35 dB out-of-band","Impedance":"50 Ohm","Connector":"SMA Female",
      "Power Handling":"500 mW max","Operating Temp.":"-20 to +85 deg C",
      "Dimensions":"30 x 15 x 8 mm","Applications":"Wi-Fi 2.4/5 GHz, Bluetooth, Zigbee harmonic rejection"
    },
    options: [
      { partNo:"AFL0003-2G",   service:"AFL0003 2.4 GHz",        standard:"ETSI EN 300328", scope:"2.4 GHz Wi-Fi / Bluetooth",        accr:"In-house", leadTime:"3 days", status:"In Stock" },
      { partNo:"AFL0003-5G",   service:"AFL0003 5 GHz",          standard:"ETSI EN 301893", scope:"5 GHz Wi-Fi 802.11a/n/ac/ax",       accr:"In-house", leadTime:"3 days", status:"In Stock" },
      { partNo:"AFL0003-DUAL", service:"AFL0003 Dual 2.4+5 GHz", standard:"ETSI",           scope:"Simultaneous 2.4 GHz and 5 GHz",   accr:"In-house", leadTime:"5 days", status:"In Stock" },
    ],
    docs: [
      { title:"AFL0003 Product Datasheet",            type:"Datasheet",   std:"In-house",  rev:"v1.3", size:"1.4 MB", format:"PDF" },
      { title:"AFL0003 S-Parameter Data (Touchstone)", type:"S-Parameters",std:"N/A",       rev:"v1.0", size:"0.3 MB", format:"S2P" },
      { title:"AFL0003 Application Note — Wi-Fi/BT",  type:"App Note",    std:"ETSI",      rev:"v1.0", size:"0.9 MB", format:"PDF" },
    ],
    boards: [],
    software: [{ name:"AFL0003 S-Parameter Viewer", ver:"v1.0", platform:"ADS / Keysight", license:"Free", desc:"View AFL0003 S2P data in Keysight ADS or similar EDA tools" }],
    videos: [{ title:"AFL0003 — Wi-Fi Harmonic Rejection Demo", dur:"10 min", type:"Demo", desc:"Suppressing 2nd and 3rd harmonics on a Wi-Fi 2.4 GHz module using AFL0003." }],
  },

  {
    id: "COIL-ANT-001", partNo: "ATL-ANT-COIL",
    name: "Coil Antenna", shortName: "Coil Antenna",
    category: "product", categoryLabel: "Antenna",
    badge: "SUB-GHz", color: "green",
    family: "ATL Antenna Series", status: "Active",
    accreditation: "In-house Design / NABL Tested",
    desc: "The Avartanam Coil Antenna is a compact, high-performance helical coil antenna for sub-GHz IoT applications including LoRa, Zigbee, Z-Wave, and 433/868/915 MHz protocols. Manufactured and tuned at our Anand, Gujarat facility.",
    image: "images/products/coil-antenna.jpg",
    standards: ["ETSI EN 300220","FCC Part 15","3GPP"],
    specs: {
      "Antenna Type":"Helical Coil Antenna","Frequency Range":"433 / 868 / 915 MHz",
      "Gain":"1.5 dBi (typical)","VSWR":"< 2:1 @ resonance","Return Loss":"> 10 dB",
      "Radiation Pattern":"Omnidirectional","Impedance":"50 Ohm",
      "Connector":"SMA Male / U.FL","Cable Length":"100 mm RG174 (standard)",
      "Operating Temp.":"-40 to +85 deg C","Dimensions":"Dia 5 mm x 25 mm (helical)",
      "Applications":"LoRa, Zigbee, Z-Wave, 433/868/915 MHz IoT devices"
    },
    options: [
      { partNo:"ATL-ANT-COIL-433", service:"Coil Antenna 433 MHz",  standard:"ETSI EN 300220", scope:"433 MHz LoRa / Zigbee / Z-Wave",    accr:"NABL Tested", leadTime:"2 days", status:"In Stock" },
      { partNo:"ATL-ANT-COIL-868", service:"Coil Antenna 868 MHz",  standard:"ETSI EN 300220", scope:"868 MHz LoRa / SigFox (Europe)",     accr:"NABL Tested", leadTime:"2 days", status:"In Stock" },
      { partNo:"ATL-ANT-COIL-915", service:"Coil Antenna 915 MHz",  standard:"FCC Part 15",    scope:"915 MHz LoRa / SigFox (USA/India)",  accr:"NABL Tested", leadTime:"2 days", status:"In Stock" },
      { partNo:"ATL-ANT-COIL-UFL", service:"Coil Antenna U.FL",     standard:"General",        scope:"U.FL connector variant for PCB use",  accr:"NABL Tested", leadTime:"3 days", status:"In Stock" },
    ],
    docs: [
      { title:"Coil Antenna Datasheet",               type:"Datasheet",   std:"In-house",  rev:"v1.1", size:"1.0 MB", format:"PDF" },
      { title:"Coil Antenna Radiation Pattern Report", type:"Test Report", std:"NABL OTA",  rev:"v1.0", size:"1.5 MB", format:"PDF" },
      { title:"Antenna Mounting & Integration Guide",  type:"App Note",    std:"General",   rev:"v1.0", size:"0.6 MB", format:"PDF" },
    ],
    boards: [
      { name:"OTA Antenna Test Bench (RMS)",  model:"ATL-OTA-6G",     type:"Anechoic Chamber", freq:"370 MHz - 6 GHz",  cert:"NABL",      avail:"Available" },
      { name:"Vector Network Analyser (VNA)", model:"Keysight E5063A", type:"VNA",              freq:"100 kHz - 18 GHz", cert:"NABL Cal.", avail:"Available" },
    ],
    software: [{ name:"Antenna Pattern Viewer", ver:"v2.1", platform:"Windows", license:"Licensed", desc:"3D radiation pattern visualization for coil antenna variants" }],
    videos: [
      { title:"Coil Antenna — OTA Gain Measurement",      dur:"10 min", type:"Demo",     desc:"Live gain and radiation pattern measurement of 868 MHz coil antenna in ATL OTA chamber." },
      { title:"Antenna Tuning — From Coil to Compliance", dur:"20 min", type:"Tutorial", desc:"How we tune and verify coil antennas using Smith Chart, VSWR and return loss." },
    ],
  },

  {
    id: "ATL-FXA-01", partNo: "ATL-FXA-01",
    name: "Flexible Antenna", shortName: "Flexible Antenna",
    category: "product", categoryLabel: "RF Antenna",
    badge: "FLEXIBLE FPC", color: "teal",
    family: "ATL Antenna Series", status: "Active",
    accreditation: "NABL In-house Tested",
    pageUrl: "products/flexible-antenna.html",
    desc: "Ultra-thin, bendable FPC patch antenna for space-constrained IoT and wearable designs. Covers 433 MHz, 868 MHz, 915 MHz, and 2.4 GHz with IPEX/U.FL connector and 3M adhesive backing. Validated at Avartanam NABL-accredited anechoic chamber.",
    image: "images/products/coil-antenna.jpg",
    standards: ["ETSI EN 300 220","IEEE 802.15.4","IEEE 802.11b/g/n"],
    specs: {
      "Antenna Type":    "Flexible FPC Patch Antenna",
      "Frequency Bands": "433 / 868 / 915 MHz · 2.4 GHz",
      "Gain":            "2.0 dBi (Sub-GHz) · 2.5 dBi (2.4 GHz)",
      "VSWR":            "< 2:1 across operating band",
      "Impedance":       "50 Ω",
      "Connector":       "IPEX / U.FL (MHF4 optional)",
      "Cable Length":    "100 mm (customisable to 300 mm)",
      "Dimensions":      "85 × 10 × 0.2 mm (Sub-GHz) · 42 × 6 × 0.2 mm (2.4 GHz)",
      "Substrate":       "FPC (Flexible Printed Circuit) · PI Base",
      "Mounting":        "3M Adhesive Backing · Peel & Stick",
      "Operating Temp.": "−40°C to +85°C",
      "Applications":    "LoRa / BLE / Zigbee / Wi-Fi / NB-IoT / Wearables",
      "MOQ":             "10 Pieces",
    },
    options: [
      { partNo:"ATL-FXA-01-433", service:"Flexible Antenna 433 MHz",      standard:"ETSI EN 300220",    scope:"433 MHz LoRa / Zigbee / Z-Wave",    accr:"NABL Tested", leadTime:"1 week", status:"In Stock" },
      { partNo:"ATL-FXA-01-868", service:"Flexible Antenna 868 MHz",      standard:"ETSI EN 300220",    scope:"868 MHz LoRa / SigFox (Europe)",    accr:"NABL Tested", leadTime:"1 week", status:"In Stock" },
      { partNo:"ATL-FXA-01-915", service:"Flexible Antenna 915 MHz",      standard:"FCC Part 15",       scope:"915 MHz LoRa / SigFox (USA/India)", accr:"NABL Tested", leadTime:"1 week", status:"In Stock" },
      { partNo:"ATL-FXA-01-24G", service:"Flexible Antenna 2.4 GHz",      standard:"IEEE 802.11b/g/n",  scope:"Wi-Fi / BLE / Zigbee 2.4 GHz",      accr:"NABL Tested", leadTime:"1 week", status:"In Stock" },
      { partNo:"ATL-FXA-01-CST", service:"Custom Frequency / Dimensions", standard:"Per Specification",  scope:"Custom band tuning, length, connector or adhesive variant", accr:"NABL Tested", leadTime:"2–3 weeks", status:"On Request" },
    ],
    docs: [
      { title:"ATL-FXA-01 Product Datasheet",            type:"Datasheet",    std:"ATL Internal",       rev:"v1.0", size:"0.9 MB", format:"PDF" },
      { title:"VSWR & Radiation Pattern Test Report",    type:"Test Report",  std:"NABL Format",        rev:"v1.0", size:"1.4 MB", format:"PDF" },
      { title:"Antenna Integration Guide (FPC)",         type:"App Note",     std:"ATL Internal",       rev:"v1.0", size:"0.6 MB", format:"PDF" },
      { title:"ETSI EN 300 220 Standard Reference",      type:"Standard",     std:"ETSI",               rev:"v3.2", size:"2.0 MB", format:"PDF" },
    ],
    boards: [
      { name:"Anechoic Chamber (OTA)",        model:"ATL-OTA-6G",      type:"Anechoic Chamber", freq:"400 MHz–6 GHz",    cert:"NABL Accredited", avail:"Available" },
      { name:"Vector Network Analyser (VNA)", model:"Keysight E5063A", type:"VNA",               freq:"100 kHz–18 GHz",   cert:"NABL Calibrated", avail:"Available" },
      { name:"Bending Test Fixture",          model:"ATL-BND-FXA",     type:"Custom Fixture",    freq:"N/A",              cert:"ATL Internal",    avail:"Available" },
    ],
    software: [{ name:"Antenna Pattern Viewer", ver:"v2.1", platform:"Windows", license:"Licensed", desc:"2D/3D radiation pattern visualisation for flexible antenna characterisation" }],
    videos: [
      { title:"Flexible Antenna — Integration Guide for Wearables",  dur:"14 min", type:"Tutorial", desc:"How to mount and route the FPC antenna inside curved plastic enclosures without VSWR degradation." },
      { title:"VSWR Measurement — Flat vs Bent Configuration",        dur:"10 min", type:"Demo",     desc:"Comparing VNA VSWR measurements in flat and 90°/180° bent states at 868 MHz and 2.4 GHz." },
    ],
  },

];
