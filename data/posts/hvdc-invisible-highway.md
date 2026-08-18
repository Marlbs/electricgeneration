---
slug: "hvdc-invisible-highway"
categories: "Grid Technology"
headline: "HVDC: The Invisible Highway Moving Power Across Continents"
subhead: "High-voltage direct current transmission lines are solving problems that alternating current cannot. Here's why the world is building more of them — and what they make possible."
author: "Volt Staff"
date: "2026-04-05"
---
Thomas Edison lost the "War of Currents" in 1891. His preferred direct current lost to Nikola Tesla's alternating current because AC could be transformed to high voltages for long-distance transmission and back down for distribution — a problem DC had no practical solution to at the time.

The situation has reversed. Modern power electronics have made high-voltage direct current (HVDC) transmission not just practical but, for the right applications, dramatically superior to AC. The world is currently building more HVDC infrastructure than at any point in history, and the underlying logic deserves more attention than it typically receives.

## Why DC Wins at Long Distance

Alternating current has an inherent disadvantage over long transmission distances: reactive power. AC lines are both resistive (they dissipate power as heat) and reactive (they store and release energy with each cycle). Over long distances, the reactive component becomes a major efficiency drain. Managing it requires reactive power compensation equipment spaced along the line, adding cost and complexity.

DC has no reactive component. A DC transmission line delivers only real power, with losses that scale simply with resistance. At distances beyond roughly 600 km overland, HVDC typically becomes cheaper to operate than HVAC for equivalent power transfer.

For submarine cables — the undersea links connecting offshore wind farms, interconnecting island grids, or linking continental grids across seas — HVDC is almost always superior. Underwater cables have very high capacitance, making HVAC impractical beyond relatively short distances. The 720 km NordLink cable connecting Norway and Germany operates at ±525 kV DC, carrying up to 1.4 GW with losses around 3%.

## The Converter Station

The key technology that enables modern HVDC is the voltage source converter (VSC), using insulated-gate bipolar transistors (IGBTs) to synthesize AC from DC with fine control. VSC converters can independently control active and reactive power, operate against weak or isolated grids, and reverse power flow electronically rather than mechanically.

Converter stations are the expensive part of any HVDC project — typically $200–400 million each for a multi-gigawatt link, with one at each end of the transmission line. The line itself is relatively cheap; the cost advantage of HVDC over HVAC for long distances comes from lower line cost per unit capacity, not from cheaper converter stations.

> "HVDC is not a technology of the future. It is the technology of the last decade, finally reaching the scale the grid needs." — Dr. Bjorn Jacobsen, ABB Grid Systems

## The Interconnection Vision

The most ambitious application of HVDC is continental-scale grid interconnection. If renewable energy resources could be shared across time zones and climate zones, the storage and backup capacity requirements of any single region would shrink dramatically.

Europe's interconnected grid already demonstrates this: Norwegian hydropower — essentially a giant battery driven by snowmelt and rainfall — is exported to continental Europe during periods of low continental wind or solar output, and Norwegian pumped-storage reservoirs are refilled during surplus periods. The same model could work at larger scale, but it requires the transmission infrastructure to move power between distant regions.

In the United States, the three largely separate AC grids (Eastern, Western, and Texas) share very limited interconnection. A network of HVDC links connecting them would allow California's solar surplus to reach the Southeast, and Texas wind to reach the upper Midwest, without the frequency synchronization challenges that have historically prevented AC interconnection.

The SunZia Wind and Transmission project, currently under construction, will carry 3,000 MW of New Mexico wind energy to Arizona and California markets via a 550-mile HVDC line — one of the longest in the United States. It is a template for how the country could stitch together its regional grids into something resembling a unified national system.

## The HVDC Grid Frontier

Existing HVDC systems are mostly point-to-point: one converter at each end, moving power between two nodes. True HVDC grids — with multiple taps along a line and multi-terminal converter stations — are technically feasible but have rarely been built due to the challenge of DC fault protection.

When a short circuit occurs on an AC line, the current naturally passes through zero 100 times per second (at 50 Hz), providing a natural interruption opportunity for conventional circuit breakers. DC current doesn't do this; interrupting DC fault current requires specialized DC circuit breakers capable of managing enormous energy transients in milliseconds.

ABB and Siemens have both developed high-speed DC circuit breakers that can interrupt faults in under 5 milliseconds. These are now being deployed in the offshore wind grids of the North Sea, where multiple HVDC cables from multiple wind farms will eventually be interconnected into a regional DC mesh.

The first offshore HVDC grid — called the North Sea Wind Power Hub in its most ambitious form — would create a genuine multi-terminal DC system connecting wind generation from multiple countries to multiple national grids. It would also, in embryo, demonstrate the technology needed to build something far larger: a planetary electricity network where the sun always shines and the wind always blows somewhere.
