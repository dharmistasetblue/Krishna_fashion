import Link from "next/link";

export default function ManagementPage(){
  return (<>

<div className="scroll-progress" id="scrollProgress"></div>

<section className="page-title">
<div className="container">
<span>Leadership</span>
<h1>Leadership <br />Built on Experience</h1>
<p>KRISHNA FASHION is led by its Partners, whose strategic direction and hands-on involvement underpin the company's manufacturing capabilities, operational discipline and long-term growth.</p>
</div>
</section>
<section className="profile profile-one">
<div className="container profile-grid">
<div className="profile-image reveal">
<img src="/assets/images/management-1.png" alt="Mr. Himanshu Mittal" />
</div>
<div className="profile-copy reveal">
<span className="label">Partner</span>
<h2>Mr. Himanshu<br />Mittal</h2>
<p className="large">Provides strategic leadership across business development, Commercial Relationship, manufacturing growth and overall organisational direction, supporting the continued development of KRISHNA FASHION's manufacturing infrastructure.</p>
<p>His approach supports the continued development of Krishna Fashion's manufacturing infrastructure while strengthening customer relationships and long-term business partnerships.</p>
<div className="areas">
<div><b>01</b><span>Business Development</span></div>
<div><b>02</b><span>Commercial Strategy</span></div>
<div><b>03</b><span>Customer Relationships</span></div>
</div>
</div>
</div>
</section>
<section className="profile profile-two">
<div className="container profile-grid01">
<div className="profile-copy reveal">
<span className="label">Partner</span>
<h2>Mr. Keshav<br />Choudhary</h2>
<p className="large">Focused on manufacturing operations, production efficiency and quality standards, Customer Relationships building long term partnership across domestic and international markets, with a focus on strengthening KRISHNA FASHION's capabilities and market presence.</p>
<p>His operational focus contributes to strengthening Krishna Fashion's production capabilities and market presence across domestic and international markets.</p>
<div className="areas">
<div><b>01</b><span>Manufacturing Operations</span></div>
<div><b>02</b><span>Production Efficiency</span></div>
<div><b>03</b><span>Quality Standards</span></div>
</div>
</div>
<div className="profile-image reveal">
<img src="/assets/images/management-2.png" alt="Mr. Keshav Choudhary" />
</div>
</div>
</section>


<a className="whatsapp-btn" href="https://wa.me/918980982777" target="_blank" rel="noopener"><span className="whatsapp-icon"><i className="fa-brands fa-whatsapp"></i></span><span className="whatsapp-text">WhatsApp</span></a>
<button className="back-top" id="backTop"><i className="fa-solid fa-arrow-up"></i></button>



</>);
}
