import Link from "next/link"
import { Instagram, Facebook, ExternalLink } from "lucide-react"

export function Footer() {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/order-status", label: "Order Status" },
    { href: "/admin", label: "Admin" },
  ]

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/espressionist.ph?fbclid=IwY2xjawJ6qOJleHRuA2FlbQIxMABicmlkETFFcWRsZDJjZm92Tks4cFFsAR60VOshh_hPe3adamtuDrzBQlWZeos22kWEymqH5fwtVqunERmZcX0wsvAsPA_aem_CZTjAhuNlKlXxz7hDP1eNQ",
      icon: Instagram,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/espressionist.ph",
      icon: Facebook,
    },
    {
      name: "Linktree",
      href: "https://linktr.ee/espressionist.ph?fbclid=IwY2xjawJ6qM9leHRuA2FlbQIxMABicmlkETFFcWRsZDJjZm92Tks4cFFsAR4LVuomHvWDn2YAFR2G7CM0JUxdCXDbURtYe17DvpDUY-yVqumsY2njJCUXxQ_aem_NSz3uTtWdI36iJ2Edv-V6g",
      icon: ExternalLink,
    },
  ]

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-logo text-brand-primary">espressionist</div>
            <p className="text-sm font-tagline text-gray-600">coffee. canvas. culture.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-brand-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>109 Rizal Blvd</p>
              <p>Santa Rosa, Philippines</p>
              <p>0995 965 9332</p>
              <a href="mailto:espressionist.ph@gmail.com" className="hover:text-brand-primary transition-colors">
                espressionist.ph@gmail.com
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} espressionist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
