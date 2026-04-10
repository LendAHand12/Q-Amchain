import { Target } from "lucide-react";
import aboutHero from "@/assets/background/home-3-illustration.png";
import roadmapBg from "@/assets/background/aff-2.png";
const RoadmapStage = ({ stage, year, description }) => (
  <div className="flex flex-col gap-4 max-w-[140px] group">
    <span className="bg-gradient-to-r from-[#BF1727] to-[#E8494F] bg-clip-text text-transparent font-semibold uppercase tracking-wider text-sm">
      Stage {stage}
    </span>
    <div className="space-y-4 text-white">
      <h3 className="text-4xl font-bold font-['Barlow'] tracking-tight">
        {year}
      </h3>
      <p className="text-[#E9E9E9] text-base leading-relaxed font-['Barlow'] opacity-80 group-hover:opacity-100 transition-opacity">
        {description}
      </p>
    </div>
  </div>
);

export default function About() {
  return (
    <div className="min-h-screen w-full bg-[#0C0B0B] text-white selection:bg-red-500 font-['Space_Grotesk']">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-16 lg:pt-32 lg:pb-0 overflow-visible">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none -z-10" 
          style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}
        ></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-[#EC3535]/10 blur-[150px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-[-302px] w-[1060px] h-[847px] opacity-30 mix-blend-screen -z-10">
           {/* Decorative light effect area */}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <h1 className="text-7xl sm:text-8xl lg:text-[100px] font-black text-white uppercase leading-[0.85] tracking-tight">
              About <br /> QAmCHAIN
            </h1>
          </div>

          <div className="relative group">
            <div className="absolute inset-x-0 bottom-0 top-10 bg-[#EC3535]/10 blur-[120px] rounded-full -z-10"></div>
            <img 
              src={aboutHero} 
              alt="QAMCHAIN About Illustration" 
              className="w-full max-w-[700px] h-auto relative z-10 drop-shadow-2xl animate-float"
            />
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 relative bg-[#0C0B0B] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section
            className="relative h-[10vh] lg:h-[30vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${roadmapBg})`,
              backgroundPosition: "center 0%",
            }}
          >
            <div className="relative z-10 container px-0 mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center leading-tight">
                <div>ROADMAP</div>
              </h1>
            </div>
          </section>

          <div className="backdrop-blur-[10px] bg-white/5 border border-red-500/20 rounded-[20px] p-8 lg:p-12 overflow-x-auto no-scrollbar">
            <div className="flex gap-12 lg:gap-16 min-w-max h-full items-start py-4">
              <RoadmapStage 
                stage="1" 
                year="2026" 
                description="QAMCHAIN evolution, Q-AMC / Q-HEWE transition framework, validator expansion" 
              />
              <div className="w-px h-64 bg-gradient-to-b from-transparent via-red-500/50 to-transparent shrink-0"></div>
              <RoadmapStage 
                stage="2" 
                year="2026" 
                description="QB CURE wallet launch" 
              />
              <div className="w-px h-64 bg-gradient-to-b from-transparent via-red-500/50 to-transparent shrink-0"></div>
              <RoadmapStage 
                stage="3" 
                year="2027" 
                description="Q-Phone launch" 
              />
              <div className="w-px h-64 bg-gradient-to-b from-transparent via-red-500/50 to-transparent shrink-0"></div>
              <RoadmapStage 
                stage="4" 
                year="2027" 
                description="Q-Meet launch" 
              />
              <div className="w-px h-64 bg-gradient-to-b from-transparent via-red-500/50 to-transparent shrink-0"></div>
              <RoadmapStage 
                stage="5" 
                year="2027" 
                description="Q-Pay global gateway rollout" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ameritec IPS Section */}
      <section className="py-24 relative bg-[#0C0B0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-8">
                <h2 className="text-6xl font-bold text-white uppercase tracking-tight leading-tight">
                    Built by <br /> <span className="text-red-500">Ameritec IPS</span>
                </h2>
                <div className="space-y-6 text-[#E9E9E9] text-lg opacity-90">
                    <p>Ameritec IPS is an Intrusion Prevention System company organized under the laws of the State of Texas, USA.</p>
                    <p>Ameritec IPS brings cybersecurity discipline—threat modeling, resilience engineering, and defense-in-depth—into the next generation of blockchain infrastructure.</p>
                </div>
            </div>

            <div className="lg:w-1/2 w-full flex flex-col items-center">
                <div className="relative group w-full max-w-md">
                     <div className="absolute inset-0 bg-red-500/10 blur-[100px] rounded-full -z-10"></div>
                     <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-12 rounded-[40px] text-center space-y-8">
                        <div className="inline-flex size-20 rounded-3xl bg-red-500/20 items-center justify-center mb-4">
                            <Target className="size-10 text-red-500" />
                        </div>
                        <h4 className="text-4xl font-bold text-red-500 uppercase tracking-wide">Mission</h4>
                        <p className="text-2xl text-[#F2F2F2] font-semibold leading-snug">
                            Build security that survives the future.
                        </p>
                     </div>
                </div>
            </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ab-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: ab-float 6s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
