/* ==========================================================================
   EDIT THIS FILE TO UPDATE YOUR WEBSITE
   ==========================================================================
   Every page reads its text from the SITE object below. Change a value here,
   save the file, refresh the page (or re-upload to GitHub) — that's it.
   You do NOT need to touch any .html file to update content.

   Rules of thumb:
   - Keep the quotes around text: "like this"
   - Separate list items with a comma
   - If a value has an apostrophe, either use double quotes "it's fine"
     or backslash it: 'it\'s fine'
   ========================================================================== */

window.SITE = {

  // ---- Identity — used across every page ----
  name: "[Your Name]",
  email: "[you@email.com]",
  phone: "[Your Phone Number]",
  location: "Indore, India",
  linkedinUrl: "https://linkedin.com/in/yourprofile",
  linkedinLabel: "linkedin.com/in/yourprofile",
  githubUrl: "https://github.com/yourusername",
  githubLabel: "github.com/yourusername",

  // ---- Home page ----
  home: {
    tagline: "Building the machines that build things.",
    bioParagraphs: [
      "I'm a second-year Robotics and Automation Engineering student at Medicaps University in Indore, currently working out how sensors, software, and steel come together to make a machine that actually does something useful. I've completed two internships so far, and I lead a six-person team at AIESEC Indore, coordinating across a multicultural, cross-time-zone environment.",
      "Outside of coursework I'm a member of the Robotics Club, and I spend a fair amount of free time reading about history and anthropology — the Galileo affair, Maya cosmology — for roughly the same reason I like robotics: I want to know how a system actually works, not just what it does."
    ],
    quickSpecs: [
      { k: "Based in", v: "Indore, India" },
      { k: "Studying", v: "Robotics & Automation Eng." },
      { k: "University", v: "Medicaps University" },
      { k: "Year", v: "2nd Year" },
      { k: "Leading", v: "AIESEC team of 6" },
      { k: "Currently building", v: "Face-tracking attendance system" },
      { k: "Core tools", v: "Python, C/C++, AutoCAD, SQL" }
    ],
    interests: [
      { title: "Applied computer vision", body: "Face detection, tracking, and the eventual hardware to point a camera at what it finds." },
      { title: "Automation & future manufacturing", body: "How mechanical systems and software layers combine on a factory floor, and where that's headed." },
      { title: "Systems, historical and technical", body: "Whether it's a servo loop or a 16th-century institution, I like taking the cover off and looking inside." }
    ]
  },

  // ---- Resume page ----
  resume: {
    education: {
      degree: "B.Tech, Robotics and Automation Engineering",
      dates: "2024 – 2028 (expected)",
      school: "Medicaps University, Indore, India",
      body: "Currently in second year. Coursework has covered C and Python programming, digital image processing, and core automation/robotics fundamentals. Active member of the university Robotics Club."
    },
    experience: [
      {
        title: "Team Leader",
        dates: "[Start] – Present",
        org: "AIESEC Indore",
        bullets: [
          "Lead a team of six members in a multicultural, cross-functional environment.",
          "[Add: a specific initiative you ran, a target you hit, or a process you improved.]",
          "[Add: a metric — retention, delivery timelines, satisfaction scores, etc.]"
        ]
      },
      {
        title: "[Internship Title]",
        dates: "[Dates]",
        org: "[Company Name]",
        bullets: [
          "[Add: what you were responsible for.]",
          "[Add: a concrete outcome — something that shipped, improved, or was measured.]"
        ]
      },
      {
        title: "[Internship Title]",
        dates: "[Dates]",
        org: "[Company Name]",
        bullets: [
          "[Add: what you were responsible for.]",
          "[Add: a concrete outcome — something that shipped, improved, or was measured.]"
        ]
      }
    ],
    skills: [
      { label: "Programming", body: "C, C++, Python, object-oriented programming" },
      { label: "Tools", body: "AutoCAD, SQL & database management" },
      { label: "Emerging", body: "Applied computer vision, LLM-assisted development" }
    ],
    activities: [
      { k: "Robotics Club", v: "Member, Medicaps University" },
      { k: "AIESEC Indore", v: "Team Leader, team of 6" }
    ],
    // Interactive skill bars on the resume page. value is 0–100.
    skillLevels: [
      { label: "Python", value: 80 },
      { label: "C / C++", value: 65 },
      { label: "AutoCAD", value: 60 },
      { label: "SQL", value: 55 },
      { label: "Computer Vision (OpenCV)", value: 45 }
    ]
  },

  // ---- Projects (index cards + detail sheets) ----
  projects: [
    {
      id: "facetrack",
      page: "project-facetrack.html",
      num: "03.1",
      title: "Face-Tracking Attendance & Security System",
      cardDesc: "A phased computer-vision system for attendance and lab security, built toward eventual servo-camera hardware.",
      status: "In progress",
      tags: ["Python", "OpenCV", "MediaPipe", "FastAPI"],
      stack: "Python / CV",
      phasesCount: "4",
      problem: "Attendance in shared spaces like a robotics lab or club room usually comes down to a sign-in sheet or a manual roll call — slow, easy to fake, and not tied to anything else going on in the room. The same manual sign-in is often the only security layer for who's allowed to be there. I wanted a system that could recognize people automatically, log that in a way I could actually query later, and eventually connect that recognition to a physical camera that could track a subject in real time.",
      steps: [
        {
          label: "A",
          title: "Scoped it into four phases before writing production code",
          body: "Rather than starting with hardware, I broke the build into four stages so each one could be validated on its own: (1) a face detection and enrollment pipeline, (2) real-time tracking, (3) a persistence and service layer, and (4) hardware integration. That separation was deliberate — it keeps the riskiest, least-reversible part of the project (servo and camera hardware) as the last phase, after the recognition logic is proven on a laptop webcam."
        },
        {
          label: "B",
          title: "Selected a stack for each phase",
          body: "Detection & enrollment — OpenCV for capture and preprocessing, with face_recognition / DeepFace evaluated for encoding faces into comparable embeddings. Real-time tracking — MediaPipe, chosen over a heavier detector for its speed on modest hardware. Data & service layer — SQLite for attendance logs, wrapped in a Flask or FastAPI service so the recognition pipeline and the log/API are decoupled. Hardware — a servo-mounted camera, planned as the final phase once the software pipeline is stable."
        }
      ],
      outcome: "The project is currently at the planning/architecture stage: the four-phase roadmap and stack are defined, and the next concrete step is building and testing the detection and enrollment pipeline (Phase 1) before touching tracking, the service layer, or hardware.",
      outcomeNote: "[Once you've built further: replace this section with what's actually working — e.g. detection accuracy on your test set, how attendance logging performs day to day, or what changed once the servo camera was wired in.]",
      notes: "The main lesson so far has been about sequencing: it's tempting to start with the exciting part (the hardware), but proving the recognition pipeline first means any hardware problems later are isolated to hardware, not tangled up with detection accuracy."
    },
    {
      id: "studytools",
      page: "project-studytools.html",
      num: "03.2",
      title: "Interactive Study Tool Suite",
      cardDesc: "A set of self-contained interactive guides that turned two dense course units into something I'd actually use to revise.",
      status: "Shipped",
      tags: ["HTML/CSS/JS", "Instructional design"],
      stack: "HTML/JS",
      phasesCount: "4 guides",
      problem: "Two of my courses — Digital Image Processing and a Python unit on data structures and sorting — are the kind that reward understanding a process, not memorizing a slide. Lecture decks are fine for a first pass, but they don't hold up as revision tools: there's no way to poke at a transform, quiz yourself, or jump straight to the one concept you're shaky on.",
      steps: [
        {
          label: "A",
          title: "Defined what a good study tool needed, unit by unit",
          body: "For each unit I specified the same shape: a working interactive widget for the core concept (not just a diagram — something you could manipulate), a glossary of the terms that actually show up in exam questions, and a flashcard deck for quick review. I broke Digital Image Processing into three single-page guides — image fundamentals, enhancement/transforms, and segmentation/morphological operations — and built one more for the Python unit covering lists, tuples, dictionaries, and sorting algorithms."
        },
        {
          label: "B",
          title: "Built iteratively, one widget at a time",
          body: "Rather than writing a spec and hoping it worked, I went topic by topic — describe the concept, build the widget for it, check it against what I actually needed to know, adjust, move to the next topic. That loop is what made the guides usable rather than just decorative: each interactive piece had to actually clarify something I'd been stuck on, not just look good."
        }
      ],
      outcome: "Four self-contained HTML study guides, each with embedded widgets, a glossary, and a flashcard deck, used directly for exam prep. More usefully, the process itself — spec a unit, build the interactive piece, refine against real exam-style questions — turned into a repeatable pattern I can point at any dense course unit going forward.",
      outcomeNote: "[Add: how you actually used these before the exam, and whether the interactive format changed your results or just your confidence.]",
      notes: ""
    },
    {
      id: "aiesec",
      page: "project-aiesec.html",
      num: "03.3",
      title: "Leading a Six-Person Team at AIESEC Indore",
      cardDesc: "Running a small cross-cultural team where the deliverable is coordination, not code.",
      status: "Ongoing",
      tags: ["Leadership", "Cross-cultural teams"],
      stack: "Team Leader",
      phasesCount: "6",
      problem: "AIESEC runs on small teams pulled from very different backgrounds working toward shared deadlines, often across time zones and with different assumptions about how a team should communicate. Managing six people well in that setup means the coordination itself is the deliverable — there's no single artifact to point to the way there is with code.",
      steps: [
        {
          label: "A",
          title: "Took on the Team Leader role for a team of six",
          body: "[Add specifics here: how you structured check-ins, how you handled a disagreement or a missed deadline, what tools you used to keep everyone aligned across time zones, or how you onboarded new members into a multicultural working style.]"
        }
      ],
      outcome: "",
      outcomeNote: "[Add: a concrete result — a project the team delivered, a retention or satisfaction number, a process you introduced that stuck, or simply what changed about how the team worked together under your lead.]",
      notes: ""
    }
  ],

  // ---- Writing page ----
  writing: [
    {
      label: "History of science",
      title: "The Galileo Affair Wasn't Science vs. Religion",
      body: "It's tempting to read Galileo's trial as an early round in a permanent war between science and faith, but that framing flattens a much messier situation. The Church had already accepted heliocentrism as a useful mathematical model — the objection was to presenting it as literal fact without what the era considered sufficient proof, at a moment when the Church was especially sensitive to challenges to its authority during the Counter-Reformation. Galileo's own combativeness, and the political rivalries around him, mattered as much as the astronomy. Treating it as a clean clash of worldviews makes for a good story, but it erases the actual, more interesting argument about evidence, authority, and timing."
    },
    {
      label: "Anthropology",
      title: "What the Maya Calendar Actually Measured",
      body: "The popular image of the Maya calendar is mostly apocalypse trivia, which misses what the system was actually for. Maya cosmology tracked multiple interlocking cycles at once — ritual, agricultural, and long-count — because time itself was understood as cyclical and layered rather than a single arrow moving forward. Ritual practice wasn't decoration on top of the calendar; it was how a community stayed in sync with cycles they believed governed everything from planting to political legitimacy. And despite the \"lost civilization\" framing that shows up in documentaries, Maya people and their descendant communities are very much still here, across southern Mexico and Central America."
    },
    {
      label: "Robotics & automation",
      title: "Notes on Automation, After Reading Too Much History",
      body: "Every automation project I've worked on eventually turns into a question that isn't really technical: what should a machine be trusted to decide on its own, and what should always route back to a person? That question is old — factories asked a version of it a century ago, and every wave of manufacturing automation since has redrawn the line slightly differently. Working on a face-tracking system has made this concrete rather than abstract: it's not enough to build something that recognizes a face correctly, you also have to decide what it's allowed to do with that recognition, and who's accountable when it gets it wrong."
    }
  ],

  // ---- Hidden easter egg ----
  // Click the small "Portfolio Set — Sheet ..." text at the top of any page
  // this many times in a row to reveal it. Edit the lines below freely.
  easterEgg: {
    clicksToReveal: 5,
    title: "SHEET 00 — CLASSIFIED",
    lines: [
      "You found the hidden sheet.",
      "This site was hand-drafted, revised, and over-engineered by a robotics student who definitely did not procrastinate on an assignment to build it.",
      "Tolerance: ±0.00mm. Patience: also ±0.00mm.",
      "Now go build something."
    ]
  }

};
