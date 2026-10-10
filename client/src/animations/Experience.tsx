import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger);
export function MotionSystem() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".page-enter", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .forEach((el) =>
          gsap.from(el, {
            y: 55,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%" },
          }),
        );
      gsap.utils
        .toArray<HTMLElement>(".project-art")
        .forEach((el) =>
          gsap.fromTo(
            el.querySelector("img"),
            { scale: 1.12 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          ),
        );
      gsap.to(".progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: true },
      });
      const philosophy = document.querySelector(".philosophy");
      if (philosophy && innerWidth > 800) {
        gsap.to(".future-word", {
          opacity: 0.15,
          x: -60,
          scrollTrigger: {
            trigger: philosophy,
            start: "top 30%",
            end: "bottom 50%",
            scrub: true,
          },
        });
        gsap.from(".design-word", {
          scale: 0.7,
          opacity: 0,
          scrollTrigger: {
            trigger: philosophy,
            start: "top 40%",
            end: "bottom 80%",
            scrub: true,
          },
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        const value = { n: 0 };
        gsap.to(value, {
          n: Number(el.dataset.counter),
          roundProps: "n",
          duration: 1.7,
          onUpdate: () => {
            el.textContent = String(value.n);
          },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    });
    return () => ctx.revert();
  }, [pathname]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.05, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      !matchMedia("(pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const el = ref.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.3 }),
      y = gsap.quickTo(el, "y", { duration: 0.3 });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.style.opacity = "1";
      const target = (e.target as HTMLElement).closest(
        "[data-cursor],a,button",
      );
      el.dataset.active = target ? "true" : "false";
      el.textContent = target?.getAttribute("data-cursor") || "";
    };
    document.addEventListener("pointermove", move);
    return () => {
      document.removeEventListener("pointermove", move);
      gsap.killTweensOf(el);
    };
  }, []);
  return <div className="cursor" ref={ref} aria-hidden="true" />;
}
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.remove();
        return;
      }
      ctx = gsap.context(() => {
        gsap
          .timeline()
          .from(".intro span", {
            y: 100,
            opacity: 0,
            stagger: 0.035,
            duration: 0.45,
          })
          .to(".intro-mark", { scale: 1.1, duration: 0.2 })
          .to(el, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.6,
            ease: "power4.inOut",
            onComplete: () => {
              el.style.display = "none";
            },
          });
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);
  return (
    <div className="intro" ref={ref} aria-hidden="true">
      <div className="intro-mark">
        {"KINETIQ".split("").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <small>IDEAS IN MOTION / STUDIO LOADED</small>
    </div>
  );
}
