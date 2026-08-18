---
slug: "what-is-electricity-really"
categories: "Science"
headline: "What Is Electricity, Really? A Deeper Look at Electrons and Fields"
subhead: "We use electricity every moment of every day, yet most explanations of it are wrong in ways that matter. Here's what's actually happening when you flip a light switch."
author: "Volt Staff"
date: "2026-05-05"
---
Ask someone how electricity works and you'll likely hear something about electrons flowing through a wire like water through a pipe. It's a useful analogy. It is also profoundly misleading in ways that matter for understanding how power actually moves through systems.

### The Electron Drift Speed Problem

Here is a fact that surprises almost everyone who hears it: the electrons in a wire carrying household current move at an average speed of about **0.001 millimeters per second**. Not meters per second. Not centimeters. A millimeter per second — divided by a thousand.

At that speed, an electron in a wire connecting your wall outlet to a lamp would take years to travel from the socket to the bulb. And yet, when you flip the switch, the lamp illuminates essentially instantaneously. How?

The answer reveals something fundamental about what electricity actually is. The electrons don't need to travel from the power plant to your bulb. They just need to *move*. The wire is already full of electrons — roughly 10²³ of them per cubic centimeter in a copper conductor. When you close the circuit, an electric field propagates through the wire at close to the speed of light, pushing electrons everywhere in the circuit simultaneously.

> The current-as-water analogy mistakes the medium for the message. Electricity is not a substance that flows — it is a field effect that propagates.

### Fields, Not Particles

The physicist who best described what is actually happening when electricity moves was James Clerk Maxwell, who in 1865 published his equations unifying electricity and magnetism into a single framework. Maxwell's insight was that electric and magnetic fields are not static properties of charges and magnets — they are dynamic entities that can propagate through space as waves.

When you plug in a device, you are not injecting electrons into it from the wall. You are establishing electromagnetic field conditions that cause the device's internal electrons to move in useful ways. The energy that lights the bulb, heats the toaster, or charges the battery travels primarily through the electromagnetic field surrounding the wire, not through the wire itself.

The Poynting vector — a mathematical description of the direction and magnitude of electromagnetic energy flow — points perpendicular to the wire, not along it. In a strict physical sense, the energy of the circuit flows through the space around the conductor, channeled and guided by the conductor's geometry.

### The Skin Effect

This field-centric view of electricity has practical engineering consequences. At high frequencies — radio frequencies, for instance — the electromagnetic field penetrates only a thin layer near the conductor surface. The effective cross-sectional area of the conductor shrinks dramatically. This is the *skin effect*, and it is why RF engineers cannot simply use thicker wire to reduce resistance at high frequencies. Instead, they use hollow tubing, stranded wire with many thin strands, or exotic transmission line geometries.

In power systems, the skin effect is meaningful at 50–60 Hz, driving the use of bundled conductors on high-voltage transmission lines rather than a single large cable.

### Superconductivity and What It Tells Us

When certain materials are cooled below a critical temperature, their electrical resistance drops to exactly zero. Not approximately zero — precisely zero, with no energy loss whatsoever. This phenomenon, superconductivity, is one of the most striking in all of physics and remains only partially understood despite a century of study.

A superconducting loop carrying current will continue to circulate that current indefinitely — experiments have maintained currents for years with no detectable decay. This is not a practical perpetual motion machine; you still need to supply energy to the refrigeration system keeping the material cold. But it demonstrates that resistance is not an intrinsic property of electricity — it is a property of the interaction between electrons and the atomic lattice they move through.

High-temperature superconductors, discovered in 1986 and still an active research area, can achieve superconductivity at the temperature of liquid nitrogen (-196°C) rather than liquid helium (-269°C). This makes them significantly more practical for applications like MRI machines, particle accelerators, and experimental power cables.

### Why Any of This Matters

The field-based model of electricity is not merely a physicist's abstraction. It has direct engineering consequences:

- **Electromagnetic interference** spreads through fields, not wires, which is why shielding and cable routing matter for sensitive electronics
- **Wireless power transfer** (as in induction chargers and EV wireless charging pads) works by coupling electromagnetic fields between coils, with no electrons crossing the gap
- **Grid stability** depends on frequency synchronization across a network — a fundamentally field-level phenomenon
- **Power quality** problems like harmonics are distortions in the electromagnetic wave, not simply variations in electron flow

The water analogy is fine for explaining why a larger pipe (thicker wire) reduces resistance. But the moment you want to understand why your phone charges wirelessly, why transformers work, or why the lights turn on before the electrons move an angstrom from where they started — you need Maxwell.
