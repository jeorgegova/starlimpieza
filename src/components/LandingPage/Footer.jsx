import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";

const Footer = ({ onNavigate }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = {
    footer: {
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      color: "white",
      padding: "2rem 1rem",
      fontFamily: "Arial, sans-serif",
      fontSize: "0.9rem",
    },
    container: {
      maxWidth: "1100px",
      margin: "0 auto",
    },
    top: {
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      marginBottom: "1.5rem",
    },
    brand: { flex: 1 },
    logo: { height: "60px", marginBottom: "0.8rem" },
    description: { color: "#cbd5e1", lineHeight: "1.4", maxWidth: "380px" },
    socials: { display: "flex", gap: "0.6rem", marginTop: "0.6rem" },
    socialBtn: {
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "13px",
      cursor: "pointer",
    },
    facebook: { background: "#2563eb" },
    instagram: { background: "#db2777" },

    section: { flex: 1 },
    title: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#60a5fa",
      borderBottom: "1px solid #60a5fa",
      marginBottom: "0.8rem",
      display: "inline-block",
    },
    list: { listStyle: "none", padding: 0, margin: 0 },
    listItem: { marginBottom: "0.5rem", cursor: "pointer", color: "#cbd5e1" },

    contactItem: {
      display: "flex",
      gap: "0.6rem",
      marginBottom: "0.5rem",
      color: "#cbd5e1",
      cursor: "pointer",
    },
    contactLabel: { fontWeight: "600" },
    mapThumbnailSmall: {
      width: "80px",
      height: "80px",
      borderRadius: "10px",
      overflow: "hidden",
      cursor: "pointer",
      border: "2px solid #334155",
      /* Using a more realistic map-like background image */
      background: "url('https://maps.googleapis.com/maps/api/staticmap?center=41.9089393,3.1533425&zoom=16&size=80x80&maptype=roadmap&markers=color:red%7C41.9089393,3.1533425&key=')",
      /* Fallback to a styled div if key is missing, or a high-quality placeholder */
      backgroundColor: "#1e293b",
      backgroundSize: "cover",
      backgroundPosition: "center",
      flexShrink: 0,
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },
    directionsLink: {
      color: "#60a5fa",
      fontSize: "0.8rem",
      textDecoration: "underline",
      marginTop: "0.2rem",
      display: "inline-block",
      cursor: "pointer",
    },

    nav: {
      borderTop: "1px solid #334155",
      paddingTop: "1rem",
      marginBottom: "1rem",
      textAlign: "center",
    },
    navBtns: { display: "flex", gap: "1rem", justifyContent: "center" },
    navBtn: {
      background: "none",
      border: "none",
      color: "#cbd5e1",
      fontSize: "0.85rem",
      cursor: "pointer",
    },

    copy: {
      borderTop: "1px solid #334155",
      paddingTop: "1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.6rem",
      fontSize: "0.8rem",
      color: "#94a3b8",
    },
    brandText: { color: "#60a5fa", fontWeight: "600" },
    links: { display: "flex", gap: "1rem" },
    linkBtn: {
      background: "none",
      border: "none",
      color: "#94a3b8",
      cursor: "pointer",
      fontSize: "0.8rem",
    },

    // Responsive
    row: {
      display: "flex",
      flexDirection: "row",
      gap: "2rem",
    },
    col: {
      flexDirection: "column",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Top */}
        <div
          style={{
            ...styles.top,
            ...(isMobile ? styles.col : styles.row),
          }}
        >
          {/* Marca */}
          <div style={styles.brand}>
            <img src={logo} alt="Star Limpiezas" style={styles.logo} />
            <p style={styles.description}>
              Servicios profesionales de limpieza en Girona. Tu tranquilidad es
              nuestra prioridad.
            </p>
            <div style={styles.socials}>
              <div style={{ ...styles.socialBtn, ...styles.facebook }}>f</div>
              <div style={{ ...styles.socialBtn, ...styles.instagram }}>@</div>
            </div>
          </div>

          {/* Servicios */}
          <div style={styles.section}>
            <h4 style={styles.title}>Servicios</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>Limpieza de Oficinas</li>
              <li style={styles.listItem}>Limpieza Doméstica</li>
              <li style={styles.listItem}>Limpieza Post-Obra</li>
              <li style={styles.listItem}>Limpieza Especializada</li>
            </ul>
          </div>

          {/* Contacto */}
          <div style={styles.section}>
            <h4 style={styles.title}>Contacto</h4>
            <div>
              <div
                style={{ ...styles.contactItem, alignItems: 'center' }}
                onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=Carrer+del+Carrilet+14+17253+Mont-ras+Girona+España", "_blank")}
              >
                <div
                  style={styles.mapThumbnailSmall}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05) translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1) translateY(0)"}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    zIndex: 2, cursor: 'pointer'
                  }} />
                  <iframe
                    title="Ubicación miniatura"
                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d742.3130216254883!2d3.1533424520107025!3d41.908939298115264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDU0JzMyLjIiTiAzwrAwOScxNC40IkU!5e0!3m2!1ses!2sco!4v1757478879723!5m2!1ses!2sco"
                    width="180%"
                    height="180%"
                    style={{
                      border: 0,
                      pointerEvents: 'none',
                      marginTop: '-50px',
                      marginLeft: '-45px'
                    }}
                    allowFullScreen=""
                    loading="lazy"
                  />
                </div>
                <div style={{ marginLeft: '0.2rem' }}>
                  <p style={styles.contactLabel}>Oficina Principal</p>
                  <p>Carrer del Carrilet, 14, Mont-ras</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span>📞</span>
                <div>
                  <p style={styles.contactLabel}>Teléfono</p>
                  <p>+34 643513174</p>
                </div>
              </div>
              <div style={styles.contactItem}>
                <span>✉️</span>
                <div>
                  <p style={styles.contactLabel}>Email</p>
                  <p>info@starlimpiezas.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <div style={styles.nav}>
          <div style={styles.navBtns}>
            <button style={styles.navBtn} onClick={() => onNavigate("hero")}>
              Inicio
            </button>
            <button style={styles.navBtn} onClick={() => onNavigate("services")}>
              Servicios
            </button>
            <button
              style={styles.navBtn}
              onClick={() => onNavigate("testimonials")}
            >
              Testimonios
            </button>
            <button style={styles.navBtn} onClick={() => onNavigate("contact")}>
              Contacto
            </button>
            <button style={styles.navBtn} onClick={() => onNavigate("job-modal")}>
              Trabaja con nosotros
            </button>
          </div>
        </div>

        {/* Copy */}
        <div style={styles.copy}>
          <p>
            © 2025 <span style={styles.brandText}>Star Limpiezas</span>. Todos
            los derechos reservados.
          </p>
          <div style={styles.links}>
            <button style={styles.linkBtn}>Privacidad</button>
            <button style={styles.linkBtn}>Términos</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
