import React from 'react';
import './about.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const About = () => {
  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Recipes' },
    { number: '100+', label: 'Countries' },
    { number: '4.8', label: 'Average Rating' }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
      bio: 'Passionate about bringing people together through food.'
    },
    {
      name: 'Michael Chen',
      role: 'Head Chef',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
      bio: 'Professional chef with 15 years of culinary experience.'
    },
    {
      name: 'Emma Davis',
      role: 'Food Curator',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
      bio: 'Food stylist and recipe developer extraordinaire.'
    }
  ];

  return (
    <div className="about-page">
      <Header />
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Our Story</h1>
          <p>Bringing people together through the love of food</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At TheRecipeBook, we believe that cooking is more than just preparing meals – 
              it's about creating memories, sharing traditions, and bringing people together. 
              Our platform is designed to inspire home cooks of all skill levels to explore 
              new flavors and techniques while connecting with a global community of food lovers.
            </p>
          </div>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="icon">🌱</div>
              <h3>Sustainability</h3>
              <p>Promoting eco-friendly cooking practices and sustainable ingredients.</p>
            </div>
            <div className="value-card">
              <div className="icon">🤝</div>
              <h3>Community</h3>
              <p>Building connections through shared culinary experiences.</p>
            </div>
            <div className="value-card">
              <div className="icon">💡</div>
              <h3>Innovation</h3>
              <p>Constantly evolving and improving our platform for our users.</p>
            </div>
            <div className="value-card">
              <div className="icon">🎯</div>
              <h3>Quality</h3>
              <p>Ensuring the highest standards in our recipe curation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <h4>{member.role}</h4>
                  <p>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-content">
            <h2>Get in Touch</h2>
            <p>Have questions or suggestions? We'd love to hear from you!</p>
            <button className="contact-btn">
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About; 