import React from "react";
import './Contact.css'; 
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function ContactPage() {
  return (
    <>
      <Header />
      <div className="contact-header">
  
        <h1>Contact Us</h1>
        <p className="contact-para">Got questions or need help? We're here for you! <br />  Reach out via email, live chat, or check our FAQ. <br /> Your satisfaction is our priority, and we’ll assist you as quickly as possible!</p>
      </div>

      <div className="contact-page-container">
       
        {/* Privacy Policy Section */}
        <div className="section-container privacy-policy-container">
          <img src="https://images.unsplash.com/photo-1601315379734-425a469078de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGVybXMlMjBhbmQlMjBzZXJ2aWNlcyUyMHJlY2lwZXxlbnwwfHwwfHx8MA%3D%3D"/>
          <h2>Privacy Policy</h2>
          <p>
          By using our website, you agree to our terms. Our meal plans are for personal use, and all content is our intellectual property. We respect your privacy and never share personal data without consent. We are not liable for any dietary reactions. For full details, visit our Terms & Conditions page.r <a   className="faq-views-2"   href="/privacy-policy">Privacy Policy</a> page.
          </p>
        </div>

        {/* Help Center Section */}
        <div className="section-container help-center-container">
          <img src="https://images.unsplash.com/photo-1495546968767-f0573cca821e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlY2lwZXxlbnwwfHwwfHx8MA%3D%3D" alt="Help Center" className="section-image"/>
          <h2>Help Center</h2>
          <p>Need assistance? Visit our <a className="faq-views-2"  href="/help-center">Help Center</a> for guides and answers to common questions.
          Our Help Center is here to assist you! Browse FAQs, contact support, or access guides for a seamless experience. For further inquiries, email us at support@TheRecipeBook.com.
          </p>
        </div>



 

        {/* Feedback Section */}
        <div className="section-container feedback-container">
          <img src="https://plus.unsplash.com/premium_photo-1661507070247-1ed0a6ed3ca2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHJlY2lwZXxlbnwwfHwwfHx8MA%3D%3D" alt="Feedback" className="section-image"/>
          <h2>Feedback</h2>
          <p>We value your feedback and want to improve your experience. Share your thoughts through our form, email us at TheRecipeBook@gmail.com, or rate your experience on our website. Your input helps us grow!
          </p>
          <form>
            <textarea placeholder="Your feedback" required></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Terms & Services Section */}
        <div className="section-container terms-container">
          <img src="https://plus.unsplash.com/premium_photo-1667520402304-4d51d0b1a98f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGVybXMlMjBhbmQlMjBzZXJ2aWNlcyUyMHJlY2lwZXxlbnwwfHwwfHx8MA%3D%3D" alt="Terms & Services" className="section-image"/>
          <h2>Terms & Services</h2>
          <p>
          By using our website, you agree to our terms: meal plans are for personal use, your data remains private, our content is our property, and we aren’t liable for dietary reactions. Read more on our Terms & Conditions page. <a  className="faq-views-2 faq-view-2" href="/terms-and-services">Terms & Services</a> page.
          </p>
        </div>


{/* FAQ Section */}
<main className="faq-container section-container">
          <section className="accordion" id="overview">
          <h2 className="faq-title">Frequently Asked Questions</h2>  
            <h3 className="title"><a  className="faq-views" href="#overview">How do I shop for the ingredients on my meal plan?</a></h3>
            <div className="content">
              <p>
              Generate a shopping list, shop online or in-store, and easily gather all ingredients for your meals.
              </p>
            </div>
          </section>

          <section className="accordion" id="how-does-it-work">
            <h3 className="title"><a   className="faq-views" href="#how-does-it-work">How do I create my meal plan?</a></h3>
            <div className="content">
              <p>
              Sign up, set preferences, select meals, adjust portions, and confirm your weekly meal plan. It’s that simple!
              </p>
            </div>
          </section>

          <section className="accordion" id="inspiration">
            <h3 className="title"><a className="faq-views" href="#inspiration"> Can I customize the meal plans to fit my dietary preferences?</a></h3>
            <div className="content">
              <p>
              Yes! You can adjust meals based on diet type, allergies, calories, and meal swaps for your preferences.
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default ContactPage;
