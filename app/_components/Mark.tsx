export default function Mark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return <span className={`falcon-mark ${tone}`} aria-hidden="true" />;
}
