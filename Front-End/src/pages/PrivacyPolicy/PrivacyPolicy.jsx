import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, ArrowLeft, Mail, ChevronRight } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const FOOD_BG = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2070&q=80';

const sections = [
  {
    title: 'Introduction',
    content: `Welcome to TheRecipeBook. We are committed to protecting your privacy and ensuring you have a positive experience using our meal planning and recipe management platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.`
  },
  {
    title: 'Information We Collect',
    content: `We collect information you provide directly to us, including: Name and email address when you register for an account; Profile information and profile pictures; Recipes you create, including ingredients, instructions, and images; Meal planning data and shopping lists; Communications and feedback you submit. We also automatically collect certain information when you use our app, including device information, usage data, and cookies.`,
    list: [
      'Account credentials (email, password)',
      'Profile information (name, profile picture)',
      'User-generated content (recipes, reviews, meal plans)',
      'Usage data and analytics',
      'Device and browser information'
    ]
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect to: Provide, maintain, and improve our services; Process your transactions and send related information; Send you technical notices, updates, and support messages; Respond to your comments, questions, and requests; Communicate with you about products, services, and events; Monitor and analyze trends, usage, and activities.`,
    list: [
      'Provide and personalize our services',
      'Process transactions securely',
      'Send administrative and promotional communications',
      'Improve user experience and features',
      'Protect against fraud and abuse'
    ]
  },
  {
    title: 'Information Sharing',
    content: `We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following circumstances: With service providers who assist us in operating our app; When required by law or in response to valid requests; To protect our rights, property, or safety; In connection with a merger, sale, or acquisition.`,
    list: [
      'Service providers (hosting, analytics, payment processing)',
      'Legal obligations (court orders, law enforcement)',
      'Business transfers (merger, acquisition)',
      'Aggregate anonymized data for analytics'
    ]
  },
  {
    title: 'Data Security',
    content: `We implement appropriate technical and organizational measures to protect your personal information, including: Encryption of data in transit and at rest; Secure authentication and authorization; Regular security audits and assessments; Access controls and employee training. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
    list: [
      'Industry-standard encryption (SSL/TLS)',
      'Secure password hashing (bcrypt)',
      'Regular security audits',
      'Employee data handling training'
    ]
  },
  {
    title: 'Your Rights',
    content: `You have certain rights regarding your personal information: Right to access and receive a copy of your data; Right to rectification of inaccurate data; Right to erasure ("right to be forgotten"); Right to restrict processing; Right to data portability; Right to object to processing. To exercise these rights, please contact us using the information provided below.`,
    list: [
      'Access your personal data',
      'Request correction of data',
      'Request deletion of data',
      'Opt-out of marketing communications',
      'Export your data in portable format'
    ]
  },
  {
    title: 'Cookies & Tracking',
    content: `We use cookies and similar tracking technologies to: Keep you logged in; Understand your preferences; Analyze app performance; Improve our services. You can control cookies through your browser settings, but disabling them may affect functionality.`,
    list: [
      'Essential cookies for authentication',
      'Analytics cookies for improvements',
      'Preference cookies for personalization',
      'Third-party cookies from partners'
    ]
  },
  {
    title: "Children's Privacy",
    content: `Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us so we can delete such information.`
  },
  {
    title: 'Changes to Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "last updated" date. You are advised to review this Privacy Policy periodically for any changes.`
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at:`
  }
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img src={FOOD_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-stone-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/20 to-emerald-900/10" />
        <div className="absolute bottom-10 left-4 sm:left-8 lg:left-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
            Privacy <span className="text-emerald-400">Policy</span>
          </h1>
          <p className="text-white/65 mt-2 text-sm max-w-sm">How we protect and handle your data</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3a5d8f] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <p className="text-sm text-gray-400">Last updated: April 2026</p>
          </div>

          <div className="p-8 space-y-10">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#3a5d8f] to-emerald-500 flex items-center justify-center text-white text-sm font-black">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">{section.content}</p>
                {section.list && (
                  <ul className="space-y-2 ml-4">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <ChevronRight className="w-4 h-4 text-[#3a5d8f] mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.title === 'Contact Us' && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mt-4">
                    <Mail className="w-5 h-5 text-[#3a5d8f]" />
                    <span className="font-semibold text-gray-800">support@therecipebook.com</span>
                  </div>
                )}
              </motion.section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
