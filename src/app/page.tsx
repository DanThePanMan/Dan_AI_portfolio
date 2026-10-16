"use client";

import { useState } from "react";
import ChatWidget from "./components/ChatWidget";
import LegacyPortfolio from "./components/LegacyPortfolio";

const experience = [
    { company: "Kinaxis", role: "Generative AI Developer Intern", domain: "kinaxis.com", href: "https://www.kinaxis.com/", tech: [{ name: "Python", icon: "python" }, { name: "TypeScript", icon: "typescript" }, { name: "React", icon: "react" }] },
    { company: "Nokia", role: "Incubation Developer Intern", domain: "nokia.com", href: "https://www.nokia.com/", tech: [{ name: "Python", icon: "python" }, { name: "PyTorch", icon: "pytorch" }, { name: "Hugging Face", icon: "huggingface" }, { name: "Amazon SageMaker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" }, { name: "Ollama", icon: "ollama" }] },
    { company: "Transport Canada", role: "MLOps Engineer Intern", domain: "canada.ca", href: "https://www.canada.ca/en/transport-canada.html", tech: [{ name: "Python", icon: "python" }, { name: "PyTorch", icon: "pytorch" }, { name: "Databricks", icon: "databricks" }, { name: "MLflow", icon: "mlflow" }] },
    { company: "Aedo", role: "Data Engineer Intern", domain: "aedo.com", href: "https://aedo.com/", tech: [{ name: "Python", icon: "python" }, { name: "TypeScript", icon: "typescript" }, { name: "React", icon: "react" }, { name: "Node.js", icon: "nodedotjs" }] },
];

const projects = [
    { name: "Concerto", type: "Hack the North 2026 finalist", href: "https://github.com/DanThePanMan/Concerto" },
    { name: "Dan AI Portfolio", type: "RAG powered portfolio assistant", href: "https://github.com/DanThePanMan/Dan_AI_portfolio" },
    { name: "F1 Race Podium Predictor", type: "Machine learning prediction tool", href: "https://github.com/DanThePanMan/f1-race-podium-predictor" },
    { name: "Gunpla Hub", type: "Full stack social platform", href: "https://github.com/DanThePanMan/gunpla-hub" },
];

const emailAddress = "danielchenschw@gmail.com";

function Arrow() {
    return <span aria-hidden="true">-&gt;</span>;
}

export default function Home() {
    const [showLegacy, setShowLegacy] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(emailAddress);
        } catch {
            const input = document.createElement("textarea");
            input.value = emailAddress;
            input.style.position = "fixed";
            input.style.opacity = "0";
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            input.remove();
        }

        setEmailCopied(true);
        window.setTimeout(() => setEmailCopied(false), 1800);
    };

    if (showLegacy) return <LegacyPortfolio onExit={() => setShowLegacy(false)} />;

    return (
        <main className="portfolio">
            <div className="site-shell">
                <aside className="profile-rail">
                    <div className="rail-profile">
                        <img src="/daniel-snowboarding.jpg" alt="Daniel snowboarding" />
                        <p>Daniel Chen</p>
                        <small>Software developer<br />Ottawa, Canada</small>
                    </div>
                    <div className="rail-links">
                        <button onClick={() => void copyEmail()} type="button" aria-label="Copy Daniel Chen's email address">
                            {emailCopied ? "email copied" : "email"}
                        </button>
                        <a href="https://github.com/DanThePanMan" target="_blank" rel="noreferrer">github</a>
                        <a href="https://linkedin.com/in/daniel-chen-uo/" target="_blank" rel="noreferrer">linkedin</a>
                        <a href="/daniel-chen-resume.pdf" target="_blank" rel="noreferrer">resume</a>
                        <button className="legacy-link" onClick={() => setShowLegacy(true)} type="button">view legacy site <span aria-hidden="true">↗</span></button>
                    </div>
                </aside>

                <div className="content-column">
                    <section className="opening" id="top">
                        <h1>Daniel <em>Chen</em></h1>
                        <p className="degree">Honours BSc Computer Science (Co-op) · University of Ottawa · 2028</p>
                        <p className="opening-copy">
                            Hi, I&apos;m Daniel. I&apos;m always on the lookout for new opportunities to expand my skill set and challenge myself. I am an amateur snowboarding, track day driver, keyboard nerd, and model kit builder.
                        </p>
                    </section>

                    <section className="content-section" id="experience">
                        <ol className="experience-timeline">
                            {experience.map((item) => (
                                <li key={item.company}>
                                    <a className="experience-link" href={item.href} target="_blank" rel="noreferrer" aria-label={`Visit ${item.company}`}>
                                        <img src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`} alt="" />
                                        <div><strong>{item.company}</strong><p>{item.role}</p></div>
                                        <span className="tech-icons" aria-label={`${item.company} technologies`}>
                                            {item.tech.map((tool) => <img className={tool.icon === "react" ? "tech-icon-react" : undefined} key={tool.name} src={tool.icon.startsWith("http") ? tool.icon : `https://cdn.simpleicons.org/${tool.icon}`} alt={tool.name} title={tool.name} />)}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section className="content-section" id="projects">
                        <div className="project-grid">
                            {projects.map((project) => (
                                <a href={project.href} target="_blank" rel="noreferrer" className="project-item" key={project.name}>
                                    <div><strong>{project.name}</strong><p>{project.type}</p></div>
                                    <Arrow />
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
            <ChatWidget />
        </main>
    );
}
