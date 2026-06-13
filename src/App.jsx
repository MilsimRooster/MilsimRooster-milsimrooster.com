const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "/apps/gallery/" },
  { label: "Videos", href: "#videos" },
  { label: "Projects", href: "#projects" },
  { label: "Links", href: "#links" }
];

const featuredApps = [
  {
    name: "Apostles Quest",
    href: "/apps/apostles/",
    icon: "AQ",
    text: "Open the classroom review game for apostles, Acts, teams, cards, and quick quiz rounds."
  },
  {
    name: "FPS Visualizer",
    href: "/apps/fps-visualizer/",
    icon: "FPS",
    text: "Launch the airsoft BB performance tool for energy, range, drop, and useful-distance estimates."
  },
  {
    name: "Rooster Recipes",
    href: "/apps/recipes/",
    icon: "RR",
    text: "Browse family recipes, scale servings, save favorites, and build a practical shopping list."
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
  },
  {
    name: "Quotetron",
    href: "/apps/quotetron/",
    icon: "QT",
    text: "Price jobs, compare going rates, and decide when to take, negotiate, or pass before profit disappears."
  }
];

const projects = [
  ...featuredApps,
  {
    name: "Command Center",
    icon: "CC",
    text: "A compact Windows workflow hub for launching tools, opening folders, checking status, and keeping daily actions close."
  },
  {
    name: "System Gauges",
    icon: "SG",
    text: "A desktop monitoring utility focused on quick system visibility, clean controls, and lightweight performance."
  },
  {
    name: "Pomodoro Timer",
    icon: "PT",
    text: "A polished timer shell with media playback, visual backgrounds, and focused work-session controls."
  }
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
          <a className="brand" href="#home" aria-label="Milsim Rooster home">
            <span className="brand-mark">MR</span>
            <span>Milsim Rooster</span>
          </a>
          <nav aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}>{item.label}</a>
            ))}
          </nav>
        </header>

        <main>
          <section id="home" className="hero gallery-first-hero">
            <div className="hero-copy">
              <p className="kicker">Field Gallery / Media Archive</p>
              <h1>Milsim Rooster</h1>
              <p className="tagline">
                The gallery is the front door now: field photography, second-layer moments, and cinematic milsim media in one focused archive.
              </p>
              <a className="hero-gallery-button gallery-launch-button" href="/apps/gallery/">
                <span>Gallery</span>
                <strong>Enter the Gallery</strong>
                <small>Spherical field archive, second layer, and media wall.</small>
              </a>
            </div>
            <div className="hero-visual" aria-label="Milsim Rooster visual preview">
              <img src="/media/optimized/hero/img-7003-hero.jpg" alt="Milsim Rooster hero media preview" />
              <div className="mission-card">
                <div>
                  <span>01</span>
                  <strong>Surface</strong>
                  <p>Curated portraits, events, and field atmosphere.</p>
                </div>
                <div>
                  <span>02</span>
                  <strong>Second Layer</strong>
                  <p>Expanded image wall with clean framed viewing.</p>
                </div>
                <div>
                  <span>03</span>
                  <strong>Motion</strong>
                  <p>Field video and channel links sit below the archive.</p>
                </div>
              </div>
            </div>
          </section>

        <Section id="about" eyebrow="About" title="Creative Work With Practical Edges">
          <div className="split-card">
            <p>
              Keith League, operating as Milsim Rooster, works across photography, video production, media projects, and hands-on software utilities. This site is a central place to collect the creative work, promote new releases, and point people toward the projects that matter most.
            </p>
          </div>
        </Section>

        <Section id="videos" eyebrow="Motion" title="Video Showcase">
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
                <h3>{video.title}</h3>
                <a className="video-link" href={video.link} target="_blank" rel="noreferrer">Open on YouTube</a>
              </article>
            ))}
          </div>
        </Section>

        <Section id="projects" eyebrow="Builds" title="Software Utilities and Web Apps">
          <div className="card-grid">
            {projects.map((project) => (
              project.href ? (
                <a className="project-card project-link-card" href={project.href} key={project.name}>
                  <span className={`project-icon ${project.icon === "FPS" ? "project-icon-reticle" : ""}`}>{project.icon}</span>
                  <span className="project-card-copy">
                    <h3>{project.name}</h3>
                    <p>{project.text}</p>
                    <strong>Open app</strong>
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

        <Section id="links" eyebrow="Links" title="External Channels">
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
