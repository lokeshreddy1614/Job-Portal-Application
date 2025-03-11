import { ToastContainer } from "react-toastify";
import { DataProvider } from "./context/DataContext";
import "./styles/globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Job Portal",
  description: "Welcome to my Job Portal application!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-200 h-screen" cz-shortcut-listen="true">
        <ToastContainer position="top-right" pauseOnFocusLoss={false} autoClose={3000} theme="dark" />
        <DataProvider>
          <Navbar />
          <main className="p-4 mx-auto min-h-[80vh] max-w-7xl">
            {children}
          </main>
        </DataProvider>
      </body>
    </html>
  );
}