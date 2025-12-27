import instituteData from '../../data/institute.json';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export const Footer: React.FC = () => {
  const { name, phone, email, address, social } = instituteData as any;

  const socialLinks = [
    { icon: FaWhatsapp, url: social?.whatsapp, label: 'WhatsApp', bg: 'bg-green-600', hover: 'hover:bg-green-700' },
    { icon: FaInstagram, url: social?.instagram, label: 'Instagram', bg: 'bg-pink-500', hover: 'hover:bg-pink-600' },
    { icon: FaFacebook, url: social?.facebook, label: 'Facebook', bg: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    { icon: FaYoutube, url: social?.youtube, label: 'YouTube', bg: 'bg-red-600', hover: 'hover:bg-red-700' },
  ];

  return (
    <footer className="w-full bg-neutral-900 text-neutral-200 pt-12 md:pt-20 pb-8 md:pb-12">
      <div className="w-full px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* Logo & Info */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt={`${name} Logo`}
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-bold text-red-600">{name}</span>
            </Link>
            <p className="text-neutral-400 leading-relaxed max-w-xs">
              Yoga, Zumba, dance and fitness studio in Narnaund, helping students feel stronger, calmer, and more confident.
            </p>
          </div>

          {/* Quick Links - Hidden on mobile */}
          <div className="hidden sm:block">
            <h4 className="text-xl font-bold text-white mb-4 md:mb-6">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-neutral-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link to="/online-classes" className="text-neutral-400 hover:text-white transition-colors">
                  Online Studio
                </Link>
              </li>
              <li className="hidden sm:block">
                <Link to="/corporate-yoga" className="text-neutral-400 hover:text-white transition-colors">
                  Corporate
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-neutral-400 hover:text-red-500 transition-colors">
                  Book Class
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info with icons */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 md:mb-6">Contact</h4>
            <div className="space-y-2 md:space-y-4 text-neutral-400">
              <p className="flex items-start text-sm sm:text-base gap-2">
                <FaMapMarkerAlt className="mt-1 text-red-600" /> {address}
              </p>
              <p className="flex items-center text-sm sm:text-base gap-2">
                <FaPhone className="text-red-600" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </p>
              <p className="flex items-center text-sm sm:text-base gap-2">
                <FaEnvelope className="text-red-600" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 md:mb-6">Follow Us</h4>
            <div className="flex space-x-3 mt-2">
              {socialLinks.map(
                (item) =>
                  item.url && (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className={`p-3 rounded-2xl text-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center ${item.bg} ${item.hover}`}
                    >
                      <item.icon className="h-5 w-5" />
                    </a>
                  )
              )}
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-neutral-800 pt-6 mt-8 text-center text-neutral-500 text-sm">
          &copy; 2025 {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
