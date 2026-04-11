import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Mail, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const FOOD_BG = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=2070&q=80';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing and using TheRecipeBook ("the App"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.`
  },
  {
    title: 'Description of Service',
    content: `TheRecipeBook is a web application that provides meal planning, recipe management, and smart grocery shopping features. The service includes: Creating and managing personal recipe libraries; Planning meals across a 7-day calendar; Auto-generating grocery shopping lists; Browsing community recipes; Leaving ratings and reviews.`,
    list: [
      'Recipe creation and management',
      'Weekly meal planning tools',
      'Shopping list generation',
      'Community recipe discovery',
      'User ratings and reviews'
    ]
  },
  {
    title: 'User Accounts',
    content: `To use our service, you must create an account. You agree to: Provide accurate and complete registration information; Maintain the security of your account credentials; Accept responsibility for all activities under your account; Notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these terms.`,
    list: [
      'Keep your password secure',
      'Provide accurate information',
      'Accept responsibility for account activity',
      'Report unauthorized access immediately'
    ]
  },
  {
    title: 'User Content',
    content: `You retain ownership of content you submit to TheRecipeBook. By submitting content, you grant us a worldwide, royalty-free, perpetual, irrevocable license to use, display, and modify your content for operating our service. You represent that you have the right to grant this license.`,
    list: [
      'Recipes you create',
      'Photos and images uploaded',
      'Reviews and ratings',
      'Comments and feedback'
    ]
  },
  {
    title: 'Prohibited Conduct',
    content: `You agree not to use our service to: Post content that is illegal, harmful, or offensive; Infringe upon intellectual property rights; Attempt to gain unauthorized access to systems; Distribute malware or other malicious code; Harass or abuse other users; Engage in any activity that disrupts or interferes with our service.`,
    list: [
      'No illegal or harmful content',
      'No copyright infringement',
      'No harassment or abuse',
      'No spam or commercial solicitation',
      'No system hacking or attacks'
    ]
  },
  {
    title: 'Intellectual Property',
    content: `TheRecipeBook and its original content, features, and functionality are owned by the developer and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our service without our written permission.`
  },
  {
    title: 'Termination',
    content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including but not limited to: Breach of these terms; Inactivity for an extended period; Request by law enforcement; Fraudulent or illegal activity. Upon termination, your right to use the service will immediately cease.`
  },
  {
    title: 'Limitation of Liability',
    content: `In no event shall TheRecipeBook, its developers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from: Your use or inability to use the service; Any unauthorized access to your account; Content posted by other users.`
  },
  {
    title: 'Disclaimer of Warranties',
    content: `THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not warrant that the service will be uninterrupted, secure, or error-free.`
  },
  {
    title: 'Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the developer operates, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved in the competent courts of that jurisdiction.`
  },
  {
    title: 'Changes to Terms',
    content: `We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on our website and updating the "last updated" date. Your continued use of the service after such changes constitutes acceptance of the new Terms.`
  },
  {
    title: 'Contact Information',
    content: `If you have any questions about these Terms of Service, please contact us at:`
  }
];

const TermsOfService = () => {
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
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
            Terms of <span className="text-emerald-400">Service</span>
          </h1>
          <p className="text-white/65 mt-2 text-sm max-w-sm">Rules and guidelines for using our app</p>
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
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.title === 'Contact Information' && (
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

export default TermsOfService;
