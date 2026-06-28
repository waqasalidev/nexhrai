const logos = ["Google", "Microsoft", "Amazon", "Adobe", "Spotify", "Airbnb", "Netflix", "Linear", "Notion", "Stripe"];
export function Marquee() {
    return (<section className="py-12 border-y border-white/5">
      <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Trusted by leading companies</p>
      <div className="relative overflow-hidden mask-fade">
        <div className="flex gap-16 animate-marquee w-max">
          {[...logos, ...logos].map((l, i) => (<div key={i} className="text-2xl font-semibold text-muted-foreground/60 hover:text-foreground transition-colors whitespace-nowrap">
              {l}
            </div>))}
        </div>
      </div>
      <style>{`.mask-fade{-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);}`}</style>
    </section>);
}
