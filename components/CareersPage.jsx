import Link from "next/link";

export default function CareersPage(){
  return (<>

<div className="scroll-progress" id="scrollProgress"></div>

<section className="page-title">
<div className="container">
<span>career</span>
<h1>Build your career where <br />manufacturing moves forward.</h1>
<p>
                    Join a textile organisation focused on learning, responsibility, teamwork and long-term growth.
                </p>
</div>
</section>


<section className="career-full-w">
<div className="container career-grid">
<article>
<span>01</span>
<h3>Learning</h3>
<p>Training and guidance to strengthen professional capability.</p>
</article>
<article>
<span>02</span>
<h3>Ownership</h3>
<p>A culture that encourages responsibility and initiative.</p>
</article>
<article>
<span>03</span>
<h3>Collaboration</h3>
<p>Teams working together across manufacturing and business functions.</p>
</article>
<article>
<span>04</span>
<h3>Growth</h3>
<p>Opportunities for personal development and long-term contribution.</p>
</article>
</div>
</section>
<section className="enquiry" id="form">
<div className="container enquiry-grid">
<div>
<div className="kicker" style={{color: "#2c9242"}}>Opportunities</div>
<h2>We are always interested<br /></h2>
<p>
                       Share your profile for opportunities across Production & Operations, Quality, Technical, Sales,
                        Customer Relations, Administration and Support functions.
                    </p>
</div>
<form>
<label>Your Name<input type="text" placeholder="Enter your name" /></label>
<div className="two">
<label>Email Address<input type="email" placeholder="name@company.com" /></label><label>Phone Number<input type="tel" placeholder="+91" /></label>
</div>
<label>Area of Interest<select>
<option>Production & Operations</option>
<option>Quality</option>
<option>Technical</option>
<option>Sales & Customer Relations</option>
<option>Administration</option>
</select></label><label>Your Message<textarea rows="5" placeholder="Tell us about your experience..."></textarea></label><button type="button">SUBMIT <span>↗</span></button>
</form>
</div>
</section>
<section className="inner-cta">
<div className="container career-box-warp" data-animate="up">
<h2>We're Always Hiring Great Talent</h2>
<p>The openings above aren't the only opportunities at KRISHNA FASHION. If you believe your skills can make an impact, we'd love to hear from you. Send us your resume, and we'll contact you when a suitable position becomes available.</p>
<a href="mailto:info@krishnafashion.co" className="btn btn-dark">APPLY NOW<span>↗</span></a>
</div>
</section>

<a className="whatsapp-btn" href="https://wa.me/918980982777" target="_blank" rel="noopener"><span className="whatsapp-icon"><i className="fa-brands fa-whatsapp"></i></span><span className="whatsapp-text">WhatsApp</span></a>
<button className="back-top" id="backTop"><i className="fa-solid fa-arrow-up"></i></button>


</>);
}
