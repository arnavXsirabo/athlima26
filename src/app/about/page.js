import { EVENT_DATA } from "@/data/event";
import Image from "next/image";

export const metadata = {
  title: 'About | ATHLIMA 2026',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bone text-ink pt-32 pb-24 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-multiply" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">

          <div className="md:col-span-6 flex flex-col justify-center">
            <div className="inline-block mb-6">
              <span className="text-xs font-bold tracking-widest text-accent uppercase flex items-center gap-4">
                <div className="w-8 h-px bg-accent" />
                The Story
              </span>
            </div>

            <h1 className="font-display text-fluid-h1 uppercase leading-none tracking-tight mb-12">
              ABOUT <br /> ATHLIMA
            </h1>

            <p className="text-xl md:text-2xl font-medium leading-relaxed text-ink/80 mb-6">
              Athlima is the annual sports fest of Sikkim Manipal Institute of Technology and one of the most energetic and unifying events of the academic year.
            </p>

            <p className="text-lg leading-relaxed text-ink/70 font-medium mb-10">
              It celebrates team spirit, endurance, discipline, and passion for sports, bringing together athletes from various colleges to compete and excel in a wide range of sporting events. More than a tournament, Athlima is a testament to the unyielding spirit and the energy of youth.
            </p>

          </div>

          <div className="md:col-span-6">
            <div className="relative aspect-[4/3] md:aspect-video lg:aspect-[16/10] bg-ink/5 overflow-hidden">
              <video
                src="/sports/video.mp4"
                className="object-cover w-full h-full scale-105 absolute inset-0"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-ink/10 mix-blend-overlay"></div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
