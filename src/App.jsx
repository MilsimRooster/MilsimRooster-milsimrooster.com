const navItems = ["Home", "About", "Photography", "Videos", "Projects", "Contact", "Links"];

const photoCategories = [
  "Portraits",
  "Events",
  "Milsim / Airsoft",
  "Church / Community"
];

const projects = [
  {
    name: "Command Center",
    text: "A compact Windows workflow hub for launching tools, opening folders, checking status, and keeping daily actions close."
  },
  {
    name: "System Gauges",
    text: "A desktop monitoring utility focused on quick system visibility, clean controls, and lightweight performance."
  },
  {
    name: "Pomodoro Timer",
    text: "A polished timer shell with media playback, visual backgrounds, and focused work-session controls."
  }
];

const links = ["Photography Portfolio", "Video Channel", "Project Updates", "GitHub"];

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
              <a href="#contact">Contact</a>
            </div>
          </div>
          <div className="mission-card" aria-label="Site overview">
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
        </section>

        <Section id="about" eyebrow="About" title="Creative Work With Practical Edges">
          <div className="split-card">
            <p>
              Keith League, operating as Milsim Rooster, works across photography, video production, media projects, and hands-on software utilities. This site is a central place to collect the creative work, promote new releases, and point people toward the projects that matter most.
            </p>
            <p>
              The current content is intentionally structured for expansion: galleries, video embeds, project writeups, external links, and contact details can grow without changing the core layout.
            </p>
          </div>
        </Section>

        <Section id="photography" eyebrow="Gallery" title="Photography Categories">
          <div className="card-grid photo-grid">
            {photoCategories.map((category, index) => (
              <article className="photo-card" key={category}>
                <div className="photo-texture" />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{category}</h3>
                <p>Placeholder gallery lane ready for selected images and captions.</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="videos" eyebrow="Motion" title="Video Showcase">
          <div className="card-grid">
            {[1, 2, 3].map((item) => (
              <article className="video-card" key={item}>
                <div className="play-symbol">▶</div>
                <h3>Featured Video Slot {item}</h3>
                <p>Embed a reel, walkthrough, project demo, or short promotional cut here.</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="projects" eyebrow="Builds" title="Software Utilities">
          <div className="card-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.name}>
                <h3>{project.name}</h3>
                <p>{project.text}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Start A Conversation">
          <div className="contact-panel">
            <p>
              For photography, media work, project questions, or collaboration, use this section for preferred contact details.
            </p>
            <a href="mailto:contact@milsimrooster.com">contact@milsimrooster.com</a>
          </div>
        </Section>

        <Section id="links" eyebrow="Links" title="External Channels">
          <div className="links-list">
            {links.map((link) => (
              <a href="#" key={link}>{link}<span>↗</span></a>
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
