import Link from "next/link";

export default function AboutUsPage(){
  return (<>

<div className="scroll-progress" id="scrollProgress"></div>

<section className="inner-hero only-about-text" style={{backgroundImage: "url(assets/images/about-us.jpg)"}}>
<div className="inner-hero-overlay"></div>
<div className="container inner-hero-content" data-animate="up">
<div className="kicker">Who We Are</div>
<h1 style={{color: "#3f953d", textShadow: "none"}}>About <br />Krishna Fashion</h1>
<p style={{textShadow: "none"}}>A Surat-based textile manufacturing enterprise focused on
          polyester-based circular and warp knitted fabrics.</p>
</div>
</section>
<section className="numbers-dark"><div className="container inner-stats">
<div><strong>400+</strong><span>Knitting Machines</span></div>
<div><strong>~70 MT</strong><span>Daily Capacity</span></div>
<div><strong>CIRCULAR & WARP</strong><span>Knitting Locations</span></div>
</div></section>
<section className="inner-section" style={{paddingBottom: "0px"}}><div className="container">
<div data-animate="up">
<h2 className="text-green big-text">Manufacturing Excellence. <br />Built on Experience. Driven by Innovation.</h2>
<p className="inner-lead">Established in 2014, KRISHNA FASHION is a professionally driven textile manufacturing enterprise based in Surat, Gujarat, India, specialising in the production of high-quality polyester-based circular knitted and warp knitted fabrics.</p>
<p className="gen-text">As a part of the Mittal Group, KRISHNA FASHION is supported by a textile legacy that dates back to 2004. Over the years, the Group has developed extensive experience across textile manufacturing and markets, building a strong foundation of technical expertise, manufacturing discipline and industry insight.</p>
</div>
</div>
</section>
<section className="inner-section"><div className="container mv-grid"><article data-animate="left"><span>01</span>
<h3>Our Vision</h3>
<p>To establish KRISHNA FASHION as a trusted global textile manufacturing partner, recognised for manufacturing excellence, technical capability, consistent quality and dependable supply.</p>
</article>
<article data-animate="right"><span>02</span><h3>Our Mission</h3>
<p>To manufacture high-quality knitted textile solutions through advanced infrastructure, disciplined processes and continuous innovation, while creating enduring value for customers and partners worldwide.</p>
</article>
</div>
</section>
<section className="feature" id="infra">
<div className="feature-grid">
<div className="feature-copy" data-animate="right">
<div className="kicker" style={{color: "#2c9242"}}>High-Volume Infrastructure</div>
<h2>Our Manufacturing Strength</h2>
<p>With an infrastructure of approximately 400 knitting machines and an aggregate production capacity of nearly 70 tonnes per day, KRISHNA FASHION operates with the scale and flexibility required to meet diverse and demanding fabric requirements.</p>
<p>Our manufacturing facilities are strategically located in Gujarat and are designed to support large-volume as well as customised production programmes. Through disciplined processes, modern manufacturing practices and continuous operational improvement, we focus on delivering consistent quality across every stage of production.</p>
</div>
<div className="feature-media"><img className="w-100" src="/assets/images/manufacturing_strength.jpg" /></div>
</div>
</section>
<section className="feature" id="infra">
<div className="feature-grid">
<div className="feature-media"><img className="w-100" src="/assets/images/our_approach.jpg" /></div>
<div className="feature-copy" data-animate="right">
<div className="kicker" style={{color: "#2c9242"}}>Process-First Manufacturing</div>
<h2>Our Approach</h2>
<p>At KRISHNA FASHION, we believe that manufacturing excellence is built on three fundamental principles: consistency, capability and continuous improvement.</p>
<p>Our approach combines extensive industry experience with modern production practices to create fabrics that meet demanding requirements across performance, appearance, quality, consistency and application versatility.</p>
<p>We continuously strengthen our manufacturing capabilities to respond to changing market requirements and the evolving needs of our customers across domestic and international markets.</p>
</div>
</div>
</section>
<section className="inner-section commitment-box" style={{paddingTop: "0"}}>
<div><img className="w-100" src="/assets/images/commitment.jpg" /></div>
<div className="container page-signature">
<article className="sig-card" data-animate="left">
<h3>Our journey is built on the experience of the past and the possibilities of the future.</h3>
<p>With the strength of the Mittal Group’s textile experience, the scale of our manufacturing infrastructure and a commitment to continual advancement, KRISHNA FASHION strives to be a dependable manufacturing partner for quality-driven textile businesses worldwide.
With experience behind us and innovation ahead, we deliver fabric with precision, consistency and scale.</p>
</article>
<article className="sig-card" data-animate="right">
<h3>To Manufacture Better. <br />To Deliver Consistently. To Grow Together.</h3>
<p>Our commitment extends beyond the fabric it self.</p>
<p>We aim to create long-term value through dependable manufacturing, responsive service, technical collaboration and continuous improvement.</p>
<p>As textile markets become increasingly competitive and supply chains increasingly sophisticated, KRISHNA FASHION remains focused on strengthening the capabilities that matter most to customers — quality, scale, flexibility and reliability.</p>
</article>
</div>
</section>


<a className="whatsapp-btn" href="https://wa.me/918980982777" target="_blank" rel="noopener"><span className="whatsapp-icon"><i className="fa-brands fa-whatsapp"></i></span><span className="whatsapp-text">WhatsApp</span></a>
<button className="back-top" id="backTop"><i className="fa-solid fa-arrow-up"></i></button>


</>);
}
