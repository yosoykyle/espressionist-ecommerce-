import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-beige to-white py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-logo text-brand-primary mb-6">espressionist</h1>
            <p className="text-xl sm:text-2xl font-tagline text-gray-700 mb-8">coffee. canvas. culture.</p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Experience the perfect blend of artisanal coffee, creative expression, and cultural connection in the
              heart of Santa Rosa, Philippines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary/90">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
              >
                <Link href="/order-status">Track Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose espressionist?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than just a café – we're a community hub where coffee culture meets artistic expression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">☕</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Coffee</h3>
                <p className="text-gray-600">
                  Carefully sourced beans, expertly roasted, and crafted with passion for the perfect cup every time.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Art & Creativity</h3>
                <p className="text-gray-600">
                  A space where artists gather, create, and showcase their work while enjoying exceptional coffee.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Culture</h3>
                <p className="text-gray-600">
                  Building connections and fostering relationships through shared experiences and meaningful
                  conversations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Visit Our Café</h2>
            <p className="text-lg text-gray-600">Located in the heart of Santa Rosa, Philippines</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Address</h3>
                <p className="text-gray-600">109 Rizal Blvd, Santa Rosa, Philippines</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Contact</h3>
                <p className="text-gray-600">Phone: 0995 965 9332</p>
                <p className="text-gray-600">Email: espressionist.ph@gmail.com</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Hours</h3>
                <p className="text-gray-600">Monday - Sunday: 7:00 AM - 10:00 PM</p>
              </div>

              <Button asChild className="bg-brand-primary hover:bg-brand-primary/90">
                <Link href="/products">Order Online</Link>
              </Button>
            </div>

            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7731.682543584867!2d121.100823!3d14.320651!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d9006b676453%3A0xfba2c30aae1cf0d3!2sEspressionist!5e0!3m2!1sen!2sph!4v1745721835963!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="espressionist café location"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
