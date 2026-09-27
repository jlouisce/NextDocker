import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LandingPage.css'

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconBox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function LandingPage() {
  const navigate = useNavigate()
  const [origin, setOrigin] = useState('')
  const [containerType, setContainerType] = useState('all')

  function onSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (origin.trim()) params.set('origin', origin.trim())
    if (containerType !== 'all') params.set('type', containerType)
    const query = params.toString()
    navigate(query ? `/marketplace?${query}` : '/marketplace')
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <Link to="/" className="landing-logo">
          NextDocker
        </Link>

        <nav className="landing-nav" aria-label="Primary">
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/logistics">Tracking</Link>
          <Link to="/logistics">Logistics</Link>
          <Link to="/rates">Rates</Link>
        </nav>

        <div className="landing-header-actions">
          <button type="button" aria-label="Shopping cart">
            <IconCart />
          </button>
          <button type="button" aria-label="Notifications">
            <IconBell />
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <h1>Find Containers in Any Port</h1>
        <p className="landing-hero-sub">
          Global procurement simplified. Source, track, and manage industrial-grade
          shipping containers across our worldwide network with structural precision.
        </p>

        <form className="landing-search" onSubmit={onSearch}>
          <label className="landing-search-field">
            <span className="landing-search-icon">
              <IconPin />
            </span>
            <input
              type="text"
              name="origin"
              placeholder="e.g. Shanghai, Rotterdam, Los Angeles"
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              aria-label="Origin port"
            />
          </label>

          <label className="landing-search-field">
            <span className="landing-search-icon">
              <IconBox />
            </span>
            <select
              name="type"
              value={containerType}
              onChange={(event) => setContainerType(event.target.value)}
              aria-label="Container type"
            >
              <option value="all">All Types</option>
              <option value="20ft">20ft Standard</option>
              <option value="40ft">40ft High Cube</option>
              <option value="reefer">Refrigerated</option>
            </select>
          </label>

          <button type="submit" className="landing-search-cta">
            <IconSearch />
            Search Prices
          </button>
        </form>
      </section>

      <section className="landing-section landing-equipment">
        <div className="landing-section-header">
          <h2>Available Equipment</h2>
          <p>Ready for immediate deployment across key global hubs.</p>
        </div>

        <div className="equipment-grid">
          <article className="equipment-card">
            <div className="equipment-card-media">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80"
                alt="Red 20ft standard shipping container"
              />
              <span className="equipment-badge available">
                <span className="equipment-badge-dot" />
                Available
              </span>
            </div>
            <div className="equipment-card-body">
              <h3>20ft Standard</h3>
              <p>
                The industry workhorse for dry cargo, general merchandise, and
                compact intermodal moves.
              </p>
              <div className="equipment-specs">
                <span>Cap: 33.2 CBM</span>
                <span>Max: 28,200 KG</span>
              </div>
              <Link to="/containers/20ft" className="equipment-card-btn">
                View Inventory
              </Link>
            </div>
          </article>

          <article className="equipment-card">
            <div className="equipment-card-media">
              <img
                src="https://images.unsplash.com/photo-1562564055-71e051d33c19?auto=format&fit=crop&w=800&q=80"
                alt="40ft high cube container being lifted"
              />
              <span className="equipment-badge available">
                <span className="equipment-badge-dot" />
                Available
              </span>
            </div>
            <div className="equipment-card-body">
              <h3>40ft High Cube</h3>
              <p>
                Extra cubic capacity for voluminous freight without increasing
                the container footprint.
              </p>
              <div className="equipment-specs">
                <span>Cap: 76.4 CBM</span>
                <span>Max: 28,680 KG</span>
              </div>
              <Link to="/containers/40ft" className="equipment-card-btn">
                View Inventory
              </Link>
            </div>
          </article>

          <article className="equipment-card">
            <div className="equipment-card-media">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80"
                alt="White refrigerated shipping container"
              />
              <span className="equipment-badge limited">
                <span className="equipment-badge-dot" />
                Limited
              </span>
            </div>
            <div className="equipment-card-body">
              <h3>Refrigerated (Reefer)</h3>
              <p>
                Climate-controlled units for perishable cargo with precise
                temperature hold across long hauls.
              </p>
              <div className="equipment-specs">
                <span>Temp: -30°C to +30°C</span>
                <span>Power: 380/460V AC</span>
              </div>
              <Link to="/containers/20ft-refrigerated" className="equipment-card-btn">
                View Inventory
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="landing-section landing-bento">
        <div className="landing-section-header">
          <h2>Smart Logistics Optimization</h2>
          <p>Data-driven procurement for the modern supply chain.</p>
        </div>

        <div className="bento-grid">
          <article className="bento-card bento-card-large">
            <div className="bento-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="6" cy="19" r="2" />
                <circle cx="18" cy="5" r="2" />
                <path d="M8 18l8-12" />
                <path d="M7 8h.01M12 12h.01" />
              </svg>
            </div>
            <h3>Dynamic Routing &amp; Sourcing</h3>
            <p>
              Our algorithm continuously evaluates port availability, transit
              windows, and landed cost so you source the right unit from the
              nearest viable hub.
            </p>
            <span className="bento-watermark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            </span>
          </article>

          <article className="bento-card bento-card-navy">
            <div className="bento-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <h3>Grade-A Certification</h3>
            <p>
              Structural integrity testing on every listed unit — CSC plates,
              corner posts, and weatherproofing verified before it hits the
              marketplace.
            </p>
          </article>

          <article className="bento-card bento-card-small">
            <div className="bento-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3>Instant Booking</h3>
            <p>Secure API booking with confirmation in seconds, not email threads.</p>
          </article>

          <article className="bento-card bento-card-small">
            <div className="bento-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3>Market Rates</h3>
            <p>Transparent spot and contract pricing across our port network.</p>
          </article>
        </div>
      </section>

      <footer className="landing-footer">
        <Link to="/" className="landing-footer-logo">
          NextDocker
        </Link>
        <nav className="landing-footer-links" aria-label="Footer">
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms of Service</Link>
          <Link to="/marketplace">Port Network</Link>
          <Link to="/">Support</Link>
        </nav>
        <p className="landing-footer-copy">2024 NextDocker Logistics. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage
