export interface GameIntroData {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  howToPlay: string[];
  tip: string;
  reward: number;
  estimatedTime: string;
  difficulty: number;
}

const gameIntroData: Record<string, GameIntroData>;
export default gameIntroData;
