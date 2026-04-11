import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { submitSurveyResponse, closeSurvey, markSurveyed } from '../../features/survey/surveySlice';

const SURVEY_OPTIONS = [
  'Deciding meals',
  'Finding cultural recipes',
  'Organizing recipes',
  'Planning ahead',
  'Keeping it simple',
  'Other',
];

const SurveyPopup = () => {
  const dispatch = useDispatch();
  const { isOpen, isLoading } = useSelector((state) => state.survey);
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) return;

    await dispatch(submitSurveyResponse({ option: selectedOption, feedback }));
    dispatch(markSurveyed());
  };

  const handleSkip = () => {
    dispatch(closeSurvey());
    dispatch(markSurveyed());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#2b4c7e] dark:bg-[#1a365d] p-6 relative">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <MessageCircle className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white font-['Poppins']">
                  Let's make cooking easier for you
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  We'd love your feedback
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <p className="text-gray-700 dark:text-gray-200 font-medium mb-4 font-['Poppins']">
              What's the hardest part about planning or managing your meals?
            </p>

            <div className="space-y-3 mb-6">
              {SURVEY_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedOption === option
                      ? 'border-[#2b4c7e] bg-[#2b4c7e]/10 dark:border-[#3a5d8f] dark:bg-[#3a5d8f]/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-[#2b4c7e]/50 dark:hover:border-[#3a5d8f]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="surveyOption"
                    value={option}
                    checked={selectedOption === option}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                      selectedOption === option
                        ? 'border-[#2b4c7e] dark:border-[#3a5d8f] bg-[#2b4c7e] dark:bg-[#3a5d8f]'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}
                  >
                    {selectedOption === option && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-200 font-['Inter']">{option}</span>
                </label>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 font-['Poppins']">
                Share your experience with us (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us more about your meal planning challenges..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-['Inter'] resize-none focus:outline-none focus:ring-2 focus:ring-[#2b4c7e] dark:focus:ring-[#3a5d8f] focus:border-transparent transition-all"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {feedback.length}/500
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold font-['Poppins'] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={!selectedOption || isLoading}
                className="flex-1 px-4 py-3 rounded-lg bg-[#2b4c7e] dark:bg-[#3a5d8f] text-white font-semibold font-['Poppins'] hover:bg-[#1a365d] dark:hover:bg-[#2b4c7e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SurveyPopup;
