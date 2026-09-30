import Link from "next/link";

export default function Footer(){
  return (<>
<footer className="footer-ref">
<div className="footer-overlay"></div>
<div className="container footer-inner">
<div className="footer-tagline" data-animate="up">
<h2>Your trusted partner for dependable knitted fabric solutions</h2>
</div>
<div className="footer-columns">
<div className="footer-col">
<div className="footer-title">Address</div>
<p>B-306, International Commerce Centre,<br />Ring Road, Surat - 395002,<br />Gujarat, India</p>
</div>
<div className="footer-col">
<div className="footer-title">Contact</div>
<a href="mailto:info@krishnafashion.co" className="footer-email">info@krishnafashion.co</a>
<a href="tel:+918980982777">+91 89809 82777</a>
<div className="footer-title social-title">Social</div>
<div className="social-row">
<a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
<a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
<a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
</div>
</div>
<div className="footer-col mobile-none">
<div className="footer-title">Products</div>
<Link href="/circular-knitting">Circular Knitting</Link>
<Link href="/warp-knitting">Warp Knitting</Link>
</div>
<div className="footer-col mobile-none">
<div className="footer-title">About Krishna Fashion</div>
<Link href="/about-us">About Us</Link>
<Link href="/management">Management</Link>
<a href="#">Infrastructure</a>
<Link href="/sustainability">Sustainability</Link>
<Link href="/careers">Careers</Link>
<a href="#">Contact Us</a>
</div>
</div>
<div className="footer-bottom">
<span>© 2026 KRISHNA FASHION. All Rights Reserved.</span>
<span>Website developed by : <a href="https://setblue.com/" target="_blank">Setblue.com</a></span>
</div>
</div>
</footer>
</>);
}
