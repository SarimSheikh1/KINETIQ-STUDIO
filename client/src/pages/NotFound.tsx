import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
export default function NotFound() {
  return (
    <section className="section not-found">
      <span className="eyebrow">A LITTLE OFF THE GRID</span>
      <div className="error-number">
        4<span>✳</span>4
      </div>
      <h1>
        THIS IDEA
        <br />
        WENT <i>ELSEWHERE.</i>
      </h1>
      <Link to="/" className="pill">
        Back to the studio <ArrowUpRight />
      </Link>
    </section>
  );
}
