import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';

interface LandingIntroProps {
  onGetStarted: () => void;
}

export default function LandingIntro({ onGetStarted }: LandingIntroProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: 'url(/assets/generated/ko-tt1c-hero-bg.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/branding/1770656359337.png"
            alt="Ko T T1C"
            className="w-full max-w-2xl h-auto rounded-lg shadow-2xl shadow-neon-pink/20"
          />
        </div>

        {/* Main Content Card */}
        <Card className="max-w-5xl mx-auto bg-card/90 backdrop-blur-md border-neon-pink/20 shadow-2xl shadow-neon-purple/10">
          <div className="p-8 md:p-12 space-y-8">
            {/* Title */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent leading-tight">
                Ko T T1C — The Chaos That Finally Makes Sense
              </h1>
              <Button onClick={onGetStarted} size="lg" className="gap-2 text-lg px-8 py-6 neon-glow">
                <Sparkles className="h-5 w-5" />
                Get Started
              </Button>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent" />

            {/* Introduction Letter */}
            <div className="prose prose-invert prose-lg max-w-none space-y-6 text-foreground/90">
              <h2 className="text-2xl md:text-3xl font-bold text-neon-pink">
                Subject: Strength in Numbers (and a Weakness in Yours)
              </h2>

              <p>
                Dear{' '}
                <a
                  href="https://www.louisvuitton.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-cyan hover:text-neon-pink transition-colors underline"
                >
                  Louis Vuitton
                </a>
                ,
              </p>

              <p>
                Ko T T1C — pronounced "chaotic" — is my brand built from the mess that makes sense. It stands for
                creating from whatever life throws up that day: survival turned into style, emotion stitched into
                expression. I designed it as a rebellion against being branded by others. Because being branded by some
                jackass was never my idea of a brand—so I made one of my own instead of owned.
              </p>

              <p>Now, let's talk strength in numbers—and the weak spot in yours.</p>

              <p>
                The global luxury fashion market was around $350 billion in 2023. Yet only a fraction of that comes from
                actual accessibility, because price tags climb high while entire markets stay invisible. So here's the
                question: how many people can actually afford one $5,000 bag? Flip the math—what if you let ten million
                people in the poverty sector spend just $10 each on a legitimate, simplified Louis Vuitton product?
                That's $100 million in revenue from people you pretend don't exist.
              </p>

              <p>
                You don't lose money from the knockoffs—you lose money ignoring the demand they meet. The so‑called
                "criminals" you chase are highly skilled artisans filling the gap your business model leaves open.
                They're not stealing your designs; they're proving your customers exist in larger numbers than your
                pricing allows.
              </p>

              <p className="font-semibold">Here's the challenge:</p>
              <p>
                Would you rather sell five handbags to the 1%, or five million affordable ones to the 99%?
                <br />
                Volume builds loyalty, reach, and relevance—and it's worth more than exclusivity ever could.
              </p>

              <p>
                Nobody's asking you to lose luxury; we're asking you to redefine access. Launch an official "chaos
                line"—same name, simpler material, subtle mark. Make inclusion intentional. A small dot or star beside
                your LV could turn piracy into partnership, chaos into commerce, and survival into sustainability.
              </p>

              <p>
                People will scrounge up $10 for dignity, beauty, and belonging. Don't judge that—respect it. That's real
                value. The people you criminalize could be your most loyal designers and customers if only you gave them
                a seat at the table.
              </p>

              <p>
                Because here's the truth: we don't walk around naked. We're dressed by what you refuse to
                acknowledge—the creativity you've underestimated. Strength in numbers doesn't just mean more buyers; it
                means more believers. And belief is the real luxury you can't counterfeit.
              </p>

              <p className="italic">
                With respect and a touch of chaos,
                <br />
                Your Friendly Neighborhood Fashion Realist
              </p>

              <p className="font-semibold text-neon-cyan">
                Ko T T1C — Chaotic day. Common‑sense drip. Believe in yourself when nobody's passing you the baton.
              </p>
            </div>

            <Separator className="my-8 bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />

            {/* Manifesto */}
            <div className="prose prose-invert prose-lg max-w-none space-y-6 text-foreground/90">
              <p>
                I created Ko T T1C to make a statement: "say goodbye to sacrificing love of self." Because being branded
                by some jackass was never my idea of a brand—so I decided to create one of my own instead of owned.
              </p>

              <p>
                It's pronounced <em>chaotic</em>—messy like my life and delightfully unpredictable. Whatever I throw up
                that day becomes the look. Some days it's loud, some days it's scraps, but it's always art that survived
                the week.
              </p>

              <p>
                I used to think{' '}
                <a
                  href="https://www.louisvuitton.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-cyan hover:text-neon-pink transition-colors underline"
                >
                  Louis Vuitton
                </a>{' '}
                was Louis Baton, like a relay race. Turns out, it kind of is—except the baton never quite makes it to
                our side. So, I started running my own leg. Because when nobody's passing it to you, you pass it to
                yourself.
              </p>

              <p>
                Let's be clear—we don't walk around naked. The so-called "criminals" you keep arresting? They're the
                reason the world stays dressed. They're meeting a demand you pretend doesn't exist. They're not knocking
                off your work; they're knocking down the walls you built around it. You didn't lose profit because
                someone made a fake—you lost it because you criminalized survival, creativity, and skill.
              </p>

              <Separator className="my-8 bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />

              <h2 className="text-2xl md:text-3xl font-bold text-neon-pink">
                Dear Esteemed Fashion Overlords of Prada, Gucci, Louis Vuitton
              </h2>

              <p>
                This is your love letter and your wake‑up call, wrapped in silk, stitched with sarcasm, and sealed with
                hope.
              </p>

              <p>
                We see your collections—stunning, divine, breathtaking. But let's talk real: the so‑called "knockoffs"
                are not villains. They're brilliant, underdog artisans—highly skilled, endlessly inventive—who just
                never got an invite to the haute couture table. They're serving a market your price tags ghosted long
                ago. Because let's be honest—everyday people aren't walking around in blank tees and wishful thinking.
                They want style, too. And talent doesn't come with a trust fund.
              </p>

              <p>
                Meanwhile, you keep treating these makers like fashion fugitives, chasing them with cease‑and‑desist
                letters instead of collaborations. You think you're protecting your brand, but you're just criminalizing
                the creative you depend on. You're not losing money because knockoffs exist; you're losing money because
                you refuse to admit the market they serve exists.
              </p>

              <p>
                Here's a little common‑sense drip for you: hire them. Partner with them. Don't treat them like outlaws
                when they've already mastered your language of luxury. Launch your own "official knockoff" line—same
                logo, same legacy, maybe just a subtle signature: a dot, a star, a wink—to distinguish it from the
                couture tier. Because most people can't tell the difference anyway, but having the genuine brand name
                still means everything. It doesn't damage your image, it multiplies your influence.
              </p>

              <p>
                This isn't dilution; it's inclusion. Call it a collab with reality. You'd be turning piracy into
                partnership, chaos into craftsmanship, lawsuits into loyalty. Naming it "Gucky" instead of <em>Gucci</em>{' '}
                just feels cruel. Don't mock the dreamers—empower them. The artisans you prosecute today could be your
                next creative directors tomorrow.
              </p>

              <p>
                It's kind of like <em>Vogue</em>, except I call it <em>Vogui</em>—because I'm stuck in the line right
                below the "e." As in: everyone who has money but me. Still, I make it work—with duct tape, threadbare
                fabrics, and nerve, because sometimes necessity is the purest form of design.
              </p>

              <p>
                The truth is, we're not the problem—you just don't want to admit we exist. We are the mirror you refuse
                to look at. You can't trademark struggle, but you can collaborate with it and finally be honest about
                where style really comes from.
              </p>

              <Separator className="my-8 bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />

              <div className="text-center space-y-4 py-6">
                <p className="text-xl font-semibold text-neon-cyan">
                  In the buzzing neon hum of the city that never sleeps, fashion is not just fabric—it's survival art.
                </p>
                <p>
                  The fingers behind the seams are not thieves—they're believers. People who turn scraps into statements,
                  who find texture in turmoil, who dream even when the world tells them not to. You call it counterfeit;
                  we call it proof of life.
                </p>
              </div>

              <div className="bg-gradient-to-r from-neon-pink/10 via-neon-purple/10 to-neon-cyan/10 p-6 rounded-lg border border-neon-pink/20">
                <h3 className="text-xl font-bold text-neon-pink mb-4">So here's my message from the streets to the suites:</h3>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-neon-cyan">•</span>
                    <span>Stop criminalizing the creative. Hire the hustlers. Own the chaos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-cyan">•</span>
                    <span>Make beauty that breaks down bars, not builds them.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-cyan">•</span>
                    <span>Let luxury be love, not exclusion. Let your labels lift people up, not lock them out.</span>
                  </li>
                </ul>
                <p className="mt-4 text-center font-semibold">
                  Because when fashion finally accepts the hands that built it, everyone shines.
                </p>
              </div>

              <Separator className="my-8 bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent" />

              {/* Poem */}
              <div className="italic text-center space-y-4 py-6 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent rounded-lg">
                <p>In the buzzing neon glow of a city that never sleeps,</p>
                <p>where threads of dreams entwine and secrets keep,</p>
                <p>I write this love note—one part love, two parts chaos—</p>
                <p>to Prada, Gucci, Louis, and every monarch of gloss.</p>
                <br />
                <p>Bright butterflies in gilded cages,</p>
                <p>weaving gold across privileged stages,</p>
                <p>Your runways gleam with aspiration divine,</p>
                <p>while real creators craft below the line.</p>
                <br />
                <p>They're not thieves—they're dreamers with dusty hands,</p>
                <p>piecing beauty together in forgotten lands.</p>
                <p>You call it counterfeit; they call it survival.</p>
                <p>You call it theft; I call it arrival.</p>
                <br />
                <p>Look closer: these makers are the pulse you've missed,</p>
                <p>the heartbeat under your diamond‑studded wrist.</p>
                <p>Invite them in—don't erase their name,</p>
                <p>your empire grows when you feed the flame.</p>
                <br />
                <p>Keep your label, just add a star's small gleam,</p>
                <p>for it's all the same dream, stitched into one seam.</p>
                <p>Let luxury be love made wide, not tall—</p>
                <p>a door we can all walk through and stand proud in.</p>
                <br />
                <p>When everyone gets to say, "I wear the real deal,"</p>
                <p>maybe then fashion starts to <em>feel</em> real.</p>
                <p>So here's to beauty that breaks down bars,</p>
                <p>to chaos turned couture,</p>
                <p>and to brands that finally see the humans behind the stars.</p>
              </div>

              <Separator className="my-8 bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />

              {/* Tagline */}
              <div className="text-center py-8">
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
                  Ko T T1C — Chaotic day. Common‑sense drip.
                </p>
                <p className="text-xl mt-4 text-neon-cyan">
                  Believe in yourself when nobody's passing you the baton.
                </p>
              </div>
            </div>

            <div className="text-center pt-8">
              <Button onClick={onGetStarted} size="lg" className="gap-2 text-lg px-8 py-6 neon-glow">
                <Sparkles className="h-5 w-5" />
                Start Creating
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
