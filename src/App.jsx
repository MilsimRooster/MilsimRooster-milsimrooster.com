const navItems = [
  { label: "About", href: "#about" },
  { label: "Gallery", href: "/" },
  { label: "Tools", href: "/tools/" },
  { label: "Videos", href: "#videos" },
  { label: "Projects", href: "#projects" },
  { label: "Links", href: "#links" }
];

const featuredApps = [
  {
    name: "Rooster's Nest",
    href: "/tools/",
    icon: "RN",
    text: "Open the no-login toolbox for QR codes, passwords, UUIDs, hashes, JSON, images, PDFs, and quick browser utilities.",
    action: "Open toolbox"
  },
  {
    name: "Digital Bible",
    href: "/bible/",
    icon: "KJV",
    text: "Read the public-domain Berean Standard Bible and King James Version with searchable chapters.",
    action: "Open reader"
  },
  {
    name: "Kids Bible Lessons",
    href: "/bible/lessons/",
    icon: "KID",
    text: "Open kid-friendly Bible lessons with age modes, activities, quizzes, and teacher notes.",
    action: "Open lessons"
  },
  {
    name: "Bug Strike",
    href: "/apps/bug-strike/",
    icon: "BS",
    text: "Play the revived arcade shooter where a debugger ship blasts malware swarms, bosses, hostile packets, and powerups."
  },
  {
    name: "Apostles Quest",
    href: "/apps/apostles/",
    icon: "AQ",
    text: "Open the classroom review game for apostles, Acts, teams, cards, and quick quiz rounds."
  },
  {
    name: "New Testament Trail",
    href: "/apps/apostles/new-testament-trail.html",
    icon: "NT",
    text: "Open the kid-friendly New Testament flashcard game for Gospels, Acts, letters, book order, teams, and matching."
  },
  {
    name: "How Southern Are You?",
    href: "/apps/how-southern-are-you/",
    icon: "HS",
    text: "Take the funny Southern culture quiz and get a screenshot-friendly score card to share."
  },
  {
    name: "Southern Translator",
    href: "/apps/southern-translator/",
    icon: "ST",
    text: "Translate Southern sayings, grandma warnings, weather talk, and church phrases into plain English."
  }
];

const projects = [
  ...featuredApps
];

const links = [
  {
    label: "Photography Portfolio",
    href: "https://youpic.com/dude01"
  },
  {
    label: "Video Channel",
    href: "https://www.youtube.com/@milsimirl"
  },
  {
    label: "GitHub",
    href: "https://github.com/MilsimRooster"
  }
];

const videos = [
  {
    title: "Video 01",
    embed: "https://www.youtube.com/embed/L8-81IFMeWQ",
    link: "https://youtu.be/L8-81IFMeWQ?si=570zj6dAQEAtsIaB"
  },
  {
    title: "Video 02",
    embed: "https://www.youtube.com/embed/LWxlvE7Y_cA",
    link: "https://youtu.be/LWxlvE7Y_cA?si=A2eZOq3PTP314gVT"
  }
];

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="section">
      <div className="section-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function App() {
  return (
    <div
      className="site-liquid-glass-stage"
      data-liquid-glass-stage
      data-liquid-glass-global="true"
      data-liquid-glass-key="mr-global-cursor"
      data-liquid-glass-width="56"
      data-liquid-glass-height="56"
      data-liquid-glass-scale="58"
      data-liquid-glass-edge="72"
    >
      <div className="site-shell" data-liquid-glass-scene>
        <header className="topbar">
          <a className="brand" href="/" aria-label="Milsim Rooster gallery">
            <span className="brand-mark">MR</span>
            <span>Milsim Rooster</span>
          </a>
          <nav aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}>{item.label}</a>
            ))}
          </nav>
        </header>

        <main className="secondary-page">
          <Section id="about" eyebrow="About" title="About Milsim Rooster">
            <div className="split-card">
              <p>
                Keith League's home base for military simulation photos, videos, and projects. Keith is a Veteran, IT Professional, husband, father, and a generally curious creative artist sharing his experiences and ideas here for all to enjoy.
              </p>
            </div>
          </Section>

          <Section id="videos" eyebrow="Videos" title="Field Videos">
            <div className="video-grid">
              {videos.map((video) => (
                <article className="video-card" key={video.embed}>
                  <div className="video-frame">
                    <iframe
                      src={video.embed}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <a className="video-link" href={video.link} target="_blank" rel="noreferrer">Open on YouTube</a>
                </article>
              ))}
            </div>
          </Section>

          <Section id="projects" eyebrow="Apps" title="Apps and Utilities">
            <div className="card-grid">
              {projects.map((project) => (
                project.href ? (
                  <a
                    className="project-card project-link-card"
                    href={project.href}
                    key={project.name}
                    target={project.external ? "_blank" : undefined}
                    rel={project.external ? "noreferrer" : undefined}
                  >
                    <span className={`project-icon ${project.icon === "FPS" ? "project-icon-reticle" : ""}`}>{project.icon}</span>
                    <span className="project-card-copy">
                      <h3>{project.name}</h3>
                      <p>{project.text}</p>
                      <strong>{project.action || "Open app"}</strong>
                    </span>
                  </a>
                ) : (
                  <article className="project-card" key={project.name}>
                    <span className="project-icon">{project.icon}</span>
                    <h3>{project.name}</h3>
                    <p>{project.text}</p>
                  </article>
                )
              ))}
            </div>
          </Section>

          <Section id="links" eyebrow="Links" title="Links">
            <div className="links-list">
              {links.map((link) => (
                <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
                  {link.label}<span>Open</span>
                </a>
              ))}
            </div>
          </Section>
        </main>

      <footer>
        <span>MilsimRooster.com</span>
        <span>Photography, video, projects, and local software utilities.</span>
      </footer>
      </div>
      <div className="site-glass-pointer" data-liquid-glass-lens aria-hidden="true"></div>
    </div>
  );
}

export default App;
