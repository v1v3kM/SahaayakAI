import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Support both GET and POST for easier seeding
export async function GET() {
  return seed()
}

export async function POST() {
  return seed()
}

async function seed() {
  try {
    const existingIncidents = await db.incident.count()
    if (existingIncidents > 0) {
      return NextResponse.json({ message: 'Seed data already exists', count: existingIncidents })
    }

    // Seed reporters with different credibility levels (upsert to handle re-runs)
    const reporter1 = await db.reporter.upsert({
      where: { phone: '9876543210' },
      update: { name: 'Rajesh Kumar', credibilityScore: 95, totalReports: 12, verifiedReports: 10, badges: '["Verified Source","Community Hero","Trusted Reporter"]' },
      create: { name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@example.com', credibilityScore: 95, totalReports: 12, verifiedReports: 10, fakeReports: 0, role: 'citizen', badges: '["Verified Source","Community Hero","Trusted Reporter"]' },
    })
    const reporter2 = await db.reporter.upsert({
      where: { phone: '9876543211' },
      update: { name: 'Priya Sharma', credibilityScore: 78 },
      create: { name: 'Priya Sharma', phone: '9876543211', email: 'priya@example.com', credibilityScore: 78, totalReports: 8, verifiedReports: 6, fakeReports: 1, role: 'citizen', badges: '["Trusted Reporter"]' },
    })
    const reporter3 = await db.reporter.upsert({
      where: { phone: '9876543212' },
      update: { name: 'Amit Patel', credibilityScore: 45, isRateLimited: true },
      create: { name: 'Amit Patel', phone: '9876543212', email: 'amit@example.com', credibilityScore: 45, totalReports: 15, verifiedReports: 5, fakeReports: 8, role: 'citizen', isRateLimited: true, badges: '[]' },
    })
    const reporter4 = await db.reporter.upsert({
      where: { phone: '9876543214' },
      update: { name: 'Kavitha Nair', credibilityScore: 88 },
      create: { name: 'Kavitha Nair', phone: '9876543214', email: 'kavitha@example.com', credibilityScore: 88, totalReports: 6, verifiedReports: 5, fakeReports: 0, role: 'citizen', badges: '["Trusted Reporter","Community Hero"]' },
    })
    const reporter5 = await db.reporter.upsert({
      where: { phone: '9876543215' },
      update: { name: 'Sourav Das', credibilityScore: 72 },
      create: { name: 'Sourav Das', phone: '9876543215', email: 'sourav@example.com', credibilityScore: 72, totalReports: 4, verifiedReports: 3, fakeReports: 0, role: 'citizen', badges: '[]' },
    })
    await db.reporter.upsert({
      where: { phone: '9876543213' },
      update: { name: 'Inspector Deshmukh' },
      create: { name: 'Inspector Deshmukh', phone: '9876543213', email: 'deshmukh@ndrf.gov', credibilityScore: 100, totalReports: 0, verifiedReports: 0, fakeReports: 0, role: 'authority', department: 'NDRF Disaster Management', badges: '["Verified Source","Community Hero","Trusted Reporter"]' },
    })
    await db.reporter.upsert({
      where: { phone: '9876543200' },
      update: { name: 'Admin Control' },
      create: { name: 'Admin Control', phone: '9876543200', email: 'admin@sahaayak.ai', credibilityScore: 100, totalReports: 0, verifiedReports: 0, fakeReports: 0, role: 'admin', badges: '["Verified Source","Community Hero","Trusted Reporter"]' },
    })

    // Seed incidents from across India
    const incidents = await Promise.all([
      // Mumbai - Waterlogging (Maharashtra)
      db.incident.create({
        data: {
          type: 'waterlogging', title: 'Critical Waterlogging in Andheri Subway',
          description: 'Severe waterlogging in Andheri subway has brought traffic to a complete halt. Water level has risen to 3 feet, stranding multiple vehicles. Residents in low-lying areas are reporting water entering homes.',
          location: 'Andheri, Mumbai, Maharashtra', area: 'Andheri', severity: 'critical', status: 'active',
          latitude: 19.1136, longitude: 72.8697,
          verificationStatus: 'pending', reporterId: reporter1.id, credibilityAtReport: 95, aiFakeScore: 0.12,
          alertsGenerated: 3, resourcesAllocated: 6, affectedPopulation: '3000-5000',
          agentAnalysis: JSON.stringify({
            report_intake: 'Critical waterlogging incident verified at Andheri subway, Mumbai. Multiple stranded vehicles. Water level at 3 feet and rising.',
            fake_detector: 'LOW RISK (0.12): Report matches known flooding patterns in Andheri during monsoon. Cross-referenced with IMD rainfall data showing heavy precipitation. Multiple independent sources confirm waterlogging in this area.',
            situation_assessment: 'High cascading risk - potential for electrocution, structural damage. Estimated 3000-5000 people directly affected in Mumbai.',
            resource_allocation: '4 rescue boats deployed, 3 ambulances on standby, 2 dewatering pump trucks en route. NDRF team on alert. ETA: 12 minutes.',
            communication: 'Emergency alerts sent in English, Hindi, and Marathi. Train services suspended between Andheri-Bandra.',
            coordination: 'All agencies coordinated. BMC, NDRF, Fire Brigade on unified response. IMD monitoring ongoing.',
          }),
        },
      }),
      // Chennai - Cyclone (Tamil Nadu)
      db.incident.create({
        data: {
          type: 'cyclone', title: 'Cyclone Warning - Chennai Coastline',
          description: 'IMD has issued a cyclone warning for the Chennai coastline. Wind speeds expected to reach 120 km/h. Heavy rainfall and storm surge expected. Fishermen advised not to venture into sea.',
          location: 'Marina Beach, Chennai, Tamil Nadu', area: 'Besant Nagar', severity: 'critical', status: 'active',
          latitude: 13.0500, longitude: 80.2824,
          verificationStatus: 'genuine', reporterId: reporter4.id, credibilityAtReport: 88, aiFakeScore: 0.05,
          alertsGenerated: 3, resourcesAllocated: 8, affectedPopulation: '50000-100000',
          agentAnalysis: JSON.stringify({
            report_intake: 'Cyclone warning for Chennai coastline confirmed by IMD. Category 3 system approaching Bay of Bengal coast.',
            fake_detector: 'LOW RISK (0.05): Verified against IMD cyclone tracking data. Wind speed and trajectory match official bulletins. Reporter has high credibility (88/100). Information consistent with satellite imagery.',
            situation_assessment: 'Very high severity. Estimated 50,000-100,000 people in coastal zones at risk. Storm surge of 2-3 meters possible. Power disruption likely across Chennai metropolitan area.',
            resource_allocation: '6 NDRF battalions deployed, 12 ambulances positioned, Coast Guard on high alert, 4 relief shelters activated, IAF helicopters on standby.',
            communication: 'Alerts issued in English, Hindi, and Tamil. Evacuation orders for coastal zones. Schools and offices closed for 48 hours.',
            coordination: 'NDMA coordinating with state SDMA. All coastal districts on high alert. Navy and Coast Guard assisting evacuation.',
          }),
        },
      }),
      // Kolkata - Flood (West Bengal)
      db.incident.create({
        data: {
          type: 'flood', title: 'Hooghly River Flooding in Howrah',
          description: 'Hooghly River water levels have crossed the danger mark near Howrah Bridge. Several low-lying areas of Howrah and Kolkata are experiencing flooding. Drainage systems overwhelmed.',
          location: 'Howrah Bridge, Kolkata, West Bengal', area: 'Howrah', severity: 'high', status: 'active',
          latitude: 22.5958, longitude: 88.2636,
          verificationStatus: 'pending', reporterId: reporter5.id, credibilityAtReport: 72, aiFakeScore: 0.15,
          alertsGenerated: 3, resourcesAllocated: 5, affectedPopulation: '10000-20000',
          agentAnalysis: JSON.stringify({
            report_intake: 'Flood warning for Howrah/Kolkata area. Hooghly River water levels above danger mark.',
            fake_detector: 'LOW RISK (0.15): Hooghly River flooding is well-documented during monsoon season. Water level data corroborated by CWC sensors. Geographic details accurate.',
            situation_assessment: 'High severity. 10,000-20,000 residents in low-lying areas at risk. Transport disruption on Howrah Bridge likely. Risk of waterborne diseases.',
            resource_allocation: '3 NDRF teams deployed, 5 rescue boats, 4 ambulances dispatched. Relief camps set up in Howrah Municipal area.',
            communication: 'Emergency alerts in English, Hindi, and Bengali. Ferry services suspended. Alternative transport routes announced.',
            coordination: 'SDRF West Bengal leading response. KMC and HMC coordinating drainage pumping. Indian Railways monitoring tracks.',
          }),
        },
      }),
      // Bengaluru - Waterlogging (Karnataka)
      db.incident.create({
        data: {
          type: 'waterlogging', title: 'Severe Waterlogging in Electronic City',
          description: 'Heavy rainfall has caused severe waterlogging in Electronic City and surrounding IT parks. Several tech companies reporting basement flooding. ORR (Outer Ring Road) submerged at multiple points.',
          location: 'Electronic City, Bengaluru, Karnataka', area: 'Electronic City', severity: 'moderate', status: 'active',
          latitude: 12.8399, longitude: 77.6770,
          verificationStatus: 'pending', reporterId: reporter2.id, credibilityAtReport: 78, aiFakeScore: 0.18,
          alertsGenerated: 3, resourcesAllocated: 3, affectedPopulation: '5000-10000',
          agentAnalysis: JSON.stringify({
            report_intake: 'Waterlogging reported at Electronic City, Bengaluru. IT parks and ORR affected.',
            fake_detector: 'LOW RISK (0.18): Bengaluru waterlogging during monsoons is well-documented, especially in Electronic City. ORR flooding confirmed by traffic cameras. Consistent with recent heavy rainfall data from IMD.',
            situation_assessment: 'Moderate severity. 5000-10000 IT workers affected. Risk of electrical hazards in flooded basements. Traffic disruption on ORR and Hosur Road.',
            resource_allocation: '2 fire brigade units, 1 dewatering pump, 2 ambulances dispatched. BBMP storm water drain team activated.',
            communication: 'Alerts in English, Hindi, and Kannada. Companies advised WFH for the day. BMTC buses rerouted.',
            coordination: 'BBMP and BWSSB coordinating. Fire department leading rescue of stranded vehicles. Traffic police deploying diversions.',
          }),
        },
      }),
      // Delhi - Heatwave
      db.incident.create({
        data: {
          type: 'heatwave', title: 'Severe Heatwave Alert - Delhi NCR',
          description: 'Temperature soaring to 48°C in parts of Delhi NCR. Multiple heat stroke cases reported. IMD has issued a red alert for extreme heat conditions for the next 3 days.',
          location: 'Connaught Place, New Delhi, Delhi', area: 'Connaught Place', severity: 'high', status: 'active',
          latitude: 28.6315, longitude: 77.2167,
          verificationStatus: 'genuine', reporterId: reporter1.id, credibilityAtReport: 95, aiFakeScore: 0.08,
          alertsGenerated: 2, resourcesAllocated: 4, affectedPopulation: '5000000+',
          agentAnalysis: JSON.stringify({
            report_intake: 'Extreme heatwave conditions in Delhi NCR. Temperature recorded at 48°C, matching IMD red alert.',
            fake_detector: 'LOW RISK (0.08): IMD confirms red alert for Delhi. Temperature readings match AWS stations. Heat stroke cases being reported at hospitals. Verified by multiple weather services.',
            situation_assessment: 'High severity affecting entire Delhi NCR population (20M+). Vulnerable populations at extreme risk. Water supply stress, power grid overload possible. Hospital emergency wards preparing for surge.',
            resource_allocation: 'Mobile water tankers deployed across 50 locations. Additional 200 beds in heat stroke wards. Public cooling shelters activated. Power grid load management team on alert.',
            communication: 'Alerts in English and Hindi. Public advisory to stay indoors 11AM-4PM. Schools closed for 3 days. Construction work banned during peak hours.',
            coordination: 'Delhi Disaster Management Authority leading response. MCD, NDMC, DJB coordinating water supply. BSES and Tata Power managing grid stability.',
          }),
        },
      }),
      // Uttarakhand - Landslide
      db.incident.create({
        data: {
          type: 'landslide', title: 'Major Landslide on Rishikesh-Badrinath Highway',
          description: 'A massive landslide has blocked the Rishikesh-Badrinath National Highway near Rudraprayag. Several vehicles stranded. Debris flow continues. 200+ pilgrims and tourists reportedly stuck.',
          location: 'Rudraprayag, Uttarakhand', area: 'Rudraprayag', severity: 'critical', status: 'active',
          latitude: 30.2840, longitude: 78.9800,
          verificationStatus: 'pending', reporterId: reporter2.id, credibilityAtReport: 78, aiFakeScore: 0.10,
          alertsGenerated: 2, resourcesAllocated: 7, affectedPopulation: '200-500',
          agentAnalysis: JSON.stringify({
            report_intake: 'Major landslide on NH-7 (Rishikesh-Badrinath Highway) near Rudraprayag. Road completely blocked. Active debris flow.',
            fake_detector: 'LOW RISK (0.10): Uttarakhand landslides during monsoon are extremely common on this highway. Location-specific details verify against known vulnerable stretches. BRO confirms road blockage.',
            situation_assessment: 'Critical severity. 200-500 people stranded including Char Dham pilgrims. Risk of secondary landslides. River damming possibility creating flash flood risk downstream.',
            resource_allocation: '2 NDRF teams airlifted, 3 SDRF teams deployed on ground, BRO heavy machinery en route, IAF helicopter on standby for medical evacuation.',
            communication: 'Alerts in English and Hindi. Char Dham Yatra advisory updated. Alternative route via Gopeshwar announced.',
            coordination: 'Uttarakhand SDMA leading operations. BRO clearing debris. ITBP assisting in rescue of stranded pilgrims. GSI monitoring slope stability.',
          }),
        },
      }),
      // Gujarat - Earthquake
      db.incident.create({
        data: {
          type: 'earthquake', title: 'Earthquake Tremors Felt in Kutch Region',
          description: 'Earthquake of magnitude 4.8 felt in Kutch district and surrounding areas. Minor structural damage reported in Bhuj. Residents have evacuated buildings as a precaution.',
          location: 'Bhuj, Kutch, Gujarat', area: 'Bhuj', severity: 'moderate', status: 'monitoring',
          latitude: 23.2420, longitude: 69.6669,
          verificationStatus: 'genuine', reporterId: reporter4.id, credibilityAtReport: 88, aiFakeScore: 0.06,
          alertsGenerated: 3, resourcesAllocated: 3, affectedPopulation: '50000-100000',
          agentAnalysis: JSON.stringify({
            report_intake: 'Earthquake M4.8 in Kutch region, Gujarat. Epicenter near Bhuj. Minor structural damage reported.',
            fake_detector: 'LOW RISK (0.06): Seismic data confirmed by NCS (National Center for Seismology). Kutch is a known seismically active zone (Zone V). Magnitude and location verified against USGS data.',
            situation_assessment: 'Moderate severity. Aftershocks possible. Kutch region has earthquake-resistant infrastructure post-2001. 50,000-100,000 people in affected zone. Building inspection teams needed.',
            resource_allocation: '2 NDRF teams pre-positioned in Bhuj. Building safety inspection teams deployed. Medical teams on standby at Bhuj Civil Hospital.',
            communication: 'Alerts in English, Hindi, and Gujarati. Earthquake safety advisory issued. Schools evacuated as precaution.',
            coordination: 'Gujarat SDMA coordinating with NCS for aftershock monitoring. District administration conducting damage assessment. GSDMA protocols activated.',
          }),
        },
      }),
      // Kerala - Flood
      db.incident.create({
        data: {
          type: 'flood', title: 'Flash Floods in Wayanad District',
          description: 'Heavy rainfall has triggered flash floods in Wayanad district. Multiple villages cut off. Landslides blocking rescue routes. Rivers overflowing in Meppadi and Vythiri areas.',
          location: 'Meppadi, Wayanad, Kerala', area: 'Meppadi', severity: 'critical', status: 'active',
          latitude: 11.5550, longitude: 76.1370,
          verificationStatus: 'pending', reporterId: reporter4.id, credibilityAtReport: 88, aiFakeScore: 0.07,
          alertsGenerated: 3, resourcesAllocated: 8, affectedPopulation: '5000-10000',
          agentAnalysis: JSON.stringify({
            report_intake: 'Flash floods in Wayanad district, Kerala. Multiple villages cut off. Landslides blocking access routes.',
            fake_detector: 'LOW RISK (0.07): Wayanad is a known flood and landslide prone district. IMD confirms extremely heavy rainfall. District collector has confirmed emergency. Reporter has high credibility (88/100).',
            situation_assessment: 'Critical severity. 5000-10000 people in affected villages. Multiple access routes blocked by landslides. Risk of further landslides in hilly terrain. Aerial rescue may be needed.',
            resource_allocation: '3 NDRF teams, 4 SDRF teams deployed. Navy helicopter requested for aerial survey. 100+ fishermen boats mobilized for rescue. Army engineering unit for road clearance.',
            communication: 'Alerts in English, Hindi, and Malayalam. Red alert for Wayanad district. Tourism advisory issued. Schools and offices closed.',
            coordination: 'Kerala SDMA leading multi-agency response. NDRF, Navy, Army, and Air Force coordinating. CM monitoring situation from Thiruvananthapuram.',
          }),
        },
      }),
      // FAKE report - pan-India
      db.incident.create({
        data: {
          type: 'earthquake', title: 'MASSIVE EARTHQUAKE DESTROYING DELHI RIGHT NOW!!!',
          description: 'GIANT 9.5 MAGNITUDE EARTHQUAKE in Delhi!! All buildings collapsing!! Run for your lives!! Delhi is FINISHED!! Share this with everyone NOW!!!',
          location: 'Delhi, India', area: 'All Delhi', severity: 'critical', status: 'fake',
          latitude: 28.6139, longitude: 77.2090,
          verificationStatus: 'fake', reporterId: reporter3.id, credibilityAtReport: 30, aiFakeScore: 0.95,
          alertsGenerated: 0, resourcesAllocated: 0, affectedPopulation: '0',
          agentAnalysis: JSON.stringify({
            report_intake: 'Earthquake report received for Delhi. Extremely alarming language with excessive exclamation marks and caps.',
            fake_detector: 'HIGH RISK (0.95): No seismic activity registered by NCS or USGS for Delhi region. Report uses classic misinformation patterns: ALL CAPS, excessive exclamation, unrealistic magnitude (9.5 - never recorded in India), panic-inducing language ("FINISHED", "Run for your lives"). Reporter has low credibility (30/100). This is deliberate misinformation designed to cause mass panic.',
            situation_assessment: 'REJECTED: No seismological evidence supports this claim. NCS confirms no earthquake activity in Delhi-NCR region. This is a confirmed false alarm.',
            resource_allocation: 'NO RESOURCES ALLOCATED: Report flagged as confirmed misinformation. No emergency deployment warranted.',
            communication: 'Counter-advisory issued: No earthquake in Delhi. Citizens advised to verify information through official NCS/IMD channels. Do not share unverified panic messages.',
            coordination: 'Report forwarded to cyber crime cell for investigation. Reporter flagged for credibility review. Counter-misinformation bulletin issued to media.',
          }),
        },
      }),
    ])

    // Seed alerts for genuine incidents
    const alerts = []
    for (const incident of incidents.slice(0, 8)) {
      if (incident.status === 'fake') continue
      const templates = [
        { language: 'en', type: 'emergency_alert', content: `⚠️ EMERGENCY: ${incident.severity.toUpperCase()} ${incident.type.replace(/_/g, ' ')} at ${incident.area}. Emergency services responding. Stay safe and follow official advisories.` },
        { language: 'hi', type: 'public_advisory', content: `⚠️ आपातकालीन अलर्ट: ${incident.area} में ${incident.type.replace(/_/g, ' ')} की सूचना। आपातकालीन सेवाएं तैनात। सुरक्षित रहें।` },
      ]
      for (const t of templates) {
        const alert = await db.alert.create({ data: { incidentId: incident.id, language: t.language, type: t.type, content: t.content } })
        alerts.push(alert)
      }
    }

    return NextResponse.json({ success: true, incidents: incidents.length, alerts: alerts.length, reporters: 7 })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Internal server error seeding data' }, { status: 500 })
  }
}
