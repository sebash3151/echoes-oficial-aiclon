import React from 'react';
import { Bot, AlertTriangle, MessageSquare, Brain, Settings, Target, Zap, ShieldAlert, Bug } from 'lucide-react';

export const ICON_LIBRARY: Record<string, React.ReactNode> = {
  bot: <Bot className="w-4 h-4" />,
  alert: <AlertTriangle className="w-4 h-4" />,
  message: <MessageSquare className="w-4 h-4" />,
  brain: <Brain className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
  target: <Target className="w-4 h-4" />,
  zap: <Zap className="w-4 h-4" />,
  shield: <ShieldAlert className="w-4 h-4" />,
  bug: <Bug className="w-4 h-4" />
};
