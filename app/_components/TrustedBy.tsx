const companies = [
  "Northwind",
  "BloomFast",
  "Acorn Labs",
  "Sherlock AI",
  "Vega Systems",
  "Thatch Co",
];

export default function TrustedBy() {
  return (
    <section
      style={{
        width: "100%",
        borderTop: "1px solid #E8E0D3",
        borderBottom: "1px solid #E8E0D3",
        paddingTop: 28,
        paddingBottom: 28,
        paddingLeft: "var(--pad)",
        paddingRight: "var(--pad)",
        backgroundColor: "var(--color-cream)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          marginBottom: 20,
          marginTop: 0,
        }}
      >
        TRUSTED BY TEAMS SHIPPING AT
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        {companies.map((name) => (
          <span
            key={name}
            style={{
              fontFamily: "var(--font-nav)",
              fontSize: 15,
              fontWeight: 700,
              color: "#aaa",
              letterSpacing: "0.02em",
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
