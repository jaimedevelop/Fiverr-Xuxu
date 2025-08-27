import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Package,
  Settings,
  Heart
} from 'lucide-react';
// Temporarily disabled cart functionality
// import CartIcon from '../../../components/user/cart/CartIcon';
// import CartSidebar from '../../../components/user/cart/CartSidebar';

const UserMobileNavigation: React.FC = () => {
  const userNavItems = [
    { path: '/usuario/explorar', label: 'Explorar', icon: Search },
    { path: '/usuario/pedidos', label: 'Pedidos', icon: Package },
    { path: '/usuario/favoritos', label: 'Favoritos', icon: Heart },
    { path: '/usuario/perfil', label: 'Perfil', icon: Settings },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-saffron-200 z-50 shadow-brand-lg">
        {/* Main Navigation */}
        <div className="px-4 py-3">
          <div className="flex justify-around max-w-md mx-auto">
            {userNavItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 text-gray-600 hover:text-saffron-700 hover:bg-saffron-50 active:bg-saffron-100 hover:scale-110 group"
              >
                <div className="p-1">
                  <Icon size={20} className="group-hover:text-saffron-600 transition-colors duration-200" />
                </div>
                <span className="text-xs mt-1 font-medium">{label}</span>
              </Link>
            ))}
            
            {/* Temporarily disabled cart functionality */}
            {/* 
            <div className="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 text-gray-600 hover:text-saffron-700 hover:bg-saffron-50 active:bg-saffron-100 hover:scale-110 group cursor-pointer">
              <div className="p-1">
                <CartIcon />
              </div>
              <span className="text-xs mt-1 font-medium">Carrito</span>
            </div>
            */}
            
            {/* Temporary cart placeholder */}
            <div 
              className="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 text-gray-400 cursor-not-allowed opacity-60"
              onClick={() => alert('Funcionalidad de carrito temporalmente deshabilitada')}
            >
              <div className="p-1">
                <Package size={20} />
              </div>
              <span className="text-xs mt-1 font-medium">Carrito</span>
            </div>
          </div>
        </div>
        
        {/* Decorative bottom border */}
        <div className="h-1 bg-gradient-saffron"></div>
      </nav>
      
      {/* Temporarily disabled cart sidebar */}
      {/* <CartSidebar /> */}
    </>
  );
};

export default UserMobileNavigation;