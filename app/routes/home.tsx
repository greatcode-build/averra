import { Navbar } from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import { ResumeCard } from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Averra" },
    {
      name: "description",
      content:
        "AI-powered resume analysis that helps job seekers optimize their CVs and stand out to recruiters.",
    },
  ];
}
export function links() {
  return [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/icons/averra-icon.svg",
    },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  return (
    <main className="bg-[url('/images/bg-main.png')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Applications & Resume Scores</h1>
          <h2>Review your submissions and explore AI-powered insights</h2>
        </div>
        {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
