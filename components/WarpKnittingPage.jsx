import Link from "next/link";

export default function WarpKnittingPage(){
  return (<>

<div className="scroll-progress" id="scrollProgress"></div>

<section className="kf-single-product-hero">

<div className="kf-single-product-hero__bg"></div>
<div className="kf-single-product-hero__container">

<div className="kf-single-product-hero__content">
<div className="kf-single-product-hero__label">
<span></span>
                       Next-Gen Technology
                    </div>
<h1 className="kf-single-product-hero__title">Warp Knitting</h1>
<p className="kf-single-product-hero__description">
                       Advanced technology and precision-driven processes enable us to produce high-quality fabrics with consistent results, improved efficiency, and greater versatility.
                    </p>
</div>

<div className="kf-single-product-hero__visual">
<img src="/assets/images/warp_knitting01.png" alt="Circular Knitting" className="kf-single-product-hero__product" />
</div>
</div>
</section>
<section className="intro" style={{paddingBottom: "0px"}}>
<div className="container">
<div className="intro-grid" data-animate="up">
<div><div className="kicker" style={{color: "var(--green)"}}>Our Capabilities</div>
<h2>Technical Construction. Enhanced Stability.</h2>
</div>
<div>
<p className="bigcopy">Our warp knitting capabilities complement our circular knitting operations, allowing KRISHNA FASHION to manufacture fabrics with distinctive structural and performance characteristics.</p>
<p>Warp knitted fabrics can provide specific advantages in applications where dimensional stability, construction integrity, surface aesthetics and technical performance are critical.</p>
<p>The combination of circular and warp knitting gives KRISHNA FASHION a broader manufacturing portfolio and greater flexibility in responding to customer requirements.</p>
</div>
</div>
</div>
</section>
<section className="management-gallery">
<div className="container">
<div className="masonry-grid">
<div className="masonry-item tall" data-lightbox="/assets/images/marquee/warp-knitting/warp/1.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/1.jpg" alt="" /></div>
<div className="masonry-item square" data-lightbox="/assets/images/marquee/warp-knitting/warp/2.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/2.jpg" alt="" /></div>
<div className="masonry-item wide" data-lightbox="/assets/images/marquee/warp-knitting/warp/3.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/3.jpg" alt="" /></div>
<div className="masonry-item tall" data-lightbox="/assets/images/marquee/warp-knitting/warp/4.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/4.jpg" alt="" /></div>
<div className="masonry-item wide" data-lightbox="/assets/images/marquee/warp-knitting/warp/5.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/5.jpg" alt="" /></div>
<div className="masonry-item square" data-lightbox="/assets/images/marquee/warp-knitting/warp/6.jpg" data-caption=""><img src="/assets/images/marquee/warp-knitting/warp/6.jpg" alt="" /></div>
</div>
</div>
</section>
<section className="enquiry" id="form">
<div className="container enquiry-grid">
<div>
<div className="kicker" style={{color: "#2c9242"}}>Start a Conversation</div>
<h2>To manufacture better. To grow together.</h2>
<p>
                        Share your requirement and contact details. Our team can connect with you regarding products,
                        manufacturing capabilities or business enquiries.
                    </p>
</div>
<form>
<label>Your Name<input type="text" placeholder="Enter your name" /></label>
<div className="two">
<label>Email Address<input type="email" placeholder="name@company.com" /></label><label>Phone Number<input type="tel" placeholder="+91" /></label>
</div>
<label>Inquiry Type<select>
<option>Select inquiry type</option>
<option>Product Inquiry</option>
<option>Manufacturing Inquiry</option>
<option>Business Inquiry</option>
<option>Career</option>
<option>Other</option>
</select></label><label>Your Message<textarea rows="5" placeholder="Tell us about your requirement..."></textarea></label><button type="button">SEND ENQUIRY <span>↗</span></button>
</form>
</div>
</section>

<a className="whatsapp-btn" href="https://wa.me/918980982777" target="_blank" rel="noopener"><span className="whatsapp-icon"><i className="fa-brands fa-whatsapp"></i></span><span className="whatsapp-text">WhatsApp</span></a>
<button className="back-top" id="backTop"><i className="fa-solid fa-arrow-up"></i></button>


</>);
}
