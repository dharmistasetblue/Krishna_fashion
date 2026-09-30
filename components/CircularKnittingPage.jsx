import Link from "next/link";

export default function CircularKnittingPage(){
  return (<>

<div className="scroll-progress" id="scrollProgress"></div>

<section className="kf-single-product-hero">

<div className="kf-single-product-hero__bg"></div>
<div className="kf-single-product-hero__container">

<div className="kf-single-product-hero__content">
<div className="kf-single-product-hero__label">
<span></span>
                       High-Performance
                    </div>
<h1 className="kf-single-product-hero__title">Circular Knitting</h1>
<p className="kf-single-product-hero__description">
                       Advanced circular knitting technology for consistent quality, superior fabric performance, efficient production, and versatile textile applications.
                    </p>
</div>

<div className="kf-single-product-hero__visual">
<img src="/assets/images/circular_knitting01.png" alt="Circular Knitting" className="kf-single-product-hero__product" />
</div>
</div>
</section>
<section className="intro" id="about" style={{paddingBottom: "0"}}>
<div className="container">
<div className="intro-grid" data-animate="up">
<div><div className="kicker" style={{color: "var(--green)"}}>Our Capabilities</div>
<h2>Versatile Structures. Consistent Performance.</h2>
</div>
<div>
<p className="bigcopy">KRISHNA FASHION's circular knitting capabilities enable the production of a wide range of polyester-based knitted fabrics, engineered for diverse apparel and textile applications.</p>
<h3>Our manufacturing expertise encompasses fabrics with varying:</h3>
<ul>
<li>GSM and weight</li>
<li>Fabric constructions</li>
<li>Width specifications</li>
<li>Surface characteristics</li>
<li>Stretch and recovery </li>
<li>Texture and handle  </li>
<li>Functional requirements </li>
<li>Finishing specifications </li>
</ul>
</div>
</div>
</div>
</section>
<section className="management-gallery">
<div className="container">
<div className="masonry-grid">
<div className="masonry-item tall" data-lightbox="/assets/images/marquee/circular-knitting/circular/1.jpg" data-caption=""><img src="/assets/images/marquee/circular-knitting/circular/1.jpg" alt="" /></div>
<div className="masonry-item square" data-lightbox="/assets/images/marquee/circular-knitting/circular/2.jpg" data-caption=""><img src="/assets/images/marquee/circular-knitting/circular/2.jpg" alt="" /></div>
<div className="masonry-item wide" data-lightbox="/assets/images/marquee/circular-knitting/circular/3.jpg" data-caption=""><img src="/assets/images/marquee/circular-knitting/circular/3.jpg" alt="" /></div>
<div className="masonry-item tall" data-lightbox="/assets/images/marquee/circular-knitting/circular/4.jpg" data-caption=""><img src="/assets/images/marquee/circular-knitting/circular/4.jpg" alt="" /></div>
<div className="masonry-item wide" data-lightbox="/assets/images/marquee/circular-knitting/circular/5.jpg" data-caption=""><img src="/assets/images/marquee/circular-knitting/circular/5.jpg" alt="" /></div>
<div className="masonry-item square" data-lightbox="/assets/images/marquee/circular-knitting/circular/6.jpg" data-caption=""><img src="/assets/images/marquee/circular-knitting/circular/6.jpg" alt="" /></div>
</div>
</div>
</section>

<section className="product-apps">
<div className="container">
<div className="section-head">
<div>
<div className="kicker green">END USE</div>
<h2>For Evolving Applications</h2>
<p>KRISHNA FASHION manufactures polyester-based knitted fabrics for a diverse range of applications, including:</p>
</div>
</div>

<div className="app-grid">
<article>
<img src="/assets/images/application/1-sportswear.jpg" />
<h3>Sportswear</h3>
</article>
<article>
<img src="/assets/images/application/2-activewear.jpg" />
<h3>Activewear</h3>
</article>
<article>
<img src="/assets/images/application/3-athleisure.jpg" />
<h3>Athleisure</h3>
</article>
<article>
<img src="/assets/images/application/4-fashion-apparel.jpg" />
<h3>Fashion Apparel</h3>
</article>
<article>
<img src="/assets/images/application/5-Innerwear.jpg" />
<h3>Innerwear</h3>
</article>
<article>
<img src="/assets/images/application/6-loungewear.jpg" />
<h3>Loungewear</h3>
</article>
<article>
<img src="/assets/images/application/7-performance-apparel.jpg" />
<h3>Performance Apparel</h3>
</article>
<article>
<img src="/assets/images/application/8-home-textile-applications.jpg" />
<h3>Home Textile Applications</h3>
</article>
<article>
<img src="/assets/images/application/9-specialised-textile-applications.jpg" />
<h3>Specialised Textile Applications</h3>
</article>
</div>

<p className="applications-text">Our manufacturing flexibility allows us to adapt fabric construction and specifications according to the intended end use.</p>
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
