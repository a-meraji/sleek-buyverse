import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Play, ArrowDownToLine, Sparkles, Rocket, Globe, Shield, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="space-y-32 pb-32">
      {/* E-commerce Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <Container className="relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Discover Your Style, <br />
                Elevate Your Wardrobe
              </h1>
              <p className="text-lg text-violet-100">
                Shop the latest trends in fashion with our curated collection of premium clothing and accessories.
              </p>
              <div className="flex gap-4">
                <Button size="lg" variant="secondary">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                alt="Fashion Model"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* SaaS Hero */}
      <section className="bg-slate-50">
        <Container className="py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
              New Features Available
            </span>
            <h1 className="text-5xl font-bold text-slate-900">
              Transform Your Workflow with AI-Powered Automation
            </h1>
            <p className="text-xl text-slate-600">
              Streamline your business processes and boost productivity with our intelligent automation platform.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Mobile App Hero */}
      <section className="bg-gradient-to-b from-purple-50 to-white">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium">
                #1 Fitness App
              </span>
              <h1 className="text-5xl font-bold text-purple-900">
                Your Personal <br />
                Fitness Journey <br />
                Starts Here
              </h1>
              <p className="text-lg text-purple-700">
                Track your workouts, nutrition, and progress with our comprehensive fitness app.
              </p>
              <div className="flex gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Download App
                  <ArrowDownToLine className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80"
                alt="Fitness App"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Educational Platform Hero */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <Container className="py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
              Learn at Your Own Pace
            </span>
            <h1 className="text-5xl font-bold text-slate-900">
              Unlock Your Potential with Expert-Led Courses
            </h1>
            <p className="text-xl text-slate-600">
              Access thousands of courses from industry experts and transform your career.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Sparkles className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold">Expert Teachers</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Globe className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold">Global Community</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Shield className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold">Lifetime Access</h3>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Startup Hero */}
      <section className="bg-black text-white">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
                Revolutionary AI Technology
              </span>
              <h1 className="text-6xl font-bold leading-tight">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                  AI-Powered
                </span> <br />
                Innovation
              </h1>
              <p className="text-lg text-gray-400">
                Transforming industries with cutting-edge artificial intelligence solutions.
              </p>
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Get Early Access
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-3xl blur-3xl opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"
                alt="AI Technology"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Travel Agency Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <Container className="relative py-32">
          <div className="max-w-2xl text-white space-y-8">
            <h1 className="text-6xl font-bold">
              Explore the World's Beauty
            </h1>
            <p className="text-xl text-gray-200">
              Discover breathtaking destinations and create unforgettable memories with our curated travel experiences.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Plan Your Trip
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Destinations
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Real Estate Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-emerald-900">
                Find Your Dream Home
              </h1>
              <p className="text-lg text-emerald-700">
                Discover premium properties in prime locations with our expert real estate services.
              </p>
              <div className="p-6 bg-white rounded-xl shadow-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input type="text" placeholder="Enter city" className="mt-1 w-full rounded-lg border-gray-300 shadow-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Price Range</label>
                    <select className="mt-1 w-full rounded-lg border-gray-300 shadow-sm">
                      <option>Any</option>
                      <option>$100k - $200k</option>
                      <option>$200k - $500k</option>
                      <option>$500k+</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Search Properties
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
                alt="Luxury Home"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Healthcare Hero */}
      <section className="bg-gradient-to-r from-cyan-50 to-blue-50">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-100 text-cyan-600 text-sm font-medium">
                24/7 Healthcare Support
              </span>
              <h1 className="text-5xl font-bold text-cyan-900">
                Your Health, <br />
                Our Priority
              </h1>
              <p className="text-lg text-cyan-700">
                Access quality healthcare services from the comfort of your home with our telemedicine platform.
              </p>
              <div className="flex gap-4">
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  Book Appointment
                </Button>
                <Button variant="outline" className="border-cyan-600 text-cyan-600">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Users className="h-8 w-8 text-cyan-500 mb-4" />
                  <h3 className="font-semibold">Expert Doctors</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Shield className="h-8 w-8 text-cyan-500 mb-4" />
                  <h3 className="font-semibold">Secure Platform</h3>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Zap className="h-8 w-8 text-cyan-500 mb-4" />
                  <h3 className="font-semibold">Quick Response</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Globe className="h-8 w-8 text-cyan-500 mb-4" />
                  <h3 className="font-semibold">24/7 Support</h3>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Gaming Platform Hero */}
      <section className="bg-gray-900 text-white">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium">
                Level Up Your Gaming
              </span>
              <h1 className="text-6xl font-bold leading-tight">
                Enter the World of
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Epic Gaming
                </span>
              </h1>
              <p className="text-lg text-gray-400">
                Join millions of players worldwide in the most immersive gaming experience.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Play Now
                </Button>
                <Button size="lg" variant="outline" className="border-purple-500 text-purple-400">
                  Watch Trailer
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"
                alt="Gaming"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Food Delivery Hero */}
      <section className="bg-orange-50">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                Free Delivery on First Order
              </span>
              <h1 className="text-5xl font-bold text-orange-900">
                Delicious Food,
                <br />
                Delivered Fast
              </h1>
              <p className="text-lg text-orange-700">
                Order from your favorite local restaurants with just a few taps.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Order Now
                </Button>
                <Button size="lg" variant="outline" className="border-orange-600 text-orange-600">
                  View Menu
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">30min</div>
                  <div className="text-sm text-orange-700">Fast Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">500+</div>
                  <div className="text-sm text-orange-700">Restaurants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-orange-700">Support</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
                alt="Food Delivery"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}