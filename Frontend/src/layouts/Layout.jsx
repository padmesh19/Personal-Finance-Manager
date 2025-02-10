import { Navbar } from "@/components/Navbar";

const Layout = ({ children }) => {

  return (
    <div className="min-h-screen bg-gray-50 roboto">
      <Navbar/>
      <main className="pt-24">{children}</main>
    </div>
  );
};

export default Layout;
