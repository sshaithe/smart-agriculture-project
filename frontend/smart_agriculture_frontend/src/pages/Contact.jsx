import React from "react";
import Text from "../components/atomic_design/atom/Text";
import FormField from "../components/atomic_design/modelcule/FormField"; // Assuming this is the correct path
import Button from "../components/atomic_design/atom/Button";

// A simple SVG icon component for demonstration. You can replace this with your own or use a library like react-icons.
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <header className="text-center mb-12 md:mb-16">
          <Text
            children="Get In Touch"
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3"
          />
          <Text
            children="We're here to help and answer any question you might have. We look forward to hearing from you."
            className="text-lg text-gray-800 max-w-3xl mx-auto"
          />
        </header>

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contact Information Section */}
            <div className="p-8 md:p-12 bg-gray-600 text-white">
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              <Text
                children="Fill up the form and our Team will get back to you within 24 hours."
                className="text-gray-200 mb-8"
              />

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Icon
                    path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z"
                    className="w-6 h-6 text-indigo-50"
                  />
                  <Text children="+1 (555) 123-4567" />
                </div>
                <div className="flex items-center gap-4">
                  <Icon
                    path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    className="w-6 h-6 text-indigo-50"
                  />
                  <Text children="contact@smartagri.com" />
                </div>
                <div className="flex items-start gap-4">
                  <Icon
                    path="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    className="w-6 h-6 text-indigo-50 mt-1 flex-shrink-0"
                  />
                  <Text
                    children="123 Innovation Drive, Tech Valley, CA 94043, USA"
                    className="leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="p-8 md:p-12">
              <form action="#" method="POST">
                <div className="space-y-6">
                  <FormField id="name" label="Full Name" placeholder="John Doe" />
                  <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                  />
                  <FormField
                    id="subject"
                    label="Subject"
                    placeholder="Inquiry about..."
                  />
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea id="message" name="message" rows="4" className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Your message..."></textarea>
                  </div>
                  <Button
                    type="submit"
                    children="Send Message"
                    className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;