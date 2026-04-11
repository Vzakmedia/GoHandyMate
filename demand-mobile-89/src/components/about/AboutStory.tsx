export const AboutStory = () => {
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
              alt="Team working on laptops"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2020, GoHandyMate was born from a simple frustration: finding reliable, skilled professionals for home projects shouldn't be so difficult.
              </p>
              <p>
                After experiencing countless delays, poor communication, and unexpected costs, our founders decided to create a platform that puts transparency, quality, and customer satisfaction first.
              </p>
              <p>
                Today, we've helped thousands of homeowners complete their projects while supporting local professionals to grow their businesses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};