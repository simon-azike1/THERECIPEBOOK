import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openSurvey, markSurveyed } from '../features/survey/surveySlice';

const INTERACTION_THRESHOLD = 20000;
const MIN_DAYS_BETWEEN_SURVEYS = 1;
const MAX_DAYS_BETWEEN_SURVEYS = 3;

const useSurveyTrigger = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.survey);
  const { user } = useSelector((state) => state.auth);
  const interactionTimeRef = useRef(0);
  const isTrackingRef = useRef(false);
  const keyActionsCountRef = useRef(0);

  const shouldShowSurvey = useCallback(() => {
    if (!user || isOpen) return false;

    const hasSurveyed = localStorage.getItem('surveySubmittedAt');
    if (!hasSurveyed) return true;

    const lastSurveyDate = new Date(hasSurveyed);
    const now = new Date();
    const daysSinceLastSurvey = Math.floor((now - lastSurveyDate) / (1000 * 60 * 60 * 24));

    return daysSinceLastSurvey >= MIN_DAYS_BETWEEN_SURVEYS && daysSinceLastSurvey <= MAX_DAYS_BETWEEN_SURVEYS;
  }, [user, isOpen]);

  const triggerSurvey = useCallback(() => {
    console.log('triggerSurvey called, shouldShowSurvey:', shouldShowSurvey());
    if (shouldShowSurvey()) {
      dispatch(openSurvey());
    }
  }, [shouldShowSurvey, dispatch]);

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
  }, [triggerSurvey]);

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
        console.log('Survey trigger: Checking if should show survey...');
        if (shouldShowSurvey()) {
          console.log('Survey trigger: Opening survey on page load');
          triggerSurvey();
        }
      }, 15000);
    };

    window.addEventListener('keypress', handleKeyAction);
    window.addEventListener('click', handleClick);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('keypress', handleKeyAction);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('load', handleLoad);
    };
  }, [shouldShowSurvey, triggerSurvey]);

  return { triggerSurvey };
};

export default useSurveyTrigger;
