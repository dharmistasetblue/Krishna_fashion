import Link from "next/link";

export default function SustainabilityPage(){
  return (<>

<div className="scroll-progress" id="scrollProgress"></div>

<section className="page-title">
<div className="container">
<span>Sustainability</span>
<h1>Sustainable by Design</h1>
<p>
                    At Krishna Fashion, sustainability is an integral part of our manufacturing philosophy. We are
                    committed to reducing our environmental footprint by investing in renewable energy, improving energy
                    efficiency and progressively transitioning towards cleaner sources of power.
                </p>
</div>
</section>
<section className="sustain-full">
<div className="container" data-animate="up">
<p>Our renewable energy infrastructure comprises:</p>
</div>
<div className="container sustain-grid">
<article data-animate="up">
<i className="fa-solid fa-solar-panel"></i>
<h3>2.10 MW Ground-Mounted Solar Power Project –</h3>
<p>a dedicated solar installation supporting our long-term transition towards renewable energy.</p>
</article>
<article data-animate="up">
<i className="fa-solid fa-bolt"></i>
<h3>0.70 MW Rooftop Solar Power Plant –</h3>
<p>
                        utilising available rooftop space to generate clean electricity directly from our manufacturing
                        facilities.
                    </p>
</article>
<article data-animate="up">
<i className="fa-solid fa-recycle"></i>
<h3>2.10 MW Wind Power Project –</h3>
<p>
                        adding wind energy to our renewable energy portfolio and strengthening our commitment to a
                        diversified clean-energy mix.
                    </p>
</article>
</div>
</section>
<section className="feature" id="infra">
<div className="feature-grid">
<div className="feature-copy" data-animate="right">
<h2>Powering Manufacturing with Renewable Energy</h2>
<p>
                        With a combined renewable energy capacity of 4.90 MW across solar and wind, we are taking tangible steps towards reducing our dependence on conventional energy sources and lowering the carbon intensity of our operations.
                    </p>
<p>
                        Our approach is focused on responsible manufacturing, efficient resource utilisation and long-term environmental stewardship. By integrating renewable energy into our operations, we aim to build a more resilient and sustainable manufacturing ecosystem while continuing to deliver consistent quality and performance to our customers.
                    </p>
</div>
<div className="feature-media"><img className="w-100" src="/assets/images/sustainability01.jpg" /></div>
</div>
</section>
<section className="feature" id="infra">
<div className="feature-grid div-reverse-mobile">
<div className="feature-media"><img className="w-100" src="/assets/images/sustainability02.jpg" /></div>
<div className="feature-copy" data-animate="right">
<h2>Our Commitment</h2>
<p>
                        Cleaner Energy. Responsible Manufacturing. Sustainable Growth.
                    </p>
<p>
                        We believe that sustainability is not simply a destination—it is an ongoing commitment to making better choices across our operations and building a more responsible future for the textile industry.
                    </p>
</div>
</div>
</section>

<a className="whatsapp-btn" href="https://wa.me/918980982777" target="_blank" rel="noopener"><span className="whatsapp-icon"><i className="fa-brands fa-whatsapp"></i></span><span className="whatsapp-text">WhatsApp</span></a>
<button className="back-top" id="backTop"><i className="fa-solid fa-arrow-up"></i></button>


</>);
}
