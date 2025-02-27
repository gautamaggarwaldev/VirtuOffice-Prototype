import React from 'react';

const Map: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="relative w-full h-full">
        {/* Main background */}
        <img 
          src="https://images.unsplash.com/photo-1604147706283-d7119b5b822c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Office floor"
          className="w-full h-full object-cover opacity-50"
        />
        
        {/* Office layout */}
        <div className="absolute inset-0">
          {/* Main office area */}
          <div className="absolute left-[5%] top-[5%] w-[90%] h-[90%] bg-blue-50 bg-opacity-70 rounded-lg border border-blue-200"></div>
          
          {/* Conference room */}
          <div className="absolute left-[35%] top-[20%] w-[30%] h-[25%] bg-green-50 bg-opacity-80 rounded-lg border border-green-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg font-semibold text-green-800">Conference Room</h3>
            </div>
            
            {/* Conference table */}
            <div className="absolute left-[15%] top-[30%] w-[70%] h-[40%]">
              <img 
                src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Conference table"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
            
            {/* Chairs */}
            <div className="absolute left-[10%] top-[20%] w-[10%] h-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Chair"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute left-[25%] top-[20%] w-[10%] h-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Chair"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute left-[40%] top-[20%] w-[10%] h-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Chair"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute left-[55%] top-[20%] w-[10%] h-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Chair"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute left-[70%] top-[20%] w-[10%] h-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Chair"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute left-[10%] top-[70%] w-[10%] h-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Chair"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute left-[25%] top-[70%] w-[10%] h-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Chair"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute left-[40%] top-[70%] w-[10%] h-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Chair"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute left-[55%] top-[70%] w-[10%] h-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Chair"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute left-[70%] top-[70%] w-[10%] h-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Chair"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          
          {/* Lounge area */}
          <div className="absolute left-[10%] top-[60%] w-[25%] h-[25%] bg-yellow-50 bg-opacity-80 rounded-lg border border-yellow-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg font-semibold text-yellow-800">Lounge Area</h3>
            </div>
            
            {/* Sofa */}
            <div className="absolute left-[10%] top-[30%] w-[50%] h-[30%]">
              <img 
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Sofa"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
            
            {/* Coffee table */}
            <div className="absolute left-[65%] top-[35%] w-[25%] h-[20%]">
              <img 
                src="https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Coffee table"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
            
            {/* Plants */}
            <div className="absolute left-[85%] top-[15%] w-[10%] h-[15%]">
              <img 
                src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Plant"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          
          {/* Game zone */}
          <div className="absolute left-[70%] top-[60%] w-[20%] h-[25%] bg-purple-50 bg-opacity-80 rounded-lg border border-purple-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg font-semibold text-purple-800">Game Zone</h3>
            </div>
            
            {/* Ping pong table */}
            <div className="absolute left-[20%] top-[30%] w-[60%] h-[40%]">
              <img 
                src="https://images.unsplash.com/photo-1611251135345-18c56206b863?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Ping pong table"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
          
          {/* Quiet zone / Library */}
          <div className="absolute left-[70%] top-[10%] w-[20%] h-[20%] bg-gray-50 bg-opacity-80 rounded-lg border border-gray-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg font-semibold text-gray-800">Library</h3>
            </div>
            
            {/* Bookshelves */}
            <div className="absolute left-[10%] top-[30%] w-[80%] h-[50%]">
              <img 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Bookshelf"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
          
          {/* Cafeteria */}
          <div className="absolute left-[10%] top-[10%] w-[20%] h-[20%] bg-pink-50 bg-opacity-80 rounded-lg border border-pink-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-lg font-semibold text-pink-800">Cafeteria</h3>
            </div>
            
            {/* Tables */}
            <div className="absolute left-[20%] top-[30%] w-[25%] h-[25%]">
              <img 
                src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Cafeteria table"
                className="w-full h-full object-cover rounded-full shadow-md"
              />
            </div>
            <div className="absolute left-[55%] top-[30%] w-[25%] h-[25%]">
              <img 
                src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Cafeteria table"
                className="w-full h-full object-cover rounded-full shadow-md"
              />
            </div>
            <div className="absolute left-[20%] top-[65%] w-[25%] h-[25%]">
              <img 
                src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Cafeteria table"
                className="w-full h-full object-cover rounded-full shadow-md"
              />
            </div>
            <div className="absolute left-[55%] top-[65%] w-[25%] h-[25%]">
              <img 
                src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Cafeteria table"
                className="w-full h-full object-cover rounded-full shadow-md"
              />
            </div>
          </div>
          
          {/* Reception */}
          <div className="absolute left-[45%] top-[10%] w-[10%] h-[5%] bg-amber-50 bg-opacity-80 rounded-lg border border-amber-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-sm font-semibold text-amber-800">Reception</h3>
            </div>
          </div>
          
          {/* Paths/walkways */}
          <div className="absolute left-[50%] top-[50%] w-[1%] h-[45%] bg-gray-200 transform -translate-x-1/2"></div>
          <div className="absolute left-[50%] top-[50%] w-[30%] h-[1%] bg-gray-200 transform -translate-y-1/2"></div>
          <div className="absolute left-[20%] top-[50%] w-[1%] h-[30%] bg-gray-200"></div>
          <div className="absolute left-[20%] top-[20%] w-[1%] h-[30%] bg-gray-200"></div>
          <div className="absolute left-[80%] top-[50%] w-[1%] h-[30%] bg-gray-200"></div>
          <div className="absolute left-[80%] top-[20%] w-[1%] h-[30%] bg-gray-200"></div>
          <div className="absolute left-[50%] top-[20%] w-[1%] h-[10%] bg-gray-200 transform -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default Map;