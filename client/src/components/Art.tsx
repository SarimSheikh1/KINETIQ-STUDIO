export default function Art({
  project,
  className = "",
}: {
  project: any;
  className?: string;
}) {
  return (
    <div
      className={"project-art " + project.slug + " " + className}
      style={{ background: project.color }}
    >
      <img
        src={project.media?.[0] || "/images/monoform.svg"}
        alt={`${project.title} original concept artwork`}
        loading="lazy"
      />
      <span className="art-tag">KINETIQ / CONCEPT SERIES</span>
    </div>
  );
}
