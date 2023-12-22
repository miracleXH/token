export default function StickyContainer({ children, className }) {
  return <div className={`relative sticky mt-16 ${className}`}>{children}</div>;
}
