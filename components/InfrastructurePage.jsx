import Link from "next/link";

export default function InfrastructurePage() {
    return (
        <>

            <div className="scroll-progress" id="scrollProgress"></div>

            <section className="kf-single-product-hero">

                <div className="kf-single-product-hero__bg"></div>
                <div className="kf-single-product-hero__container">

                    <div className="kf-single-product-hero__content">
                        <div className="kf-single-product-hero__label">
                            <span></span>
                            Built for Excellence
                        </div>
                        <h1 className="kf-single-product-hero__title">Infrastructure</h1>
                        <p className="kf-single-product-hero__description">
                            A manufacturing platform created to balance production scale, technical versatility and dependable
                            output.
                        </p>
                    </div>

                    <div className="kf-single-product-hero__visual">
                        <img src="/assets/images/infrastructure01.png" alt="Circular Knitting" className="kf-single-product-hero__product" />
                    </div>
                </div>
            </section>
            <section className="infra-showcase">
                <div className="container infra-box">
                    <h2 className="big-text">
                        <span style={{ color: "#2c9242", fontWeight: "700" }}>Built for Volume.</span> Designed for Versatility.
                    </h2>
                    <p className="inner-lead">
                        <span style={{ color: "#2c9242", fontWeight: "700" }}>KRISHNA FASHION</span> operates a substantial
                        knitting infrastructure comprising approximately 400 machines, supported by two dedicated
                        manufacturing locations in the Surat region. Our production platform has been developed to
                        accommodate large-volume requirements, diversified fabric programmes and evolving customer
                        specifications.
                    </p>
                </div>
                <div className="container infra-grid">
                    <div className="infra-photo" data-animate="left"><img src="/assets/images/Infrastructure01.jpg" /></div>
                    <div className="infra-facts" data-animate="right">
                        <div>
                            <strong>400+</strong><span>Knitting Machines</span>
                            <p>
                                A significant installed machinery base provides the scale and flexibility required to serve
                                diverse production requirements.
                            </p>
                        </div>
                        <div>
                            <strong>~70 MT</strong><span>Daily Production Capacity</span>
                            <p>
                                Our manufacturing capability enables KRISHNA FASHION to support substantial and recurring
                                requirements with dependable production capacity.
                            </p>
                        </div>
                        <div>
                            <strong>2</strong><span>Manufacturing Locations</span>
                            <p>
                                Strategically located manufacturing facilities strengthen our operational capacity and
                                provide greater production flexibility.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="infra-gallery-section">
                <div className="container infra-slider">
                    <div className="gallery-head" data-animate="up">
                        <div>
                            <div className="kicker" style={{ color: "#7edf95" }}>Inside Our Infrastructure</div>
                            <h2>A closer look at the <br />manufacturing environment.</h2>
                        </div>
                    </div>
                    <div className="masonry-grid">
                        <div className="masonry-item tall" data-lightbox="/assets/images/infrastructure/01.jpg" data-caption="High-volume fabric roll production.">
                            <img src="/assets/images/infrastructure/01.jpg" alt="High-volume fabric roll production." />
                        </div>
                        <div className="masonry-item square" data-lightbox="/assets/images/infrastructure/02.jpg" data-caption="Direct split warping machinery.">
                            <img src="/assets/images/infrastructure/02.jpg" alt="Direct split warping machinery." />
                        </div>
                        <div className="masonry-item wide" data-lightbox="/assets/images/infrastructure/03.jpg" data-caption="Spinning and beam storage aisle.">
                            <img src="/assets/images/infrastructure/03.jpg" alt="Spinning and beam storage aisle. " />
                        </div>
                        <div className="masonry-item tall" data-lightbox="/assets/images/infrastructure/04.jpg" data-caption="Yarn bobbin inventory carts.">
                            <img src="/assets/images/infrastructure/04.jpg" alt="Yarn bobbin inventory carts." />
                        </div>
                        <div className="masonry-item wide" data-lightbox="/assets/images/infrastructure/05.jpg" data-caption="In-process fabric quality inspection.">
                            <img src="/assets/images/infrastructure/05.jpg" alt="In-process fabric quality inspection." />
                        </div>
                        <div className="masonry-item square" data-lightbox="/assets/images/infrastructure/06.jpg" data-caption="Spinning floor yarn management.">
                            <img src="/assets/images/infrastructure/06.jpg" alt="Spinning floor yarn management." />
                        </div>
                        <div className="masonry-item square" data-lightbox="/assets/images/infrastructure/07.jpg" data-caption="High-speed industrial warp knitting machine.">
                            <img src="/assets/images/infrastructure/07.jpg" alt="High-speed industrial warp knitting machine." />
                        </div>
                        <div className="masonry-item square" data-lightbox="/assets/images/infrastructure/08.jpg" data-caption="Operator monitoring active fabric production.">
                            <img src="/assets/images/infrastructure/08.jpg" alt="Operator monitoring active fabric production." />
                        </div>
                        <div className="masonry-item square" data-lightbox="/assets/images/infrastructure/09.jpg" data-caption="Quality control inspection and fabric measuring. ">
                            <img src="/assets/images/infrastructure/09.jpg" alt="Quality control inspection and fabric measuring. " />
                        </div>
                        <div className="masonry-item square" data-lightbox="/assets/images/infrastructure/10.jpg" data-caption="Close-up of warp knitting needle bed and threads.  ">
                            <img src="/assets/images/infrastructure/10.jpg" alt="Close-up of warp knitting needle bed and threads.  " />
                        </div>
                        <div className="masonry-item square" data-lightbox="/assets/images/infrastructure/11.jpg" data-caption="Circular knitting machinery and yarn creels. ">
                            <img src="/assets/images/infrastructure/11.jpg" alt="Circular knitting machinery and yarn creels. " />
                        </div>
                        <div className="masonry-item square" data-lightbox="/assets/images/infrastructure/12.jpg" data-caption="High-density automated yarn winding rack.">
                            <img src="/assets/images/infrastructure/12.jpg" alt="High-density automated yarn winding rack." />
                        </div>
                    </div>
                </div>
            </section>
            <section className="process-section">
                <div className="container">
                    <div className="section-head">
                        <div>
                            <div className="kicker green">Production Philosophy</div>
                            <h2>From planning to final assurance.</h2>
                        </div>
                    </div>
                    <div className="process-rail">
                        <div>
                            <b>01</b>
                            <h3>Material Control</h3>
                            <p>Incoming materials evaluated against defined requirements.</p>
                        </div>
                        <div>
                            <b>02</b>
                            <h3>Knitting</h3>
                            <p>Controlled production for repeatability and consistency.</p>
                        </div>
                        <div>
                            <b>03</b>
                            <h3>In-Process Checks</h3>
                            <p>Monitoring through key stages of manufacturing.</p>
                        </div>
                        <div>
                            <b>04</b>
                            <h3>Final Inspection</h3>
                            <p>Verification before packing and dispatch.</p>
                        </div>
                    </div>
                </div>
            </section>

            <a className="whatsapp-btn" href="https://wa.me/918980982777" target="_blank" rel="noopener"><span className="whatsapp-icon"><i className="fa-brands fa-whatsapp"></i></span><span className="whatsapp-text">WhatsApp</span></a>
            <button className="back-top" id="backTop"><i className="fa-solid fa-arrow-up"></i></button>


        </>);
}
