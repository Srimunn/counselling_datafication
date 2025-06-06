
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useActivityTracker = () => {
  const { user } = useAuth();

  const logActivity = async (
    activityType: string, 
    description: string, 
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          description,
          metadata
        });
      
      console.log('Activity logged:', activityType, description);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const logAssessment = async (
    totalScore: number,
    averageScore: number,
    answers: Record<string, any>,
    sentimentLevel: string
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('sentiment_assessments')
        .insert({
          user_id: user.id,
          total_score: totalScore,
          average_score: averageScore,
          answers,
          sentiment_level: sentimentLevel
        });

      await logActivity(
        'assessment_completed',
        `Sentiment assessment completed with ${sentimentLevel} result`,
        { total_score: totalScore, average_score: averageScore }
      );
    } catch (error) {
      console.error('Error logging assessment:', error);
    }
  };

  const logChatSession = async (sessionType: 'ai_chat' | 'human_counselor' = 'ai_chat') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionType
        })
        .select()
        .single();

      if (error) throw error;

      await logActivity(
        'chat_started',
        `Started ${sessionType} session`,
        { session_id: data.id }
      );

      return data.id;
    } catch (error) {
      console.error('Error logging chat session:', error);
      return null;
    }
  };

  return {
    logActivity,
    logAssessment,
    logChatSession
  };
};
