import React from "react";
import logo from "../../assets/logo.png";

const Footer = ({ onNavigate }) => {
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
            ...(window.innerWidth > 768 ? styles.row : styles.col),
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
              <div style={styles.contactItem}>
                <span>📍</span>
                <div>
                  <p style={styles.contactLabel}>Oficina Principal</p>
                  <p>Mont-ras, Girona</p>
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
