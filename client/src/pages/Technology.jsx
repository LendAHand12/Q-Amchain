import techHero from "@/assets/background/tech.png";
import iconTech from "@/assets/icon-tech.png";
const TechCard = ({ title, description, children }) => (
  <div className="backdrop-blur-[5px] bg-[#181717] border-2 border-black/20 p-[30px] rounded-[8px] flex flex-col gap-6 hover:border-red-500/30 transition-all duration-300 group h-full">
    <div className="flex gap-[24px] items-start">
      <div className="shrink-0 size-[80px]">
        <img src={iconTech} alt="" className="size-full object-contain" />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-[24px] font-bold text-white tracking-[0.36px] leading-[30px] font-['Space_Grotesk']">
          {title}
        </h3>
      </div>
    </div>
    <div className="space-y-4 flex-1">
      {description && (
        <p className="text-[#E9E9E9] text-[16px] leading-[25px] font-normal font-['Space_Grotesk']">
          {description}
        </p>
      )}
      {children}
    </div>
  </div>
);

export default function Technology() {
  return (
    <div className="min-h-screen w-full bg-[#0C0B0B] text-white selection:bg-red-500">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-16 lg:pb-24 lg:pt-32 overflow-visible">
        {/* Background Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none -z-10" 
          style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}
        ></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-[#EC3535]/10 blur-[150px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#EC3535]/5 blur-[120px] -z-10 rounded-full -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <h1 className="text-7xl sm:text-8xl lg:text-[110px] font-black text-white uppercase font-['Space_Grotesk'] leading-[0.85] tracking-tight">
              TECHNOLOGY
            </h1>
            <p className="text-lg text-[#E9E9E9] max-w-lg leading-relaxed font-['Space_Grotesk']">
              QAMCHAIN is engineered with a post-quantum security mindset—replacing vulnerable assumptions with quantum-resistant primitives and modern network hardening.
            </p>
          </div>

          <div className="relative group flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-[#EC3535]/20 blur-[100px] rounded-full -z-10 group-hover:bg-[#EC3535]/30 transition-colors duration-500"></div>
            <img 
              src={techHero} 
              alt="QAMCHAIN Technology Illustration" 
              className="w-full max-w-[600px] xl:max-w-[700px] h-auto relative z-10 drop-shadow-2xl animate-float"
            />
          </div>
        </div>
      </section>

      {/* Core Technology Grid */}
      <section className="py-24 lg:py-32 relative bg-[#0C0B0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-[24px]">
            <TechCard 
              title="Post-Quantum Security Layer"
              description="QAMCHAIN adopts post-quantum cryptographic standards (lattice-based families) to protect identity, signatures, and encryption in the quantum era. Hybrid compatibility strategies can support phased migration where needed."
            />

            <TechCard 
              title="Network & Identity"
            >
              <ul className="space-y-3 text-[#E9E9E9] text-[16px] leading-[25px] list-disc list-inside marker:text-red-500 font-['Space_Grotesk']">
                <li>Secure node identity framework</li>
                <li>Encrypted peer communications</li>
                <li>Validator authentication and policy-driven participation</li>
              </ul>
            </TechCard>

            <TechCard 
              title="Consensus: Forest Protocol"
              description="A leaderless staked DAG model designed for throughput, stability, and fast finality. It allows the network to scale without compromise."
            />

            <TechCard 
              title="Virtual Machine & dApps"
              description="A smart contract execution environment designed for performance and safety, supporting real-world applications without sacrificing security."
            />
          </div>
        </div>
      </section>

      {/* Styles for float animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tech-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: tech-float 6s ease-in-out infinite; }
      `}} />
    </div>
  );
}
