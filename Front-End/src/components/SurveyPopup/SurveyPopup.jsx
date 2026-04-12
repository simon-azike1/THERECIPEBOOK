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
  const [showFeedback, setShowFeedback] = useState(false);
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-[#2b4c7e] to-[#3a5d8f] p-4 rounded-t-2xl relative">
            <button
              onClick={handleSkip}
              className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-1.5">
                <MessageCircle className="text-white" size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">
                  Let's make cooking easier
                </h2>
                <p className="text-white/70 text-xs">Your feedback matters</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              What's hardest about planning meals?
            </p>

            <div className="space-y-2 mb-4">
              {SURVEY_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${
                    selectedOption === option
                      ? 'border-[#2b4c7e] bg-[#2b4c7e]/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-[#2b4c7e]/50'
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
                    className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                      selectedOption === option
                        ? 'border-[#2b4c7e] bg-[#2b4c7e]'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedOption === option && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-200">{option}</span>
                </label>
              ))}
            </div>

            {showFeedback && (
              <div className="mb-4">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us more (optional)..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#2b4c7e]"
                  rows={2}
                />
              </div>
            )}

            {!showFeedback && selectedOption && (
              <button
                type="button"
                onClick={() => setShowFeedback(true)}
                className="text-xs text-[#3a5d8f] hover:underline mb-3"
              >
                + Add more detail (optional)
              </button>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={!selectedOption || isLoading}
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-[#2b4c7e] dark:bg-[#3a5d8f] text-white font-medium hover:bg-[#1a365d] transition-colors disabled:opacity-50"
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
