/* The Trade Hub — site content. Edit text here; pages are built from it. */
window.TH = {
  company: {
    name: "The Trade Hub",
    base: "Ras Al Khaimah, United Arab Emirates",
    warehouse: "Jebel Ali, Dubai",
    phone: "[PHONE]",
    whatsapp: "[WHATSAPP]",
    email: "sales@thetradehubuae.com",
    address: "[ADDRESS]",
    licence: "[LICENCE NUMBER]"
  },
  checked: "13 November 2026",

  // Product families. The containers and pallets pages use the active family's word and pictures,
  // so a new line (e.g. textiles) reuses the same pages: add its word, blocks and mixed-load items here.
  families: [
    { id: "tiles", word: "Tiles", ready: true, unit: "m² of 60 × 120", blockImgs: ["t-calacatta","t-cafe","t-onyx","t-glaze","t-ivory","t-terrazzo","t-oak","t-stone"], mixWord: "sanitaryware" },
    { id: "toilets", word: "Toilets", ready: true, link: true },
    { id: "insulation", word: "Insulation", ready: true, link: true },
    { id: "textiles", word: "Textiles", ready: false }
  ],

  // Starvoll WCs, as stocked by UAE sanitaryware suppliers. "—" = not published; confirmed on quotation.
  starvoll: {
    lead: {
      model: "L175", type: "One-piece floor-standing WC",
      rows: [
        ["Model", "L175W (S-trap) · L175P (P-trap)"],
        ["Type", "One-piece, floor-standing"],
        ["Size (L × W × H)", "720 × 360 × 810 mm"],
        ["Weight", "≈ 35 kg"],
        ["Material", "Ceramic"],
        ["Colours", "White · Ivory · Matt black (L-175B) · Gold electroplated (L175G)"],
        ["Gold version", "L175G: siphonic one-piece, 730 × 350 × 800 mm"]
      ],
      variants: [["L175W","White","img/p/sv-l175-front.jpg"],["L175W","Installed","img/p/sv-l175-room.jpg"],["L175","Ivory & white","img/p/sv-l175-ivory.jpg"],["L-175B","Matt black","img/p/sv-l175b.jpg"],["L175G","Gold","img/p/sv-l175g.jpg"],["L175P","P-trap","img/p/sv-l175p.jpg"]]
    },
    range: [
      ["L175", "One-piece", "S-trap or P-trap", "720 × 360 × 810", "White, ivory, matt black, gold", "img/p/sv-l175-front.jpg"],
      ["L136", "One-piece", "S-trap", "—", "Glossy white", "img/p/sv-l136.jpg"],
      ["L138", "One-piece, washdown", "S-trap, 250 mm", "680 × 365 × 785", "White", "img/p/sv-l138.jpg"],
      ["L139", "Floor-standing", "S-trap, 250 mm", "670 × 365 × 770", "Alpine white", "img/p/sv-l139.jpg"],
      ["L803", "One-piece, elongated", "S-trap", "—", "Glossy white", "img/p/sv-l803.jpg"],
      ["2051A", "Close-coupled, rimless", "P-trap, 180 mm", "690 × 355 × 835", "White", "img/p/sv-2051a.jpg"],
      ["F805", "Wall-hung, concealed cistern", "—", "505 × 360 × 360", "Matt black", "img/p/sv-f805.jpg"]
    ]
  },

  // Isover Spacesaver glass mineral wool roll (Isover datasheet, published 2 March 2026)
  isover: {
    product: "Isover Spacesaver",
    facts: [
      ["Product", "Isover Spacesaver glass mineral wool roll"],
      ["Use", "Thermal insulation between ceiling joists in pitched roofs (loft floors)"],
      ["Thermal conductivity", "λD 0.044 W/m·K"],
      ["Reaction to fire", "Euroclass A1, non-combustible (EN 13501-1)"],
      ["Standard", "EN 13162 · designation MW-EN 13162-T1"],
      ["Marking", "CE and UKCA marked to EN 13162"],
      ["Fitting", "Pre-perforated to fit common joist spacings"],
      ["Recycled content", "52% recycled glass plus 30% glass cullet"]
    ],
    sizes: [
      ["100 mm", "2.25", "12.18 × 1.16 m", "14.13", "24", "339.09", "5200854520"],
      ["150 mm", "3.40", "8.05 × 1.16 m", "9.34", "24", "224.11", "5200854529"],
      ["170 mm", "3.85", "7.03 × 1.16 m", "8.15", "24", "195.72", "5200854549"],
      ["200 mm", "4.50", "5.20 × 1.16 m", "6.03", "24", "144.77", "5200840154"]
    ]
  },

  // 20ft / 40ft / pallet figures used by the container explainer and calculator (approximate)
  load: {
    m2PerBox: 1.44, kgPerBox: 29, boxesPerPallet: 30,
    c20: { label: "20ft", payloadKg: 23000, slots: 30 },   // ≈ 25 pallets / 1,080 m² incl. pallets; VGM ≈ 25.3 t
    c40: { label: "40ft", payloadKg: 25000, slots: 60 }    // ≈ 27 pallets / 1,170 m²; VGM ≈ 28.9 t (road limits)
  },

  collections: [
    { id: "marble", name: "Marble", img: "img/tiles-marble.jpg", color: "lagoon",
      kicker: "Polished · honed · lappato",
      short: "Calacatta, statuario, onyx and dark café marbles on a dense porcelain body. Our lead range for container buyers and UAE fit-outs.",
      body: "Marble-effect porcelain gives clients the look of natural stone without sealing, staining or the price of real marble. Large 60 × 120 cm and 120 × 120 cm slabs keep grout lines to a minimum, which is what makes a bathroom or open-plan floor read as luxury.",
      uses: ["Bathrooms and wet rooms", "Kitchen floors and splashbacks", "Hotel and retail floors", "Feature walls"],
      lines: true },
    { id: "mega-slabs", name: "Mega slabs", img: "img/mega-slabs-marble.jpg", color: "gold",
      kicker: "Book-matched · countertop sizes",
      short: "Very large porcelain slabs for walls, islands and worktops, with veining that flows across joints.",
      body: "Mega slabs (RAK's Maximus range) are porcelain panels big enough to clad a wall or wrap a kitchen island in one piece. They need specialist handling and fitting, so we quote them per project with crate sizes and weights.",
      uses: ["Kitchen islands and worktops", "Full-height feature walls", "Reception desks", "Shower enclosures"] },
    { id: "stone", name: "Stone & travertine", img: "img/tiles-stone.jpg", color: "travertine",
      kicker: "Matt · soft structure",
      short: "Warm limestone and travertine looks in matt finishes, the calm neutrals homeowners everywhere are asking for.",
      body: "Stone-effect porcelain in sand, beige and greige tones. Matt and lightly structured surfaces give better grip than polished marble, so they suit hallways, kitchens and open-plan living.",
      uses: ["Hallways and kitchens", "Open-plan living", "Retail floors", "Indoor–outdoor runs (R11 versions)"] },
    { id: "concrete", name: "Concrete & terrazzo", img: "img/tiles-concrete.jpg", color: "silk",
      kicker: "Urban · architectural",
      short: "Concrete, resin and terrazzo looks for modern homes, offices and restaurants.",
      body: "Concrete-effect porcelain gives a clean, architectural floor without the cracking or sealing of real screed. Terrazzo designs add colour flecks for cafés, shops and kitchens.",
      uses: ["Modern kitchens", "Offices and showrooms", "Cafés and restaurants", "Garages and utility rooms"] },
    { id: "wood", name: "Wood-effect plank", img: "img/tiles-wood.jpg", color: "oak",
      kicker: "19.5 × 120 cm planks",
      short: "Oak-look porcelain planks that never need sanding or sealing, made for underfloor heating.",
      body: "Long, narrow porcelain planks with realistic grain. Lay straight, staggered or herringbone. Unlike timber they are fine in bathrooms and kitchens and work with underfloor heating.",
      uses: ["Herringbone hallways", "Kitchens and bathrooms", "Underfloor-heated floors", "Holiday lets and rentals"] },
    { id: "glazed", name: "Glazed wall tiles", img: "img/bricks.jpg", color: "zellige",
      kicker: "Zellige-look · metro",
      short: "Handmade-look glazed bricks and metro tiles in deep greens, blues and whites.",
      body: "Small-format glazed wall tiles with a handmade, uneven glaze. Ideal for splashbacks, shower walls and feature walls, and light enough to mix into a container of floor tiles.",
      uses: ["Kitchen splashbacks", "Shower walls", "Feature walls", "Bars and cafés"] }
  ],

  // Marble lines (our prices are quoted per order)
  lines: [
    { id: "grey-silk", range: "Tech-Marble", colour: "Grey Silk", finish: "Polished", size: "60 × 120 cm", thick: "9 mm", box: "2 tiles · 1.44 m² · 29 kg", code: "A12GTCMB-GSK.X0X5P", uk: "£55.95", src: "Wholesale Domestic", img: "img/techmarble-tech.jpg", imgNote: "Tech-Marble collection photo" },
    { id: "white-venato", range: "Tech-Marble", colour: "White Venato", finish: "Honed", size: "60 × 120 cm", thick: "9 mm", box: "2 tiles · 1.44 m² · 29 kg", code: "A12GTCMB-WVT.O0X5P", uk: "£55.95", src: "Wholesale Domestic", img: "img/techmarble-tech.jpg", imgNote: "Tech-Marble collection photo" },
    { id: "supreme-white", range: "Tech-Marble", colour: "Supreme White", finish: "Honed", size: "60 × 120 cm", thick: "9 mm", box: "2 tiles · 1.44 m² · 29 kg", code: "A12GTCMB-SUW.O0X5P", uk: "£55.95", src: "Wholesale Domestic", img: "img/techmarble-marble.jpg", imgNote: "Tech-Marble collection photo" },
    { id: "calacatta-africa", range: "Tech-Marble", colour: "Calacatta Africa", finish: "Honed", size: "60 × 120 cm", thick: "9 mm", box: "2 tiles · 1.44 m² · 29 kg", code: "A12GTCMB-CCA.O0X5P", uk: "£49.95", src: "Wholesale Domestic", img: "img/techmarble-book.jpg", imgNote: "Tech-Marble collection photo" },
    { id: "amani-60", range: "Amani Marble", colour: "Dark Grey", finish: "High gloss", size: "60 × 120 cm", thick: "9 mm", box: "2 tiles · 1.44 m²", code: "AGB12AMMBDKGZHSS5P", uk: "£34.69 – £49.95", src: "Heat & Plumb, Wholesale Domestic", img: "img/il-amani.jpg", imgNote: "Illustration, not a product photo" },
    { id: "amani-120", range: "Amani Marble", colour: "Dark Grey", finish: "Full lappato", size: "120 × 120 cm", thick: "9 mm", box: "2 tiles · 2.88 m²", code: "AGB22AMMBDKGZHSC3P", uk: "£55.19", src: "Heat & Plumb", img: "img/il-amani.jpg", imgNote: "Illustration, not a product photo" },
    { id: "panda", range: "Panda Marble", colour: "White", finish: "Full lappato", size: "60 × 120 cm", thick: "—", box: "—", code: "AGB12PDMBWHEZHSS5P", uk: "£40.97", src: "Aqva", img: "img/il-panda.jpg", imgNote: "Illustration, not a product photo" },
    { id: "medicea", range: "Medicea", colour: "White", finish: "Matt", size: "60 × 120 cm", thick: "—", box: "2 tiles · 1.44 m²", code: "A12GMDMB-WHE.M0X5R", uk: "£45.95", src: "Wholesale Domestic", img: "img/il-medicea.jpg", imgNote: "Illustration, not a product photo" },
    { id: "urban-ornate", range: "Urban Marble", colour: "Ornate", finish: "Full lappato", size: "60 × 120 cm", thick: "9 mm", box: "2 tiles · 1.44 m² · 30 kg", code: "A12GURBM-OLE.N0X5P", uk: "£25.99 (trade)", src: "Sayda Trade", img: "img/il-urban.jpg", imgNote: "Illustration, not a product photo" },
    { id: "glamour-black", range: "Glamour", colour: "Black Café", finish: "Honed", size: "60 × 120 cm", thick: "—", box: "2 tiles · 1.44 m²", code: "A12GGMOR-BKF.O0X5P", uk: "—", src: "RAK UAE online shop", img: "img/glamour-1.jpg", imgNote: "RAK product image" }
  ],

  guides: [
    { id: "guide-large-format", title: "Laying 60 × 120: what fitters need to know", color: "lagoon", read: "6 min",
      intro: "Large-format porcelain looks seamless when it is laid well and unforgiving when it isn't. These are the basics to agree with your fitter before the first box is opened.",
      sections: [
        ["Get the floor flat first", "Big tiles show every dip. Most adhesive makers ask for a substrate within about 3 mm over a 2 m straight edge for large formats. Use a levelling compound where needed; it is far cheaper than lifting cracked tiles."],
        ["Back-butter every tile", "Spread adhesive on the floor with a large notched trowel and a thin skim on the back of the tile. Aim for near-full coverage, especially on floors and in wet areas."],
        ["Use a levelling system", "Clip-and-wedge levelling systems stop lippage between long edges. Polished and lappato tiles show lippage most."],
        ["Stagger no more than a third", "Long rectangular tiles can bow very slightly in the middle. Offsetting by a third (not half) hides this."],
        ["Joints and grout", "Rectified edges allow narrow joints of about 2 mm. Match grout to the background colour of the marble so the veining reads across the floor."],
        ["Handle with two people", "A 60 × 120 tile weighs about 14–15 kg and can snap if carried flat. Carry on edge; use suction lifters for 120 × 120."]
      ] },
    { id: "guide-container-pallet", title: "Container or pallet? How to buy tiles from the UAE", color: "gold", read: "5 min",
      intro: "Tiles are heavy. That one fact decides most of how you should buy them.",
      sections: [
        ["A 20ft is the tile container", "A 20ft container fills up by weight long before it runs out of space. We plan about 23 tonnes of 9 mm porcelain including pallets: roughly 1,080 m² of 60 × 120 cm tile, 25 pallets or 750 boxes. With the container itself that is about 25 tonnes gross, which is within the container's rating and normal road limits."],
        ["A 40ft is not twice as much", "A 40ft has twice the floor space, but the limit is the lorry, not the box. On a 44-tonne lorry a 40ft can safely take about 25 tonnes of tile (about 1,170 m²), only around 8% more than a 20ft, and in countries with 40-tonne lorries it can be less than a 20ft. A 40ft makes sense when you add lighter goods (wall tiles, trims, sanitaryware) to use the space."],
        ["Mix your load", "One container can carry several ranges and colours. We plan the load by weight and give you a packing list per pallet."],
        ["Pallets for speed", "When a job can't wait for a full container, buy by the pallet from our Jebel Ali warehouse. A typical pallet of 60 × 120 is 30 boxes: 43.2 m², about 920 kg. We deliver across the UAE and ship pallets worldwide in a shared container (LCL), or by air for urgent pieces such as replacement WCs and basins."],
        ["Heavy-box surcharges", "Many shipping lines add a heavy-load surcharge (often a few hundred dollars) once a 20ft weighs more than about 20 tonnes in total. Tile containers usually pay it, so we include it in quotes."],
        ["Always check the routing", "Sea routes and emergency surcharges out of the Gulf have changed a lot in 2026. Every quote we send names the port, the routing and the surcharges at the time."]
      ] },
    { id: "guide-ce-marking", title: "CE marking and the DoP: selling tiles in Europe", color: "zellige", read: "4 min",
      intro: "Ceramic tiles are construction products. Here is the paperwork that has to travel with them, in plain English.",
      sections: [
        ["The standard: EN 14411", "Ceramic tiles are covered by the harmonised standard EN 14411. The manufacturer tests the tile and declares its performance: water absorption, breaking strength, slip and so on."],
        ["The Declaration of Performance (DoP)", "The DoP is the manufacturer's signed statement of those results. It must be available for every product placed on the market. We supply RAK's DoP with every order."],
        ["The importer's details", "When goods are imported into the EU, the importer's name and address must be on the product, its packaging or the accompanying documents, and records kept for 10 years."],
        ["Duty and VAT", "Porcelain tiles fall under commodity code family 6907. Import duty and VAT are set by the destination country; your customs agent will confirm the rates."]
      ] },
    { id: "guide-landed-cost", title: "What goes into a landed price per m²", color: "copper", read: "4 min",
      intro: "The factory price is only the start. Here is everything between the kiln in Ras Al Khaimah and your yard.",
      sections: [
        ["Factory price", "Price per m² ex-works from the manufacturer, which depends on the range, finish and volume."],
        ["UAE side", "Trucking to the port, terminal handling and export paperwork."],
        ["Sea freight", "The ocean rate plus any fuel, emergency or contingency surcharges. These change often, so always use a dated quote."],
        ["Destination side", "Port handling, customs clearance, and haulage to your site or yard."],
        ["Duty and taxes", "Import duty and VAT or GST at the destination country's rates, usually on the customs value."],
        ["Divide by m²", "Add it up and divide by the m² in the container. Because tiles are heavy, freight per m² is lower for thin 9 mm tiles than for 20 mm outdoor slabs."]
      ] }
  ],

  standards: [
    ["International", "ISO 13006", "Ceramic tiles: definitions, classification, characteristics and marking. The base for many national standards."],
    ["Europe", "EN 14411", "Harmonised standard behind CE marking and the Declaration of Performance."],
    ["Gulf states (GCC)", "GSO ISO 13006", "The Gulf Standardization Organization's adoption of ISO 13006."],
    ["USA", "ANSI A137.1", "US specification for ceramic tile. Separate tests and limits from ISO 13006."],
    ["India", "IS 15622", "Pressed ceramic tiles, harmonised with ISO 13006 (BIS / ISI mark)."],
    ["China", "GB/T 4100", "Ceramic tiles, a modified adoption of ISO 13006."],
    ["Japan", "JIS A 5209", "Japanese Industrial Standard for ceramic tiles."]
  ],
  // other product lines
  standardsOther: [
    ["Insulation · Europe", "EN 13162", "Factory-made mineral wool for buildings. Isover Spacesaver is CE and UKCA marked to it, designation MW-EN 13162-T1."],
    ["Insulation · fire", "EN 13501-1", "Reaction to fire classification. Spacesaver is Euroclass A1, non-combustible."],
    ["Toilets · Europe", "EN 997", "WC pans and WC suites with integral trap. We confirm with the maker which test reports are available for each Starvoll model."]
  ],

  glossary: [
    ["One-piece WC", "A toilet with the cistern and bowl made as a single piece of ceramic, such as the Starvoll L175."],
    ["Close-coupled WC", "A toilet whose cistern sits directly on the back of the bowl as a separate piece."],
    ["S-trap / P-trap", "Where the WC's waste leaves: S-trap goes down through the floor, P-trap goes back into the wall."],
    ["Roughing-in", "The distance from the finished wall to the centre of the waste pipe. The WC must match it."],
    ["Glass mineral wool", "Insulation made from spun glass fibres, much of it recycled glass, supplied as rolls or slabs."],
    ["λ (lambda)", "Thermal conductivity in W/m·K. The lower it is, the better the insulation."],
    ["R-value", "Thermal resistance in m²K/W: thickness divided by λ. Higher is better."],
    ["Euroclass A1", "The top reaction-to-fire class under EN 13501-1: non-combustible."],
    ["EN 13162", "European standard for factory-made mineral wool insulation, behind its CE marking."],
    ["VGM", "Verified gross mass: the weight of a packed container, declared before it is loaded on a ship."],
    ["Rectified", "Edges ground perfectly square after firing, so tiles can be laid with narrow 2 mm joints."],
    ["Polished", "A mirror-shine surface made by grinding and polishing the fired tile."],
    ["Lappato / full lappato", "A semi-polished surface: a soft sheen between matt and polished. Full lappato covers the whole face."],
    ["Honed / satin", "A smooth, low-sheen finish, softer than polished and less slippery."],
    ["Porcelain", "A dense ceramic body fired at high temperature, with water absorption of 0.5% or less."],
    ["Water absorption", "How much water the body soaks up. Tech-Marble is listed at ≤ 0.1%, suitable for wet areas."],
    ["R rating (R9–R13)", "German ramp test for slip resistance. R9 is typical indoors; R11 is used outdoors and in wet commercial areas."],
    ["PEI", "A wear rating for glazed tiles, from 1 (walls only) to 5 (heavy traffic)."],
    ["V1–V4", "Shade variation between tiles: V1 is uniform, V4 varies a lot, like natural stone."],
    ["Mega slab", "A very large porcelain panel (e.g. 160 × 320 cm) used for walls, islands and worktops."],
    ["ISO 13006", "The international standard for ceramic tiles: definitions, classification, characteristics and marking. Many national standards are based on it."],
    ["EN 14411", "The European harmonised standard for ceramic tiles, used for CE marking across Europe."],
    ["ANSI A137.1", "The US specification for ceramic tile. It uses its own tests and limits, so it is not interchangeable with ISO 13006."],
    ["DoP", "Declaration of Performance: the manufacturer's signed statement of a product's tested performance."],
    ["FCL / LCL", "Full container load (you use the whole container) / less than container load (you share one)."],
    ["20GP / 40HC", "Standard 20ft container / 40ft high-cube container."],
    ["Payload", "The maximum weight of goods a container can carry. Tiles reach it before the container is full."],
    ["EXW / FOB / CIF / DAP", "Incoterms: who pays and takes risk at each step, from ex-works (buyer arranges everything) to delivered at place."],
    ["HS 6907", "The commodity code family for ceramic flags and paving, hearth or wall tiles."],
    ["Landed cost", "The total cost of goods delivered to you: product, freight, surcharges, duty and handling."]
  ],

  faq: [
    ["Are you RAK Ceramics?", "No. The Trade Hub is an independent trading company in Ras Al Khaimah. We buy RAK Ceramics tiles and sell them on to trade buyers worldwide and in the UAE."],
    ["Where do you ship containers?", "Worldwide: to any port a shipping line serves from the UAE. Every quote names the port, routing and surcharges on the day."],
    ["What is the minimum container order?", "One 20ft container. Tiles alone fill it at about 1,080 m² of 60 × 120 cm (around 23 tonnes); you can mix ranges and colours, and add toilets and insulation rolls. Smaller orders go by the pallet."],
    ["Should I choose a 20ft or a 40ft?", "For tiles alone, usually a 20ft: tiles hit the weight limit first, and a 40ft only carries about 8% more tile once road limits are respected. For toilets, insulation or a mixed load, a 40ft gives you twice the space. Try it in the load builder on the Containers page."],
    ["Can I mix tiles, toilets and insulation in one container?", "Yes. Tile is heavy and fills a container by weight; boxed WCs and glass wool rolls are light and fill it by space. Mixed, they use both. Build your mix on the Containers page and we'll confirm the load plan with the quote."],
    ["Which toilets and insulation do you supply?", "Starvoll WCs (led by the one-piece L175, in white, ivory, matt black and gold), as stocked in the UAE, and Isover Spacesaver glass mineral wool rolls, 100 to 200 mm, CE and UKCA marked to EN 13162."],
    ["Can I buy smaller amounts?", "Yes, by the pallet from our Jebel Ali warehouse: tiles, toilets, insulation or a mix, delivered across the UAE or shipped worldwide when a job can't wait for a full container."],
    ["Which standards do the tiles meet?", "RAK makes porcelain to the international standard ISO 13006 and the European standard EN 14411 (CE marking, used across Europe). Other markets use their own standard (for example ANSI A137.1 in the USA, IS 15622 in India, GSO ISO 13006 in the Gulf). We confirm the test reports available for each range and your country. See our standards page."],
    ["Can I get samples?", "Yes. Ask for the ranges you're considering and we'll arrange samples before you commit to a container or pallet."],
    ["How are prices quoted?", "Per order, in writing: by the container or by the pallet, in AED, USD or EUR, ex-works, to your port, or delivered."],
    ["Which documents do I get?", "Commercial invoice, packing list, bill of lading and certificate of origin, plus the standards papers for each product: the Declaration of Performance for tiles and insulation, and the maker's test data for toilets on request."]
  ]
};
