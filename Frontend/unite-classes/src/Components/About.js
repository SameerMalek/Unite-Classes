import './About.css';

export default function About() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
        {/* Header Section */}
        <div className="text-center py-8">
          <h1 className="text-5xl font-extrabold text-gray-800">About Us</h1>
          <p className="text-gray-600 mt-4 text-lg">
            Learn more about our mission, our vision, and the people who make it happen.
          </p>
        </div>
  
        {/* About Section */}
        <div className="bg-white shadow-lg m-3 rounded-lg p-8 md:flex md:items-center md:space-x-8">
          {/* Profile Photo */}
          <div className="flex justify-center md:w-1/3 mb-6 md:mb-0">
            <img
              src="photo.jpg" // Replace with your image path
              alt="Profile"
              className="rounded-full shadow-md object-cover w-40 h-40 border-4 border-gray-300"
            />
          </div>
  
          {/* Description */}
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hello! I'm Shakil Malek</h2>
            <p className="text-gray-600 text-lg mb-4">
              Welcome to our tuition classes! Our mission is to help students achieve academic
              excellence. With a dedicated focus on improvement and consistent results, we ensure
              every student reaches their full potential.
            </p>
            <p className="text-gray-600 text-lg">
              Join us in creating a supportive environment that fosters learning, growth, and
              success.
            </p>
          </div>
        </div>
  
        {/* Teachers Section */}
        <div className="mt-12">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">Meet Our Teachers</h2>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Teacher Card Example */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center m-3 hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold text-gray-800">Raziya Mam</h3>
              <p className="text-gray-600 mt-2">English Teacher</p>
              <p className="text-gray-500 mt-2">Phone: +91 95104 56663</p>
            </div>
  
            <div className="bg-white shadow-lg rounded-lg p-6 text-center m-3 hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold text-gray-800">Farhana Mam</h3>
              <p className="text-gray-600 mt-2">Science Teacher</p>
              <p className="text-gray-500 mt-2">Phone: +91 83471 70996</p>
            </div>
  
            <div className="bg-white shadow-lg rounded-lg p-6 text-center m-3 hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold text-gray-800">Madni Sir</h3>
              <p className="text-gray-600 mt-2">Social Science Teacher</p>
              <p className="text-gray-500 mt-2">Phone: +91 6356 389443</p>
            </div>
            {/* Add more teacher cards as needed */}
          </div>
        </div>
      </div>
    );
  }
  