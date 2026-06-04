const navItems = ["Home", "About", "Photography", "Videos", "Projects", "Links"];

const photoCategories = [
  {
    name: "Events",
    slug: "events",
    items: [
      "/media/optimized/photography/events/00246-00-03-47-13.jpg",
      "/media/optimized/photography/events/chatgpt-image-may-8-2026-05-50-48-pm.jpg",
      "/media/optimized/photography/events/chatgpt-image-may-8-2026-05-54-24-pm.jpg",
      "/media/optimized/photography/events/img-0812.jpg",
      "/media/optimized/photography/events/img-1253.jpg",
      "/media/optimized/photography/events/img-1514.jpg",
      "/media/optimized/photography/events/img-1742.jpg",
      "/media/optimized/photography/events/img-2965.jpg",
      "/media/optimized/photography/events/img-6492.jpg",
      "/media/optimized/photography/events/img-6604.jpg",
      "/media/optimized/photography/events/img-6926-2.jpg",
      "/media/optimized/photography/events/img-6949.jpg"
    ]
  },
  {
    name: "Milsim / Airsoft",
    slug: "milsim-airsoft",
    items: [
      "/media/optimized/photography/milsim-airsoft/crossbone2s.jpg",
      "/media/optimized/photography/milsim-airsoft/goats.jpg",
      "/media/optimized/photography/milsim-airsoft/img-0633.jpg",
      "/media/optimized/photography/milsim-airsoft/img-1657.jpg",
      "/media/optimized/photography/milsim-airsoft/img-1951.jpg",
      "/media/optimized/photography/milsim-airsoft/img-7003.jpg",
      "/media/optimized/photography/milsim-airsoft/img-9072.jpg",
      "/media/optimized/photography/milsim-airsoft/jackbranch.jpg",
      "/media/optimized/photography/milsim-airsoft/report.jpg",
      "/media/optimized/photography/milsim-airsoft/vce55-sv260220-007.jpg",
      "/media/optimized/photography/milsim-airsoft/whohasmyfinger.jpg"
    ]
  },
  {
    name: "Church / Community",
    slug: "church-community",
    items: [
      "/media/optimized/photography/church-community/img-4166.jpg",
      "/media/optimized/photography/church-community/img-4170.jpg",
      "/media/optimized/photography/church-community/img-4177.jpg",
      "/media/optimized/photography/church-community/img-4182.jpg",
      "/media/optimized/photography/church-community/img-4184.jpg",
      "/media/optimized/photography/church-community/img-4187.jpg",
      "/media/optimized/photography/church-community/img-4191.jpg",
      "/media/optimized/photography/church-community/img-4194.jpg",
      "/media/optimized/photography/church-community/img-4195.jpg",
      "/media/optimized/photography/church-community/img-4196.jpg",
      "/media/optimized/photography/church-community/img-4216.jpg",
      "/media/optimized/photography/church-community/img-4217.jpg"
    ]
  },
  {
    name: "Portraits",
    slug: "portraits",
    items: [
      "/media/optimized/photography/portraits/img-9535.jpg",
      "/media/optimized/photography/portraits/img-9797.jpg"
    ]
  }
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
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Milsim Rooster home">
          <span className="brand-mark">MR</span>
          <span>Milsim Rooster</span>
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>
          ))}
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-copy">
            <p className="kicker">Photography / Video / Utilities</p>
            <h1>Milsim Rooster</h1>
            <p className="tagline">
              A tactical-media home base for photography, field footage, creative projects, and practical software built around real workflows.
            </p>
            <div className="hero-actions">
              <a href="#photography">Photography</a>
              <a href="#videos">Videos</a>
              <a href="#projects">Projects</a>
            </div>
            <h2 className="app-launcher-title">Games and Utilities</h2>
            <div className="app-launcher" aria-label="Featured app launcher">
              {featuredApps.map((app) => (
                <a className="app-launch" href={app.href} key={app.name}>
                  <span className={`app-icon ${app.icon === "FPS" ? "app-icon-reticle" : ""}`}>{app.icon}</span>
                  <span>{app.name}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="hero-visual" aria-label="Milsim Rooster visual preview">
            <img src="/media/optimized/hero/img-7003-hero.jpg" alt="Milsim Rooster hero media preview" />
            <div className="mission-card">
              <div>
                <span>01</span>
                <strong>Capture</strong>
                <p>Portraits, events, community moments, and milsim atmosphere.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Produce</strong>
                <p>Short-form video work, field edits, and promotional media.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Build</strong>
                <p>Local utilities that turn repeated desktop work into fast controls.</p>
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

        <Section id="photography" eyebrow="Gallery" title="Photography Categories">
          <div className="gallery-stack">
            {photoCategories.map((category, index) => (
              <article className="gallery-category" key={category.slug}>
                <div className="gallery-heading">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{category.name}</h3>
                </div>
                <div className="media-grid">
                  {category.items.length ? category.items.map((src) => (
                    <div className="media-tile" key={src}>
                      {src.toLowerCase().endsWith(".mp4") ? (
                        <video src={src} controls muted playsInline />
                      ) : (
                        <img src={src} alt={category.name} loading="lazy" />
                      )}
                    </div>
                  )) : (
                    <div className="media-empty">Waiting for uploads</div>
                  )}
                </div>
              </article>
            ))}
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
                {link.label}<span>↗</span>
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
  );
}

export default App;
