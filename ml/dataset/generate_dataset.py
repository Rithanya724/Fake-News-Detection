"""
Dataset Generator for Textile Industry Fake News Detection System.
Generates a structured, balanced academic dataset of REAL and FAKE textile news across various textile sub-sectors.
"""

import csv
import os

DATASET_PATH = os.path.join(os.path.dirname(__file__), "textile_news.csv")

REAL_NEWS = [
    # Cotton
    ("Cotton Corporation of India announces MSP procurement schedule for upcoming season",
     "The Cotton Corporation of India (CCI) has formally released the schedule for Minimum Support Price (MSP) operations across major cotton-growing states. CCI confirmed that procurement centers will be operational across Gujarat, Maharashtra, Telangana, and Punjab starting next month to safeguard farmer interests following market fluctuations.",
     "Cotton", "Textile Ministry Bulletin", "2026-01-15"),
    ("India's raw cotton exports surge 22 percent amid rising demand from Bangladesh and Vietnam",
     "Official trade statistics show a 22 percent increase in raw cotton shipments to key Asian manufacturing hubs including Bangladesh and Vietnam. Exporters attribute the growth to competitive domestic price realisations and higher staple length cotton availability during the current harvest cycle.",
     "Cotton", "Apparel & Textile Trade Daily", "2026-01-20"),
    ("Pink bollworm infestation reported in select districts; agricultural department issues advisories",
     "Agricultural extension officers in Northern cotton belts have identified sporadic pink bollworm attacks on standing crops. The state agriculture department has issued comprehensive pest management guidelines advising integrated pest control and pheromone traps to limit yield reduction.",
     "Cotton", "Agri-Textile Research Review", "2026-02-02"),
    ("Global cotton production forecast revised slightly upward by International Cotton Advisory Committee",
     "The International Cotton Advisory Committee (ICAC) updated its global production estimates by 1.2 percent for the marketing year, citing improved yields in West Africa and stable output across North American producers.",
     "Cotton", "Global Fiber Report", "2026-02-14"),

    # Silk
    ("Central Silk Board reports 8 percent growth in mulberry cocoon production across southern states",
     "The Central Silk Board (CSB) announced an 8 percent increase in mulberry raw silk production in Karnataka and Tamil Nadu. Modernized rearing houses and improved bi-voltine silkworm breeds contributed significantly to the higher yield and superior tensile strength of silk threads.",
     "Silk", "Sericulture Development Board", "2026-01-18"),
    ("Customs duty on raw silk imports maintained to support domestic sericulture farmers",
     "The Ministry of Finance confirmed that customs duties on imported raw silk will remain unchanged in the current fiscal year. The policy aims to protect domestic reelers and sericulturists from cheaper imported yarn dumping while ensuring steady raw material supplies.",
     "Silk", "National Trade Journal", "2026-02-05"),
    ("Assam Muga silk weavers receive Geographical Indication tag validation and modernization support",
     "Weavers of traditional golden Muga silk in Assam have been granted updated GI tag certificates alongside technological assistance for reeling machines to preserve authentic weaving heritage while improving weaving speed.",
     "Silk", "Handloom Heritage Monitor", "2026-02-18"),

    # Wool
    ("Raw wool imports from Australia stabilize as domestic winter garment demand peaks",
     "Indian woolen mills reported steady shipments of fine Merino fleece from Australian auctions to fulfill autumn-winter knitwear export orders. Price stabilization in international wool auctions has assisted domestic spinning mills in maintaining margins.",
     "Wool", "Woolen Mills Federation", "2026-01-12"),
    ("Himalayan pashmina goat rearing program receives development grant for high-altitude shelters",
     "The Department of Animal Husbandry sanctioned funding for high-altitude livestock shelters across Ladakh to protect Changthangi goats during extreme winter conditions, securing sustainable pashmina fleece harvesting.",
     "Wool", "Himalayan Textile Journal", "2026-02-10"),

    # Yarn & Spinning
    ("Spinning mills in South India announce 5 percent production rationalization due to power tariff hike",
     "The Southern India Mills' Association (SIMA) reported that several medium-scale spinning mills in Tamil Nadu have adjusted shift timings to manage revised peak-hour electricity tariffs, maintaining balanced yarn inventory levels.",
     "Yarn", "Spinning World Post", "2026-01-25"),
    ("Cotton yarn prices hold steady in major trading hubs of Bhiwandi and Tirupur",
     "Prices for 30s and 40s combed cotton yarn remained stable in major wholesale markets this week as fabric manufacturers maintained steady inventory purchasing without speculative stocking.",
     "Yarn", "Textile Market Watch", "2026-02-08"),
    ("Polyester-cotton blended yarn demand increases in sports apparel manufacturing sector",
     "Textile manufacturers noted an increased uptake of 65/35 polyester-cotton blended yarns driven by expanding activewear and technical apparel manufacturing clusters in Surat and Ludhiana.",
     "Yarn", "Yarn & Fiber Times", "2026-02-22"),

    # Fabrics & Weaving
    ("Powerloom clusters in Surat adopt high-speed water-jet looms for synthetic fabric production",
     "Fabric manufacturing units in Surat have accelerated loom modernization by commissioning energy-efficient water-jet and air-jet machines, enabling higher output of synthetic georgette and chiffon fabrics.",
     "Fabrics", "Weaving Technology News", "2026-01-28"),
    ("Grey fabric inventory in Ichalkaranji market normalizes after seasonal stock clearing",
     "Traders at the Ichalkaranji cloth market reported normalized warehouse stock levels following seasonal festive dispatches to garment processing hubs in Ahmedabad and Mumbai.",
     "Fabrics", "Textile Hub Report", "2026-02-15"),

    # Garments & Apparel
    ("Garment export hub Tirupur records 11 percent increase in European summer orders",
     "The Tirupur Exporters Association (TEA) stated that knitwear export orders for the European spring/summer collections grew 11 percent year-on-year, supported by compliance with international sustainability certifications.",
     "Garments", "Apparel Online India", "2026-02-01"),
    ("Readymade garment manufacturers invest in automated laser cutting and sewing systems",
     "Apparel export houses in Noida and Gurugram have integrated computer numerical control (CNC) fabric cutters and automated unit production systems to minimize fabric wastage and boost sewing efficiency.",
     "Garments", "Industrial Garment Gazette", "2026-02-12"),

    # Machinery & Technology
    ("Textile machinery exhibition in Coimbatore showcases IoT-enabled spinning spindles",
     "The international textile machinery expo featured next-generation spinning frames equipped with real-time vibration sensors and automated doffing systems designed to reduce downtime in spinning mills.",
     "Machinery", "Machinery & Engineering News", "2026-01-30"),
    ("Digital textile printing adoption rises by 18 percent among home textile exporters",
     "Home textile manufacturers in Panipat have expanded pigment-based digital printing lines, enabling short-run custom designs for bed linens and curtains with lower water consumption.",
     "Technology", "Print & Pattern Textile Review", "2026-02-16"),

    # Government Schemes & Subsidies
    ("Ministry of Textiles releases allocated funds under PM MITRA Mega Textile Park scheme",
     "The Union Ministry of Textiles disbursed project development assistance for the approved PM Mega Integrated Textile Region and Apparel (PM MITRA) parks in Gujarat, Tamil Nadu, and Madhya Pradesh to accelerate infrastructure readiness.",
     "Subsidies", "Government Press Information Bureau", "2026-01-14"),
    ("RoDTEP benefit rates for textile garment exports notified by Directorate General of Foreign Trade",
     "The Directorate General of Foreign Trade (DGFT) published the updated Remission of Duties and Taxes on Exported Products (RoDTEP) schedule, outlining eligible refund percentages on exported fabrics and apparels.",
     "Policy", "Official Gazette of Trade", "2026-02-04"),

    # Sustainability & Labour
    ("Textile processing clusters in Tirupur maintain Zero Liquid Discharge compliance audit",
     "State pollution control authorities conducted annual environmental compliance verifications across CETPs (Common Effluent Treatment Plants) in Tirupur, confirming consistent reverse osmosis and brine recovery operations.",
     "Sustainability", "EcoTextile Monitor", "2026-02-11"),
    ("Tripartite committee revises minimum wages for skilled spinning and weaving workers",
     "The state labour commission announced a revised cost-of-living allowance and base wage scale for permanent textile mill workers following consultations between trade unions and mill associations.",
     "Labour", "Industrial Relations Bulletin", "2026-02-19"),
    ("Organic cotton certification bodies introduce blockchain-based farm-to-shelf traceability",
     "Leading textile standards organizations have rolled out decentralized ledger tracking for certified organic cotton bales to eliminate fraudulent certification claims in retail supply chains.",
     "Sustainability", "Global Organic Textile Times", "2026-02-24"),
    ("Knitwear exporters association launches solar rooftop subsidy program for member factories",
     "In an effort to lower operating carbon footprints, the regional apparel manufacturers guild partnered with clean energy funds to subsidize industrial solar installations across 50 production units.",
     "Sustainability", "Renewable Textile Industrial Post", "2026-02-25"),
    ("Textile exports to GCC countries show 14 percent growth under bilateral trade pact",
     "Trade data confirms higher export volumes of home furnishings, embroidered fabrics, and finished garments to United Arab Emirates and Saudi Arabia under streamlined duty structures.",
     "Policy", "International Trade Weekly", "2026-02-26")
]

FAKE_NEWS = [
    # Cotton
    ("Government bans all cotton exports immediately overnight causing complete market crash",
     "BREAKING: The government has issued an emergency midnight notification banning 100 percent of raw cotton and yarn exports indefinitely! Mill owners across the nation are shutting doors permanently as prices are guaranteed to plummet to zero rupees per candy tomorrow morning!",
     "Cotton", "Viral WhatsApp Forward", "2026-01-16"),
    ("Genetically modified alien cotton variety guarantees 500 percent yield with zero water requirement",
     "Secret agricultural breakthrough! A newly engineered extraterrestrial cotton seed is being distributed underground that requires no water or fertilizer and produces 5000 kg per acre in just 15 days. Government scientists are hiding this from farmers!",
     "Cotton", "Daily Miracle News Blog", "2026-01-22"),
    ("All synthetic fabrics declared illegal and toxic by WHO; only 100% pure cotton allowed globally",
     "SHOCKING: The World Health Organization has banned all polyester, nylon, and synthetic clothes worldwide starting this Friday! Anyone caught wearing synthetic garments will face heavy fines. Everyone must burn their polyester clothes immediately!",
     "Cotton", "Conspiracy Herald", "2026-02-03"),

    # Silk
    ("Fake Chinese plastic silk flooding markets dissolves into toxic poison upon touching skin",
     "BEWARE! Dangerous fake plastic silk sarees are being sold in every local bazaar. Medical researchers warn that wearing this fabric causes immediate skin paralysis and releases lethal chemical vapors into the bloodstream! Share this alert to save your family!",
     "Silk", "Sensational Viral Alerts", "2026-01-19"),
    ("Government announces free 10 lakh cash direct transfer to anyone purchasing raw silk yarn",
     "Claim your free money now! Under the urgent secret silk welfare scheme, every citizen who registers on this unofficial web portal will receive 10,00,000 rupees directly in their bank account within 2 hours without any verification!",
     "Silk", "Free Scheme Clickbait", "2026-02-06"),

    # Wool
    ("Australian sheep completely extinct due to mysterious virus; global wool supply finished forever",
     "Catastrophic report! All merino sheep in Australia have perished overnight due to a secret bio-weapon. There will never be any woolen sweaters or blankets produced in the world again. Stockpile wool now before prices reach 1 lakh per kilogram!",
     "Wool", "Panic Post Daily", "2026-01-14"),

    # Yarn & Spinning
    ("Spinning mills to provide free unlimited yarn to all weavers following supreme court order",
     "HISTORIC DECISION: The supreme court has ordered all private spinning mills to distribute 100% of their cotton yarn stock completely free of cost to any weaver who shows up at factory gates tomorrow morning. No payment required!",
     "Yarn", "Weaver Gossip Forum", "2026-01-26"),
    ("Secret chemical in polyester yarn causes clothes to burst into flames under direct sunlight",
     "URGENT WARNING: Textile labs have discovered that all cheap polyester yarns sold this year contain self-igniting combustible chemicals. Hundreds of shirts are exploding spontaneously on the street under afternoon sun! Stop wearing clothes now!",
     "Yarn", "Fear Trend Online", "2026-02-09"),

    # Fabrics & Garments
    ("World trade body completely outlaws garment imports from Asian countries starting tomorrow",
     "URGENT TRADE EMERGENCY: The WTO has permanently blocked all textile and apparel consignments from Asia effective midnight. Hundreds of thousands of container ships are being turned back into the ocean and all garment factories will close permanently!",
     "Garments", "Unverified Rumor Desk", "2026-02-02"),
    ("Smart clothing microchips secretly implanted in branded t-shirts to monitor citizen brainwaves",
     "EXPOSED: Major fast-fashion brands have partnered with shadow intelligence agencies to weave quantum 5G microchips into t-shirt tags that read your private thoughts and track your exact location 24/7!",
     "Technology", "Deep Web Secrets", "2026-02-13"),

    # Subsidies & Government
    ("Textile ministry announces 90 percent flat cash rebate on all machinery purchases with no audit",
     "HUGE OPPORTUNITY: The central textile ministry is giving away 90% instant cash back on any machinery bought from unregistered vendors. No invoices, tax filing, or factory inspection required. Apply on this third-party link immediately before slots close!",
     "Subsidies", "Subsidy Scams Hub", "2026-01-17"),
    ("All textile bank loans completely waived off by finance ministry in secret emergency decree",
     "GREAT RELIEF: The government has erased 100 percent of all pending loans and credit lines for textile business owners without any repayment required. Simply forward this message to your bank branch manager to get immediate debt clearance!",
     "Subsidies", "WhatsApp Forward Express", "2026-02-07"),
    ("New textile policy imposes 500 percent tax on handloom sarees to force automated factory usage",
     "OUTRAGEOUS: New confidential government policy leaked! Handloom weavers will now be taxed 500% on every handmade cloth to destroy traditional weaving and enrich billionaire factory owners. Strike called across all states!",
     "Policy", "Outrage Media Portal", "2026-02-17"),

    # Sustainability & Labour
    ("Major fashion brands secretly dumping radioactive waste into river water supplies",
     "CONFIDENTIAL LEAK: Multinational apparel brands have been caught using nuclear waste to dye denim jeans fluorescent blue, causing glowing radioactive rivers across three districts. Authorities are covering up the mass contamination!",
     "Sustainability", "Eco Scare Wire", "2026-02-21"),
    ("Robots to replace 100 percent of textile workers by next week under compulsory automation law",
     "SHOCKING MANDATE: A new international law mandates that every garment factory must fire all human tailors and sewing operators by next Monday and deploy humanoid AI robots or face instant military closure!",
     "Labour", "Future Shock News", "2026-02-23"),
    ("Secret formula enables waterless dyeing using pure air alone with zero electricity consumption",
     "MIRACLE DISCOVERY: A rogue inventor has created a magical dye process using thin air that dyes 10,000 meters of cloth per second for zero cost. Big chemical corporations are trying to assassinate him to keep chemical prices high!",
     "Technology", "Miracle Inventions Daily", "2026-02-27")
]

# Generate realistic variations across all 14 categories to build a rich 240+ dataset
CATEGORIES = [
    "Cotton", "Silk", "Wool", "Yarn", "Fabrics", "Garments",
    "Machinery", "Subsidies", "Policy", "Prices", "Sustainability",
    "Labour", "Technology", "Exports"
]

REAL_TEMPLATES = [
    ("{} export shipments register steady growth in Q3 financial review",
     "Market analysts report an upward trend in {} export volumes driven by consistent bilateral trade demand, stable raw material pricing, and enhanced logistical efficiency at major transit ports.",
     "Authoritative Industry Bulletin"),
    ("Ministry of Textiles convenes stakeholder meeting to review {} quality standards",
     "Senior officials from the Ministry of Textiles and industry trade bodies held a consultative conference to deliberate on revised Bureau of Indian Standards (BIS) parameters for {} manufacturing and testing protocols.",
     "National Textile Bureau"),
    ("New technology upgrade initiative launched for sustainable {} processing units",
     "State development agencies have rolled out an incentive scheme offering subsidized interest rates on energy-efficient machinery for micro and small enterprises operating within the {} sector.",
     "Eco Textile Gazette"),
    ("Quarterly production estimates for {} sector indicate moderate expansion",
     "The National Textile Statistics Council released its quarterly digest indicating a 4.5 percent expansion in {} output, underpinned by domestic consumption and replenishment of retail apparel inventories.",
     "Textile Economic Review"),
    ("Trade delegation signs memorandum of understanding for {} supply chain collaboration",
     "An international textile trade council has concluded bilateral negotiations with regional textile associations to streamline export documentation and promote joint technical training in {} fabrication.",
     "Global Apparel Chronicle"),
    ("Research institute develops high-efficiency spinning process for {} fiber blends",
     "Textile engineering scientists have published validated trial findings on an optimized spindle speed configuration that reduces yarn hairiness and energy usage in {} spinning lines.",
     "Textile Engineering Research"),
    ("Annual {} industry convention highlights digitalization and ERP integration",
     "Industry leaders gathered at the national textile convention emphasized the role of automated inventory management and predictive maintenance in enhancing productivity across {} processing facilities.",
     "Industrial Management Today"),
    ("Port authorities streamline container customs clearance for {} consignments",
     "Customs authorities have implemented 24/7 automated green-channel clearance for compliant {} exporters to reduce dwell times and enhance maritime trade turnaround.",
     "Logistics & Cargo Monitor"),
    ("Textile cluster completes solar microgrid installation to reduce operational carbon footprint in {} units",
     "A leading industrial development corporation announced the successful commissioning of a 12MW shared solar array powering over 40 {} processing and finishing factories.",
     "Green Industry Post")
]

FAKE_TEMPLATES = [
    ("SHOCKING: Government to seize all private {} stocks without compensation next week",
     "URGENT LEAK: Insiders confirm the commerce department has drafted a secret executive order to confiscate all privately owned {} warehouses across the country starting Monday. Factory owners are urged to hide their inventory immediately!",
     "Viral WhatsApp Group Alert"),
    ("Miracle chemical eliminates all manufacturing cost for {} production forever",
     "UNBELIEVABLE BREAKTHROUGH: A secret liquid created in a home garage makes {} 1000 times stronger and reduces production costs to zero rupees. Big textile monopolies are paying millions to suppress this video!",
     "Clickbait Trend Tube"),
    ("Total emergency ban imposed on {} sales; violators face immediate military arrest",
     "BREAKING EMERGENCY: An unverified leaked notice claims that the international health tribunal has banned all production and sale of {} with immediate effect due to dangerous cosmic radiation. Share before this gets deleted!",
     "Panic Alert Network"),
    ("Claim your instant 50 lakh government grant for {} factories with no paperwork",
     "FREE MONEY ALERT: The prime minister has announced an emergency direct benefit transfer of 50,00,000 rupees for anyone who claims to own a {} business. Simply click this unverified external link and enter your bank OTP!",
     "Fraudulent Scheme Tracker"),
    ("All imported {} shipments proven to contain deadly mind-control bio-agents",
     "TERRIFYING TRUTH: Independent anonymous whistleblowers claim foreign adversaries are infusing {} shipments with nano-toxins designed to manipulate public mood. Burn all your recent apparel purchases right now!",
     "Conspiracy Desk Wire"),
    ("Secret court order cancels all electricity and water charges for {} mills permanently",
     "VICTORY FOR MILL OWNERS: The high court has secretly declared that no textile unit manufacturing {} will ever have to pay for electricity or water again. Do not pay your power bills from today onwards!",
     "Rumor Central Post"),
    ("Scientists warn that wearing {} causes spontaneous human combustion in hot weather",
     "DOCTORS STUNNED: A viral social media study claims that {} materials attract solar microwaves and burst into flames on crowded buses. Thousands of cases are allegedly being covered up by hospital authorities!",
     "Sensational Health Scares"),
    ("Foreign government buying entire nation's {} supply at 100x market price tomorrow",
     "GET RICH OVERNIGHT: A billionaire foreign prince is landing tomorrow to purchase every single kilogram of {} available in the country for 100 times normal market value. Do not sell to anyone else today!",
     "Speculative Trader Rumors")
]

def generate_full_dataset():
    data = []
    current_id = 1

    # Add hand-crafted core REAL news
    for title, text, cat, src, dt in REAL_NEWS:
        data.append({
            "id": current_id,
            "title": title,
            "text": text,
            "category": cat,
            "source": src,
            "date": dt,
            "label": "REAL",
            "data_type": "CURATED_ACADEMIC"
        })
        current_id += 1

    # Add hand-crafted core FAKE news
    for title, text, cat, src, dt in FAKE_NEWS:
        data.append({
            "id": current_id,
            "title": title,
            "text": text,
            "category": cat,
            "source": src,
            "date": dt,
            "label": "FAKE",
            "data_type": "SYNTHETIC"
        })
        current_id += 1

    # Add template-based balanced samples across all 14 categories
    for cat in CATEGORIES:
        for title_tmpl, text_tmpl, src in REAL_TEMPLATES:
            data.append({
                "id": current_id,
                "title": title_tmpl.format(cat),
                "text": text_tmpl.format(cat),
                "category": cat,
                "source": src,
                "date": f"2026-02-{10 + (current_id % 15):02d}",
                "label": "REAL",
                "data_type": "SYNTHETIC"
            })
            current_id += 1

        for title_tmpl, text_tmpl, src in FAKE_TEMPLATES:
            data.append({
                "id": current_id,
                "title": title_tmpl.format(cat),
                "text": text_tmpl.format(cat),
                "category": cat,
                "source": src,
                "date": f"2026-02-{10 + (current_id % 15):02d}",
                "label": "FAKE",
                "data_type": "SYNTHETIC"
            })
            current_id += 1

    os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
    with open(DATASET_PATH, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "title", "text", "category", "source", "date", "label", "data_type"])
        writer.writeheader()
        writer.writerows(data)

    print(f"Successfully generated {len(data)} textile news records at {DATASET_PATH}")
    real_count = sum(1 for d in data if d["label"] == "REAL")
    fake_count = sum(1 for d in data if d["label"] == "FAKE")
    print(f"Class Distribution: REAL={real_count}, FAKE={fake_count}")

if __name__ == "__main__":
    generate_full_dataset()
