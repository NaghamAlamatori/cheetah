import React, { Suspense } from 'react' 
import { Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Reviews from "./pages/Reviews";
import Chat from "./pages/Chat";
import Complaints from "./pages/Complaints";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddCar from "./pages/AddCar";
import CarDetails from "./pages/CarDetails";
import SellerInfo from "./pages/SellerInfo";
import About from "./pages/About";
import SubmitAd from "./pages/SubmitAd";
import Ads from "./pages/Ads";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Admin components 
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminAds from "./admin/AdminAds";
import AdminSettings from "./admin/AdminSettings";
import AdminComplaints from "./admin/AdminComplaints";
import AdminReviews from "./admin/AdminReviews";
import AdminCars from "./admin/AdminCars";
import AddUser from "./admin/AddUser";

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/cars/add" element={<ProtectedRoute><AddCar /></ProtectedRoute>} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/seller-info/:carId" element={<SellerInfo />} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/ads" element={<Ads />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/submit-ad" element={<ProtectedRoute><SubmitAd /></ProtectedRoute>} />
              
              {/* Admin routing */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/new" element={<AddUser />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="complaints" element={<AdminComplaints />} />
                <Route path="ads" element={<AdminAds />} />
                <Route path="cars" element={<AdminCars />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="*" element={<div>Admin page not found</div>} />
              </Route>
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;