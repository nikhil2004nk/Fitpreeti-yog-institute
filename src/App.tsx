import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Booking } from './pages/Booking';
import { OnlineClasses } from './pages/OnlineClasses';
import { CorporateWellness } from './pages/CorporateWellness';
import { About } from './pages/About';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/online-classes" element={<OnlineClasses />} />
      <Route path="/corporate-wellness" element={<CorporateWellness />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;
