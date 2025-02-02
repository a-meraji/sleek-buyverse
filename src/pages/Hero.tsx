import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Star, Truck, Shield, Gift, Clock, CreditCard, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="space-y-32 pb-32">
      {/* Luxury Fashion Hero */}
      <section className="relative overflow-hidden bg-[#1a1a1a] text-white">
        <Container className="relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-serif leading-tight">
                Discover Luxury <br />
                <span className="text-[#c4a47c]">Fashion</span>
              </h1>
              <p className="text-lg text-gray-300">
                Explore our curated collection of designer pieces that define elegance.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-[#c4a47c] hover:bg-[#b39371]">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
                alt="Luxury Fashion"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Streetwear Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <Container className="py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              New Collection Drop
            </span>
            <h1 className="text-6xl font-black">
              STREET <br /> CULTURE
            </h1>
            <p className="text-xl text-purple-100">
              Express yourself with our latest streetwear collection.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
                <Star className="h-8 w-8 text-yellow-400 mb-4" />
                <h3 className="font-bold">Limited Edition</h3>
              </div>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
                <Sparkles className="h-8 w-8 text-yellow-400 mb-4" />
                <h3 className="font-bold">Exclusive Drops</h3>
              </div>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg">
                <Heart className="h-8 w-8 text-yellow-400 mb-4" />
                <h3 className="font-bold">Member Access</h3>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Home Decor Hero */}
      <section className="bg-[#f8f5f0]">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-light text-gray-800">
                Transform Your Space
              </h1>
              <p className="text-xl text-gray-600">
                Discover unique home decor pieces that reflect your personal style.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <Truck className="h-6 w-6 text-gray-600 mb-2" />
                  <p className="text-sm text-gray-600">Free Shipping</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="h-6 w-6 text-gray-600 mb-2" />
                  <p className="text-sm text-gray-600">Quality Guarantee</p>
                </div>
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800">
                Shop Now
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=400"
                alt="Home Decor"
                className="rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400"
                alt="Home Decor"
                className="rounded-lg mt-8"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Electronics Store Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Container className="py-20">
          <div className="relative">
            <div className="max-w-2xl space-y-8">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                New Tech Arrivals
              </span>
              <h1 className="text-6xl font-bold leading-tight">
                Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Technology
                </span>
              </h1>
              <p className="text-xl text-gray-300">
                Discover cutting-edge electronics and gadgets.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Shop Gadgets
                </Button>
                <Button size="lg" variant="outline" className="border-white/20">
                  View Deals
                </Button>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-1/3 aspect-square rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
          </div>
        </Container>
      </section>

      {/* Beauty Store Hero */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
                Natural Beauty
              </span>
              <h1 className="text-5xl font-light text-gray-800">
                Discover Your <br />
                Natural Glow
              </h1>
              <p className="text-lg text-gray-600">
                Premium skincare and beauty products for your daily routine.
              </p>
              <div className="flex gap-4">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                  Shop Beauty
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
                alt="Beauty Products"
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                  <Star className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="font-semibold">Trusted by</p>
                    <p className="text-sm text-gray-500">10k+ customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Sports Store Hero */}
      <section className="bg-gray-900 text-white">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-7xl font-black uppercase leading-none">
                Push Your <br />
                <span className="text-yellow-500">Limits</span>
              </h1>
              <p className="text-xl text-gray-300">
                Professional sports gear for athletes and enthusiasts.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-yellow-500">50+</h3>
                  <p className="text-sm text-gray-400">Brands</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-yellow-500">1000+</h3>
                  <p className="text-sm text-gray-400">Products</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-yellow-500">24/7</h3>
                  <p className="text-sm text-gray-400">Support</p>
                </div>
              </div>
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Shop Equipment
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800"
                alt="Sports Equipment"
                className="rounded-lg"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Jewelry Store Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white">
        <Container className="py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
              Handcrafted Excellence
            </span>
            <h1 className="text-5xl font-serif text-gray-900">
              Timeless Elegance in Every Piece
            </h1>
            <p className="text-xl text-gray-600">
              Discover our collection of fine jewelry and precious stones.
            </p>
            <div className="grid sm:grid-cols-4 gap-8">
              <div className="text-center">
                <Gift className="h-8 w-8 text-amber-700 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Gift Wrapping</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-amber-700 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Certified</p>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 text-amber-700 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <CreditCard className="h-8 w-8 text-amber-700 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Secure Payment</p>
              </div>
            </div>
            <Button className="bg-amber-800 hover:bg-amber-900 text-white">
              Explore Collection
            </Button>
          </div>
        </Container>
      </section>

      {/* Furniture Store Hero */}
      <section className="bg-[#2c3e50] text-white">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium">
                Modern Living
              </span>
              <h1 className="text-6xl font-light">
                Design Your <br />
                Perfect Space
              </h1>
              <p className="text-xl text-gray-300">
                Contemporary furniture for modern homes.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  View Catalog
                </Button>
                <Button size="lg" variant="outline" className="border-white/20">
                  Book Consultation
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400"
                alt="Furniture"
                className="rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400"
                alt="Furniture"
                className="rounded-lg mt-8"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Kids Store Hero */}
      <section className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
        <Container className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold">
                Magic and Wonder <br />
                for Little Ones
              </h1>
              <p className="text-xl">
                Quality toys and clothing for children of all ages.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 p-4 rounded-lg backdrop-blur-lg">
                  <Clock className="h-6 w-6 mb-2" />
                  <p className="text-sm">Fast Delivery</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg backdrop-blur-lg">
                  <Shield className="h-6 w-6 mb-2" />
                  <p className="text-sm">Safe Materials</p>
                </div>
              </div>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Explore Toys
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800"
                alt="Kids Store"
                className="rounded-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Sustainable Fashion Hero */}
      <section className="bg-[#eef2f7]">
        <Container className="py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
              Eco-Friendly Fashion
            </span>
            <h1 className="text-4xl font-medium text-gray-900">
              Style that Respects Our Planet
            </h1>
            <p className="text-lg text-gray-600">
              Sustainable and ethical fashion for conscious consumers.
            </p>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200"
                  alt="Sustainable Fashion"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium">Organic Materials</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1581497396202-5645e76a3a8e?w=200"
                  alt="Sustainable Fashion"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium">Fair Trade</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200"
                  alt="Sustainable Fashion"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium">Zero Waste</h3>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Shop Sustainable
            </Button>
          </div>
        </Container>
      </section>

      {/* Premium Fashion Boutique */}
      <section className="relative min-h-[80vh] flex items-center" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-black/50" />
        <Container className="relative z-10">
          <div className="max-w-2xl text-white">
            <span className="inline-block px-4 py-1 mb-6 text-xs font-medium tracking-wider uppercase bg-white/20 rounded-full">New Collection 2024</span>
            <h1 className="text-6xl font-light mb-6">Timeless Elegance Redefined</h1>
            <p className="text-lg text-gray-200 mb-8">Discover our curated collection of premium fashion pieces that transcend seasons.</p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Shop Collection
            </Button>
          </div>
        </Container>
      </section>

      {/* Designer Accessories */}
      <section className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white">
        <Container className="py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-serif mb-6">Luxury Accessories</h2>
              <p className="text-gray-300 mb-8">Elevate your style with our exclusive collection of designer accessories.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 border border-white/10 rounded-lg">
                  <h3 className="font-medium mb-2">Free Shipping</h3>
                  <p className="text-sm text-gray-400">On orders over $200</p>
                </div>
                <div className="p-4 border border-white/10 rounded-lg">
                  <h3 className="font-medium mb-2">Returns</h3>
                  <p className="text-sm text-gray-400">30-day money back</p>
                </div>
              </div>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black">
                Explore Collection
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae"
                alt="Designer Accessories"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* High-End Cosmetics */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50">
        <Container className="py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-purple-600 font-medium">Luxury Beauty</span>
            <h2 className="text-4xl font-light mt-2 mb-4">Experience Premium Skincare</h2>
            <p className="text-gray-600">Discover our collection of high-end beauty products crafted for your skin.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Star className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="font-medium mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">Only the finest ingredients</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Heart className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="font-medium mb-2">Cruelty Free</h3>
              <p className="text-gray-600 text-sm">Ethically produced</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Shield className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="font-medium mb-2">Dermatologist Tested</h3>
              <p className="text-gray-600 text-sm">Safe for all skin types</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Vintage Fashion */}
      <section className="relative min-h-[90vh] flex items-center" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1445205170230-053b83016050)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-black/40" />
        <Container className="relative z-10">
          <div className="max-w-xl">
            <h2 className="text-5xl font-serif text-white mb-6">Timeless Vintage Collection</h2>
            <p className="text-lg text-gray-200 mb-8">Carefully curated vintage pieces that tell a story.</p>
            <div className="flex gap-4">
              <Button className="bg-white text-black hover:bg-gray-100">
                Shop Women
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Shop Men
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Athleisure Wear */}
      <section className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
        <Container className="py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm">Active Lifestyle</span>
              <h2 className="text-6xl font-bold">MOVE<br />WITH<br />STYLE</h2>
              <p className="text-lg text-blue-100">Performance meets fashion in our latest athleisure collection.</p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Shop Now
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1483721310020-03333e577078"
                alt="Athleisure"
                className="rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8"
                alt="Athleisure"
                className="rounded-lg mt-8"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Minimalist Fashion */}
      <section className="bg-[#f8f8f8]">
        <Container className="py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-6">Less is More</h2>
            <p className="text-gray-600 mb-12">Curated minimalist pieces for the modern wardrobe.</p>
            <div className="grid sm:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-medium">Sustainable</h3>
                <p className="text-sm text-gray-500 mt-2">Eco-friendly materials</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-medium">Timeless</h3>
                <p className="text-sm text-gray-500 mt-2">Classic designs</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-medium">Versatile</h3>
                <p className="text-sm text-gray-500 mt-2">Mix and match</p>
              </div>
            </div>
            <Button className="bg-black text-white hover:bg-gray-900">
              View Collection
            </Button>
          </div>
        </Container>
      </section>

      {/* Luxury Skincare */}
      <section className="bg-gradient-to-br from-amber-50 to-rose-50">
        <Container className="py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-rose-600 font-medium">Luxury Skincare</span>
              <h2 className="text-4xl font-light mt-2 mb-6">Your Skin Deserves the Best</h2>
              <p className="text-gray-600 mb-8">Experience the transformation with our premium skincare collection.</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <Star className="w-6 h-6 text-amber-400 mb-2" />
                  <p className="text-sm text-gray-600">Natural Ingredients</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="w-6 h-6 text-amber-400 mb-2" />
                  <p className="text-sm text-gray-600">Dermatologist Tested</p>
                </div>
              </div>
              <Button className="bg-rose-600 text-white hover:bg-rose-700">
                Shop Skincare
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881"
                alt="Luxury Skincare"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Designer Shoes */}
      <section className="bg-black text-white">
        <Container className="py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-7xl font-bold">STEP INTO LUXURY</h2>
              <p className="text-gray-300">Exclusive collection of designer footwear.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-white/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Handcrafted</h3>
                  <p className="text-sm text-gray-400">Italian leather</p>
                </div>
                <div className="border border-white/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Limited Edition</h3>
                  <p className="text-sm text-gray-400">Exclusive designs</p>
                </div>
              </div>
              <Button className="bg-white text-black hover:bg-gray-100">
                View Collection
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2"
                alt="Designer Shoes"
                className="rounded-lg"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Bridal Collection */}
      <section className="relative min-h-[90vh] flex items-center" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1549416878-b9ca95e26903)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/50" />
        <Container className="relative z-10">
          <div className="max-w-xl">
            <span className="text-gray-600 font-medium">Bridal Collection</span>
            <h2 className="text-5xl font-serif mt-2 mb-6">Your Perfect Day Awaits</h2>
            <p className="text-gray-600 mb-8">Exquisite bridal wear and accessories for your special day.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="font-medium mb-1">Custom Fitting</h3>
                <p className="text-sm text-gray-600">Perfect fit guaranteed</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="font-medium mb-1">Consultation</h3>
                <p className="text-sm text-gray-600">Personal stylist</p>
              </div>
            </div>
            <Button className="bg-black text-white hover:bg-gray-900">
              Book Appointment
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
