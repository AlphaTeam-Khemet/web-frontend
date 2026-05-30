import Navbar from './Navbar';
import Footer from './Footer';
export default function PageLayout({ children }) { return <div className="min-h-screen bg-khemet-paper"><Navbar /><main>{children}</main><Footer /></div>; }
