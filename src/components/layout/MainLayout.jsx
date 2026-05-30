import { Outlet } from 'react-router-dom';
import Navbar from "../home/Navbar";
export default function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <Outlet />
    </div>
  );
}