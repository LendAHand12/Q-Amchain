import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  ShieldCheck, 
  Wallet, 
  MessageSquare, 
  Video,
} from "lucide-react";

// Import assets
import home1 from "@/assets/background/home-1.png";

// Import icons for the sections
import blockchainIcon from "@/assets/blockchain-icon.png";
import walletIcon from "@/assets/wallet-icon.png";
import communicationIcon from "@/assets/communication-icon.png";
import paymentIcon from "@/assets/payment-icon.png";
import privatyIcon	from '@/assets/privacy-icon.png';
import highIcon from '@/assets/icons/high.svg';
import speedIcon from '@/assets/icons/speed.svg';
import blockchainV2Icon from '@/assets/icons/blockchain.svg';
import home4 from "@/assets/background/home-4.png";
import home5 from "@/assets/background/home-5.png";
import home6 from "@/assets/background/home-6.png";
import home3Illustration from "@/assets/background/home-3-illustration.png";

// Helper components
const Section = ({ children, className = "", id = "" }) => (
  <section id={id} className={`w-full py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

const FeatureCard = ({ imageIcon, title, description, className = "" }) => (
  <div className={`p-8 rounded-[32px] bg-[#161719] border border-white/5 backdrop-blur-md hover:border-[#EC3535]/30 transition-all duration-500 group ${className} flex items-start gap-6 h-full relative overflow-hidden`}>
    {/* Subtle Background Glow */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC3535]/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-[#EC3535]/10 transition-colors" />

<div className="relative z-10 flex flex-col justify-center min-h-[64px]">
      <h3 className="text-2xl font-black text-white mb-2 font-['Space_Grotesk'] uppercase tracking-tight leading-none group-hover:text-[#EC3535] transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-[15px] leading-relaxed font-medium">
        {description}
      </p>
    </div>
    <div className="shrink-0 relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-[#EC3535]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <img src={imageIcon} alt="" className="w-10 h-10 object-contain" />
      </div>
    </div>
  </div>
);

const SecurityQuestionCard = ({ question, icon: Icon }) => (
  <div className="p-8 rounded-[24px] bg-[#161719] border border-white/5 flex items-center gap-6 hover:border-red-500/30 transition-all duration-500 group">
    <div className="shrink-0">
      <div className="w-12 h-12 rounded-xl bg-[#EC3535]/10 flex items-center justify-center group-hover:bg-[#EC3535]/20 transition-colors">
        <Icon className="w-6 h-6 text-[#EC3535]" />
      </div>
    </div>
    <p className="text-white text-xl font-bold font-['Space_Grotesk'] leading-snug tracking-tight">
      {question}
    </p>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#0C0B0B] text-white selection:bg-red-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Background Image - Only visible on PC/Tablet (md and up) */}
        <div 
          className="absolute inset-0 hidden md:block bg-no-repeat bg-top bg-contain z-0 pointer-events-none" 
          style={{ backgroundImage: `url(${home1})` }} 
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-12 relative z-10 lg:pr-10">
            <div className="space-y-6">
              <h1 className="text-7xl sm:text-8xl lg:text-[130px] font-black text-[#EC3535] uppercase font-['Space_Grotesk'] leading-[0.75] tracking-[-0.04em]">
                QAMCHAIN
              </h1>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-[#EC3535] uppercase tracking-[0.05em] font-['Space_Grotesk'] leading-tight">
                  Security Beyond Time
                </h2>
                <h2 className="text-xl sm:text-2xl font-bold text-[#EC3535] uppercase tracking-[0.05em] font-['Space_Grotesk'] leading-tight">
                  Designed for the World After Tomorrow
                </h2>
              </div>
            </div>
            
            <div className="space-y-5 max-w-xl text-white/90">
              <p className="text-[17px] leading-relaxed font-['Space_Grotesk']">
                A post-quantum blockchain engineered to protect assets, identity, communication, meetings, and payments—even as quantum computing changes the security rules.
              </p>
              <p className="text-[17px] leading-relaxed font-['Space_Grotesk']">
                Built by Ameritec IPS (Texas, USA) — an Intrusion Prevention System company bringing decades of cybersecurity expertise into the blockchain era.
              </p>
            </div>

            <div className="flex flex-col gap-4 max-w-[520px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button asChild size="lg" className="bg-[#EC3535] hover:bg-red-600 h-14 text-white uppercase font-bold text-xs tracking-[0.15em] rounded-lg transition-all flex items-center justify-center gap-3 group">
                  <Link to="/packages">
                    Explore QAMCHAIN <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 border-white/40 border-2 text-black uppercase font-bold text-xs tracking-[0.15em] rounded-lg transition-all flex items-center justify-center gap-3 group">
                  <Link to="/register">
                    Validator Program <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <Button asChild size="lg" className="bg-[#EC3535] hover:bg-red-600 h-14 w-full text-white uppercase font-bold text-xs tracking-[0.15em] rounded-lg transition-all flex items-center justify-center gap-3 group">
                <Link to="/register">
                  Download Whitepaper <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative lg:scale-150 lg:translate-x-24 lg:translate-y-8">
            
          </div>
        </div>
      </section>

      {/* The Wake-Up Call Section */}
      <Section className="bg-[#0C0B0B] py-32">
        <div className="max-w-6xl mx-auto space-y-24">
          <h2 className="text-5xl md:text-7xl font-black text-center text-white uppercase tracking-tighter">
            The Wake-Up Call
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SecurityQuestionCard question="Do you believe blockchain is secure?" icon={ShieldCheck} />
              <SecurityQuestionCard question="Do you believe your wallet can't be compromised?" icon={Wallet} />
              <SecurityQuestionCard question="Your communication can't be leaked?" icon={MessageSquare} />
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto">
              <div className="w-full lg:w-1/2">
                <SecurityQuestionCard question="Your private meetings are truly private?" icon={Video} />
              </div>
              <div className="w-full lg:w-1/2">
                <SecurityQuestionCard question="Your payments are safe?" icon={ShieldCheck} />
              </div>
            </div>
          </div>

          <div className="text-center space-y-10">
            <h3 className="text-2xl md:text-3xl font-black text-[#EC3535] uppercase tracking-widest">
              If your answer is yes—think again.
            </h3>
            
            <div className="space-y-1 max-w-3xl mx-auto">
              <p className="text-gray-400 text-lg font-medium tracking-wide">
                Most systems still rely on classical cryptography designed before quantum computing existed.
              </p>
              <p className="text-white text-lg font-black uppercase tracking-widest">
                QAMCHAIN is built for what comes next.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* What QAMCHAIN Secures Section */}
      <Section className="relative overflow-hidden py-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-red-600/[0.03] blur-[150px] -z-10 rounded-full"></div>
        
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-5xl md:text-6xl font-black uppercase font-['Space_Grotesk'] text-white tracking-tighter">WHAT QAMCHAIN SECURES</h2>
          <p className="text-gray-400 text-lg">One unified security foundation—across your entire digital stack:</p>
        </div>

        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              imageIcon={blockchainIcon}
              title="Blockchain" 
              description="quantum-resistant validation and network security"
            />
            <FeatureCard 
              imageIcon={walletIcon}
              title="Wallets" 
              description="protected even if recovery phrases are compromised (dual-control design)"
            />
            <FeatureCard 
              imageIcon={communicationIcon}
              title="Communication" 
              description="post-quantum encrypted calls and messages"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="w-full lg:w-1/3">
              <FeatureCard 
                imageIcon={privatyIcon}
                title="Private Meetings" 
                description="confidentiality designed to prevent reconstruction and leakage"
              />
            </div>
            <div className="w-full lg:w-1/3">
              <FeatureCard 
                imageIcon={paymentIcon}
                title="Payments" 
                description="Quantum + Biometric authorization through Q-Pay"
              />
            </div>
          </div>
        </div>

        <div className="mt-20 text-center space-y-2">
          <p className="text-gray-400 text-sm uppercase font-bold">Not separate products.</p>
          <p className="text-white text-md font-black uppercase italic">One ecosystem. One security standard.</p>
        </div>
      </Section>

      {/* Performance Section */}
      <Section className="bg-[#0C0B0B] py-32">
        <div className="max-w-6xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              PERFORMANCE THAT MATTERS
            </h2>
            <p className="text-gray-400 text-lg">
              QAMCHAIN is designed for real-world scale:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center space-y-6 group">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                <img src={highIcon} alt="" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-[#EC3535] uppercase tracking-tight">High throughput</h3>
                <p className="text-gray-400 font-medium leading-relaxed px-4 text-sm md:text-base">
                  up to 30,000 TPS in optimized benchmark conditions
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 group">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                <img src={speedIcon} alt="" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-[#EC3535] uppercase tracking-tight">Fast finality</h3>
                <p className="text-gray-400 font-medium leading-relaxed px-4 text-sm md:text-base">
                  sub-second finality targets for simple transfers under controlled conditions
                </p>
              </div>
            </div>

            <div className="text-center space-y-6 group">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                <img src={blockchainV2Icon} alt="" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-[#EC3535] uppercase tracking-tight">Scalable architecture</h3>
                <p className="text-gray-400 font-medium leading-relaxed px-4 text-sm md:text-base">
                  parallel processing designed for global demand
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Validator Revolution Section */}
      <Section className="relative overflow-hidden py-32 bg-[#0C0B0B]">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 relative z-10">
            <h2 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              THE VALIDATOR <br /> REVOLUTION
            </h2>
            
            <div className="space-y-8">
              <div className="space-y-4 text-gray-400 text-lg max-w-xl">
                <p>Traditional networks require you to run your own infrastructure, stake coins, and stop earning when you withdraw.</p>
                <p className="text-white font-bold">QAMCHAIN Validator Licenses are designed for long-term participation and network stability.</p>
              </div>
              
              <ul className="space-y-5">
                {[
                  "Validator License = the platform-issued right to validate on QAMCHAIN",
                  "VAL CERT = official proof of license ownership",
                  "Licenses are transferable and inheritable after six (6) months, subject to platform rules",
                  "Limited validator availability by tier"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="w-2 h-2 rounded-full bg-[#EC3535] mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-300 text-[15px] font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button asChild size="lg" className="bg-[#EC3535] hover:bg-red-600 h-14 px-12 text-white uppercase font-black rounded-xl transition-all group shadow-xl shadow-red-500/10">
              <Link to="/register" className="flex items-center gap-3">
                Become a Validator <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="relative min-h-[600px] lg:h-[700px] w-full mt-10 lg:mt-0 px-4 flex items-center justify-center translate-x-10">
            {/* Background Illustration */}
            <img 
              src={home4} 
              alt="Validator Network" 
              className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90 scale-125" 
            />
          </div>
        </div>
      </Section>

      {/* QB CURE Wallet Showcase */}
      <Section className="relative overflow-hidden py-32">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#EC3535]/10 blur-[150px] -z-10 rounded-full"></div>
        
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-[#EC3535]/10 blur-[100px] rounded-full scale-150"></div>
            <img 
              src={home5} 
              alt="QB CURE WALLET" 
              className="relative z-10 w-full max-w-2xl mx-auto drop-shadow-2xl scale-110"
            />
          </div>
          
          <div className="order-1 lg:order-2 space-y-12">
            <div className="space-y-4">
              <h2 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter">
                QB CURE <span className="text-[#EC3535]">WALLET</span>
              </h2>
              <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-xl">
                QB CURE is a dual-protection wallet designed for the post-quantum era.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                "Post-Quantum Cryptography",
                "Biometric Authentication"
              ].map((text, idx) => (
                <div key={idx} className="p-8 rounded-[32px] bg-[#161719] border border-white/5 flex flex-col justify-center min-h-[160px] group hover:border-[#EC3535]/30 transition-all duration-500">
                  <h4 className="text-2xl font-black text-white uppercase leading-tight tracking-tight group-hover:text-[#EC3535] transition-colors">
                    {text}
                  </h4>
                </div>
              ))}
            </div>

            <div className="space-y-8 max-w-xl">
              <p className="text-gray-400 text-lg leading-relaxed font-medium">
                Built to protect assets even in scenarios where recovery phrases are compromised, using multi-layer authorization and secure identity controls.
              </p>
              
              <Button asChild className="bg-[#EC3535] hover:bg-red-600 h-14 px-12 text-white uppercase font-black rounded-xl transition-all group shadow-xl shadow-red-500/10">
                <Link to="/register" className="flex items-center gap-3">
                  Explore QB CURE <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Product Ecosystem Section */}
      <Section className="relative overflow-hidden py-32 bg-[#0C0B0B]">
        <div className="absolute top-1/2 right-1/4 w-[800px] h-[800px] bg-[#EC3535]/5 blur-[150px] -z-10 rounded-full"></div>
        
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12 relative z-10">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                Q-PHONE • Q-MEET • Q-PAY
              </h2>
              <p className="text-lg text-gray-400 font-medium">A quantum-secure digital life:</p>
            </div>
            
            <div className="space-y-4 max-w-xl">
              {[
                { name: "Q-Phone", desc: "quantum-secure calls, texts, voice messages, and file sharing" },
                { name: "Q-Meet", desc: "private corporate meetings built for confidentiality" },
                { name: "Q-Pay", desc: "a global Quantum + Biometric payment gateway for cards and crypto" }
              ].map((p, i) => (
                <div key={i} className="flex items-center p-8 rounded-[32px] bg-[#161719] border border-white/5 group hover:border-[#EC3535]/30 transition-all duration-500">
                  <div className="w-1/3 shrink-0">
                    <h4 className="text-xl font-black text-white uppercase group-hover:text-[#EC3535] transition-colors tracking-tight">
                      {p.name}
                    </h4>
                  </div>
                  <div className="w-2/3 pl-8 border-l border-white/10">
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button asChild className="bg-[#EC3535] hover:bg-red-600 h-14 px-12 text-white uppercase font-black rounded-xl transition-all group shadow-xl shadow-red-500/10">
              <Link to="/register" className="flex items-center gap-3">
                See the Ecosystem <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          <div className="relative">
             <div className="absolute inset-0 bg-[#EC3535]/10 blur-[120px] rounded-full scale-125"></div>
             <img 
               src={home6} 
               alt="QAMCHAIN Ecosystem" 
               className="relative z-10 w-full max-w-3xl mx-auto drop-shadow-3xl animate-float-slow"
             />
          </div>
        </div>
      </Section>

      {/* Final CTA Footer */}
      <section className="relative w-full py-40 bg-[#0C0B0B] border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Column - Illustration */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="absolute inset-0 bg-[#EC3535]/10 blur-[150px] rounded-full scale-125"></div>
              <img 
                src={home3Illustration} 
                alt="QAMCHAIN Branding" 
                className="relative z-10 w-full max-w-2xl mx-auto lg:mx-0 drop-shadow-2xl"
              />
            </div>

            {/* Right Column - Statement */}
            <div className="text-center lg:text-left space-y-4 lg:pl-20 relative z-10">
              <div className="space-y-2">
                <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide">
                  QAMCHAIN isn’t here to chase trends.
                  <br className="hidden md:block" />
                  It’s here to outlast them.
                </p>
                <h2 className="text-6xl md:text-8xl font-black text-[#EC3535] uppercase tracking-tighter leading-none">
                  QAMCHAIN
                </h2>
              </div>
              
              <div className="pt-4">
                <p className="text-2xl md:text-4xl font-bold text-white leading-tight font-['Space_Grotesk']">
                  Built by Ameritec IPS <br />
                  Security Beyond Time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styles for animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
      `}} />
    </div>
  );
}
