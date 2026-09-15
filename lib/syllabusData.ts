export interface Subtopic {
  id: string;
  name: string;
}

export interface Chapter {
  id: string;
  name: string;
  classLevel: 11 | 12;
  subtopics: Subtopic[];
}

export interface SubjectSyllabus {
  [subject: string]: Chapter[];
}

export const JEE_SYLLABUS: SubjectSyllabus = {
  Physics: [
    {
      id: "phy-units",
      name: "Units & Measurements",
      classLevel: 11,
      subtopics: [
        { id: "p1_1", name: "SI Units & Systems of Units" },
        { id: "p1_2", name: "Least Count & Significant Figures" },
        { id: "p1_3", name: "Errors in Measurement & Propagation" },
        { id: "p1_4", name: "Dimensional Analysis & Applications" },
      ],
    },
    {
      id: "phy-kinematics",
      name: "Kinematics",
      classLevel: 11,
      subtopics: [
        { id: "p2_1", name: "Motion in a Straight Line & Graphs (v-t, x-t)" },
        { id: "p2_2", name: "Relative Velocity in 1D & 2D" },
        { id: "p2_3", name: "Projectile Motion & Trajectory" },
        { id: "p2_4", name: "Uniform Circular Motion & Kinematics" },
      ],
    },
    {
      id: "phy-nlms",
      name: "Laws of Motion",
      classLevel: 11,
      subtopics: [
        { id: "p3_1", name: "Newton's 3 Laws & Momentum Conservation" },
        { id: "p3_2", name: "Impulse & Free Body Diagrams" },
        { id: "p3_3", name: "Static & Kinetic Friction, Laws of Friction" },
        { id: "p3_4", name: "Dynamics of Circular Motion & Banking of Roads" },
      ],
    },
    {
      id: "phy-wep",
      name: "Work, Energy and Power",
      classLevel: 11,
      subtopics: [
        { id: "p4_1", name: "Work Done by Constant & Variable Forces" },
        { id: "p4_2", name: "Work-Energy Theorem & Power" },
        { id: "p4_3", name: "Conservative Forces & Potential Energy of Spring" },
        { id: "p4_4", name: "Motion in a Vertical Circle" },
        { id: "p4_5", name: "Elastic & Inelastic Collisions (1D & 2D)" },
      ],
    },
    {
      id: "phy-rotational",
      name: "Rotational Motion",
      classLevel: 11,
      subtopics: [
        { id: "p5_1", name: "Centre of Mass of System of Particles" },
        { id: "p5_2", name: "Torque & Equilibrium of Rigid Bodies" },
        { id: "p5_3", name: "Moment of Inertia & Parallel/Perpendicular Theorems" },
        { id: "p5_4", name: "Angular Momentum & Conservation of Angular Momentum" },
        { id: "p5_5", name: "Pure Rolling Motion without Slipping" },
      ],
    },
    {
      id: "phy-gravitation",
      name: "Gravitation",
      classLevel: 11,
      subtopics: [
        { id: "p6_1", name: "Universal Law of Gravitation & Kepler's Laws" },
        { id: "p6_2", name: "Variation of g with Altitude, Depth & Rotation" },
        { id: "p6_3", name: "Gravitational Potential & Potential Energy" },
        { id: "p6_4", name: "Escape Velocity & Orbital Motion of Satellites" },
      ],
    },
    {
      id: "phy-solids-fluids",
      name: "Properties of Solids and Liquids",
      classLevel: 11,
      subtopics: [
        { id: "p7_1", name: "Elasticity, Stress-Strain Curve & Young's Modulus" },
        { id: "p7_2", name: "Pressure in Fluids, Pascal's Law & Buoyancy" },
        { id: "p7_3", name: "Bernoulli's Theorem & Equation of Continuity" },
        { id: "p7_4", name: "Viscosity, Stoke's Law & Terminal Velocity" },
        { id: "p7_5", name: "Surface Tension, Excess Pressure & Capillary Rise" },
        { id: "p7_6", name: "Calorimetry, Thermal Expansion & Heat Transfer" },
      ],
    },
    {
      id: "phy-thermodynamics",
      name: "Thermodynamics & KTG",
      classLevel: 11,
      subtopics: [
        { id: "p8_1", name: "Zeroth & First Law of Thermodynamics" },
        { id: "p8_2", name: "Isothermal, Adiabatic & Isochoric Processes" },
        { id: "p8_3", name: "Second Law of Thermodynamics & Carnot Engine" },
        { id: "p8_4", name: "Ideal Gas Laws & RMS Speed of Gas Molecules" },
        { id: "p8_5", name: "Degrees of Freedom & Equipartition of Energy" },
      ],
    },
    {
      id: "phy-oscillations-waves",
      name: "Oscillations and Waves",
      classLevel: 11,
      subtopics: [
        { id: "p9_1", name: "Simple Harmonic Motion (SHM) Equations & Phase" },
        { id: "p9_2", name: "Energy in SHM, Spring & Pendulum Time Period" },
        { id: "p9_3", name: "Wave Motion & Progressive Wave Equation" },
        { id: "p9_4", name: "Superposition, Standing Waves in Strings & Organ Pipes" },
        { id: "p9_5", name: "Beats & Doppler Effect" },
      ],
    },
    {
      id: "phy-electrostatics",
      name: "Electrostatics",
      classLevel: 12,
      subtopics: [
        { id: "p10_1", name: "Coulomb's Law & Electric Field Lines" },
        { id: "p10_2", name: "Electric Dipole & Torque in Uniform Field" },
        { id: "p10_3", name: "Gauss's Law & Applications (Wire, Sheet, Shell)" },
        { id: "p10_4", name: "Electric Potential & Equipotential Surfaces" },
        { id: "p10_5", name: "Capacitors, Dielectrics, Series/Parallel Combinations" },
      ],
    },
    {
      id: "phy-current",
      name: "Current Electricity",
      classLevel: 12,
      subtopics: [
        { id: "p11_1", name: "Electric Current, Drift Velocity & Ohm's Law" },
        { id: "p11_2", name: "Resistivity, Temperature Dependence & Combinations" },
        { id: "p11_3", name: "Kirchhoff's Laws & Circuit Analysis" },
        { id: "p11_4", name: "Wheatstone Bridge & Metre Bridge" },
        { id: "p11_5", name: "Potentiometer, EMF & Internal Resistance of Cells" },
      ],
    },
    {
      id: "phy-magnetism",
      name: "Magnetic Effects of Current & Magnetism",
      classLevel: 12,
      subtopics: [
        { id: "p12_1", name: "Biot-Savart Law & Circular Loop Field" },
        { id: "p12_2", name: "Ampere's Law & Solenoid Magnetic Field" },
        { id: "p12_3", name: "Lorentz Force & Moving Coil Galvanometer" },
        { id: "p12_4", name: "Bar Magnet, Magnetic Dipole & Earth's Magnetism" },
        { id: "p12_5", name: "Para-, Dia- and Ferromagnetic Substances" },
      ],
    },
    {
      id: "phy-emi-ac",
      name: "EMI and Alternating Currents",
      classLevel: 12,
      subtopics: [
        { id: "p13_1", name: "Faraday's Law, Induced EMF & Lenz's Law" },
        { id: "p13_2", name: "Self & Mutual Inductance" },
        { id: "p13_3", name: "AC Peak/RMS, Reactance & Impedance" },
        { id: "p13_4", name: "LCR Series Circuit & Electrical Resonance" },
        { id: "p13_5", name: "Power in AC, Wattless Current & Transformers" },
      ],
    },
    {
      id: "phy-optics",
      name: "Optics (Ray & Wave)",
      classLevel: 12,
      subtopics: [
        { id: "p14_1", name: "Reflection, Spherical Mirrors & Mirror Formula" },
        { id: "p14_2", name: "Refraction, Total Internal Reflection & Prism" },
        { id: "p14_3", name: "Thin Lens Formula, Lens Maker & Microscopes" },
        { id: "p14_4", name: "Wavefronts, Huygens' Principle & Laws of Reflection" },
        { id: "p14_5", name: "Young's Double Slit Experiment (YDSE) & Fringe Width" },
        { id: "p14_6", name: "Diffraction (Single Slit) & Polarization (Brewster's Law)" },
      ],
    },
    {
      id: "phy-modern",
      name: "Modern Physics & Semiconductors",
      classLevel: 12,
      subtopics: [
        { id: "p15_1", name: "Photoelectric Effect & Einstein's Equation" },
        { id: "p15_2", name: "de Broglie Wavelength & Matter Waves" },
        { id: "p15_3", name: "Bohr's Hydrogen Model & Spectral Series" },
        { id: "p15_4", name: "Nucleus, Mass Defect, Binding Energy & Radioactivity" },
        { id: "p15_5", name: "p-n Junction Diode, Rectifiers, Zener Diode & Logic Gates" },
      ],
    },
  ],

  Chemistry: [
    {
      id: "chem-basic",
      name: "Some Basic Concepts of Chemistry",
      classLevel: 11,
      subtopics: [
        { id: "c1_1", name: "Laws of Chemical Combination & Dalton's Theory" },
        { id: "c1_2", name: "Mole Concept, Molar Mass & Stoichiometry" },
        { id: "c1_3", name: "Empirical & Molecular Formula Calculations" },
        { id: "c1_4", name: "Concentration Terms (Molarity, Molality, Mole Fraction)" },
      ],
    },
    {
      id: "chem-atomic",
      name: "Atomic Structure",
      classLevel: 11,
      subtopics: [
        { id: "c2_1", name: "Bohr Model Postulates, Radii & Energy Formulas" },
        { id: "c2_2", name: "de Broglie Relation & Heisenberg Uncertainty" },
        { id: "c2_3", name: "Quantum Numbers (n, l, m, s) & Orbitals (s, p, d)" },
        { id: "c2_4", name: "Aufbau Principle, Pauli Exclusion & Hund's Rule" },
      ],
    },
    {
      id: "chem-bonding",
      name: "Chemical Bonding & Molecular Structure",
      classLevel: 11,
      subtopics: [
        { id: "c3_1", name: "Ionic Bonding, Lattice Enthalpy & Fajan's Rule" },
        { id: "c3_2", name: "Dipole Moment & Polar Character of Bonds" },
        { id: "c3_3", name: "VSEPR Theory & Molecular Geometry" },
        { id: "c3_4", name: "Hybridization (sp, sp2, sp3, sp3d, sp3d2)" },
        { id: "c3_5", name: "Molecular Orbital Theory (MOT) & Bond Order" },
        { id: "c3_6", name: "Hydrogen Bonding & Types" },
      ],
    },
    {
      id: "chem-thermodynamics",
      name: "Chemical Thermodynamics",
      classLevel: 11,
      subtopics: [
        { id: "c4_1", name: "First Law of Thermodynamics, Heat, Work & Enthalpy" },
        { id: "c4_2", name: "Hess's Law of Constant Heat Summation" },
        { id: "c4_3", name: "Standard Enthalpies of Formation, Combustion, Bond" },
        { id: "c4_4", name: "Second Law, Entropy & Gibbs Free Energy Spontaneity" },
      ],
    },
    {
      id: "chem-equilibrium",
      name: "Chemical & Ionic Equilibrium",
      classLevel: 11,
      subtopics: [
        { id: "c5_1", name: "Law of Mass Action, Kp & Kc Relations" },
        { id: "c5_2", name: "Le Chatelier's Principle & Equilibrium Shifts" },
        { id: "c5_3", name: "Acid-Base Concepts (Arrhenius, Bronsted, Lewis)" },
        { id: "c5_4", name: "pH Scale, Ionization of Water & Common Ion Effect" },
        { id: "c5_5", name: "Buffer Solutions & Salt Hydrolysis" },
        { id: "c5_6", name: "Solubility Product (Ksp) & Precipitation" },
      ],
    },
    {
      id: "chem-periodicity",
      name: "Periodic Classification & p-Block",
      classLevel: 11,
      subtopics: [
        { id: "c6_1", name: "Periodic Trends (Atomic/Ionic Radii, IE, EA, EN)" },
        { id: "c6_2", name: "Group 13 & 14 Elements Properties & Trends" },
        { id: "c6_3", name: "Group 15, 16, 17, 18 Elements General Trends" },
      ],
    },
    {
      id: "chem-organic-basics",
      name: "Basic Principles & Hydrocarbons",
      classLevel: 11,
      subtopics: [
        { id: "c7_1", name: "IUPAC Nomenclature of Organic Compounds" },
        { id: "c7_2", name: "Isomerism (Structural & Stereoisomerism)" },
        { id: "c7_3", name: "Electronic Effects (Inductive, Resonance, Hyperconjugation)" },
        { id: "c7_4", name: "Carbocations, Carbanions & Free Radicals Stability" },
        { id: "c7_5", name: "Alkanes, Conformations & Halogenation" },
        { id: "c7_6", name: "Alkenes, Electrophilic Addition & Markownikoff's Rule" },
        { id: "c7_7", name: "Benzene, Aromaticity & Electrophilic Substitution" },
      ],
    },
    {
      id: "chem-solutions",
      name: "Solutions",
      classLevel: 12,
      subtopics: [
        { id: "c8_1", name: "Raoult's Law & Ideal vs Non-ideal Solutions" },
        { id: "c8_2", name: "Colligative Properties (RLVP, Elevation in BP, Depression in FP)" },
        { id: "c8_3", name: "Osmotic Pressure & Reverse Osmosis" },
        { id: "c8_4", name: "Abnormal Molar Mass & van 't Hoff Factor (i)" },
      ],
    },
    {
      id: "chem-electrochemistry",
      name: "Electrochemistry",
      classLevel: 12,
      subtopics: [
        { id: "c9_1", name: "Electrolytic Conduction & Kohlrausch's Law" },
        { id: "c9_2", name: "Galvanic Cells, Standard Potentials & EMF" },
        { id: "c9_3", name: "Nernst Equation & Equilibrium Constant" },
        { id: "c9_4", name: "Faraday's Laws of Electrolysis & Batteries" },
      ],
    },
    {
      id: "chem-kinetics",
      name: "Chemical Kinetics",
      classLevel: 12,
      subtopics: [
        { id: "c10_1", name: "Rate of Reaction, Order & Molecularity" },
        { id: "c10_2", name: "Integrated Rate Equations (Zero & First Order)" },
        { id: "c10_3", name: "Half-Life of Reactions & Calculations" },
        { id: "c10_4", name: "Arrhenius Equation, Activation Energy & Catalysis" },
      ],
    },
    {
      id: "chem-coordination",
      name: "Coordination Compounds & d-f Block",
      classLevel: 12,
      subtopics: [
        { id: "c11_1", name: "d-Block Elements Electronic Configuration & Oxidation States" },
        { id: "c11_2", name: "K2Cr2O7 & KMnO4 Preparation and Properties" },
        { id: "c11_3", name: "Lanthanoid Contraction & f-Block Elements" },
        { id: "c11_4", name: "Werner's Theory & IUPAC of Complex Compounds" },
        { id: "c11_5", name: "Valence Bond Theory (VBT) & Crystal Field Theory (CFT)" },
        { id: "c11_6", name: "Isomerism in Coordination Compounds (Geometrical & Optical)" },
      ],
    },
    {
      id: "chem-organic-functional",
      name: "Organic Chemistry Functional Groups",
      classLevel: 12,
      subtopics: [
        { id: "c12_1", name: "Haloalkanes & Haloarenes (SN1 & SN2 Mechanisms)" },
        { id: "c12_2", name: "Alcohols, Phenols & Ethers (Dehydration, Kolbe, Reimer-Tiemann)" },
        { id: "c12_3", name: "Aldehydes & Ketones (Nucleophilic Addition, Aldol, Cannizzaro)" },
        { id: "c12_4", name: "Carboxylic Acids & Acidic Strength Trends" },
        { id: "c12_5", name: "Amines (Basicity, Carbylamine Test & Diazonium Salts)" },
        { id: "c12_6", name: "Biomolecules (Glucose, Amino Acids, Peptide Bonds, DNA/RNA)" },
      ],
    },
  ],

  Mathematics: [
    {
      id: "math-sets-functions",
      name: "Sets, Relations and Functions",
      classLevel: 11,
      subtopics: [
        { id: "m1_1", name: "Sets, Power Set & Cartesian Product" },
        { id: "m1_2", name: "Types of Relations (Equivalence, Symmetric, Transitive)" },
        { id: "m1_3", name: "Functions (One-One, Onto, Invertible & Composition)" },
        { id: "m1_4", name: "Domain, Range & Graphs of Standard Functions" },
      ],
    },
    {
      id: "math-complex-quadratic",
      name: "Complex Numbers & Quadratic Equations",
      classLevel: 11,
      subtopics: [
        { id: "m2_1", name: "Algebra of Complex Numbers & Modulus/Argument" },
        { id: "m2_2", name: "Argand Plane, Triangle Inequality & Cube Roots of Unity" },
        { id: "m2_3", name: "Roots & Coefficients of Quadratic Equations" },
        { id: "m2_4", name: "Nature of Roots, Common Roots & Range of Quadratics" },
      ],
    },
    {
      id: "math-pnc-binomial",
      name: "Permutations, Combinations & Binomial",
      classLevel: 11,
      subtopics: [
        { id: "m3_1", name: "Fundamental Counting Principle, nPr & nCr" },
        { id: "m3_2", name: "Arrangements, Selections & Circular Permutations" },
        { id: "m3_3", name: "Binomial Theorem Expansion & General Term" },
        { id: "m3_4", name: "Middle Term & Properties of Binomial Coefficients" },
      ],
    },
    {
      id: "math-sequence-series",
      name: "Sequence and Series",
      classLevel: 11,
      subtopics: [
        { id: "m4_1", name: "Arithmetic Progression (AP) & Sum of n Terms" },
        { id: "m4_2", name: "Geometric Progression (GP) & Infinite GP Sum" },
        { id: "m4_3", name: "Arithmetic Mean, Geometric Mean & AM-GM Inequality" },
        { id: "m4_4", name: "Sum of First n Natural Numbers, Squares & Cubes" },
      ],
    },
    {
      id: "math-coordinate-geometry",
      name: "Coordinate Geometry (2D Lines & Conics)",
      classLevel: 11,
      subtopics: [
        { id: "m5_1", name: "Straight Lines (Slope, Intercepts, Angle & Distance Formula)" },
        { id: "m5_2", name: "Concurrency of Lines, Centroid, Orthocentre & Incentre" },
        { id: "m5_3", name: "Circle Equation, Tangents, Normals & Chord of Contact" },
        { id: "m5_4", name: "Parabola Standard Equations, Focus, Directrix & Tangents" },
        { id: "m5_5", name: "Ellipse Standard Equations & Eccentricity" },
        { id: "m5_6", name: "Hyperbola Standard Equations & Asymptotes" },
      ],
    },
    {
      id: "math-trigonometry",
      name: "Trigonometry",
      classLevel: 11,
      subtopics: [
        { id: "m6_1", name: "Trigonometric Identities & Multi-Angle Formulas" },
        { id: "m6_2", name: "General Solutions of Trigonometric Equations" },
        { id: "m6_3", name: "Inverse Trigonometric Functions & Principal Values" },
      ],
    },
    {
      id: "math-matrices-determinants",
      name: "Matrices and Determinants",
      classLevel: 12,
      subtopics: [
        { id: "m7_1", name: "Matrix Types, Addition & Matrix Multiplication" },
        { id: "m7_2", name: "Transpose, Symmetric & Skew-Symmetric Matrices" },
        { id: "m7_3", name: "Determinant Expansion & Properties" },
        { id: "m7_4", name: "Adjoint, Inverse of a Matrix & Area of Triangles" },
        { id: "m7_5", name: "System of Linear Equations (Cramer's Rule & Matrix Inversion)" },
      ],
    },
    {
      id: "math-differential-calculus",
      name: "Differential Calculus",
      classLevel: 12,
      subtopics: [
        { id: "m8_1", name: "Limits of Functions & L'Hopital's Rule" },
        { id: "m8_2", name: "Continuity of Composite & Piecewise Functions" },
        { id: "m8_3", name: "Differentiability & Chain Rule Derivatives" },
        { id: "m8_4", name: "Implicit Differentiation & Second Order Derivatives" },
        { id: "m8_5", name: "Tangents, Normals & Rate of Change" },
        { id: "m8_6", name: "Increasing/Decreasing Functions & Maxima/Minima" },
      ],
    },
    {
      id: "math-integral-calculus",
      name: "Integral Calculus",
      classLevel: 12,
      subtopics: [
        { id: "m9_1", name: "Standard Indefinite Integrals & Substitution Method" },
        { id: "m9_2", name: "Integration by Parts & Partial Fractions" },
        { id: "m9_3", name: "Definite Integrals & Fundamental Theorem of Calculus" },
        { id: "m9_4", name: "Properties of Definite Integrals (King's Rule, Periodic)" },
        { id: "m9_5", name: "Area Bounded by Curves & Simple Standard Forms" },
        { id: "m9_6", name: "Differential Equations (Separation of Variables & Linear 1st Order)" },
      ],
    },
    {
      id: "math-vectors-3d",
      name: "Vectors & 3D Geometry",
      classLevel: 12,
      subtopics: [
        { id: "m10_1", name: "Vector Addition, Dot Product & Cross Product" },
        { id: "m10_2", name: "Scalar Triple Product & Vector Triple Product" },
        { id: "m10_3", name: "Direction Cosines & Direction Ratios in 3D" },
        { id: "m10_4", name: "Equation of Line in 3D & Skew Lines Shortest Distance" },
        { id: "m10_5", name: "Equation of Plane & Distance of a Point from Plane" },
      ],
    },
    {
      id: "math-probability-stats",
      name: "Probability and Statistics",
      classLevel: 12,
      subtopics: [
        { id: "m11_1", name: "Conditional Probability & Multiplication Theorem" },
        { id: "m11_2", name: "Independent Events & Bayes' Theorem" },
        { id: "m11_3", name: "Probability Distribution of Random Variables" },
        { id: "m11_4", name: "Mean, Variance & Standard Deviation of Grouped Data" },
      ],
    },
  ],
};
