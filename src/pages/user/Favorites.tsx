import React from 'react';
import UserFavorites from '../../components/user/favorites/UserFavorites';

const Favorites: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <UserFavorites />
    </div>
  );
};

export default Favorites;