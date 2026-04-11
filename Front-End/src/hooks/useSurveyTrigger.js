import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openSurvey, markSurveyed } from '../features/survey/surveySlice';

const INTERACTION_THRESHOLD = 30000; // 30 seconds
const MIN_DAYS_BETWEEN_SURVEYS = 5;
const MAX_DAYS_BETWEEN_SURVEYS = 7;

const useSurveyTrigger = () => {
  const dispatch = useDispatch();
  const { hasSurveyed, surveySubmittedAt, isOpen } = useSelector((state) => state.survey);
  const interactionTimeRef = useRef(0);
  const isTrackingRef = useRef(false);
  const keyActionsCountRef = useRef(0);

  const shouldShowSurvey = () => {
    if (hasSurveyed || isOpen) return false;

    if (!surveySubmittedAt) return true;

    const lastSurveyDate = new Date(surveySubmittedAt);
    const now = new Date();
    const daysSinceLastSurvey = Math.floor((now - lastSurveyDate) / (1000 * 60 * 60 * 24));

    const minDays = MIN_DAYS_BETWEEN_SURVEYS;
    const maxDays = MAX_DAYS_BETWEEN_SURVEYS;

    return daysSinceLastSurvey >= minDays + Math.random() * (maxDays - minDays);
  };

  const triggerSurvey = () => {
    if (shouldShowSurvey()) {
      dispatch(openSurvey());
    }
  };

  useEffect(() => {
    const checkInteraction = () => {
      if (!isTrackingRef.current) return;
      interactionTimeRef.current += 1000;

      if (interactionTimeRef.current >= INTERACTION_THRESHOLD) {
        triggerSurvey();
        isTrackingRef.current = false;
      }
    };

    const interval = setInterval(checkInteraction, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyAction = () => {
      keyActionsCountRef.current += 1;
      if (keyActionsCountRef.current >= 5 && !isTrackingRef.current) {
        isTrackingRef.current = true;
        interactionTimeRef.current = 0;
      }
    };

    const handleClick = () => {
      if (!isTrackingRef.current) {
        isTrackingRef.current = true;
        interactionTimeRef.current = 0;
      }
    };

    const handleLoad = () => {
      setTimeout(() => {
        if (shouldShowSurvey()) {
          triggerSurvey();
        }
      }, 60000);
    };

    window.addEventListener('keypress', handleKeyAction);
    window.addEventListener('click', handleClick);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('keypress', handleKeyAction);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return { triggerSurvey };
};

export default useSurveyTrigger;
